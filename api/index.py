from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import List, Optional

# 1. Setup
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") 

# Initialize Supabase
if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found in environment variables.")
    supabase = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI()

# Security: Allow frontend to access backend
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Pydantic Models
# ------------------------------

class GenerateRequest(BaseModel):
    sentence: str
    user_id: str 
    target_language: str = "ja"

class FlashcardData(BaseModel):
    front: str
    back: str
    reading: str
    example: str

class StudySetResponse(BaseModel):
    translation: str
    grammar_explanation: str
    flashcards: List[FlashcardData]

# ------------------------------
# Endpoints
# ------------------------------

@app.post("/generate_study_set")
async def generate_study_set(req: GenerateRequest):
    print(f"Generating study set for: {req.sentence}")
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured on backend.")

    # 1. System Prompt for Structured JSON
    system_prompt = """
    You are a Japanese language teacher. 
    Analyze the user's sentence. 
    1. Translate it naturally.
    2. Explain the key grammar point briefly.
    3. Extract 3-5 keywords and create flashcards for them.
    
    Output strictly valid JSON matching this structure:
    {
        "translation": "...",
        "grammar_explanation": "...",
        "flashcards": [
            {"front": "Word", "back": "Meaning", "reading": "Hiragana", "example": "Short example sentence"}
        ]
    }
    """

    try:
        # 2. Call OpenAI
        response = openai.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.sentence}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        # 3. Parse Response
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # 4. Save to Supabase
        
        # A. Create the Deck (Saves Grammar here)
        deck_response = supabase.table("decks").insert({
            "user_id": req.user_id,
            "title": req.sentence[:30] + "...", 
            "source_text": req.sentence,
            "grammar_text": data.get('grammar_explanation', '') 
        }).execute()
        
        # Check for data presence (Supabase-py v2 behavior)
        if not deck_response.data:
             print("Warning: No data returned from deck insertion")
            
        deck_id = deck_response.data[0]['id']
        
        # B. Insert Flashcards
        cards_to_insert = []
        for card in data['flashcards']:
            cards_to_insert.append({
                "deck_id": deck_id,
                "user_id": req.user_id,
                "front": card['front'],
                "back": card['back'],
                "reading": card['reading'],
                "example_sentence": card['example'],
                "interval": 0,
                "ease_factor": 2.5
            })
            
        if cards_to_insert:
            supabase.table("cards").insert(cards_to_insert).execute()
        
        # 5. Return Data
        return {
            "success": True,
            "deck_id": deck_id,
            "data": data
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))