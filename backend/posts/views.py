from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
import json
from .models import Post, Comment, PostLike

@csrf_exempt  # remove When we setup CSRF cookies
# @login_required
@api_view(['POST'])
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

@api_view(['GET'])
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
    


# =======================
#      Like Post
# =======================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    # parse payload
    try:
        data = request.data or json.loads(request.body)
    except ValueError:
        return JsonResponse({'message': 'Invalid JSON.', 'status': 400}, status=400)

    userID = data.get('userID')

    # validations
    if not userID:
        return JsonResponse({'message': 'userID was not provided', 'status': 400}, status=400)
    if len(post_id) != 24 or len(userID) != 24:
        return JsonResponse({'message': 'Post or User ID must be 24 char long', 'status': 400}, status=400)

    # fetch post with related author/comments
    post = get_object_or_404(
        PostLike.objects.select_related('post'),
        user=userID,
        post=post_id
    )

    # check if post exists
    if not post:
        return JsonResponse({'message': 'Post not found', 'status': 404}, status=404)

    # check if user already liked the post
    if post.likes.filter(author=request.user).exists():
        post.likes.remove(request.user)
    else:
        post.likes.add(request.user)

    # build response payload
    new_post = {
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'likes': list(post.likes.values_list('author__id', flat=True)),
        'author': post.author.username,
        'comments': comments
    }

    return JsonResponse({
        'message': 'Post like handled',
        'status': 200,
        'newPost': new_post
    }, status=200)