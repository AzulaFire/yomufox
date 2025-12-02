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
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") # Or SERVICE_ROLE_KEY for admin rights

# Initialize Supabase
# Ensure you have your URL and KEY in your .env file
if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found in environment variables.")
    supabase = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI()

# Security: In production, change this to ["https://your-app.vercel.app"]
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Pydantic Models (The Data Structure)
# ------------------------------

class GenerateRequest(BaseModel):
    sentence: str
    user_id: str # We need to know WHO is asking to save it to their DB
    target_language: str = "ja"

# These models define exactly what we want OpenAI to give us back
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
# The "Magic" Endpoint
# ------------------------------

@app.post("/generate_study_set")
async def generate_study_set(req: GenerateRequest):
    print(f"Generating study set for: {req.sentence}")
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured on backend.")

    # 1. Construct the Prompt
    # We tell AI exactly how to format the JSON so our code doesn't break
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
        # 2. Call OpenAI (JSON Mode)
        response = openai.chat.completions.create(
            model="gpt-4o-mini", # Cheaper and faster for this task
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.sentence}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        # 3. Parse the AI Response
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # 4. Save to Supabase (The Stickiness)
        
        # A. Create the Deck (Updated to save grammar)
        deck_response = supabase.table("decks").insert({
            "user_id": req.user_id,
            "title": req.sentence[:30] + "...", # Title is a snippet of the sentence
            "source_text": req.sentence,
            "grammar_text": data.get('grammar_explanation', '') # Save grammar here
        }).execute()
        
        # Supabase-py v2 returns an object with .data, handle potential errors or empty data
        if not deck_response.data:
             # In some versions/configurations, this might raise an error directly, 
             # but checking data is safer.
             # If using older supabase-py, response structure might differ.
             pass 
            
        deck_id = deck_response.data[0]['id']
        
        # B. Prepare Flashcards for Bulk Insert
        cards_to_insert = []
        for card in data['flashcards']:
            cards_to_insert.append({
                "deck_id": deck_id,
                "user_id": req.user_id,
                "front": card['front'],
                "back": card['back'],
                "reading": card['reading'],
                "example_sentence": card['example'],
                # Default SRS values
                "interval": 0,
                "ease_factor": 2.5
            })
            
        # C. Insert Cards
        if cards_to_insert:
            supabase.table("cards").insert(cards_to_insert).execute()
        
        # 5. Return Data to Frontend (so we can show it immediately)
        return {
            "success": True,
            "deck_id": deck_id,
            "data": data
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        # In a real app, log this error properly
        raise HTTPException(status_code=500, detail=str(e))