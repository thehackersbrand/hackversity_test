from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    try:
        return render(request, 'home.html')
    except Exception as e:
        return HttpResponse(f"Debug: {str(e)}")

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
