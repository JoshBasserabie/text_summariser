# text_summariser

Simple web app that uses Cohere to summarise text.
Works in multiple languages.

## Installation

### Prerequisites

- Python 3

### Steps

1. This app requires a Cohere API key to run.
Go to https://dashboard.cohere.com/api-keys to get it

2. Create a file in this directory called .env

3. Paste the following into the .env file:
    COHERE_API_KEY=PLACEHOLDER

4. Replace "PLACEHOLDER" with your own API key

5. Run
    uvicorn backend:app --reload

6. Access the main page by going to http://127.0.0.1:8000