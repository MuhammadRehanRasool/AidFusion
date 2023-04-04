from django.contrib.auth.models import Group
from django.contrib import admin
from . import models
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    exclude = ('groups', 'user_permissions',
               'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined')
    list_display = ('pk', 'username', 'is_admin',)
    list_filter = ('is_staff',)

    def is_admin(self, obj):
        pl = "✔️" if obj.is_staff else "❌"
        return pl


admin.site.register(models.Users, UserAdmin)
admin.site.register(models.Review)


admin.site.site_header = "AidFusion Management System ✨"
admin.site.site_title = "Admin"
admin.site.index_title = "Website Administration"

admin.site.unregister(Group)
