from django.shortcuts import render
from django.http import JsonResponse

def HelloWorld(request):
    return JsonResponse({'message': 'Hello, world!'})