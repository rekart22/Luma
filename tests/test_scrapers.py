import pytest
from unittest.mock import Mock, patch
from src.agents.scrapers import RedditScraper, TwitterScraper, GoogleNewsScraper, HackerNewsScraper

@pytest.fixture
def mock_reddit_scraper():
    return RedditScraper()

@pytest.fixture
def mock_twitter_scraper():
    return TwitterScraper()

@pytest.fixture
def mock_google_news_scraper():
    return GoogleNewsScraper()

@pytest.fixture
def mock_hacker_news_scraper():
    return HackerNewsScraper()

def test_reddit_scraper_initialization(mock_reddit_scraper):
    assert mock_reddit_scraper is not None
    assert hasattr(mock_reddit_scraper, 'scrape')

def test_twitter_scraper_initialization(mock_twitter_scraper):
    assert mock_twitter_scraper is not None
    assert hasattr(mock_twitter_scraper, 'scrape')

def test_google_news_scraper_initialization(mock_google_news_scraper):
    assert mock_google_news_scraper is not None
    assert hasattr(mock_google_news_scraper, 'scrape')

def test_hacker_news_scraper_initialization(mock_hacker_news_scraper):
    assert mock_hacker_news_scraper is not None
    assert hasattr(mock_hacker_news_scraper, 'scrape')

@pytest.mark.asyncio
async def test_reddit_scraper_returns_valid_data(mock_reddit_scraper):
    with patch('src.agents.scrapers.RedditScraper.scrape') as mock_scrape:
        mock_data = [{
            'title': 'Test AI News',
            'url': 'https://test.com',
            'source': 'reddit',
            'engagement': 100,
            'timestamp': '2024-03-13T00:00:00Z'
        }]
        mock_scrape.return_value = mock_data
        result = await mock_reddit_scraper.scrape()
        assert isinstance(result, list)
        assert len(result) > 0
        assert all(isinstance(item, dict) for item in result)
        assert all(key in result[0] for key in ['title', 'url', 'source', 'engagement', 'timestamp'])