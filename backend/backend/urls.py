"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

from accounts import views as accounts_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('TestApp/', include('TestApp.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/userprofile/', include('userprofile.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    if settings.STATICFILES_DIRS:
        urlpatterns += static(settings.STATIC_URL,
                              document_root=settings.STATICFILES_DIRS[0])
    
    urlpatterns += static(
        '/assets/',
        document_root=str(settings.FRONTEND_DIST / 'assets')
    )
    
    urlpatterns += static(
        '/images/',
        document_root=str(settings.FRONTEND_DIST / 'images')
    )


urlpatterns += [
    re_path(r'^(?!admin/|TestApp/|assets/|images/|static/|vite\.svg$).*$', 
            TemplateView.as_view(template_name='index.html'),
            name='spa-fallback'),
]