// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .magnetic-btn, .nav-logo');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
    gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => follower.classList.add('hover-active'));
    link.addEventListener('mouseleave', () => follower.classList.remove('hover-active'));
});

// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});

gsap.ticker.lagSmoothing(0, 0);

// Preloader Animation
const preloaderTL = gsap.timeline();

preloaderTL.to(".preloader-text", {
    y: "0%",
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
    delay: 0.2
})
.to(".preloader-text", {
    y: "-100%",
    duration: 0.8,
    stagger: 0.05,
    ease: "power4.in",
    delay: 0.5
})
.to(".preloader", {
    y: "-100%",
    duration: 1,
    ease: "power4.inOut"
}, "-=0.4")
.from(".hero-title", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
}, "-=0.5");


// Agitation Section Reveal
gsap.utils.toArray('.rev-text').forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Editorial Grid Parallax
gsap.to(".parallax-img", {
    scrollTrigger: {
        trigger: ".solution-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: -100,
    scale: 1.1,
    ease: "none"
});



// Marquee Animation
gsap.to(".marquee", {
    xPercent: -50,
    ease: "none",
    duration: 10,
    repeat: -1
});

// Magnetic Button Effect
const magneticBtn = document.querySelector('.magnetic-btn');

magneticBtn.addEventListener('mousemove', function(e) {
    const position = magneticBtn.getBoundingClientRect();
    const x = e.pageX - position.left - position.width / 2;
    const y = e.pageY - position.top - position.height / 2;

    gsap.to(magneticBtn, {
        x: x * 0.3,
        y: y * 0.5,
        duration: 0.5,
        ease: 'power3.out'
    });
    
    gsap.to('.btn-text', {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.5,
        ease: 'power3.out'
    });
});

magneticBtn.addEventListener('mouseleave', function() {
    gsap.to(magneticBtn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
    });
    gsap.to('.btn-text', {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
    });
});

// --- Particle Morph Animation ---
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let particles = [];
    let targetParticles = [];
    
    // List of images to loop through
    const imagePaths = [
        'black-shirt.png',
        'white-hoodie.png',
        'sweatshirt.png',
        'white-t-shirt.png'
    ];
    let images = [];
    let currentImageIndex = 0;
    let isAnimating = false;
    let isCorsError = false;

    // IMPORTANT: Increase spacing to reduce particle count. 
    // Spacing of 5 generates 25,000+ particles which crashes the browser GSAP!
    // Spacing of 12 generates ~2,000 particles which is smooth.
    const particleSpacing = 12; 

    function resizeCanvas() {
        const container = document.querySelector('.hero-image-container');
        if(container && container.clientWidth > 0) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        } else {
            canvas.width = window.innerWidth * 0.45;
            canvas.height = window.innerHeight * 0.75;
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Load images
    Promise.all(imagePaths.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
        });
    })).then(loadedImages => {
        images = loadedImages.filter(img => img !== null);
        if(images.length > 0) {
            initParticles(images[0]);
            
            if(!isCorsError) {
                animateParticles();
                setInterval(morphToNextImage, 4000);
            }
        }
    });

    function getImageData(img) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fit image within canvas maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        
        tempCtx.drawImage(img, x, y, w, h);
        return tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function initParticles(img) {
        try {
            const imageData = getImageData(img);
            const data = imageData.data;
            particles = [];
            
            for (let y = 0; y < canvas.height; y += particleSpacing) {
                for (let x = 0; x < canvas.width; x += particleSpacing) {
                    const i = (y * canvas.width + x) * 4;
                    if (data[i + 3] > 128) { // Only take non-transparent pixels
                        particles.push({
                            x: x,
                            y: y,
                            color: `rgb(${data[i]}, ${data[i+1]}, ${data[i+2]})`
                        });
                    }
                }
            }
        } catch(e) {
            console.error("CORS Error: Cannot read local image data for particles. Running fallback.", e);
            isCorsError = true;
            // Fallback for file:// protocol
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.style.width = '100%';
            imgEl.style.height = '100%';
            imgEl.style.objectFit = 'contain';
            imgEl.style.position = 'absolute';
            imgEl.style.top = '0';
            imgEl.style.left = '0';
            imgEl.id = 'fallback-img';
            canvas.parentNode.appendChild(imgEl);
            canvas.style.display = 'none';
            
            setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                gsap.to(imgEl, {
                    opacity: 0.5,
                    duration: 0.5,
                    onComplete: () => {
                        imgEl.src = images[currentImageIndex].src;
                        gsap.to(imgEl, { opacity: 1, duration: 0.5 });
                    }
                });
            }, 4000);
        }
    }

    function morphToNextImage() {
        if(isAnimating || isCorsError) return;
        isAnimating = true;
        
        currentImageIndex = (currentImageIndex + 1) % images.length;
        const nextImg = images[currentImageIndex];
        
        try {
            const imageData = getImageData(nextImg);
            const data = imageData.data;
            
            targetParticles = [];
            for (let y = 0; y < canvas.height; y += particleSpacing) {
                for (let x = 0; x < canvas.width; x += particleSpacing) {
                    const i = (y * canvas.width + x) * 4;
                    if (data[i + 3] > 128) {
                        targetParticles.push({
                            x: x,
                            y: y,
                            color: `rgb(${data[i]}, ${data[i+1]}, ${data[i+2]})`
                        });
                    }
                }
            }
            
            // Randomize target array to make the morph look chaotic and cool
            targetParticles.sort(() => Math.random() - 0.5);
            
            const maxParticles = Math.max(particles.length, targetParticles.length);
            
            for(let i = 0; i < maxParticles; i++) {
                if(!particles[i]) {
                    // Spawn new particles from random existing particle positions
                    const randomExisting = particles[Math.floor(Math.random() * particles.length)] || {x: canvas.width/2, y: canvas.height/2};
                    particles.push({
                        x: randomExisting.x,
                        y: randomExisting.y,
                        color: targetParticles[i].color
                    });
                }
                
                const p = particles[i];
                const t = targetParticles[i % targetParticles.length];
                
                gsap.to(p, {
                    x: t.x,
                    y: t.y,
                    duration: 1.5 + Math.random() * 0.5, // slightly varied duration
                    ease: "power3.inOut",
                    onStart: () => {
                        p.color = t.color; 
                    }
                });
            }
            
            // Clean up excess particles
            if(particles.length > targetParticles.length) {
                particles.splice(targetParticles.length);
            }
            
            setTimeout(() => {
                isAnimating = false;
            }, 2200);
            
        } catch(e) {
            console.error(e);
            isAnimating = false;
        }
    }

    function animateParticles() {
        if(isCorsError) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const size = particleSpacing * 0.8; // slightly smaller than spacing for gaps
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, size, size);
        }
        
        requestAnimationFrame(animateParticles);
    }
}
