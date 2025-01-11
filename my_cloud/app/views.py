from rest_framework import viewsets
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.conf import settings
from django.http import Http404, JsonResponse
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext as _

from rest_framework import serializers, permissions
from rest_framework.serializers import ModelSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import TokenObtainPairWithUser
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenSerializer

import logging
import datetime
import os
from uuid import uuid4

from app.models import User, File
from app.serializers import FilesSerializer, UserSerializer
from app.validation import validate_password, validate_username, validate_file_size



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

#Autentification

def user_login(request):
    username = request.POST['username']
    password = request.POST['password']
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Успешная авторизация.'}, status=200)
    else:
        return JsonResponse({'message': 'Неверное имя пользователя или пароль.'}, status=status.HTTP_400_BAD_REQUEST)


def user_logout(request):
    logout(request)
    return JsonResponse({'message': 'Вы вышли из аккаунта'}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'Access granted'})

def unauthorized_access():
    return Response({'message': 'Unauthorized access'}, status=HTTP_403_FORBIDDEN)

def user_info(request):
    return JsonResponse({
        'username': request.user.username,
        'id': request.user.id
    })

#Logging

logger = logging.getLogger(__name__)

def some_function():
    logger.debug("Debug message")
    logger.info("Info message")
    logger.warning("Warning message")
    logger.error("Error message")

#Sign Up
class CreateUser(APIView):
  
    permission_classes = [AllowAny]
    def post(self, request):
        data = {}
        
        data = validate_username(request.data['username'])
        if data != True:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

       
        data = validate_password(request.data['password'])
        if data != True:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        
        request.data['password'] = make_password(request.data['password'])

        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#Sign In

class LoginUser(APIView):
    serializer_class = None
    permission_classes = []

    def post(self, request):
        data = request.data
        username = data["username"]
        password = data["password"]

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"detail": "Неверный логин или пароль"}, status=401)

        token, created = TokenObtainPairWithUser(user)
        return Response({
            "token": token.key,
            "user": {
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_staff
            }
        }, status=200)

class AuthTokenSerializer(ModelSerializer):
    user = None
    token = None

    def validate_token(self, data):
        self.token = data["token"]

        try:
            self.user = User.objects.get_by_natural_key(username=self.validated_data["username"])

        except User.DoesNotExist:
            self.user = None

        if self.user:
            self.token = TokenSerializer(data={"user_id": self.user.pk}, context={'request': self.context['request']}).data['token']

            return self.token

    def validate(self, attrs):
        if not self.token:
            raise ValidationError({"token": [_("Невозможно получить токен")]}, code="authorization")

        return self.token
    
class ValidateTokenSerializer(AuthTokenSerializer):
    pass


#Sign Out
class LogoutUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        request.user = None
        return Response({"logout": "Вы вышли из системы."}, status=200)
    


#Delete User 
class UserDestroy(DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=204)

#Users List
class UsersList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__" 

#User File List
class FilesUserListAPIView(ListAPIView):
    serializer_class = ModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, request, user):
        return self.queryset.filter(user=user)

    def list(self, request, user):
        return Response(self.get_queryset(request, user))

class FilesUserSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = ("filename", "size", "date_upload", "comment", "link")


# Uppload files

class FilesList(APIView):
  
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, format=None):
        user_id = request.GET.get('pk', None)
        if user_id == None:
            user = User.objects.get(id=request.user.id)
            if user.is_staff:
                files = File.objects.all()
                file_serializer = FilesSerializer(files, many=True)
                return Response(file_serializer.data, status=status.HTTP_200_OK)
            return Response({ 'details': 'Нет доступа.' }, status=status.HTTP_403_FORBIDDEN)

        files = File.objects.filter(user=user_id)
        file_serializer = FilesSerializer(files, many=True)
        return Response(file_serializer.data)

    def post(self, request, format=None):
        data = validate_file_size(request.data['size'])
        if data != True:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        file_serializer = FilesSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update files, delete files

class FileDetail(APIView):
   
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return File.objects.get(pk=pk)
        except File.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        is_download = request.GET.get('download', None)
        is_special = request.GET.get('special', None)

        file = self.get_object(pk)
        if is_download:
            file.last_download = datetime.datetime.now()
            file.save()
            url = serve_download_file(request, pk)
            return Response(url)

        if is_special:
            url = serve_special_file(request, pk)
            return Response(url)

        files_serializer = FilesSerializer(file)
        return Response(files_serializer.data)

    def put(self, request, pk, format=None):
        file = self.get_object(pk)
        files_serializer = FilesSerializer(file, data=request.data)
        if files_serializer.is_valid():
            files_serializer.save()
            return Response(files_serializer.data)
        return Response(files_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        file = self.get_object(pk)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Create donloads link

def serve_special_file(request, pk):
    file = File.objects.get(id=pk)

    temporary_filename = f'temp_{file.pk}_{uuid4().hex[:8]}.{file.file.name.split(".")[-1]}'
    temporary_path = os.path.join(settings.MEDIA_ROOT, temporary_filename)

    with open(temporary_path, 'wb+') as temp_file:
        for chunk in file.file.open():
            temp_file.write(chunk)

    special_url = 'http://' + request.get_host() + settings.MEDIA_URL + temporary_filename
    return {
        'special_url': special_url
    }


def serve_download_file(request, pk):
    file = File.objects.get(id=pk)
    
    download_url = 'http://' + request.get_host() + settings.MEDIA_URL + file.file.name
    return {
        'download_url': download_url,
        'filename': file.title
    }
