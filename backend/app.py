import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Review
from dotenv import load_dotenv
import google.genai as genai


load_dotenv()
GEMINI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///db.sqlite3")
PORT = int(os.getenv("PORT", 5000))

client = genai.Client(api_key=GEMINI_API_KEY) 

app = Flask(__name__)
CORS(app)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


PROMPT_TEMPLATE = """
You are a senior software engineer and code reviewer. Given the file content below,
produce a structured review covering:
1. Summary (1-2 lines)
2. Strengths
3. Readability & style problems (line references if possible)
4. Design / modularity suggestions
5. Potential bugs or edge cases
6. Security concerns (if any)
7. Performance notes
8. Concrete suggested fixes with example code snippets
9. A concise checklist of actions

Respond in markdown. File language: {language}
Filename: {filename}

--- FILE CONTENT START ---
{content}
--- FILE CONTENT END ---
"""

def call_llm(client, prompt: str, max_tokens=800): 

    try:
        available_models = [m.id for m in client.models.list()]
        
        model_name = "gemma-2b" 

        resp = client.chat.completions.create( 
            model=model_name,
            messages=[{"role": "system", "content": "You are a useful code reviewer."},
                      {"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.2,
        )
        
        return resp.choices[0].message.content 
        
    except Exception as e:
        return f"LLM call failed: {str(e)}"

@app.route("/api/reviews", methods=["POST"])
def create_review():
    session = Session()
    title = request.form.get("title") or "Untitled Review"
    language = request.form.get("language") or "unknown"
    file = request.files.get("file")
    code_text = request.form.get("code")

    filename = None
    content = ""

    if file:
        filename = file.filename
        content = file.read().decode("utf-8", errors="ignore")
    elif code_text:
        filename = request.form.get("filename") or "pasted_code"
        content = code_text
    else:
        return jsonify({"error": "No file or code provided"}), 400

    prompt = PROMPT_TEMPLATE.format(language=language, filename=filename, content=content)
    
    report = call_llm(client, prompt)

    review = Review(title=title, filename=filename, language=language, report=report)
    session.add(review)
    session.commit()
    review_id = review.id
    session.close()

    return jsonify({"id": review_id, "report": report})

@app.route("/api/reviews/<int:review_id>", methods=["GET"])
def get_review(review_id):
    session = Session()
    review = session.query(Review).filter_by(id=review_id).first()
    if not review:
        session.close()
        return jsonify({"error":"Not found"}), 404
    data = {
        "id": review.id,
        "title": review.title,
        "filename": review.filename,
        "language": review.language,
        "report": review.report,
        "created_at": review.created_at.isoformat()
    }
    session.close()
    return jsonify(data)

@app.route("/api/reviews", methods=["GET"])
def list_reviews():
    session = Session()
    reviews = session.query(Review).order_by(Review.created_at.desc()).limit(50).all()
    out = []
    for r in reviews:
        out.append({
            "id": r.id,
            "title": r.title,
            "filename": r.filename,
            "language": r.language,
            "created_at": r.created_at.isoformat()
        })
    session.close()
    return jsonify(out)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)