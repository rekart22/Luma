import pytest
from src.agents.delivery import DeliveryAgent

@pytest.fixture
def sample_summaries():
    return [
        {
            'title': 'Test AI News 1',
            'summary': 'This is a test summary 1',
            'url': 'https://test1.com'
        },
        {
            'title': 'Test AI News 2',
            'summary': 'This is a test summary 2',
            'url': 'https://test2.com'
        }
    ]

def test_delivery_agent_initialization():
    agent = DeliveryAgent('test@example.com')
    assert agent is not None
    assert hasattr(agent, 'send_email')

@pytest.mark.asyncio
async def test_delivery_agent_email_formatting(sample_summaries):
    agent = DeliveryAgent('test@example.com')
    email_content = agent.format_email_content(sample_summaries)
    assert isinstance(email_content, str)
    assert all(summary['title'] in email_content for summary in sample_summaries)
    assert all(summary['url'] in email_content for summary in sample_summaries)