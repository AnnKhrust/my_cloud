from django.urls import path
from .views import UserViewSet
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from app import views

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns =  [
    path('users/', views.UsersList.as_view()),
    path('users/<int:pk>', views.LoginUser.as_view()),
    path('login/', views.user_login),
    path('logout/', views.user_logout),
    path('user_info/', views.user_info),
    path('registration/', views.CreateUser.as_view()),
    path('storage/', views.FilesList.as_view()),
    path('storage/<int:pk>', views.FileDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
