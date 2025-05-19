# PRD: Luma Therapy Chat

## 1. Product overview
### 1.1 Document title and version
   - PRD: Luma Therapy Chat
   - Version: 1.0
   
### 1.2 Product summary
   Luma is a supportive chat application designed to provide meaningful conversations through a multi-agent AI system. The application focuses on text-based interaction, with voice capabilities reserved for future iterations. 
   
   The system features enhanced memory management through mem0 integration for improved personalization and contextual understanding. Luma is positioned as a companion for personal development, not just a therapeutic tool, empowering users on their personal growth journey.

## 2. Goals
### 2.1 Business goals
   - Create an AI companion that provides genuine value in personal development
   - Establish a sustainable subscription model with high user retention
   - Build a scalable platform that efficiently manages memory and personalization
   - Create a differentiated product in the AI companion space through memory integration
   - Ensure robust security and privacy compliance

### 2.2 User goals
   - Access a supportive companion that remembers past interactions
   - Engage in meaningful conversations that feel personalized
   - Track personal growth and development over time
   - Set and work toward meaningful life goals with guidance
   - Have control over personal data and conversation history
   - Feel safe and supported during vulnerable moments
   - Experience a warm, empathetic interaction style

### 2.3 Non-goals
   - Replace professional therapy or mental health treatment
   - Provide medical advice or diagnoses
   - Implement voice or video interaction (reserved for future iterations)
   - Create a general-purpose assistant for tasks like scheduling or information retrieval
   - Serve as a search engine or knowledge base for factual information
   - Support group or multi-user conversations

## 3. User personas
### 3.1 Key user types
   - Self-improvement seekers
   - Life transition navigators
   - Emotional support seekers
   - Goal setters
   - Reflective journalers
   - Privacy-conscious users

### 3.2 Basic persona details
   - **Alex**: A 32-year-old professional seeking personal growth and better work-life balance
   - **Jordan**: A 28-year-old experiencing life transition who needs support and reflection
   - **Taylor**: A 35-year-old who prefers journaling thoughts and receiving guided reflection
   - **Morgan**: A 40-year-old who wants to set and track personal development goals
   - **Casey**: A 25-year-old seeking emotional support without judgment
   - **Riley**: A 30-year-old privacy-conscious user who wants control over personal data

### 3.3 Role-based access
   - **End Users**: Can engage in conversations, access their profile, manage their conversation history, set goals, and use journaling features
   - **Administrators**: Can view user analytics, safety flags, and manage the platform
   - **System**: AI agents (Core-Therapist, Safety-Sentinel, Session-Summary) with specific roles in conversation handling

## 4. Functional requirements
   - **Authentication System** (Priority: High)
     - Support for Google OAuth
     - Support for GitHub OAuth
     - Magic link email authentication
     - Password setup and change functionality
     - Protected routes for authenticated content
     - Profile creation on first sign-in
   
   - **Conversation Interface** (Priority: High)
     - Text input with real-time response streaming
     - Conversation history display
     - Error handling for API failures
     - Loading states during response generation
   
   - **Multi-Agent System** (Priority: High)
     - Core-Therapist agent for primary conversation
     - Safety-Sentinel agent for risk detection
     - Session-Summary agent for conversation insights
     - State machine for coordinating agent interactions
   
   - **Memory Management** (Priority: High)
     - Hierarchical memory organization (episodic, semantic, procedural)
     - Context-aware memory retrieval
     - Memory consolidation operations
     - Memory deletion capabilities
   
   - **User Profile Management** (Priority: Medium)
     - Profile creation and editing
     - Preference settings
     - Privacy controls
   
   - **Conversation Management** (Priority: Medium)
     - Conversation history sidebar
     - AI-generated conversation titles
     - Ability to rename conversations
     - Conversation deletion with confirmation
     - Conversation search and filtering
   
   - **Goal Setting and Tracking** (Priority: Medium)
     - SMART goal creation interface
     - Progress tracking visualization
     - Milestone definition and tracking
     - Goal categorization
   
   - **Reflective Journaling** (Priority: Medium)
     - AI-guided journal prompts
     - Mood and energy tracking
     - Pattern recognition across entries
     - Integration with goals and conversations
   
   - **Admin Dashboard** (Priority: Low)
     - User management interface
     - Session monitoring
     - Risk flag review system
     - Performance analytics

## 5. User experience
### 5.1. Entry points & first-time user flow
   - User arrives at landing page with clear value proposition
   - Sign-up flow with multiple authentication options
   - Brief onboarding explaining Luma's purpose and capabilities
   - Initial guidance conversation to establish rapport
   - Introduction to key features (chat, goals, journaling)
   - Clear privacy explanations and controls

### 5.2. Core experience
   - **Authentication**: User signs in via OAuth or email magic link
     - Provides seamless, secure access with minimal friction
   - **Chat Interaction**: User engages in conversation with Core-Therapist agent
     - Responses are warm, supportive, and personalized based on memory
   - **Setting Goals**: User creates structured goals with guidance
     - The interface provides templates and suggestions for effective goal setting
   - **Journaling**: User records thoughts and receives reflective insights
     - AI provides thoughtful prompts and synthesizes patterns over time
   - **Reviewing Progress**: User views visualizations of their growth journey
     - Clear, encouraging metrics highlight achievements and patterns

### 5.3. Advanced features & edge cases
   - Safety intervention during crisis detection
   - Memory deletion with multi-step confirmation process
   - Session timeout handling and reconnection
   - Offline mode with limited functionality
   - Handling of inappropriate content requests
   - Recovery from API failures mid-conversation
   - Browser notifications for session continuity

### 5.4. UI/UX highlights
   - Warm, nurturing color palette of blush and clay tones
   - Responsive design for desktop and mobile use
   - Typing indicators and smooth chat animations
   - Skeleton loading states for asynchronous operations
   - Intuitive navigation between conversation, goals, and journal
   - Clear visual hierarchy emphasizing the conversation interface
   - Subtle progress indicators for goal tracking

## 6. Narrative
Jordan is a 28-year-old navigating a significant career transition who wants to process their thoughts and emotions because they lack a support system during this uncertain time. They find Luma and appreciate how it remembers their ongoing challenges, offers personalized guidance, and helps them reflect on their progress. Jordan values being able to journal their daily experiences, set specific transition goals, and receive warm, consistent support that adapts to their evolving needs during this transformative period.

## 7. Success metrics
### 7.1. User-centric metrics
   - User retention rate (> 70% after 30 days)
   - Average session duration (> 10 minutes)
   - Conversation satisfaction rating (> 4.5/5)
   - Feature adoption rate (> 60% using goals or journaling)
   - User-reported value assessment (NPS > 40)
   - Number of conversations per user per week (> 3)
   - Goal completion rate (> 50% of set goals)

### 7.2. Business metrics
   - Monthly active users (growing 15% month-over-month)
   - Conversion rate from free to paid tier (> 8%)
   - Customer acquisition cost (< $50 per paying user)
   - Lifetime value (> $200 per user)
   - Churn rate (< 5% monthly)
   - Average revenue per user (> $15 monthly)
   - Word-of-mouth referrals (> 20% of new users)

### 7.3. Technical metrics
   - API response time (< 200ms average)
   - LLM generation latency (< 1.5s for first token)
   - System uptime (99.9%)
   - Error rate (< 0.5% of all requests)
   - Token optimization (< 4000 tokens per conversation)
   - Memory retrieval accuracy (> 90% relevance)
   - Infrastructure cost per user (< $2/month)

## 8. Technical considerations
### 8.1. Integration points
   - OpenAI API for LLM integration
   - Supabase for authentication and database
   - mem0 for memory management
   - Next.js for frontend and Edge Functions
   - FastAPI for backend services
   - pgvector for embedding storage and retrieval
   - Vercel for deployment and hosting

### 8.2. Data storage & privacy
   - User authentication data stored in Supabase Auth
   - Conversation history in Postgres with pgvector
   - Hierarchical memory in mem0 with Supabase backup
   - Field-level encryption for sensitive user data
   - GDPR-compliant data handling procedures
   - User-controlled data retention policies
   - Multi-step memory deletion process with confirmations

### 8.3. Scalability & performance
   - Edge Function deployment for global low-latency
   - Prompt-prefix caching to reduce token usage
   - Optimized context window management
   - Tiered memory access based on recency and relevance
   - Rate limiting to prevent abuse
   - Batch processing for memory consolidation during low-traffic periods
   - Database query optimization for vector search

### 8.4. Potential challenges
   - Managing memory retrieval latency at scale
   - Ensuring privacy compliance across regions
   - Maintaining consistent agent persona across updates
   - Balancing token usage with personalization depth
   - Detecting and handling safety concerns effectively
   - Preventing memory hallucinations or false recollections
   - Synchronizing memory across multiple instances

## 9. Milestones & sequencing
### 9.1. Project estimate
   - Medium-Large: 3-6 months

### 9.2. Team size & composition
   - Medium Team: 4-6 total people
     - 1 Product manager
     - 2-3 Full-stack engineers
     - 1 AI specialist
     - 1 UX designer
     - 1 QA specialist

### 9.3. Suggested phases
   - **Phase 1**: Foundation (4 weeks)
     - Key deliverables: Authentication system, basic chat UI, Core-Therapist agent, basic memory storage
   
   - **Phase 2**: Core Functionality (6 weeks)
     - Key deliverables: Safety-Sentinel integration, Session-Summary agent, memory retrieval, conversation history management
   
   - **Phase 3**: Advanced Features (6 weeks)
     - Key deliverables: Goal setting and tracking, reflective journaling, admin dashboard, advanced memory operations
   
   - **Phase 4**: Optimization & Polish (4 weeks)
     - Key deliverables: Performance optimization, enhanced security measures, UI refinement, comprehensive testing

## 10. User stories
### 10.1. User authentication
   - **ID**: US-001
   - **Description**: As a new user, I want to sign up for an account so that I can access the platform.
   - **Acceptance criteria**:
     - Users can sign up using Google OAuth
     - Users can sign up using GitHub OAuth
     - Users can sign up using email with magic link
     - A user profile is automatically created upon first sign-in
     - Authentication flow is secure and follows best practices
     - Error messages are clear and helpful

### 10.2. Chat conversation
   - **ID**: US-002
   - **Description**: As a user, I want to have a text-based conversation with Luma so that I can receive support and guidance.
   - **Acceptance criteria**:
     - Users can type messages in a text input field
     - Luma responds with streamed text in real-time
     - Conversations maintain context within a session
     - The UI clearly distinguishes between user and Luma messages
     - Loading states are displayed during response generation
     - Error handling gracefully manages API failures

### 10.3. Conversation memory
   - **ID**: US-003
   - **Description**: As a returning user, I want Luma to remember important details from our past conversations so that I don't have to repeat myself.
   - **Acceptance criteria**:
     - Luma recalls key information from previous sessions
     - Memory retrieval is context-aware and relevant
     - Personal details and preferences are remembered
     - Memory integration feels natural in conversation
     - Users can see when Luma is referencing past conversations

### 10.4. Safety intervention
   - **ID**: US-004
   - **Description**: As a user in distress, I want Luma to recognize concerning content and provide appropriate resources.
   - **Acceptance criteria**:
     - System detects potentially harmful content
     - Safety-Sentinel can interrupt the normal conversation flow
     - Appropriate resources and support information are provided
     - Intervention maintains a supportive and non-judgmental tone
     - High-risk situations trigger clear guidance on seeking professional help

### 10.5. Conversation history
   - **ID**: US-005
   - **Description**: As a user, I want to view my past conversations with Luma so that I can reflect on previous interactions.
   - **Acceptance criteria**:
     - Conversation history is displayed in a sidebar
     - Conversations have AI-generated titles for easy reference
     - Users can search and filter their conversation history
     - Selecting a past conversation loads the full dialogue
     - Pagination allows for efficient loading of conversation history

### 10.6. Conversation management
   - **ID**: US-006
   - **Description**: As a user, I want to manage my conversation history so that I can organize and control my data.
   - **Acceptance criteria**:
     - Users can rename conversation titles
     - Users can delete conversations with confirmation
     - Users can filter conversations by date or topic
     - Deleted conversations are properly removed from the system
     - Export functionality allows users to save conversations

### 10.7. Profile management
   - **ID**: US-007
   - **Description**: As a user, I want to manage my profile information so that I can control my personal data.
   - **Acceptance criteria**:
     - Users can view their profile information
     - Users can edit their profile details
     - Privacy settings are clearly explained and adjustable
     - Password change functionality is secure
     - Profile changes are properly saved and reflected in the system

### 10.8. Memory deletion
   - **ID**: US-008
   - **Description**: As a privacy-conscious user, I want to delete my conversation memory so that I can control my personal data.
   - **Acceptance criteria**:
     - Users can request memory deletion through the UI
     - System explains the implications of memory deletion
     - Multi-step confirmation process prevents accidental deletion
     - Options for selective or complete memory deletion
     - Verification confirms successful memory deletion

### 10.9. Goal creation
   - **ID**: US-009
   - **Description**: As a user focused on personal development, I want to create structured goals so that I can track my progress.
   - **Acceptance criteria**:
     - Interface guides users through SMART goal creation
     - Templates are available for common goal types
     - Users can define milestones for each goal
     - Goals can be categorized (career, relationships, wellness, etc.)
     - Goal creation is integrated with conversation context

### 10.10. Goal tracking
   - **ID**: US-010
   - **Description**: As a user with set goals, I want to track my progress so that I can stay motivated and see my growth.
   - **Acceptance criteria**:
     - Visual progress indicators show completion percentage
     - Regular progress check-ins are prompted
     - Achievement moments are celebrated
     - Obstacles can be identified and strategies adjusted
     - Progress history is viewable over time

### 10.11. Journal entry
   - **ID**: US-011
   - **Description**: As a reflective user, I want to create journal entries so that I can process my thoughts and experiences.
   - **Acceptance criteria**:
     - Interface provides AI-guided journal prompts
     - Users can write freeform journal entries
     - Mood and energy tracking is available
     - Journal entries are saved securely
     - Users can view their journal history

### 10.12. Journal analysis
   - **ID**: US-012
   - **Description**: As a journal user, I want insights from my entries so that I can recognize patterns and growth opportunities.
   - **Acceptance criteria**:
     - System identifies patterns across journal entries
     - Insights are presented in a supportive, growth-oriented manner
     - Journal analysis integrates with goals and conversations
     - Retrospective analysis is available for longer time periods
     - Users can request specific types of insights

### 10.13. Session summary
   - **ID**: US-013
   - **Description**: As a user ending a conversation, I want a summary of key points so that I can reflect on what was discussed.
   - **Acceptance criteria**:
     - After a substantive conversation, a summary is generated
     - Key themes and insights are highlighted
     - Any action items or follow-ups are noted
     - Summaries are stored for future reference
     - Users can optionally disable summaries

### 10.14. Admin user management
   - **ID**: US-014
   - **Description**: As an administrator, I want to manage user accounts so that I can ensure platform security and support.
   - **Acceptance criteria**:
     - Admin dashboard displays user list with key metrics
     - Admins can view user activity summaries
     - Safety flags are highlighted for review
     - User account status can be modified if needed
     - Admin actions are logged for accountability

### 10.15. Secure access
   - **ID**: US-015
   - **Description**: As a security-conscious user, I want secure access controls so that my personal information remains private.
   - **Acceptance criteria**:
     - Strong authentication mechanisms are implemented
     - Session management follows security best practices
     - Row-level security ensures data isolation
     - Access logging detects suspicious patterns
     - Session expiration and renewal are handled gracefully 