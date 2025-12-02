from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # load .env file
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow requests from frontend
origins = [
    "http://localhost:3000",
    "https://yomufox.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Models
# ------------------------------


class TranslationRequest(BaseModel):
    text: str
    target_language: str = "ja"
    politeness: str = "casual"  # casual, polite, business


class FlashcardRequest(BaseModel):
    word: str
    target_language: str = "ja"


class QuizRequest(BaseModel):
    topic: str  # e.g., 'kanji', 'vocabulary', 'grammar'


class GrammarRequest(BaseModel):
    sentence: str

# ------------------------------
# Endpoints
# ------------------------------


@app.post("/translate")
async def translate(req: TranslationRequest):
    prompt = (
        f"Translate the following text to {req.target_language} "
        f"with {req.politeness} tone:\n{req.text}"
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful translation assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        translation = response.choices[0].message.content
        return {"translation": translation}
    except Exception as e:
        return {"error": str(e)}


@app.post("/flashcards")
async def flashcards(req: FlashcardRequest):
    prompt = (
        f"Generate a flashcard for the word '{req.word}' in {req.target_language}. "
        "Include: reading, meaning, and example sentence."
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful language learning assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        flashcard = response.choices[0].message.content
        return {"flashcard": flashcard}
    except Exception as e:
        return {"error": str(e)}


@app.post("/quiz")
async def quiz(req: QuizRequest):
    prompt = (
        f"Generate a short quiz for topic '{req.topic}'. "
        "Include 3 multiple-choice questions with answers."
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful language learning quiz assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        quiz_content = response.choices[0].message.content
        return {"quiz": quiz_content}
    except Exception as e:
        return {"error": str(e)}


@app.post("/grammar")
async def grammar(req: GrammarRequest):
    prompt = (
        f"Analyze the following Japanese sentence and explain the grammar, "
        f"particles, verb forms, and sentence structure clearly:\n{req.sentence}"
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful Japanese grammar assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        grammar_analysis = response.choices[0].message.content
        return {"analysis": grammar_analysis}
    except Exception as e:
        return {"error": str(e)}
