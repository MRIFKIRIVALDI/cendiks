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

# API untuk mendapatkan soal ujian
def get_exam_questions(request, exam_id):
    try:
        exam = get_object_or_404(CertificationExam, pk=exam_id)
        questions = exam.questions.all().order_by('id')

        questions_data = []
        for question in questions:
            options = question.options.all()
            questions_data.append({
                'id': question.id,
                'question': question.question,
                'question_type': question.question_type,
                'points': question.points,
                'options': [
                    {
                        'id': option.id,
                        'option_text': option.option_text,
                        'is_correct': option.is_correct
                    } for option in options
                ]
            })

        return JsonResponse({
            'success': True,
            'exam': {
                'id': exam.id,
                'title': exam.title,
                'description': exam.description,
                'duration': exam.duration,
                'total_questions': exam.total_questions,
                'passing_score': exam.passing_score
            },
            'questions': questions_data
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

# API untuk submit jawaban ujian
@csrf_exempt
@login_required
@require_POST
def submit_exam(request, exam_id):
    try:
        data = json.loads(request.body)
        answers = data.get('answers', [])
        time_used = data.get('time_used', 0)
        score = data.get('score', 0)

        exam = get_object_or_404(CertificationExam, pk=exam_id)
        questions = exam.questions.all()

        # Hitung skor berdasarkan jawaban
        total_score = 0
        max_score = sum(q.points for q in questions)
        correct_answers = 0

        # Simpan hasil ujian
        from django.utils import timezone
        exam_result = ExamResult.objects.create(
            user=request.user,
            exam=exam,
            score=0,  # akan diupdate setelah perhitungan
            total_score=max_score,
            status='pending',
            start_time=timezone.now() - timezone.timedelta(seconds=time_used),
            end_time=timezone.now()
        )

        # Periksa jawaban dan simpan detail
        for i, answer_id in enumerate(answers):
            if answer_id is None:
                continue

            try:
                question = questions[i]
                # Cari opsi yang benar berdasarkan ID
                correct_option = question.options.filter(is_correct=True).first()
                selected_option = question.options.filter(id=answer_id).first()

                is_correct = False
                if correct_option and selected_option and correct_option.id == selected_option.id:
                    is_correct = True
                    correct_answers += 1
                    total_score += question.points

                # Simpan jawaban siswa
                StudentAnswer.objects.create(
                    exam_result=exam_result,
                    question=question,
                    user_answer=selected_option.option_text if selected_option else '',
                    is_correct=is_correct
                )
            except (IndexError, ExamQuestion.DoesNotExist):
                continue

        # Update skor dan status
        passing_percentage = (total_score / max_score) * 100 if max_score > 0 else 0
        status = 'passed' if passing_percentage >= exam.passing_score else 'failed'

        exam_result.score = total_score
        exam_result.status = status
        exam_result.save()

        return JsonResponse({
            'success': True,
            'result': {
                'score': total_score,
                'max_score': max_score,
                'percentage': round(passing_percentage, 1),
                'status': status,
                'correct_answers': correct_answers,
                'total_questions': len(questions),
                'exam_result_id': exam_result.id
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Data tidak valid'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

# API untuk mendapatkan riwayat ujian
@login_required
def get_exam_history(request):
    try:
        exam_results = ExamResult.objects.filter(user=request.user).order_by('-created_at')

        history_data = []
        for result in exam_results:
            history_data.append({
                'id': result.id,
                'exam_title': result.exam.title,
                'score': result.score,
                'total_score': result.total_score,
                'percentage': round((result.score / result.total_score) * 100, 1) if result.total_score > 0 else 0,
                'status': result.status,
                'start_time': result.start_time.isoformat() if result.start_time else None,
                'end_time': result.end_time.isoformat() if result.end_time else None,
                'created_at': result.created_at.isoformat()
            })

        return JsonResponse({
            'success': True,
            'history': history_data
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

# API untuk mendapatkan detail hasil ujian
@login_required
def get_exam_result_detail(request, result_id):
    try:
        exam_result = get_object_or_404(ExamResult, pk=result_id, user=request.user)
        answers = exam_result.answers.all().select_related('question')

        detail_data = {
            'exam_title': exam_result.exam.title,
            'score': exam_result.score,
            'total_score': exam_result.total_score,
            'percentage': round((exam_result.score / exam_result.total_score) * 100, 1) if exam_result.total_score > 0 else 0,
            'status': exam_result.status,
            'start_time': exam_result.start_time.isoformat() if exam_result.start_time else None,
            'end_time': exam_result.end_time.isoformat() if exam_result.end_time else None,
            'answers': []
        }

        for answer in answers:
            correct_option = answer.question.options.filter(is_correct=True).first()
            detail_data['answers'].append({
                'question': answer.question.question,
                'user_answer': answer.user_answer,
                'correct_answer': correct_option.option_text if correct_option else '',
                'is_correct': answer.is_correct,
                'points': answer.question.points
            })

        return JsonResponse({
            'success': True,
            'result': detail_data
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

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
