/**
 * TCHID Connect - Expert JavaScript Effects
 * Effets visuels ultra-modernes et professionnels
 */

class TCHIDExpertEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupParticles();
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupTypingEffect();
        this.setupCursorEffects();
        this.setupSmoothScroll();
        this.setupLoadingAnimation();
    }

    // ===== NAVIGATION INTELLIGENTE =====
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Effet de fond au scroll
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Navigation qui se cache/affiche
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Menu mobile toggle
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
        `;

        const navbarNav = document.querySelector('.navbar-nav');
        navbar.querySelector('.container').appendChild(mobileToggle);

        mobileToggle.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.className = navbarNav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });

        // Responsive
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                mobileToggle.style.display = 'block';
            } else {
                mobileToggle.style.display = 'none';
                navbarNav.classList.remove('active');
            }
        };

        window.addEventListener('resize', checkMobile);
        checkMobile();
    }

    // ===== SYSTÈME DE PARTICULES AVANCÉ =====
    setupParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.appendChild(particlesContainer);

        // Créer les particules
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 20 + 10;
            const delay = Math.random() * 20;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: 100%;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                animation: particleFloat ${animationDuration}s linear infinite;
                animation-delay: ${delay}s;
            `;
            
            particlesContainer.appendChild(particle);
        }

        // Animation CSS pour les particules
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ANIMATIONS AU SCROLL =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animation spéciale pour les cartes
                    if (entry.target.classList.contains('card')) {
                        entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                        entry.target.classList.add('animate-card-in');
                    }
                }
            });
        }, observerOptions);

        // Observer tous les éléments animables
        document.querySelectorAll('.card, .section-title, .section-subtitle').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        // Style pour l'animation des cartes
        const cardStyle = document.createElement('style');
        cardStyle.textContent = `
            @keyframes cardSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .animate-card-in {
                animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
        `;
        document.head.appendChild(cardStyle);
    }

    // ===== COMPTEURS ANIMÉS =====
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString() + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString() + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ===== EFFET DE FRAPPE =====
    setupTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let index = 0;
        const typeSpeed = 100;
        
        const typeWriter = () => {
            if (index < originalText.length) {
                heroTitle.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Ajouter un curseur clignotant
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                heroTitle.appendChild(cursor);
                
                // Style pour le curseur
                const cursorStyle = document.createElement('style');
                cursorStyle.textContent = `
                    @keyframes blink {
                        0%, 50% { opacity: 1; }
                        51%, 100% { opacity: 0; }
                    }
                `;
                document.head.appendChild(cursorStyle);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // ===== EFFETS DE CURSEUR =====
    setupCursorEffects() {
        // Créer un curseur personnalisé
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        cursorFollower.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(cursorFollower);

        // Mouvement du curseur
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
            
            cursorFollower.style.left = e.clientX - 20 + 'px';
            cursorFollower.style.top = e.clientY - 20 + 'px';
            cursorFollower.style.opacity = '0.5';
        });

        // Effets sur les éléments interactifs
        document.querySelectorAll('a, button, .card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });

        // Masquer le curseur par défaut sur les éléments interactifs
        const hideDefaultCursor = document.createElement('style');
        hideDefaultCursor.textContent = `
            a, button, .card {
                cursor: none;
            }
        `;
        document.head.appendChild(hideDefaultCursor);
    }

    // ===== DÉFILEMENT FLUIDE =====
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ANIMATION DE CHARGEMENT =====
    setupLoadingAnimation() {
        // Créer un écran de chargement
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <i class="fas fa-microchip"></i>
                    <h2>TCHID Connect</h2>
                </div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
                <p>Chargement de l'excellence...</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f59e0b 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            text-align: center;
        `;
        
        document.body.appendChild(loader);

        // Style pour le loader
        const loaderStyle = document.createElement('style');
        loaderStyle.textContent = `
            .loader-content {
                animation: fadeInUp 1s ease-out;
            }
            .loader-logo i {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: pulse 2s ease-in-out infinite;
            }
            .loader-logo h2 {
                font-size: 2rem;
                margin-bottom: 2rem;
                font-weight: 700;
            }
            .loader-progress {
                width: 300px;
                height: 4px;
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            .loader-bar {
                height: 100%;
                background: linear-gradient(90deg, #ffffff, #f59e0b);
                width: 0%;
                animation: loadProgress 3s ease-out forwards;
            }
            @keyframes loadProgress {
                to { width: 100%; }
            }
        `;
        document.head.appendChild(loaderStyle);

        // Masquer le loader après le chargement
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 3000);
        });
    }

    // ===== EFFETS PARALLAX =====
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // ===== NOTIFICATIONS TOAST =====
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialiser les effets quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.tchidEffects = new TCHIDExpertEffects();
});

// Exposer des fonctions utiles globalement
window.showToast = (message, type) => {
    if (window.tchidEffects) {
        window.tchidEffects.showToast(message, type);
    }
};

// Effet de révélation au scroll pour tous les éléments
const revealElements = () => {
    const elements = document.querySelectorAll('.card, .section-title, .section-subtitle, .btn');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);

// Style pour les éléments révélés
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .card, .section-title, .section-subtitle, .btn {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);
