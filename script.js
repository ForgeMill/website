/**
 * ForgeMill v1.0 - Industrial Blacksmith Website Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initForgeBackground();
    initNavbar();
    initLogoAnimation();
    initScrollAnimations();
    initWaitlistForm();
});

/**
 * Cinematic Background: Floating Embers
 */
function initForgeBackground() {
    const canvas = document.getElementById('forge-bg');
    const ctx = canvas.getContext('2d');
    
    let width, height, particles;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Ember());
        }
    }

    class Ember {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.life = Math.random() * 100 + 100;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life--;
            if (this.life <= 0 || this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 122, 0, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff7a00';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/**
 * Navbar blur effect on scroll
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Logo Animation Loop: Hammer Strike
 */
function initLogoAnimation() {
    const container = document.getElementById('forge-logo-container');
    const logo = document.getElementById('forge-logo');
    const emblem = document.getElementById('emblem');
    
    function strike() {
        logo.classList.add('strike');
        
        // Shake emblem on "impact" (roughly 400ms into animation)
        setTimeout(() => {
            emblem.classList.add('shake');
            createSparks(container);
            
            // Subtle screen vibration
            document.body.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
            setTimeout(() => { document.body.style.transform = 'none'; }, 100);
            
        }, 400);

        // Reset
        setTimeout(() => {
            logo.classList.remove('strike');
            emblem.classList.remove('shake');
        }, 1000);
    }

    // Start strike loop
    setInterval(strike, 5000);
}

/**
 * Particle Spark Generator
 */
function createSparks(parent) {
    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        spark.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            width: 2px;
            height: 2px;
            background: #ffb347;
            box-shadow: 0 0 5px #ff7a00;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
        `;
        
        parent.appendChild(spark);
        
        const start = performance.now();
        function updateSpark(time) {
            const elapsed = (time - start) / 1000;
            if (elapsed > 0.6) {
                spark.remove();
                return;
            }
            spark.style.transform = `translate(${vx * elapsed}px, ${vy * elapsed + 50 * elapsed * elapsed}px)`;
            spark.style.opacity = 1 - elapsed / 0.6;
            requestAnimationFrame(updateSpark);
        }
        requestAnimationFrame(updateSpark);
    }
}

/**
 * Intersection Observer for scroll triggers
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Pipeline specific logic
                if (entry.target.classList.contains('pipeline-stage')) {
                    entry.target.classList.add('active');
                    const connector = entry.target.nextElementSibling;
                    if (connector && connector.classList.contains('pipeline-connector')) {
                        setTimeout(() => connector.classList.add('active'), 300);
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up, .pipeline-stage, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Waitlist Form Submission
 */
function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const success = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            timestamp: new Date().toISOString()
        };

        // Requirement: Log submissions to console
        console.log('%c FORGEMILL WAITLIST SUBMISSION ', 'background: #ff7a00; color: #090909; font-weight: bold;');
        console.table(data);

        // UI Feedback
        form.classList.add('hidden');
        success.classList.remove('hidden');
    });
}

/**
 * Button Ripple Effect
 */
document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            pointer-events: none;
            border-radius: 50%;
            width: 0;
            height: 0;
            animation: rippleEffect 0.6s linear;
        `;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple Animation injected via JS to keep CSS clean
const style = document.createElement('style');
style.innerHTML = `
@keyframes rippleEffect {
    to {
        width: 300px;
        height: 300px;
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
