/**
 * René De Anda - Personal Portfolio & Resume JavaScript
 * Interactive Single Page Application (SPA) Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollSpy();
    initProjectFilters();
    initLightboxModal();
    initContactForm();
    initAnimationsOnScroll();
});

/* ==========================================
   1. Mobile Navigation & Header Scroll State
   ========================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }
}

/* ==========================================
   2. ScrollSpy for Nav Links
   ========================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function checkActiveSection() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', checkActiveSection);
    checkActiveSection();
}

/* ==========================================
   3. Project Portfolio Filter
   ========================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================
   4. Project Lightbox Modal
   ========================================== */
const projectMediaMap = {
    'sniffalant': [
        'images/sniffalant1.png',
        'images/sniffalant2.png'
    ],
    'klotski': [
        'images/Klotski 2.png',
        'images/Klotski real.png'
    ],
    'roundrobin': [
        'images/RoundRobinBuddy.png',
        'images/Simulador de RoundRobin&BuddySystem.png'
    ],
    'puerta': [
        'images/Puerta_Automática.png'
    ],
    'pacman': [
        'images/minepac.png',
        'images/pac_craft2.png',
        'images/pac_craft3.png'
    ]
};

function initLightboxModal() {
    const modalBackdrop = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalThumbs = document.getElementById('modalThumbs');
    const closeBtn = document.querySelector('.modal-close');

    if (!modalBackdrop) return;

    // Delegate click events on preview buttons
    document.addEventListener('click', (e) => {
        const previewBtn = e.target.closest('.btn-preview');
        if (!previewBtn) return;

        const projectId = previewBtn.getAttribute('data-project-id');
        const title = previewBtn.getAttribute('data-project-title');
        const images = projectMediaMap[projectId] || [previewBtn.getAttribute('data-img-src')];

        modalTitle.textContent = title || 'Project Gallery';
        modalImg.src = images[0];

        // Populate thumbnails
        modalThumbs.innerHTML = '';
        if (images.length > 1) {
            images.forEach((imgSrc, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx + 1}">`;
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    modalImg.src = imgSrc;
                });
                modalThumbs.appendChild(thumb);
            });
            modalThumbs.style.display = 'flex';
        } else {
            modalThumbs.style.display = 'none';
        }

        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Close modal triggers
    const closeModal = () => {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
            closeModal();
        }
    });
}

/* ==========================================
   5. Interactive Contact Form & Toast
   ========================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');

        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            showToast('Please fill in all fields', 'warning');
            return;
        }

        // Simulating submission feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            showToast('Thank you! Your message has been received.', 'success');
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
        }, 1200);
    });
}

function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`, 'info');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showToast(message, type = 'info') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle text-success';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle text-warning';

    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* ==========================================
   6. Scroll Reveal Animations
   ========================================== */
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animElements = document.querySelectorAll('.timeline-item, .glass-card, .project-card, .skill-category-card, .cert-card');
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    document.addEventListener('scroll', () => {
        animElements.forEach(el => {
            if (el.classList.contains('animate-in')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
}
