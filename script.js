const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCs_PYx7uUZR-D2-aCfXdGn1RndyJpnehbOW1VKt777ZZZesxxA-aosL-ioUvzeayUUw/exec';
const readMore = document.getElementById("ref-more");
const closeBtn = document.getElementById("close");
const readMoreCont = document.getElementById("more-cont");

readMore.addEventListener("click", ()=>{
    readMoreCont.style.display = "block";
})

closeBtn.addEventListener("click", ()=>{
    readMoreCont.style.display = "none";
})

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusEl = document.getElementById('formStatus');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const navLinks = document.querySelectorAll('.nav-link[data-slide]');
    const infoBtns = document.querySelectorAll('.info-btn[data-target]');
    const closeBtns = document.querySelectorAll('.overlay-close[data-close]');

    if (slides.length > 0) {
        const PROJECT_SLIDES = [0, 1, 2];
        let current   = 0;
        let autoTimer = null;

        function showSlide(index) {
            const target = index % PROJECT_SLIDES.length;
            slides.forEach((s, i) => s.classList.toggle('active', i === target));
            dots.forEach((d, i)   => d.classList.toggle('active', i === target));
            current = target;
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => {
                showSlide((current + 1) % PROJECT_SLIDES.length);
            }, 3500);
        }

        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        navLinks.forEach(link => {
            const slideIndex = parseInt(link.dataset.slide, 10);
            link.addEventListener('mouseenter', () => { stopAuto(); showSlide(slideIndex); });
            link.addEventListener('mouseleave', () => { startAuto(); });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAuto();
                showSlide(parseInt(dot.dataset.dot, 10));
                startAuto();
            });
        });

        startAuto();
    }

    document.querySelectorAll('.info-btn[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = document.getElementById(btn.dataset.target);
            if (overlay) overlay.classList.add('open');
        });
    });

    document.querySelectorAll('.overlay-close[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = document.getElementById(btn.dataset.close);
            if (overlay) overlay.classList.remove('open');
        });
    });

    document.querySelectorAll('.info-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.info-overlay.open').forEach(o => o.classList.remove('open'));
        }
    });

    infoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = document.getElementById(btn.dataset.target);
            if (overlay) overlay.classList.add('open');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = document.getElementById(btn.dataset.close);
            if (overlay) overlay.classList.remove('open');
        });
    });

    document.querySelectorAll('.info-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.info-overlay.open').forEach(o => o.classList.remove('open'));
        }
    });


    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const payload = {
            email:   document.getElementById('email').value.trim(),
            name:    document.getElementById('name').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            inquiry: document.getElementById('inquiry').value.trim(),
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        setStatus('', '');

        try {
            const formBody = new URLSearchParams(payload).toString();
            await fetch(SCRIPT_URL, {
                method:  'POST',
                mode:    'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body:    formBody,
            });
            setStatus("✓ Message sent! I'll be in touch soon.", 'success');
            form.reset();
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('✕ Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Submit';
        }
    });

    function setStatus(msg, type) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className   = 'form-status ' + type;
    }

});

