// ===== WEBSITE FUNCTIONALITY & ANIMATIONS =====

// DOM Elements
const DOM = {
    // Theme & UI
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    scrollTop: document.getElementById('scroll-top'),
    loadingScreen: document.getElementById('loading'),
    
    // Navigation
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navClose: document.getElementById('nav-close'),
    navLinks: document.querySelectorAll('.nav__link'),
    header: document.getElementById('header'),
    
    // Contact Form
    contactForm: document.getElementById('contactForm'),
    formStatus: document.getElementById('form-status'),
    
    // Skills Animation
    skillProgresses: document.querySelectorAll('.skill-progress'),
    
    // Projects Filter
    filterBtns: document.querySelectorAll('.filter-btn'),
    projectCards: document.querySelectorAll('.project-card'),
    
    // Chatbot
    chatbotToggle: document.getElementById('chatbotToggle'),
    chatbotContainer: document.getElementById('chatbotContainer'),
    chatbotClose: document.getElementById('chatbotClose')
};

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            DOM.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                DOM.loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    DOM.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    DOM.themeToggle.addEventListener('click', () => {
        const currentTheme = DOM.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        DOM.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add theme transition animation
        DOM.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            DOM.body.style.transition = '';
        }, 500);
    });
}

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Add rotation effect
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
    }, 300);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    // Toggle menu
    if (DOM.navToggle) {
        DOM.navToggle.addEventListener('click', () => {
            DOM.navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close menu
    if (DOM.navClose) {
        DOM.navClose.addEventListener('click', () => {
            DOM.navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking on links
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__menu') && 
            !e.target.closest('.nav__toggle') && 
            DOM.navMenu.classList.contains('show-menu')) {
            DOM.navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Header background on scroll
        if (currentScrollY > 100) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Header hide/show on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            DOM.header.style.transform = 'translateY(-100%)';
        } else {
            DOM.header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Scroll to top button
        toggleScrollTop(currentScrollY);
        
        // Active section highlighting
        updateActiveSection();
    });
}

// ===== SCROLL TO TOP =====
function initScrollTop() {
    DOM.scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function toggleScrollTop(scrollY) {
    if (scrollY > 300) {
        DOM.scrollTop.classList.add('show');
    } else {
        DOM.scrollTop.classList.remove('show');
    }
}

// ===== ACTIVE SECTION HIGHLIGHTING =====
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(.nav__link[href*="${sectionId}"]);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}

// ===== SKILLS ANIMATION =====
function initSkillsAnimation() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function animateSkills() {
    DOM.skillProgresses.forEach(progress => {
        const width = progress.getAttribute('data-width');
        progress.style.width = '0%';
        
        setTimeout(() => {
            progress.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            progress.style.width = width + '%';
        }, 200);
    });
}

// ===== PROJECTS FILTER =====
function initProjectsFilter() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    });
}

function filterProjects(filter) {
    DOM.projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    if (DOM.contactForm) {
        DOM.contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add input animations
        const formInputs = DOM.contactForm.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(DOM.contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const buttonIcon = submitButton.querySelector('.button-icon');
    
    buttonText.style.opacity = '0';
    buttonLoader.style.display = 'block';
    buttonIcon.style.display = 'none';
    submitButton.disabled = true;
    
    try {
        // Simulate form submission
        await simulateFormSubmission(data);
        
        showFormStatus(Thank you ${data.name}! Your message has been sent successfully. I'll get back to you soon!, 'success');
        DOM.contactForm.reset();
        
        // Reset form focus states
        const formGroups = DOM.contactForm.querySelectorAll('.form__group');
        formGroups.forEach(group => group.classList.remove('focused'));
        
    } catch (error) {
        showFormStatus('Sorry, there was an error sending your message. Please try again later.', 'error');
    } finally {
        // Reset button state
        setTimeout(() => {
            buttonText.style.opacity = '1';
            buttonLoader.style.display = 'none';
            buttonIcon.style.display = 'block';
            submitButton.disabled = false;
        }, 1000);
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve(true);
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormStatus(message, type) {
    DOM.formStatus.textContent = message;
    DOM.formStatus.className = 'form__status';
    
    if (type === 'success') {
        DOM.formStatus.style.background = 'rgba(34, 197, 94, 0.1)';
        DOM.formStatus.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        DOM.formStatus.style.color = '#22c55e';
    } else if (type === 'error') {
        DOM.formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        DOM.formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        DOM.formStatus.style.color = '#ef4444';
    }
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        DOM.formStatus.textContent = '';
        DOM.formStatus.className = 'form__status';
    }, 5000);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CURSOR EFFECTS =====
function initCursorEffects() {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    let scale = 1;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Dot cursor (fast)
        dotX += (mouseX - dotX) * 0.1;
        dotY += (mouseY - dotY) * 0.1;
        
        // Outline cursor (slow)
        outlineX += (mouseX - outlineX) * 0.05;
        outlineY += (mouseY - outlineY) * 0.05;
        
        // Update positions
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        // Scale effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact__card');
        let isHovering = false;
        
        hoverElements.forEach(el => {
            if (el.matches(':hover')) {
                isHovering = true;
            }
        });
        
        scale = isHovering ? 1.5 : 1;
        cursorOutline.style.transform = translate(-50%, -50%) scale(${scale});
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stagger animation for multiple elements
                if (entry.target.classList.contains('project-card')) {
                    const delay = Array.from(DOM.projectCards).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = delay + 'ms';
                }
                
                if (entry.target.classList.contains('detail-item')) {
                    const detailItems = entry.target.parentElement.querySelectorAll('.detail-item');
                    const delay = Array.from(detailItems).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.hero_data, .heroimage, .aboutimage, .about_data, ' +
        '.skills_category, .project-card, .contactinfo, .contact_form, ' +
        '.detail-item, .cloud-tag'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== CHATBOT TOGGLE =====
function initChatbot() {
    if (DOM.chatbotToggle && DOM.chatbotContainer && DOM.chatbotClose) {
        DOM.chatbotToggle.addEventListener('click', () => {
            DOM.chatbotContainer.classList.toggle('active');
        });

        DOM.chatbotClose.addEventListener('click', () => {
            DOM.chatbotContainer.classList.remove('active');
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chatbot-container') && 
                !e.target.closest('.chatbot-toggle') && 
                DOM.chatbotContainer.classList.contains('active')) {
                DOM.chatbotContainer.classList.remove('active');
            }
        });
    }
}

// ===== PARTICLE BACKGROUND =====
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1});
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.innerHTML;
    const texts = [
        "Crafting Digital Experiences That Inspire",
        "Building The Future With Code",
        "Transforming Ideas Into Reality"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function typeWriter() {
        if (isPaused) return;
        
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            heroTitle.innerHTML = originalText.replace('That Inspire', currentText.substring(0, charIndex--));
            if (charIndex < 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeWriter, 1000);
                return;
            }
        } else {
            heroTitle.innerHTML = originalText.replace('That Inspire', currentText.substring(0, charIndex++));
            if (charIndex > currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, 2000);
                return;
            }
        }
        
        setTimeout(typeWriter, isDeleting ? 50 : 100);
    }
    
    // Start typewriter after a delay
    setTimeout(typeWriter, 2000);
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.innerText.replace('+', '');
                    const increment = target / speed;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.innerText = Math.ceil(current) + (counter.innerText.includes('+') ? '+' : '');
                            setTimeout(updateCounter, 1);
                        } else {
                            counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
                        }
                    };
                    
                    updateCounter();
                });
                observer.disconnect();
            }
        });
    });
    
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ===== INITIALIZE EVERYTHING =====
function init() {
    console.log('🚀 Initializing Zain Portfolio...');
    
    // Initialize all components
    initLoadingScreen();
    initThemeToggle();
    initMobileMenu();
    initHeaderScroll();
    initScrollTop();
    initSkillsAnimation();
    initProjectsFilter();
    initContactForm();
    initSmoothScroll();
    initCursorEffects();
    initScrollAnimations();
    initChatbot();
    initParticleBackground();
    initTypewriter();
    initCounters();
    
    // Add some fun console messages
    console.log(`
    %c🎉 Portfolio Website Loaded Successfully! %c
    %c
    Developed by Zain-ul-Abideen
    Age: 16 | Matric: 1107/1200
    Location: Mian Channu, Pakistan
    Email: bloodprince798@gmail.com
    
    🌟 Features:
    - Dark/Light Mode
    - Smooth Animations  
    - AI Chatbot (Zyron)
    - Responsive Design
    - PWA Support
    - Voice Commands
    
    Enjoy exploring! 🚀
    `, 
    'color: #6366f1; font-size: 16px; font-weight: bold;',
    '',
    'color: #94a3b8; font-size: 12px; line-height: 1.5;'
    );
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Website Error:', e.error);
});

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init };
}
