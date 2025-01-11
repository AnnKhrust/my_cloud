from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from uuid import uuid4
import os


class User(AbstractUser):
    username = models.CharField(verbose_name='Логин', max_length=20, unique=True)
    password = models.CharField(verbose_name='Пароль', max_length=30)
    first_name = models.CharField(verbose_name='Имя', max_length=40)
    last_name = models.CharField(verbose_name='Фамилия', max_length=40)
    email = models.CharField(max_length=50)
    is_staff = models.BooleanField(verbose_name='Администратор', default=False)
    is_superuser = models.BooleanField(default=False)

    class Meta:
        ordering = ['id', 'username', 'first_name', 'last_name']
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Список пользователей'

    groups = models.ManyToManyField(Group, blank=True, related_name="custom_groups")
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name="custom_user_permissions")


def user_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4().hex[:8]}.{ext}'
    return os.path.join('storage_files', instance.user.username, filename)


class File(models.Model):
    title = models.CharField(verbose_name='Имя файла', max_length=100)
    comment = models.CharField(verbose_name='Комментарий', max_length=250, default='', blank=True)
    size = models.IntegerField(verbose_name='Размер файла', default=0)
    created = models.DateTimeField(verbose_name='Дата создания', auto_now_add=True)
    last_download = models.DateTimeField(verbose_name='Дата последнего скачивания', null=True)
    user = models.ForeignKey(User, verbose_name='Пользователь', default=1, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_path, default='')

    class Meta:
        ordering = ['title', 'created']
        verbose_name = 'Файл'
        verbose_name_plural = 'Список файлов'