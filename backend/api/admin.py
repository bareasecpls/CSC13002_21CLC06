from django.contrib import admin
from .models import CustomUser, Category, Book

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(CustomUser)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Book)
