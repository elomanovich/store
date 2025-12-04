import showToast from './toast';

export default function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        const data = new FormData(form);
        const payload = {};
        data.forEach((value, key) => {
            payload[key] = value;
        });
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            form.reset();
            showToast('Запрос отправлен, мы свяжемся с вами', 'success');
        } catch (error) {
            console.warn('contact form error', error);
            showToast('Не удалось отправить запрос, попробуйте ещё раз', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });
}
