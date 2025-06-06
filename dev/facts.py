from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
import random
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

topics = [
    "artificial intelligence", "robotics", "quantum physics", "cybersecurity", "smart devices",
    "machine learning", "virtual reality", "blockchain", "future tech", "space exploration",
    "nature", "animals", "ocean", "trees", "plants", "gardening",
    "sustainable energy", "time travel", "memes", "deep sea creatures", "neural networks",
    "future trends", "fashion", "sports", "pop culture", "movies",
    "self-help", "productivity", "office structure", "focus", "cooking"
]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


async def fetch_fact(client: httpx.AsyncClient, topic: str) -> str:
    prompt = f"Give me a unique, clever, short, and lighthearted fact. Make it about {topic}."

    try:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 150,
                "temperature": 1.2,
            }
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Error fetching fact for {topic}: {e}")
        return None


@app.get("/facts")
async def get_facts():
    selected_topics = random.sample(topics, 20)

    async with httpx.AsyncClient() as client:
        facts = await asyncio.gather(*(fetch_fact(client, topic) for topic in selected_topics))

    filtered_facts = [fact for fact in facts if fact]
    return JSONResponse(content=filtered_facts)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("facts:app", host="127.0.0.1", port=8000, reload=True)

