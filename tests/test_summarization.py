import pytest
from src.agents.summarization import SummarizationAgent

@pytest.fixture
def sample_article():
    return {
        'title': 'Test AI News',
        'url': 'https://test.com',
        'source': 'reddit',
        'engagement': 100,
        'timestamp': '2024-03-13T00:00:00Z',
        'content': 'This is a test article about artificial intelligence developments.'
    }

def test_summarization_agent_initialization():
    agent = SummarizationAgent()
    assert agent is not None
    assert hasattr(agent, 'summarize')

@pytest.mark.asyncio
async def test_summarization_agent_returns_valid_summary(sample_article):
    agent = SummarizationAgent()
    summary = await agent.summarize(sample_article)
    assert isinstance(summary, str)
    assert len(summary) > 0
    assert len(summary) <= 200  # Maximum summary length