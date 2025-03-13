# AI Agent Documentation

## Overview
AI-powered multi-agent system that aggregates, ranks, and summarizes AI news from multiple sources.

## System Architecture

### Agents
1. Scraping Agents
   - Parallel execution
   - Source-specific implementations
   - Error handling and rate limiting

2. Ranking Agent
   - Scoring algorithm
   - Filtering criteria
   - Deduplication logic

3. Summarization Agent
   - OpenAI integration
   - Template management
   - Content processing

4. Delivery Agent
   - Email formatting
   - Scheduling
   - Retry mechanism

## Setup Instructions
1. Clone the repository
2. Create and configure .env file
3. Install dependencies: `pip install -r requirements.txt`
4. Run tests: `pytest`

## API Documentation

### Scraping Agents
```python
async def scrape() -> List[Dict]
```
Returns list of articles with metadata

### Ranking Agent
```python
async def rank(articles: List[Dict]) -> List[Dict]
```
Returns sorted list of articles by relevance

### Summarization Agent
```python
async def summarize(article: Dict) -> str
```
Returns concise summary of article

### Delivery Agent
```python
async def send_email(summaries: List[Dict]) -> bool
```
Sends email with formatted summaries

## Configuration
Required environment variables:
- OPENAI_API_KEY
- REDDIT_CLIENT_ID
- REDDIT_CLIENT_SECRET
- TWITTER_BEARER_TOKEN
- EMAIL_PASSWORD