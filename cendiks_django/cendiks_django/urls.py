from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),  # Gunakan template login yang telah dibuat
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]

urlpatterns = [
    path('exam/<int:exam_id>/', views.exam_detail, name='exam_detail'),
    # URL untuk mengunduh sertifikat (jika sudah selesai ujian dan lulus)
    path('generate-certificate/<int:user_exam_id>/', views.generate_certificate, name='generate_certificate'),
]

