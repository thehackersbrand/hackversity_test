# Django GenAI Setup Troubleshooting Guide

## Issue: Build wheel errors during pip install

### Solution 1: Upgrade pip and use minimal requirements

1. **Upgrade pip first**:
```bash
python -m pip install --upgrade pip
```

2. **Install packages individually**:
```bash
pip install Django==4.2.16
pip install python-dotenv
pip install djangorestframework
pip install django-allauth
pip install django-cors-headers
pip install openai
```

### Solution 2: Use conda instead of pip (if available)

```bash
conda install django python-dotenv
pip install djangorestframework django-allauth django-cors-headers openai
```

### Solution 3: Install minimal version first

Create a `requirements-minimal.txt` with just Django:
```
Django==4.2.16
python-dotenv==1.0.1
```

Then add other packages later:
```bash
pip install -r requirements-minimal.txt
pip install djangorestframework django-allauth django-cors-headers
pip install openai
```

### Solution 4: Use pre-compiled wheels

```bash
pip install --only-binary=all Django djangorestframework
```

### Test Django Installation

After successful installation, test with:
```bash
python -c "import django; print('Django version:', django.get_version())"
```

### Run Django Commands

Once Django is installed:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Alternative: Use SQLite-only version

If you continue having issues, you can run the application with just the core dependencies. The app will work with SQLite database without any external dependencies.