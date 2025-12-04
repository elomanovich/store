export default function responsiveNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('[data-nav-toggle]');
    const overlay = document.querySelector('[data-nav-overlay]');

    if (!nav || !toggle) {
        return;
    }

    const drawerLinks = nav.querySelectorAll('.nav-links a');

    const lockScroll = (shouldLock) => {
        document.body.classList.toggle('is-nav-locked', shouldLock);
    };

    const closeNav = ({ skipFocus = false } = {}) => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        lockScroll(false);
        if (!skipFocus) {
            toggle.focus();
        }
    };

    const openNav = () => {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        lockScroll(true);
    };

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
            closeNav({ skipFocus: true });
        } else {
            openNav();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', () => closeNav({ skipFocus: true }));
    }

    drawerLinks.forEach((link) => {
        link.addEventListener('click', () => closeNav({ skipFocus: true }));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeNav({ skipFocus: true });
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            closeNav();
        }
    });
}
