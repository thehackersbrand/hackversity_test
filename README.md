# Django GenAI Application

A Django-based generative AI application with user authentication and conversation management using **Euron API**.

## Features

- User authentication and registration
- AI-powered chat interface with **Euron AI API**
- Conversation history
- Responsive web design
- Euron GPT-4.1-nano model integration

## Setup

### Quick Start (if you encounter dependency issues)

1. **Create and activate virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

2. **Upgrade pip:**
```bash
python -m pip install --upgrade pip
```

3. **Install minimal dependencies first:**
```bash
pip install -r requirements-minimal.txt
```

4. **Test Django installation:**
```bash
python -c "import django; print('Django version:', django.get_version())"
```

5. **Install remaining packages:**
```bash
pip install djangorestframework django-allauth django-cors-headers
pip install requests  # For Euron API
```

### Full Setup

1. **Install all dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```
SECRET_KEY=your-secret-key-here
EURON_API_KEY=your-euron-api-key  # Get from https://api.euron.one
DEBUG=True
```

3. **Test Euron API setup:**
```bash
python test_euron_api.py
```

4. **Run database migrations:**
```bash
python manage.py migrate
```

4. **Create a superuser:**
```bash
python manage.py createsuperuser
```

5. **Run the development server:**
```bash
python manage.py runserver
```

### Troubleshooting

If you encounter build wheel errors, see `TROUBLESHOOTING.md` for detailed solutions.

## Usage

1. Navigate to `http://127.0.0.1:8000/`
2. Register a new account or login
3. Start chatting with the AI assistant
4. View your conversation history

## Project Structure

- `genai_project/` - Main Django project
- `chat/` - Main application with AI chat functionality
- `accounts/` - User authentication
- `static/` - Static files (CSS, JS)
- `templates/` - HTML templates

## API Keys

You'll need an OpenAI API key to use the generative AI features. Get one from https://platform.openai.com/api-keys