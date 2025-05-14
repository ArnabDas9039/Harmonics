from django.contrib import admin
from django.urls import path, include
from authentication import views as av

# from api.views import CreateUserView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/login/", av.LoginView.as_view()),
    # path("auth/check/", av.CheckView.as_view()),
    path("auth/refresh/", av.RefreshView.as_view()),
    path("auth/logout/", av.LogoutView.as_view()),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("content/", include("content.urls")),
    path("analytics/", include("analytics.urls")),
    path("studio/", include("studio.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
