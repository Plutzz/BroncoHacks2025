from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_message(request):
    return Response({'message': 'Hello from the backend!'})

def HelloWorld(request):
    return JsonResponse({'message': 'Hello, world!'})

def index(request):
    return render(request, 'index.html')