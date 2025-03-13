import pytest
from src.agents.ranking import RankingAgent

@pytest.fixture
def sample_articles():
    return [
        {
            'title': 'Test AI News 1',
            'url': 'https://test1.com',
            'source': 'reddit',
            'engagement': 100,
            'timestamp': '2024-03-13T00:00:00Z'
        },
        {
            'title': 'Test AI News 2',
            'url': 'https://test2.com',
            'source': 'twitter',
            'engagement': 200,
            'timestamp': '2024-03-13T00:00:00Z'
        }
    ]

def test_ranking_agent_initialization():
    agent = RankingAgent()
    assert agent is not None
    assert hasattr(agent, 'rank')

@pytest.mark.asyncio
async def test_ranking_agent_returns_sorted_articles(sample_articles):
    agent = RankingAgent()
    ranked_articles = await agent.rank(sample_articles)
    assert isinstance(ranked_articles, list)
    assert len(ranked_articles) == len(sample_articles)
    assert ranked_articles[0]['engagement'] >= ranked_articles[1]['engagement']

def test_ranking_agent_scoring_system():
    agent = RankingAgent()
    article = {
        'title': 'Test AI News',
        'url': 'https://test.com',
        'source': 'reddit',
        'engagement': 100,
        'timestamp': '2024-03-13T00:00:00Z'
    }
    score = agent.calculate_score(article)
    assert isinstance(score, (int, float))
    assert score > 0