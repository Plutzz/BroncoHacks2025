# Generated by Django 5.2 on 2025-04-19 15:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_post_files_post_image_post_video'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
    ]
