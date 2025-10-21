// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Calculator Data
const calculators = [
    {
        id: 'selang-calculator',
        title: 'Notasi Selang',
        description: 'Kalkulator operasi himpunan notasi selang dan diagram selang dengan penjelasan langkah demi langkah',
        icon: 'fas fa-project-diagram',
        link: 'kalkulator_himpunan-selang/index.html',
        color: '#FF6B35'
    },
    {
        id: 'pertidaksamaan-calculator',
        title: 'himpunan pertidaksamaan',
        description: 'penyelesaian dari beberapa pertidaksamaan',
        icon: 'fas fa-th',
        link: 'kalkulator_himpunan-persamaan/index.html',
        color: '#FF8E53'
    },
    {
        id: 'soon-calculator',
        title: 'Soon',
        description: ' ',
        icon: 'fas fa-clock',
        link: '#',
        color: '#FF8E53'
    },
    {
        id: 'soon-calculator',
        title: 'Soon',
        description: ' ',
        icon: 'fas fa-clock',
        link: '#',
        color: '#FF8E53'
    },
    {
        id: 'soon-calculator',
        title: 'Soon',
        description: ' ',
        icon: 'fas fa-clock',
        link: '#',
        color: '#FF8E53'
    },
];

// DOM Elements
let currentCarouselIndex = 0;
const carouselTrack = document.getElementById('carouselTrack');
const calculatorsGrid = document.getElementById('calculatorsGrid');

// Touch/Swipe variables
let startX = 0;
let currentX = 0;
let isDragging = false;
let dragThreshold = 50; // Minimum drag distance to trigger slide

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeCalculatorGrid();
    loadGitHubProfile();
    setupNavigation();
    setupScrollEffects();
    setupTouchSwipe();
});

// Initialize Carousel
function initializeCarousel() {
    carouselTrack.innerHTML = '';
    
    calculators.forEach((calculator, index) => {
        const calculatorItem = document.createElement('div');
        calculatorItem.className = `calculator-item ${index === 0 ? 'active' : ''}`;
        calculatorItem.innerHTML = `
            <div class="calculator-icon">
                <i class="${calculator.icon}"></i>
            </div>
            <h3>${calculator.title}</h3>
            <p>${calculator.description}</p>
            <a href="${calculator.link}" class="calculator-link">Buka Kalkulator</a>
        `;
        
        calculatorItem.addEventListener('click', () => {
            window.location.href = calculator.link;
        });
        
        carouselTrack.appendChild(calculatorItem);
    });
    
    updateCarousel();
}

// Setup Touch/Swipe functionality
function setupTouchSwipe() {
    const carouselContainer = document.querySelector('.carousel-container');
    
    // Mouse events for desktop
    carouselContainer.addEventListener('mousedown', handleDragStart);
    carouselContainer.addEventListener('mousemove', handleDragMove);
    carouselContainer.addEventListener('mouseup', handleDragEnd);
    carouselContainer.addEventListener('mouseleave', handleDragEnd);
    
    // Touch events for mobile
    carouselContainer.addEventListener('touchstart', handleDragStart);
    carouselContainer.addEventListener('touchmove', handleDragMove);
    carouselContainer.addEventListener('touchend', handleDragEnd);
    
    // Prevent image drag behavior
    carouselContainer.addEventListener('dragstart', (e) => e.preventDefault());
}

function handleDragStart(e) {
    if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
    } else {
        startX = e.clientX;
        e.preventDefault();
    }
    
    isDragging = true;
    carouselTrack.style.transition = 'none';
    carouselTrack.style.cursor = 'grabbing';
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
    } else {
        currentX = e.clientX;
    }
    
    const diff = currentX - startX;
    
    // Apply drag transformation
    const items = document.querySelectorAll('.calculator-item');
    const itemWidth = items[0].offsetWidth + 32;
    const trackWidth = carouselTrack.scrollWidth;
    const containerWidth = carouselTrack.parentElement.offsetWidth;
    const maxTransform = trackWidth - containerWidth;
    
    let baseTransform = -currentCarouselIndex * itemWidth;
    baseTransform += (containerWidth - itemWidth) / 2;
    baseTransform = Math.max(Math.min(0, baseTransform), -maxTransform);
    
    carouselTrack.style.transform = `translateX(${baseTransform + diff}px)`;
}

function handleDragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    carouselTrack.style.transition = 'transform 0.5s ease';
    carouselTrack.style.cursor = 'grab';
    
    const diff = currentX - startX;
    
    // Determine if swipe should trigger slide change
    if (Math.abs(diff) > dragThreshold) {
        if (diff > 0) {
            // Swipe right - go to previous
            moveCarousel(-1);
        } else {
            // Swipe left - go to next
            moveCarousel(1);
        }
    } else {
        // Not enough drag, return to current position
        updateCarousel();
    }
}

// Move Carousel
function moveCarousel(direction) {
    const items = document.querySelectorAll('.calculator-item');
    currentCarouselIndex += direction;
    
    if (currentCarouselIndex < 0) {
        currentCarouselIndex = items.length - 1;
    } else if (currentCarouselIndex >= items.length) {
        currentCarouselIndex = 0;
    }
    
    updateCarousel();
}

// Update Carousel Position
function updateCarousel() {
    const items = document.querySelectorAll('.calculator-item');
    const trackWidth = carouselTrack.scrollWidth;
    const containerWidth = carouselTrack.parentElement.offsetWidth;
    const itemWidth = items[0].offsetWidth + 32; // width + gap
    
    // Calculate transform
    const maxTransform = trackWidth - containerWidth;
    let transform = -currentCarouselIndex * itemWidth;
    
    // Center the active item
    transform += (containerWidth - itemWidth) / 2;
    transform = Math.max(Math.min(0, transform), -maxTransform);
    
    carouselTrack.style.transform = `translateX(${transform}px)`;
    
    // Update active states
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentCarouselIndex);
    });
}

// Initialize Calculator Grid
function initializeCalculatorGrid() {
    calculatorsGrid.innerHTML = '';
    
    calculators.forEach(calculator => {
        const calculatorCard = document.createElement('div');
        calculatorCard.className = 'calculator-card';
        calculatorCard.innerHTML = `
            <div class="calculator-icon">
                <i class="${calculator.icon}"></i>
            </div>
            <h3>${calculator.title}</h3>
            <p>${calculator.description}</p>
            <a href="${calculator.link}" class="calculator-link">Buka Kalkulator</a>
        `;
        
        calculatorCard.addEventListener('click', () => {
            window.location.href = calculator.link;
        });
        
        calculatorsGrid.appendChild(calculatorCard);
    });
}

// Load GitHub Profile
function loadGitHubProfile() {
    // Profile image already set in HTML
    const avatar = document.getElementById('github-avatar');
    
    // Simulate loading stats
    animateCounter('calculator-count', 0, 2, 1500);
    animateCounter('project-count', 0, 3, 1500);
    animateCounter('experience-count', 0, 6, 1500);
}

// Animate Counter
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(45, 48, 71, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(45, 48, 71, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Setup Scroll Effects
function setupScrollEffects() {
    // Parallax effect for background shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll to Calculators Section
function scrollToCalculators() {
    const calculatorsSection = document.getElementById('calculators');
    window.scrollTo({
        top: calculatorsSection.offsetTop - 80,
        behavior: 'smooth'
    });
}

// Auto-rotate carousel
let autoRotateInterval = setInterval(() => {
    moveCarousel(1);
}, 5000);

// Pause auto-rotate when user interacts with carousel
function pauseAutoRotate() {
    clearInterval(autoRotateInterval);
}

function resumeAutoRotate() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

// Add event listeners to pause/resume auto-rotate
document.querySelector('.carousel-container').addEventListener('mouseenter', pauseAutoRotate);
document.querySelector('.carousel-container').addEventListener('mouseleave', resumeAutoRotate);
document.querySelector('.carousel-container').addEventListener('touchstart', pauseAutoRotate);
document.querySelector('.carousel-container').addEventListener('touchend', resumeAutoRotate);

// Handle window resize
window.addEventListener('resize', updateCarousel);