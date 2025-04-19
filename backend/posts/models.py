from django.db import models
from django.conf import settings  # for AUTH_USER_MODEL

# Create your models here.
class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # works with default or custom user models
        on_delete=models.CASCADE,  # delete posts if user is deleted
        related_name='posts'
    )
    tags = models.ManyToManyField('Tag', related_name='posts', blank=True)  # this creates the association table

    title = models.CharField(max_length=255)
    pitch = models.TextField()
    tech_stack = models.TextField(default="N/A", null=True)
    view_count = models.IntegerField(default=0)  # number of views
    description = models.TextField()
    files = models.FileField(upload_to='files/', blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']  # newest first
        
    def __str__(self):
        return self.title
    

# How to create tags
# =======================================================
# post = Post.objects.get(id=1)
# tag1 = Tag.objects.create(name="machine-learning")
# tag2 = Tag.objects.create(name="web-dev")

# post.tags.add(tag1, tag2)

class Tag(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name
      


class PostLike(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='post_likes'
    )
    post = models.ForeignKey(
        'Post', 
        on_delete=models.CASCADE, 
        related_name='likes'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # prevents duplicate likes

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"




# =================================
# Comments
# =================================


class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    post = models.ForeignKey(
        'Post',  # Assuming Post model is in the same file
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'
    

class CommentLike(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='comment_likes'
    )
    comment = models.ForeignKey(
        'Comment', 
        on_delete=models.CASCADE, 
        related_name='likes'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')  # prevents duplicate likes

    def __str__(self):
        return f"{self.user.username} liked comment {self.comment.id}"
