from django.contrib import admin
from django.contrib.auth.models import Group
from .models import User, File

admin.site.unregister(Group)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    exclude = ['password', 'is_superuser', 'groups', 'last_login', 'user_permissions', 'date_joined']
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions')
    readonly_fields = ('date_joined', 'last_login')


@admin.register(File)
class FilesAdmin(admin.ModelAdmin):
    list_display = ['title', 'comment', 'size', 'created', 'user']
    exclude = ['file']
