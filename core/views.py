from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('AIzaSyAcUjHwJPR4dQBePRu5xfJPghBC8v-xE4U'))
model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(message):
    try:
        # Add context about Hackversity to every prompt
        context = """You are an AI assistant for Hackversity, a university for ethical hackers. 
        We offer cybersecurity courses including a Bug Bounty Workshop (999/- now at 299/-).
        Focus on cybersecurity, ethical hacking, and our educational offerings."""
        
        # Combine context and user message
        full_prompt = f"{context}\n\nUser question: {message}"
        
        # Get response from Gemini
        response = model.generate_content(full_prompt)
        response_text = response.text.strip()
        
        return response_text
    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}"

def home(request):
    try:
        return render(request, 'home.html')
    except Exception as e:
        return HttpResponse(f"Debug: {str(e)}")

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            # Get response from Gemini
            response = get_gemini_response(user_message)
            
            return JsonResponse({'response': response})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_gemini_response(message):
    # Sample responses based on keywords
    responses = {
        'hello': 'Hi! How can I help you with cybersecurity today?',
        'course': 'We offer various cybersecurity courses. Our most popular is the Bug Bounty Workshop at a special price of 299/-',
        'price': 'Our current special offer is the Bug Bounty Workshop at 299/- (regular price 999/-)',
        'contact': 'You can reach us through our contact form or email at support@hackversity.com',
        'help': 'I can help you with course information, pricing, features, or technical support. What would you like to know?'
    }
    
    # Check for keywords in the message
    message = message.lower()
    for key in responses:
        if key in message:
            return responses[key]
    
    return "I'm here to help you learn about cybersecurity and ethical hacking. Feel free to ask about our courses, features, or pricing!"

def features(request):
    try:
        return render(request, 'features.html')
    except Exception as e:
        return HttpResponse(f"Debug: {str(e)}")

def pricing(request):
    try:
        return render(request, 'pricing.html')
    except Exception as e:
        return HttpResponse(f"Debug: {str(e)}")

def contact(request):
    try:
        return render(request, 'contact.html')
    except Exception as e:
        return HttpResponse(f"Debug: {str(e)}")
