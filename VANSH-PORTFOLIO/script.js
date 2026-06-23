document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loader Dismissal
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            triggerSkillProgressBars();
        }, 600);
    });

    // 2. Network Node Particle System Canvas Engine (Light Adapted)
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const numberOfParticles = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = "rgba(79, 70, 229, 0.08)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dist = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (dist < (canvas.width / 9) * (canvas.height / 9)) {
                    opacityValue = 1 - (dist / 12000);
                    ctx.strokeStyle = `rgba(79, 70, 229, ${opacityValue * 0.03})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    animateParticles();

    // 3. Typewriter Animation Engine
    const typewriterEl = document.querySelector(".typewriter");
    if (typewriterEl) {
        const words = JSON.parse(typewriterEl.getAttribute("data-words"));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function typeLoop() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 60;
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 120;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 2000; 
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }
            setTimeout(typeLoop, delay);
        }
        setTimeout(typeLoop, 1000);
    }

    // 4. Progress Bars Animation Trigger
    function triggerSkillProgressBars() {
        const bars = document.querySelectorAll(".progress-bar-fill");
        bars.forEach(bar => {
            const targetWidth = bar.getAttribute("data-width");
            bar.style.width = targetWidth;
        });
    }

    // 5. Scroll Metrics Watcher (Sticky Header Navigation & Top Utility Button)
    const navbar = document.querySelector(".navbar");
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        if (window.scrollY > 400) {
            scrollTopBtn.style.display = "flex";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 6. Intersection Observer Implementation for Numerical Counters Animation
    const statsSection = document.getElementById("achievements");
    const counters = document.querySelectorAll(".counter");
    let counted = false;

    const countOptions = { threshold: 0.3, rootMargin: "0px" };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                startCounting();
                counted = true;
            }
        });
    }, countOptions);

    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    function startCounting() {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const speed = target / 30; 
            
            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + speed) > target ? target : Math.ceil(current + speed);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target + (target > 100 ? "+" : "");
                }
            };
            updateCount();
        });
    }

    // 7. Contact Submission Handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Connecting Terminal...`;
            
            setTimeout(() => {
                submitBtn.className = "btn btn-success w-100 py-2 fw-semibold text-white";
                submitBtn.innerHTML = `<i class="fa-solid fa-check-double me-2"></i>Message Dispatched Successfully`;
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.className = "btn btn-primary w-100 py-2 fw-semibold";
                    submitBtn.innerHTML = originalText;
                }, 3500);
            }, 1500);
        });
    }
});