from django.core.management.base import BaseCommand
from main.models import CertificationExam, ExamQuestion, ExamOption

class Command(BaseCommand):
    help = 'Create initial exam data with challenging questions'

    def handle(self, *args, **options):
        # Hapus data lama jika ada
        ExamOption.objects.all().delete()
        ExamQuestion.objects.all().delete()
        CertificationExam.objects.all().delete()

        # Buat ujian sertifikasi
        exam = CertificationExam.objects.create(
            title="Python Basic Certification Exam",
            description="Ujian sertifikasi Python dasar untuk pemula",
            duration=15,  # 15 menit
            total_questions=10,
            passing_score=70  # 70%
        )

        # Soal-soal dasar Python (10 soal)
        questions_data = [
            {
                'question': 'Apa output dari kode berikut?\nprint(type(42.0))',
                'options': ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'number\'>'],
                'correct': 1,
                'points': 10
            },
            {
                'question': 'Manakah yang merupakan tipe data immutable di Python?',
                'options': ['list', 'dict', 'tuple', 'set'],
                'correct': 2,
                'points': 10
            },
            {
                'question': 'Apa hasil dari: len([1, 2, 3, 4, 5])',
                'options': ['4', '5', '6', 'Error'],
                'correct': 1,
                'points': 10
            },
            {
                'question': 'Keyword apa yang digunakan untuk membuat fungsi?',
                'options': ['function', 'def', 'func', 'define'],
                'correct': 1,
                'points': 10
            },
            {
                'question': 'Apa output dari: bool([])',
                'options': ['True', 'False', 'None', 'Error'],
                'correct': 1,
                'points': 10
            },
            {
                'question': 'Manakah cara benar untuk membuat dictionary kosong?',
                'options': ['dict = []', 'dict = ()', 'dict = {}', 'dict = None'],
                'correct': 2,
                'points': 10
            },
            {
                'question': 'Apa hasil dari: "Python"[2:5]',
                'options': ['Pyt', 'yth', 'tho', 'hon'],
                'correct': 2,
                'points': 10
            },
            {
                'question': 'Method apa yang digunakan untuk menambah elemen ke list?',
                'options': ['add()', 'insert()', 'append()', 'push()'],
                'correct': 2,
                'points': 10
            },
            {
                'question': 'Apa output dari: 10 % 3',
                'options': ['3', '1', '3.333', '0'],
                'correct': 1,
                'points': 10
            },
            {
                'question': 'Manakah yang bukan tipe data built-in Python?',
                'options': ['int', 'str', 'float', 'number'],
                'correct': 3,
                'points': 10
            }
        ]

        # Buat soal dan opsi
        for i, q_data in enumerate(questions_data, 1):
            question = ExamQuestion.objects.create(
                exam=exam,
                question=q_data['question'],
                question_type='multiple-choice',
                points=q_data['points']
            )

            for j, option_text in enumerate(q_data['options']):
                ExamOption.objects.create(
                    question=question,
                    option_text=option_text,
                    is_correct=(j == q_data['correct'])
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created exam "{exam.title}" with {len(questions_data)} questions')
        )
