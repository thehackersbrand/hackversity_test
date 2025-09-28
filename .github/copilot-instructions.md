<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Django GenAI Application

This is a Django-based generative AI application with user authentication and conversation management.

## Project Structure
- Django 4.2 web framework
- Euron API integration for AI responses (GPT-4.1-nano)
- User authentication with django-allauth
- REST API endpoints
- Responsive web interface
- SQLite database (development)

## Features
- User registration and authentication
- AI-powered chat interface
- Conversation history management
- Responsive design
- Admin interface

## Setup Instructions
1. Create and activate virtual environment: `python -m venv venv && venv\Scripts\activate`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure Euron API key in .env file: `EURON_API_KEY=your-api-key`
4. Test Euron API setup: `python test_euron_api.py`
5. Run migrations: `python manage.py migrate`
6. Create superuser: `python manage.py createsuperuser`
7. Start development server: `python manage.py runserver`

## Available VS Code Tasks
- "Install Dependencies" - Install Python packages
- "Django Migrate" - Run database migrations
- "Create Superuser" - Create admin user
- "Django Development Server" - Start the development server
- "Django Setup All" - Run installation and migration in sequence