# Generated by Django 5.1.4 on 2025-06-22 15:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('engine', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='User_Content_Interaction',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('object_id', models.PositiveIntegerField()),
                ('interaction_type', models.CharField(choices=[('Like', 'Like'), ('Dislike', 'Dislike'), ('Play', 'Play'), ('Save', 'Save')], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='User_Data',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('profile_image_url', models.ImageField(default='images/user_profile/default_image.png', upload_to='images/user_profile')),
                ('user_settings', models.JSONField(blank=True, default=dict)),
                ('queue', models.JSONField(blank=True, default=list)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User_Feed',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engine.group')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='User_History',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='User_Library',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
