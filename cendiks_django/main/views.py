from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from .models import CertificationExam, ExamQuestion, ExamResult

# Login API endpoint
@csrf_exempt
@require_POST
def api_login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'success': False, 'message': 'Username dan password diperlukan'})

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Login berhasil'})
        else:
            return JsonResponse({'success': False, 'message': 'Username atau password salah'})
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Data tidak valid'})

# Register API endpoint
@csrf_exempt
@require_POST
def api_register(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        if not username or not email or not password or not password_confirm:
            return JsonResponse({'success': False, 'message': 'Semua field harus diisi'})

        if password != password_confirm:
            return JsonResponse({'success': False, 'message': 'Password tidak cocok'})

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username sudah digunakan'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'Email sudah digunakan'})

        # Create new user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        # Auto login after registration
        login(request, user)

        return JsonResponse({'success': True, 'message': 'Registrasi berhasil'})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Data tidak valid'})

# Fungsi untuk menampilkan ujian
@login_required
def exam_detail(request, exam_id):
    exam = get_object_or_404(CertificationExam, pk=exam_id)
    questions = exam.questions.all()

    if request.method == "POST":
        score = 0
        total_questions = questions.count()
        # Periksa jawaban pengguna
        for question in questions:
            user_answer = request.POST.get(f'question_{question.id}')
            # Check if the answer is correct
            correct_option = question.options.filter(is_correct=True).first()
            if correct_option and user_answer == correct_option.option_text:
                score += question.points

        # Simpan hasil ujian
        ExamResult.objects.create(
            user=request.user,
            exam=exam,
            score=score,
            total_score=sum(q.points for q in questions),
            status='passed' if score >= exam.passing_score else 'failed',
            start_time=request.POST.get('start_time'),
            end_time=request.POST.get('end_time')
        )
        return render(request, 'exam_results.html', {'score': score, 'exam': exam, 'questions': questions})

    return render(request, 'exam_detail.html', {'exam': exam, 'questions': questions})

# Fungsi untuk mengunduh sertifikat
@login_required
def generate_certificate(request, user_exam_id):
    user_exam = get_object_or_404(ExamResult, pk=user_exam_id, user=request.user)

    # Membuat response untuk file PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="sertifikat_{user_exam.user.username}.pdf"'

    # Membuat file PDF
    p = canvas.Canvas(response)
    p.drawString(100, 750, f"Ujian Sertifikasi: {user_exam.exam.title}")
    p.drawString(100, 730, f"Nama: {user_exam.user.username}")
    p.drawString(100, 710, f"Skor: {user_exam.score}/{user_exam.total_score}")
    p.drawString(100, 690, f"Status: {user_exam.status}")
    p.showPage()
    p.save()

    return response
