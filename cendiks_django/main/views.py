from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Exam, Question, UserExam
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Fungsi untuk menampilkan ujian
def exam_detail(request, exam_id):
    exam = get_object_or_404(Exam, pk=exam_id)  # Ambil ujian berdasarkan ID
    questions = exam.questions.all()  # Ambil semua soal terkait ujian

    if request.method == "POST":
        score = 0
        # Periksa jawaban pengguna
        for question in questions:
            user_answer = request.POST.get(f'question_{question.id}')
            if user_answer == question.correct_answer:
                score += 1
        # Simpan hasil ujian
        UserExam.objects.create(user=request.user, exam=exam, score=score)
        return render(request, 'exam_results.html', {'score': score, 'exam': exam, 'questions': questions})
    
    return render(request, 'exam_detail.html', {'exam': exam, 'questions': questions})

# Fungsi untuk mengunduh sertifikat
def generate_certificate(request, user_exam_id):
    user_exam = get_object_or_404(UserExam, pk=user_exam_id)
    
    # Membuat response untuk file PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="sertifikat_{user_exam.user.username}.pdf"'
    
    # Membuat file PDF
    p = canvas.Canvas(response)
    p.drawString(100, 750, f"Ujian Sertifikasi: {user_exam.exam.title}")
    p.drawString(100, 730, f"Nama: {user_exam.user.username}")
    p.drawString(100, 710, f"Skor: {user_exam.score}")
    p.showPage()
    p.save()
    
    return response
