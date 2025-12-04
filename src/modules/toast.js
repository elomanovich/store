let toastContainer = null;

function ensureContainer() {
    if (toastContainer) {
        return toastContainer;
    }
    toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

export default function showToast(message, type = 'default') {
    const container = ensureContainer();
    if (!container) {
        return;
    }
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });
    setTimeout(() => {
        toast.classList.remove('is-visible');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, { once: true });
    }, 2600);
}
