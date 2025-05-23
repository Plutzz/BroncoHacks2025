from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
import json
from .models import Post, Comment, PostLike, Tag, PostAttachment
from .serializers import CommentSerializer
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
            github_link = data.get('github_link')
            tag_names = data.get('tags').split(",")
            print("TAGS", tag_names)
            if not title or not description or not pitch:
                return JsonResponse({'error': 'Missing title or content.'}, status=400)

            post = Post.objects.create(
                user=request.user,
                title=title,
                pitch=pitch,
                description=description,
                github_link=github_link,
                tech_stack = techStack,
            )
            
            for f in request.FILES.getlist('files'):
                PostAttachment.objects.create(post=post, file=f)
            
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
                    'files': [att.file.url for att in post.attachments.all()],
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
                'author_id': post.user.id,
                'authorAvatar': post.user.avatar.url if post.user.avatar else None,
                'pitch': post.pitch,
                'files': [att.file.url for att in post.attachments.all()],
                'github_link': post.github_link,
                'tech_stack': post.tech_stack,
                'view_count': post.view_count,
                'likes_count': post.likes.count(),
                'isLiked' : post.likes.filter(id=request.user.id).exists(),
                'comments_count': post.comments.count(),
                'likes': post.likes.count(),
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
        }, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

@api_view(['PUT','PATCH', 'POST'])
def update_post(request, id):
    """
    Update a post. Only the owner may edit.
    Accepts multipart/form-data with same fields as create.
    """
    post = get_object_or_404(Post, pk=id)
    if post.user != request.user:
        return JsonResponse({'detail': 'Forbidden'}, status=403)

    data = request.data
    post.title = data.get('title', post.title)
    post.pitch = data.get('pitch', post.pitch)
    post.description = data.get('description', post.description)
    post.tech_stack = data.get('tech_stack', post.tech_stack)
    post.github_link = data.get('github_link', post.github_link)
    # update tags (clear + add)
    if 'tags' in data:
        post.tags.clear()
        for tag_name in request.data.getlist('tags'):
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag_obj)
    # handle new files
    if request.FILES:
        post.attachments.all().delete()
        
        for f in request.FILES.getlist('files'):
            PostAttachment.objects.create(post=post, file=f)

    post.save()
    # return updated post summary
    return JsonResponse({
        'id': post.id,
        'title': post.title,
        'pitch': post.pitch,
        'description': post.description,
        'created_at': post.created_at.isoformat(),
        'tech_stack': post.tech_stack,
        'github_link': post.github_link,
        'tags': [t.name for t in post.tags.all()],
        'files': [att.file.url for att in post.attachments.all()],
    }, status=200)
    
@api_view(['GET'])
def get_post(request, id):
    """
    Get a post by ID. Returns the post and its comments.
    """
    post = get_object_or_404(Post, pk=id)
    tags = post.tags.all()
    tag_names = [tag.name for tag in tags]

    post_data = {
        'id': post.id,
        'title': post.title,
        'content': post.description,
        'author': post.user.username,
        'author_id': post.user.id,
        'authorAvatar': post.user.avatar.url if post.user.avatar else None,
        'pitch': post.pitch,
        'files': [att.file.url for att in post.attachments.all()],
        'github_link': post.github_link,
        'tech_stack': post.tech_stack,
        'view_count': post.view_count,
        'likes_count': post.likes.count(),
        'comments_count': post.comments.count(),
        'likes': post.likes.count(),
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
    }

    return JsonResponse({
        'message': 'Post fetched successfully',
        'data' : post_data
    }, status=200)

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
        'author_id': post.user.id,
        'authorAvatar': post.user.avatar.url if post.user.avatar else None,
        'pitch': post.pitch,
        'files': [att.file.url for att in post.attachments.all()],
        'github_link': post.github_link,
        'tech_stack': post.tech_stack,
        'view_count': post.view_count,
        'likes_count': post.likes.count(),
        'comments_count': post.comments.count(),
        'likes': post.likes.count(),
        'comments': [
            {
                'id': comment.id,
                'content': comment.content,
                'author': comment.user.username,
                'created_at': comment.created_at.isoformat()
            } for comment in post.comments.all()
        ],
        'created_at': post.created_at.isoformat(),
        'tags': [tag.name for tag in post.tags.all()],
        }
        for post in posts
    ]

    return JsonResponse({'results': posts_data})

# =======================
#      Like Post
# =======================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request):
    post_id = request.data.get('post_id')
    user = request.user

    if not post_id:
        return JsonResponse({'error': 'post_id is required'}, status=400)

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

    like, created = PostLike.objects.get_or_create(user=user, post=post)
    if not created:
        # Already liked, so unlike
        like.delete()
        return JsonResponse({'liked': False, 'message': 'Post unliked'}, status=200)

    return JsonResponse({'liked': True, 'message': 'Post liked'}, status=200)


@api_view(['POST'])
def view_post(request):
    post_id = request.data.get('post_id')
    user = request.user

    if not post_id:
        return JsonResponse({'error': 'post_id is required'}, status=400)

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

    post.view_count+=1
    post.save(update_fields=["view_count"])
    return JsonResponse({'viewed': True, 'message': 'Post viewed'}, status=200)


# =======================
#      Comment Post
# =======================

@login_required
@api_view(['POST'])
def create_comment(request):
    if request.method == 'POST':
        try:
            print("Trying to get comment", request.data)
            content = request.data.get('text')
            post_id = request.data.get('post_id')

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

@api_view(['GET'])
def fetch_comments(request):
    post_id = request.GET.get('post_id')

    if not post_id:
        return JsonResponse({'error': 'post_id is required'}, status=400)

    comments = Comment.objects.filter(post_id=post_id).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)

    return JsonResponse({
        'message': 'Comments fetched successfully',
        'data': serializer.data
    }, status=200)

