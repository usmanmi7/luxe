/* ==========================================================================
   LUXE — contact.js (contact form demo submission)
   ========================================================================== */

function luxeInitContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) status.textContent = 'Sending...';
    setTimeout(() => {
      if (status) status.textContent = 'Message sent — we\'ll reply within 1–2 business days.';
      form.reset();
    }, 600);
  });
}

document.addEventListener('DOMContentLoaded', luxeInitContactForm);
