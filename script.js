const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3HlsZNTWfnWE1AJvsKnMor2QTU977r2x5G8J4DrJRakd2ZtcMYcVyUK4GapvohAxl/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const statusEl   = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Gather form data
        const payload = {
            email:   document.getElementById('email').value.trim(),
            name:    document.getElementById('name').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            inquiry: document.getElementById('inquiry').value.trim(),
        };

        // Disable button while sending
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        setStatus('', '');

        try {
            // Google Apps Script requires a no-cors fetch for cross-origin POST
            await fetch(SCRIPT_URL, {
                method:  'POST',
                mode:    'no-cors',          // GAS doesn't send CORS headers
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });

            // no-cors gives an opaque response — assume success if no error thrown
            setStatus('✓ Message sent! I\'ll be in touch soon.', 'success');
            form.reset();

        } catch (err) {
            console.error('Submission error:', err);
            setStatus('✕ Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    // ── Helper ──────────────────────────────────────────────
    function setStatus(msg, type) {
        statusEl.textContent  = msg;
        statusEl.className    = 'form-status ' + type;
    }
});