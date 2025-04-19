from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view
import json
from .models import Post, Comment, PostLike, Tag
from django.shortcuts import get_object_or_404

@api_view(['POST'])
def create_post(request):
    if request.method == 'POST':
        try:
            data = request.data

            title = data.get('title')
            pitch = data.get('pitch')
            techStack = data.get('techStack')
            description = data.get('description')
            files = data.get('files')
            github_link = data.get('github_link')
            tag_names = data.get('tags').split(",")
            print("TAGS", tag_names)
            if not title or not description or not pitch:
                return JsonResponse({'error': 'Missing title or content.'}, status=400)

            post = Post.objects.create(
                user=request.user,
                title=title,
                pitch=pitch,
                files=files,
                description=description,
                github_link=github_link,
                tech_stack = techStack,
            )
            
            tags = []
            for tag_name in tag_names:
                    tag, created = Tag.objects.get_or_create(name=tag_name)
                    tags.append(tag)
            post.tags.set(tags)

            return JsonResponse({
                'message': 'Post created successfully!',
                'post': {
                    'id': post.id,
                    'title': post.title,
                    'content': post.description,
                    'created_at': post.created_at.isoformat(),
                    'author': post.user.username,
                    'files': post.files.url if post.files else None,
                    'pitch': post.pitch,
                    'github_link': post.github_link,
                    'tech_stack': post.tech_stack,
                    'tags': [tag.name for tag in tags],
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

@api_view(['GET'])
def fetch_posts(request):
    try:
        posts = Post.objects.all()
        post_data = []

        for post in posts:
            tags = post.tags.all()
            tag_names = [tag.name for tag in tags]

            post_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.description,
                'author': post.user.username,
                'authorAvatar': post.user.avatar.url if post.user.avatar else None,
                'pitch': post.pitch,
                'files': post.files.url if post.files else None,
                'github_link': post.github_link,
                'tech_stack': post.tech_stack,
                'view_count': post.view_count,
                'likes_count': post.likes.count(),
                'comments_count': post.comments.count(),
                'likes': list(post.likes.values_list('user_id', flat=True)),
                'comments': [
                    {
                        'id': comment.id,
                        'content': comment.content,
                        'author': comment.user.username,
                        'created_at': comment.created_at.isoformat()
                    } for comment in post.comments.all()
                ],
                'created_at': post.created_at.isoformat(),
                'tags': tag_names,
            })
        
        # print("POST DATA", post_data)

        return JsonResponse({
            'message': 'Posts fetched successfully',
            'data' : post_data,
        }, status=201)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)


@api_view(['POST'])
@login_required
def delete_post(request):
    print("REQUEST")
    data = request.data
    print(data)
    post_id = data.get('id')
    print(post_id)
    post = get_object_or_404(Post, id=post_id)

    if post.user != request.user:
        return JsonResponse({'error': 'You do not have permission to delete this post.'}, status=403)

    post.delete()
    return JsonResponse({'message': 'Post deleted successfully'})

@api_view(['GET'])
def search_posts(request):
    query = request.GET.get('search', '')

    posts = Post.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query)
    ).order_by('-created_at')

    posts_data = [
        {
            'id': post.id,
            'title': post.title,
            'description': post.description,
            'author': post.user.username,
            'created_at': post.created_at.isoformat(),
        }
        for post in posts
    ]

    return JsonResponse({'results': posts_data})

# =======================
#      Like Post
# =======================

@api_view(['POST'])
def like_post(request, post_id):
    try:
        data = request.data or json.loads(request.body)
    except ValueError:
        return JsonResponse({'message': 'Invalid JSON.', 'status': 400}, status=400)

    userID = data.get('userID')

    # validations
    if not userID:
        return JsonResponse({'message': 'userID was not provided', 'status': 400}, status=400)
    # if len(post_id) != 24 or len(userID) != 24:
    #     return JsonResponse({'message': 'Post or User ID must be 24 char long', 'status': 400}, status=400)

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
        'comments': [
            {
                'id': str(comment.id),
                'content': comment.content,
                'author': comment.author.username,
                'created_at': comment.created_at.isoformat()
            } for comment in post.comments.all()
        ],
    }

    return JsonResponse({
        'message': 'Post like handled',
        'status': 200,
        'newPost': new_post
    }, status=200)

# =======================
#      Comment Post
# =======================

@login_required
@api_view(['POST'])
def create_comment(request, post_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            content = data.get('content')

            if not content:
                return JsonResponse({'error': 'Missing content.'}, status=400)

            post = Post.objects.get(id=post_id)
            comment = Comment.objects.create(
                user=request.user,
                post=post,
                content=content,
            )

            return JsonResponse({
                'message': 'Comment created successfully!',
                'comment': {
                    'id': comment.id,
                    'content': comment.content,
                    'created_at': comment.created_at.isoformat()
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found.'}, status=404)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


@login_required
@api_view(['POST'])
def like_comment(request, comment_id):
    if request.method == 'POST':
        try:
            comment = Comment.objects.get(id=comment_id)
            if request.user in comment.likes.all():
                comment.likes.remove(request.user)
                liked = False
            else:
                comment.likes.add(request.user)
                liked = True

            return JsonResponse({
                'message': 'Comment liked successfully!',
                'liked': liked,
                'likes_count': comment.likes.count()
            }, status=200)

        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found.'}, status=404)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

@login_required
@api_view(['DELETE'])
def delete_comment(request, comment_id):
    if request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.user == request.user:
                comment.delete()
                return JsonResponse({'message': 'Comment deleted successfully!'}, status=200)
            else:
                return JsonResponse({'error': 'You do not have permission to delete this comment.'}, status=403)

        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found.'}, status=404)

    return JsonResponse({'error': 'Only DELETE requests are allowed.'}, status=405)

