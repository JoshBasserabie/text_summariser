# backend.py

import os
import dotenv
import cohere
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pydantic

# Initialise FastAPI app
app = FastAPI(
    title="Text Summariser",
    description="Uses Cohere to summarise text",
    version="1.0",
)
app.mount("/static", StaticFiles(directory="static"), name="static")


# Initialise Cohere client
dotenv.load_dotenv()
api_key = os.getenv("COHERE_API_KEY")
if not api_key:
    raise ValueError("COHERE_API_KEY not found in .env file.")

cohere_client = cohere.Client(api_key)


# Define request and response using Pydantic
class SummariseRequest(pydantic.BaseModel):
    text: str

class SummariseResponse(pydantic.BaseModel):
    summary: str


# Main website
@app.get("/")
async def get_index():
    return FileResponse('templates/index.html')


# Summarise
@app.post("/summarise/", response_model=SummariseResponse)
async def summarise_text(request: SummariseRequest):
    instructions = """Summarise the following text. 
    Respond in the same language as the original text. 
    Do not include anything in your response other than the summary. 
    If the text is one sentence or shorter, state that the text is too short to summarise in the same language as the text. 
    Here is the text:\n\n"""
    prompt = instructions + request.text

    try:
        response = cohere_client.chat(
            model="command-r",
            message=prompt,
        )
        summary = response.text
        
        return SummariseResponse(summary=summary)

    except cohere.CohereError as e:
        print(f"Cohere API Error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred with the Cohere API: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")