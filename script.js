// ===================================
// CONFIGURAZIONE E INIZIALIZZAZIONE
// ===================================

// Aspetta che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundAnimation();
    initTypingEffect();
    initSmoothScrolling();
    initScrollIndicator();
    initParallaxEffect();
    initButtonEffects();
});

// ===================================
// ANIMAZIONE SFONDO CON PARTICELLE
// ===================================

function initBackgroundAnimation() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    
    // Imposta dimensioni canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Array per le particelle
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50; // Meno particelle su mobile
    
    // Classe Particella
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Effetto pulsazione
            this.opacity += Math.sin(Date.now() * 0.001) * 0.01;
            this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
            
            // Rimbalzo sui bordi
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Mantieni nell'area visibile
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            
            // Effetto glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgba(0, 191, 255, ${this.opacity * 0.8})`;
        }
    }
    
    // Crea particelle
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connessioni tra particelle
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Onde di sfondo
    let waveOffset = 0;
    function drawWaves() {
        const waveAmplitude = 30;
        const waveFrequency = 0.01;
        
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height * 0.7 + 
                         Math.sin(x * waveFrequency + waveOffset + i * 2) * waveAmplitude;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `rgba(0, 191, 255, ${0.05 - i * 0.01})`);
            gradient.addColorStop(1, `rgba(0, 102, 255, ${0.1 - i * 0.02})`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        ctx.restore();
        waveOffset += 0.02;
    }
    
    // Effetto mouse (solo su desktop)
    let mouseX = 0;
    let mouseY = 0;
    let mouseInfluence = false;
    
    if (window.innerWidth > 768) {
        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseInfluence = true;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouseInfluence = false;
        });
    }
    
    function applyMouseEffect() {
        if (!mouseInfluence) return;
        
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                particle.x -= (dx / distance) * force * 2;
                particle.y -= (dy / distance) * force * 2;
            }
        });
    }
    
    // Loop di animazione
    function animate() {
        // Gradiente di sfondo dinamico
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0047ab');
        gradient.addColorStop(0.5, '#0066ff');
        gradient.addColorStop(1, '#00bfff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Disegna onde
        drawWaves();
        
        // Aggiorna e disegna particelle
        ctx.shadowBlur = 0;
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connessioni
        connectParticles();
        
        // Effetto mouse
        applyMouseEffect();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===================================
// EFFETTO TYPING
// ===================================

function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    
    const phrases = [
        'Aspirante Developer',
        'Web Developer',
        'Python Enthusiast',
        'Problem Solver',
        'Creative Coder'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Quando la frase è completa
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pausa
            isDeleting = true;
        } 
        // Quando la frase è stata cancellata
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pausa prima di iniziare nuova frase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Avvia dopo un breve delay
    setTimeout(type, 1000);
}

// ===================================
// SMOOTH SCROLLING
// ===================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// SCROLL INDICATOR
// ===================================

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ===================================
// EFFETTO PARALLASSE
// ===================================

function initParallaxEffect() {
    const heroContent = document.querySelector('.hero-content');
    
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallax}px)`;
                heroContent.style.opacity = 1 - (scrolled / 500);
            }
        });
    }
}

// ===================================
// EFFETTI PULSANTI
// ===================================

function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Effetto ripple al click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===================================
// ANIMAZIONI AL SCROLL
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
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
    
    // Osserva elementi con classe .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// GESTIONE RESPONSIVE
// ===================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Ottimizza animazioni su mobile
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Riduci complessità animazioni
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }, 250);
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Riduce animazioni se l'utente preferisce reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// ===================================
// EASTER EGG - KONAMI CODE
// ===================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const canvas = document.getElementById('backgroundCanvas');
    canvas.style.filter = 'hue-rotate(180deg)';
    
    // Crea effetto confetti
    createConfetti();
    
    setTimeout(() => {
        canvas.style.filter = '';
    }, 3000);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log(
    '%c👋 Ciao Developer! ',
    'background: #0066ff; color: white; font-size: 20px; padding: 10px; border-radius: 5px;'
);
console.log(
    '%cSe stai leggendo questo, sei una persona curiosa! 🔍',
    'color: #00bfff; font-size: 14px;'
);
console.log(
    '%cSito creato con ❤️ da Grant Akparibu',
    'color: #0047ab; font-size: 12px;'
);
