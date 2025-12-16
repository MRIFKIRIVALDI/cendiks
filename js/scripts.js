// ...existing code...
/*
  Enhanced exam & quiz script
  - Debounced search
  - Quiz manager (render, navigation, keyboard)
  - Timer with pause/resume
  - Autosave to localStorage
  - Animated progress updates
  - Submit via fetch (CSRF helper)
*/

(() => {
  // ---------- Utilities ----------
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function animateWidth(el, toPercent, duration = 600) {
    el.style.transition = `width ${duration}ms cubic-bezier(.2,.9,.3,1)`;
    requestAnimationFrame(() => (el.style.width = `${toPercent}%`));
  }

  // CSRF helper for Django
  function getCSRF() {
    const cookie = document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : (qs('[name=csrfmiddlewaretoken]')?.value || '');
  }

  // Toast (simple)
  function toast(msg, type = 'info', ttl = 2500) {
    const id = `toast-${Date.now()}`;
    const el = document.createElement('div');
    el.id = id;
    el.className = `toast toast-${type}`;
    el.innerText = msg;
    Object.assign(el.style, {
      position: 'fixed',
      right: '1rem',
      bottom: '1.25rem',
      padding: '0.6rem 0.85rem',
      background: type === 'info' ? '#2563eb' : type === 'success' ? '#16a34a' : '#dc2626',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 6px 22px rgba(16,24,40,0.12)',
      zIndex: 9999,
    });
    document.body.appendChild(el);
    setTimeout(() => el.style.opacity = '0', ttl - 300);
    setTimeout(() => el.remove(), ttl);
  }

  // ---------- Search (debounced) ----------
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = qs('#searchInput');
    const sessionsGrid = qs('#sessionsGrid');

    if (searchInput && sessionsGrid) {
      const doSearch = () => {
        const q = searchInput.value.trim().toLowerCase();
        qsa('.session-card', sessionsGrid).forEach(card => {
          const title = (card.querySelector('h4')?.textContent || '').toLowerCase();
          card.style.display = title.includes(q) ? '' : 'none';
        });
      };
      searchInput.addEventListener('input', debounce(doSearch, 200));
    }
  });

  // ---------- Timer ----------
  class Timer {
    constructor(seconds = 0, onTick = () => {}, onEnd = () => {}) {
      this.seconds = seconds;
      this.onTick = onTick;
      this.onEnd = onEnd;
      this._t = null;
      this.running = false;
    }
    start() {
      if (this.running) return;
      this.running = true;
      this._t = setInterval(() => {
        this.seconds--;
        this.onTick(this.seconds);
        if (this.seconds <= 0) { this.stop(); this.onEnd(); }
      }, 1000);
    }
    pause() { if (!this.running) return; this.running = false; clearInterval(this._t); }
    stop() { this.running = false; clearInterval(this._t); this._t = null; }
    toString() { const m = Math.floor(Math.max(0, this.seconds) / 60).toString().padStart(2,'0'); const s = (this.seconds % 60).toString().padStart(2,'0'); return `${m}:${s}`; }
  }

  // ---------- Quiz Manager ----------
  class Quiz {
    constructor({ container, questions = [], duration = 600, examId = null }) {
      this.container = container;
      this.questions = questions;
      this.duration = duration;
      this.examId = examId;
      this.stateKey = `cendiks_exam_${examId || 'anon'}`;
      this.current = 0;
      this.answers = new Array(questions.length).fill(null);
      this.timer = new Timer(duration, this.onTick.bind(this), this.onEnd.bind(this));
      this._restore();
      this._bindKeyboard();
      this._render();
    }

    _restore() {
      try {
        const raw = localStorage.getItem(this.stateKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.answers) this.answers = parsed.answers;
        if (parsed?.current) this.current = parsed.current;
        if (parsed?.timeLeft) this.timer.seconds = parsed.timeLeft;
      } catch (e) {
        console.warn('restore failed', e);
      }
    }

    _save() {
      const payload = { answers: this.answers, current: this.current, timeLeft: this.timer.seconds };
      localStorage.setItem(this.stateKey, JSON.stringify(payload));
    }

    start() {
      this.timer.start();
      this._save();
    }

    pause() {
      this.timer.pause();
      this._save();
    }

    onTick(seconds) {
      qs('#runnerTimer').innerText = this.timer.toString();
      const pct = Math.round(((this.questions.length - (seconds / (this.duration / this.questions.length))) / this.questions.length) * 100);
      const bar = qs('.progress > i');
      if (bar) animateWidth(bar, Math.min(100, Math.max(0, (this.answeredCount() / this.questions.length) * 100)));
      this._save();
    }

    onEnd() {
      toast('Waktu habis — jawaban akan dikirim otomatis', 'info', 3500);
      this.submit();
    }

    answeredCount() { return this.answers.filter(a => a !== null).length; }

    _render() {
      qs('#runnerTitle').innerText = qs(`[data-exam-id="${this.examId}"] h3`)?.innerText || 'Ujian';
      this._renderQuestion();
      qs('#runnerTimer').innerText = this.timer.toString();
      qs('#progressText').innerText = `${this.current + 1} / ${this.questions.length}`;
      const bar = qs('.progress > i');
      if (bar) animateWidth(bar, (this.answeredCount() / this.questions.length) * 100);
    }

    _renderQuestion() {
      const q = this.questions[this.current];
      if (!q) return;
      qs('#qText').innerText = q.text || `Soal ${this.current + 1}`;
      const opts = qs('#qOptions');
      opts.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const div = document.createElement('button');
        div.type = 'button';
        div.className = 'option';
        div.setAttribute('data-index', idx);
        div.setAttribute('aria-pressed', String(this.answers[this.current] === idx));
        if (this.answers[this.current] === idx) div.classList.add('selected');
        div.innerHTML = `<span style="font-weight:600;margin-right:.6rem;">${String.fromCharCode(65+idx)}</span> <span>${opt}</span>`;
        div.addEventListener('click', () => {
          this.answers[this.current] = idx;
          qsa('.option', opts).forEach(el => el.classList.remove('selected'));
          div.classList.add('selected');
          this._renderProgress();
          this._save();
        });
        opts.appendChild(div);
      });
      qs('#runnerInfo').innerText = `Soal ${this.current + 1} dari ${this.questions.length}`;
    }

    _renderProgress() {
      qs('#progressText').innerText = `${this.current + 1} / ${this.questions.length}`;
      const bar = qs('.progress > i');
      if (bar) animateWidth(bar, (this.answeredCount() / this.questions.length) * 100);
    }

    next() {
      if (this.current < this.questions.length - 1) {
        this.current++;
        this._renderQuestion();
        this._renderProgress();
      } else {
        if (confirm('Kirim jawaban sekarang?')) this.submit();
      }
      this._save();
    }

    prev() {
      if (this.current > 0) { this.current--; this._renderQuestion(); this._renderProgress(); this._save(); }
    }

    async submit() {
      // Prepare payload
      const payload = {
        exam_id: this.examId,
        answers: this.answers,
        time_used: (this.duration - this.timer.seconds),
      };

      // Try to send to backend
      try {
        const res = await fetch('/api/exams/submit/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRF() },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        toast('Jawaban berhasil dikirim', 'success', 2500);
        // optional: show result modal if backend returns score
        localStorage.removeItem(this.stateKey);
        this.timer.stop();
        // redirect or close runner
        setTimeout(() => location.href = `/exams/result/${data.result_id || ''}`, 800);
      } catch (err) {
        console.error(err);
        toast('Gagal mengirim jawaban — disimpan lokal', 'error', 3000);
        this._save();
      }
    }

    _bindKeyboard() {
      document.addEventListener('keydown', e => {
        if (qs('.exam-runner.active') === null) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
        if (/^[1-9]$/.test(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const opts = qs('#qOptions');
          const btn = opts?.querySelector(`[data-index="${idx}"]`);
          if (btn) btn.click();
        }
      });
    }
  }

  // ---------- Runner controls (open/close) ----------
  let currentQuiz = null;

  window.openRunner = function(cardOrEl) {
    const card = cardOrEl instanceof Element ? cardOrEl : document.querySelector(cardOrEl);
    if (!card) return;
    const examId = card.dataset.examId;
    const duration = parseInt(card.dataset.duration || 20, 10) * 60;
    // For demo: build questions from dataset or fallback to dummy
    const rawQuestions = card.dataset.questions ? JSON.parse(card.dataset.questions) : null;
    const questions = rawQuestions || new Array(parseInt(card.dataset.total || 10, 10)).fill(0).map((_,i) => ({
      id: i+1,
      text: `Soal #${i+1}: Pilih jawaban yang paling tepat.`,
      options: ['Pilihan A','Pilihan B','Pilihan C','Pilihan D']
    }));

    currentQuiz = new Quiz({ container: qs('#runnerContent'), questions, duration, examId });
    qs('#examRunner').classList.add('active');
    currentQuiz.start();
    // focus first option for accessibility
    setTimeout(() => qs('#qOptions button')?.focus(), 250);
  };

  window.closeRunner = function() {
    if (currentQuiz) { currentQuiz.pause(); }
    qs('#examRunner').classList.remove('active');
  };

  window.nextQuestion = function() { currentQuiz?.next(); };
  window.prevQuestion = function() { currentQuiz?.prev(); };

  // Attach inline start buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-start-exam]');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.exam-card');
      openRunner(card);
    }
  });

  // Accessibility: close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qs('#examRunner.active')) closeRunner();
  });

  // If page has old checkQuiz functions, keep compatibility by exposing simple wrapper
  window.checkQuiz = function() {
    // gather radio groups like older implementation and compute score
    const groups = {};
    qsa('[name^="q"]').forEach(r => {
      groups[r.name] = groups[r.name] || [];
      groups[r.name].push(r);
    });
    let total = 0, correct = 0;
    Object.entries(groups).forEach(([name, radios]) => {
      total++;
      const picked = radios.find(r => r.checked);
      if (picked && picked.dataset.correct === 'true') correct++;
    });
    const pct = total ? Math.round((correct/total)*100) : 0;
    const container = qs('#quiz-result');
    if (container) container.innerHTML = `<div class="result ${pct>=70? 'pass' : 'fail'}">Skor: ${correct}/${total} (${pct}%)</div>`;
  };

  // small styles for toast and result (inject minimal CSS to avoid separate file)
  const style = document.createElement('style');
  style.innerHTML = `
    .toast { opacity:1; transition: opacity .3s ease; }
    .result.pass { color:#16a34a; font-weight:700; }
    .result.fail { color:#dc2626; font-weight:700; }
    .option { display:flex; align-items:center; gap:.6rem; width:100%; text-align:left; border:none; background:transparent; }
    .option.selected { outline:2px solid rgba(37,99,235,.15); }
  `;
  document.head.appendChild(style);

})(); 
// ...existing code...
