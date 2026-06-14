document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SET CURRENT YEAR IN FOOTER ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. LIGHT / DARK THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const bodyElement = document.body;

    // Check localStorage or fallback
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        bodyElement.classList.remove('dark-theme');
        bodyElement.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        bodyElement.classList.remove('light-theme');
        bodyElement.classList.add('dark-theme');
    } else {
        // Default to light-theme (light orange)
        bodyElement.classList.remove('dark-theme');
        bodyElement.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            bodyElement.classList.remove('dark-theme');
            bodyElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            bodyElement.classList.remove('light-theme');
            bodyElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- 3. MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // --- 4. SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it has revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // use viewport
        threshold: 0.15, // element is 15% visible
        rootMargin: '0px 0px -50px 0px' // offset to reveal slightly before coming fully into view
    });

    revealElements.forEach((element, index) => {
        // Apply tiny staggered delays to consecutive items for premium visual pacing
        const siblingReveal = element.parentElement.querySelectorAll(':scope > .reveal');
        if (siblingReveal.length > 1 && Array.from(siblingReveal).indexOf(element) > 0) {
            const pos = Array.from(siblingReveal).indexOf(element);
            if (pos === 1) element.classList.add('reveal-delay-1');
            if (pos === 2) element.classList.add('reveal-delay-2');
            if (pos >= 3) element.classList.add('reveal-delay-3');
        }
        revealObserver.observe(element);
    });

    // --- 5. ACTIVE NAVIGATION INDICATOR (SCROLL SPY) ---
    const sections = document.querySelectorAll('section');

    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    // --- 6. PROJECTS GRID FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Animate filter change
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 250);
            });
        });
    });

    // --- 7. CONTACT FORM SUBMISSION HANDLER ---
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                showAlert('Please fill in all fields before sending.', 'error');
                return;
            }

            // Disable submit button and show sending state
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Sending...';

            // Simulate form submission (e.g. EmailJS, backend API, or Formspree)
            setTimeout(() => {
                // Success path simulation
                showAlert(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Send Message';
                
                // Hide alert after 5 seconds
                setTimeout(() => {
                    formAlert.style.display = 'none';
                    formAlert.className = 'form-alert';
                }, 5000);
            }, 1200);
        });
    }

    function showAlert(msg, type) {
        formAlert.textContent = msg;
        formAlert.className = 'form-alert'; // reset class
        formAlert.classList.add(type);
        formAlert.style.display = 'block';
    }
});
