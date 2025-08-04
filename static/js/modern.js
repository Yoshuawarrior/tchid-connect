/**
 * TCHID Connect - JavaScript Moderne
 * Animations et interactions avancées
 */

// Configuration globale
const TCHID = {
    config: {
        animationDuration: 300,
        scrollOffset: 100,
        particleCount: 50
    },
    
    // Initialisation
    init() {
        this.setupParticles();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupCounters();
        this.setupNotifications();
        this.setupSmoothScroll();
        this.setupLoadingStates();
        this.setupCardEffects();
    },
    
    // Système de particules pour le hero
    setupParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        heroSection.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Redimensionner le canvas
        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
        
        // Créer une particule
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '#f59e0b' : '#60a5fa';
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
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialiser les particules
        function initParticles() {
            for (let i = 0; i < this.config.particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation des particules
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        resizeCanvas();
        initParticles.call(this);
        animateParticles();
        
        window.addEventListener('resize', resizeCanvas);
    },
    
    // Animations au scroll
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);
        
        // Observer les éléments à animer
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .product-card, .formation-card, .card'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    },
    
    // Navigation intelligente
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)';
                navbar.style.backdropFilter = 'none';
            }
            
            // Masquer/afficher la navbar
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    },
    
    // Compteurs animés
    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const start = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
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
    },
    
    // Système de notifications
    setupNotifications() {
        this.createNotificationContainer();
    },
    
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    },
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            pointer-events: auto;
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },
    
    // Scroll fluide
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
    },
    
    // États de chargement
    setupLoadingStates() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) {
                    e.preventDefault();
                    return;
                }
            });
        });
    },
    
    // Effets sur les cartes
    setupCardEffects() {
        const cards = document.querySelectorAll('.service-card, .product-card, .formation-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    TCHID.init();
});

// Gestion du panier (si nécessaire)
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || {};
        this.updateCartDisplay();
    }
    
    addToCart(productId, quantity = 1) {
        this.cart[productId] = (this.cart[productId] || 0) + quantity;
        this.saveCart();
        this.updateCartDisplay();
        TCHID.showNotification('Produit ajouté au panier !', 'success');
    }
    
    removeFromCart(productId) {
        delete this.cart[productId];
        this.saveCart();
        this.updateCartDisplay();
        TCHID.showNotification('Produit retiré du panier', 'info');
    }
    
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.cart[productId] = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }
    
    getCartCount() {
        return Object.values(this.cart).reduce((total, quantity) => total + quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    updateCartDisplay() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const count = this.getCartCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartDisplay();
        TCHID.showNotification('Panier vidé', 'info');
    }
}

// Instance globale du gestionnaire de panier
window.cartManager = new CartManager();

// Fonctions utilitaires
const Utils = {
    // Formater les prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0
        }).format(price);
    },
    
    // Débounce pour les événements
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle pour les événements
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Validation d'email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validation de téléphone
    isValidPhone(phone) {
        const phoneRegex = /^(\+243|0)[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// Export pour utilisation globale
window.TCHID = TCHID;
window.Utils = Utils;
