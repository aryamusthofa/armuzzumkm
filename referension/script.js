// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Initialize AOS (Animate On Scroll)
if(typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
}

// Canvas Particle Network
const canvas = document.getElementById('hero-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const particles = [];
    const maxParticles = window.innerWidth > 768 ? 60 : 30;
    
    for(let i=0; i<maxParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
    
    function draw() {
        ctx.clearRect(0,0,width,height);
        
        ctx.fillStyle = 'rgba(144, 211, 140, 0.5)';
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Lines
        ctx.strokeStyle = 'rgba(144, 211, 140, 0.1)';
        for(let i=0; i<particles.length; i++) {
            for(let j=i+1; j<particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(draw);
    }
    draw();
}

// Typing Effect
const typedTextSpan = document.querySelector(".typing-text");
if(typedTextSpan) {
    const textArray = ["Sinergi", "Dedikasi", "Aksi Nyata", "Kemajuan Bersama"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    setTimeout(type, newTextDelay + 250);
}

// Generate Remaining Placeholders for Members
const membersGrid = document.getElementById('membersGrid');
if(membersGrid) {
    for(let i = 1; i <= 22; i++) {
        // Faster delay stagger for more items
        const delay = ((i % 4) + 1) * 50; 
        
        const placeholderHTML = `
            <div class="member-card-mini placeholder-card" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="mini-avatar gradient-bg">
                    <i class="fa-solid fa-user-secret" style="color:var(--bg-darker)"></i>
                </div>
                <div class="mini-info">
                    <h4>Anggota ${i + 3}</h4>
                    <span class="mini-div">TBD</span>
                </div>
                <div class="mini-hover-detail glass-card">
                    <h5>Anggota ${i + 3}</h5>
                    <p><i class="fa-regular fa-calendar"></i> -</p>
                    <p><i class="fa-solid fa-map-marker-alt"></i> -</p>
                    <p class="moto">"Menunggu data diisi."</p>
                </div>
            </div>
        `;
        membersGrid.insertAdjacentHTML('beforeend', placeholderHTML);
    }
}

// Navbar Scroll Effect, Scroll Progress Bar, and Hero Parallax
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
    // 1. Navbar effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2. Scroll progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if(scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
    }

    // 3. Hero Parallax Effect
    if(heroBg) {
        let scrollPosition = window.pageYOffset;
        heroBg.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px)';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if(hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Form Submission handling (Contact Message)
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Animate button
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
        btn.style.opacity = '0.8';
        
        // Simulate API call delay
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Pesan Terkirim!';
            btn.style.background = '#2ecc71';
            btn.style.color = '#fff';
            
            // Reset form fields
            this.reset();
            
            // Reset button state after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });
}

// Setup active navigation link on scroll dynamically
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Visi Misi Tab Logic
const vmTabs = document.querySelectorAll('.vm-tab');
const vmPanels = document.querySelectorAll('.vm-panel');

if(vmTabs.length > 0) {
    vmTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            vmTabs.forEach(t => t.classList.remove('active'));
            vmPanels.forEach(p => p.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Custom Cursor Logic
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

if(dot && outline && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.transform = `translate(${posX}px, ${posY}px)`;
        
        // Slight delay for outline
        outline.animate({
            transform: `translate(${posX}px, ${posY}px)`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects on links/buttons
    const hoverables = document.querySelectorAll('a, button, .member-card-mini, .gallery-item, .magnetic-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovering'));
    });
}

// Magnetic Button Effect
const magnets = document.querySelectorAll('.magnetic-btn');
magnets.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const position = btn.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    
    btn.addEventListener('mouseout', function() {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// Tilt Card Effect (Vanilla JS)
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});


