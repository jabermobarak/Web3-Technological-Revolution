// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Navigation background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
            }
        });
    }
});

// Animated counters
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Progress bar animation
function animateProgressBar() {
    const progressBar = document.getElementById('aiProgress');
    if (progressBar && isElementInViewport(progressBar)) {
        progressBar.style.width = '40%';
        progressBar.textContent = '40%';
    }
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Specific animations for different elements
            if (entry.target.classList.contains('stat-card')) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter && counter.id === 'userCount') {
                    animateCounter(counter, 66, 2500);
                }
            }
            
            if (entry.target.classList.contains('progress-container')) {
                animateProgressBar();
            }
        }
    });
}, observerOptions);

// Responsive hero name animations
function initHeroNameAnimations() {
    const authorHero = document.querySelector('.author-hero');
    const heroName = document.querySelector('.hero-name-text');
    
    if (authorHero && heroName) {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // Typing animation for the big name
            const originalName = heroName.textContent;
            heroName.textContent = '';
            let charIndex = 0;
            
            function typeHeroName() {
                if (charIndex < originalName.length) {
                    heroName.textContent += originalName.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeHeroName, 150);
                }
            }
            
            // Start typing after hero section is visible
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeHeroName, 800);
                        heroObserver.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.3,
                rootMargin: '50px' 
            });
            
            heroObserver.observe(authorHero);
        }
        
        // Interactive effects only on larger screens
        if (window.innerWidth >= 768) {
            authorHero.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
                
                heroName.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            authorHero.addEventListener('mouseleave', function() {
                heroName.style.transform = 'translate(0, 0)';
            });
        }
    }
}

// Video functionality
function initVideoPlayer() {
    const video = document.querySelector('.future-video');
    const playButton = document.getElementById('playButton');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (video && playButton && videoOverlay) {
        // Play button functionality
        playButton.addEventListener('click', function() {
            video.play();
            videoOverlay.style.display = 'none';
        });
        
        // Show overlay when video ends
        video.addEventListener('ended', function() {
            videoOverlay.style.display = 'flex';
        });
        
        // Pause overlay display when video is playing
        video.addEventListener('play', function() {
            videoOverlay.style.display = 'none';
        });
        
        // Video chapter navigation
        document.querySelectorAll('.chapter-item').forEach((chapter, index) => {
            chapter.addEventListener('click', function() {
                const time = this.querySelector('.chapter-time').textContent;
                const [minutes, seconds] = time.split(':').map(Number);
                const targetTime = minutes * 60 + seconds;
                
                video.currentTime = targetTime;
                video.play();
                videoOverlay.style.display = 'none';
            });
        });
        
        // Update video time display
        video.addEventListener('timeupdate', function() {
            const currentTime = Math.floor(video.currentTime);
            const minutes = Math.floor(currentTime / 60);
            const seconds = currentTime % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Highlight current chapter
            document.querySelectorAll('.chapter-item').forEach(chapter => {
                const chapterTime = chapter.querySelector('.chapter-time').textContent;
                if (chapterTime === timeString) {
                    chapter.style.background = 'rgba(37, 99, 235, 0.2)';
                    chapter.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                } else {
                    chapter.style.background = 'rgba(255, 255, 255, 0.03)';
                    chapter.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        });
    }
}

// Handle responsive behavior
function handleResponsiveBehavior() {
    const heroName = document.querySelector('.hero-name-text');
    
    if (heroName && window.innerWidth < 768) {
        // Reduce animation intensity on mobile
        heroName.style.animationDuration = '6s, 8s';
    }
    
    // Adjust video aspect ratio for mobile
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && window.innerWidth < 768) {
        videoContainer.style.paddingBottom = '75%'; // 4:3 for mobile
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.toc-item, .tech-item, .application-item, .security-feature, ' +
        '.stat-card, .progress-container, .integration-item, .feature-card, ' +
        '.case-study-card, .finding-card, .timeline-item, .chapter-item'
    );
    animateElements.forEach(el => observer.observe(el));
    
    // Add click events to navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Table of Contents items click
    document.querySelectorAll('.toc-item').forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('h3').textContent.toLowerCase();
            let targetId;
            if (text.includes('цифровой')) targetId = 'digital-shift';
            else if (text.includes('ии')) targetId = 'ai-engine';
            else if (text.includes('безопасность')) targetId = 'security';
            else targetId = 'introduction';
            
            scrollToSection(targetId);
        });
    });
    
    // Initial animations
    setTimeout(() => {
        const userCount = document.getElementById('userCount');
        if (userCount) {
            animateCounter(userCount, 66, 2500);
        }
    }, 1000);
    
    // Initialize custom functionality
    initHeroNameAnimations();
    initVideoPlayer();
    handleResponsiveBehavior();
});

// Update on resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveBehavior, 250);
});

// Re-initialize when coming back to page (for mobile browsers)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        handleResponsiveBehavior();
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .toc-item, .tech-item, .application-item, .security-feature, 
    .stat-card, .finding-card, .case-study-card, .integration-item,
    .feature-card, .timeline-item, .chapter-item {
        opacity: 0;
    }
    
    .toc-item.animate-in, .tech-item.animate-in, .application-item.animate-in, 
    .security-feature.animate-in, .stat-card.animate-in, .finding-card.animate-in,
    .case-study-card.animate-in, .integration-item.animate-in,
    .feature-card.animate-in, .timeline-item.animate-in, .chapter-item.animate-in {
        opacity: 1;
    }
    
    /* Loading animation for images */
    .image-placeholder {
        position: relative;
        overflow: hidden;
    }
    
    .image-placeholder::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    /* Video loading state */
    .future-video {
        background: #000;
    }
    
    .future-video::-webkit-media-controls {
        background: rgba(0, 0, 0, 0.5);
    }
`;
document.head.appendChild(style);