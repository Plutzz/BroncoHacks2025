from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from .models import Post

@csrf_exempt  # remove When we setup CSRF cookies
# @login_required
def create_post(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            title = data.get('title')
            pitch = data.get('pitch')
            description = data.get('content')

            if not title or not description or not pitch:
                return JsonResponse({'error': 'Missing title or content.'}, status=400)

            post = Post.objects.create(
                user=request.user,
                title=title,
                pitch=pitch,
                content=description,
            )

            return JsonResponse({
                'message': 'Post created successfully!',
                'post': {
                    'id': post.id,
                    'title': post.title,
                    'content': post.content,
                    'created_at': post.created_at.isoformat()
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

def fetch_posts(request):
    if request.method == 'GET':
        try:
            
            posts = Post.objects.all()
            return JsonResponse({
                'message': 'Posts fetched successfully',
                'data' : posts,
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    return JsonResponse({'error': 'Only GET requests are allowed.'}, status=405)
    
