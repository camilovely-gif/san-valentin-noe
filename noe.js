// ==================== VARIABLES GLOBALES ====================
let currentIndex = 0;
const carouselItems = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const totalSlides = carouselItems.length;

// ==================== FUNCIONES DEL CARRUSEL ====================

// Mostrar slide específico
function showSlide(index) {
    // Validar índice
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    // Ocultar todos los slides
    carouselItems.forEach(item => {
        item.classList.remove('active');
    });

    // Desactivar todos los dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Mostrar slide actual
    carouselItems[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

// Mover carrusel (siguiente/anterior)
function moveCarousel(direction) {
    showSlide(currentIndex + direction);
}

// Ir a slide específico
function currentSlide(index) {
    showSlide(index);
}

// ==================== CARRUSEL AUTOMÁTICO ====================
let autoSlideInterval;

// Iniciar carrusel automático
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Cambia cada 5 segundos
}

// Detener carrusel automático
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// ==================== NAVEGACIÓN SUAVE ====================

// Agregar animación suave al hacer clic en anclas
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

// ==================== EFECTOS DE SCROLL ====================

// Observador para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos de la galería
document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observar tarjetas de mensajes
document.querySelectorAll('.message-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ==================== CONTROL DE EVENTOS DEL CARRUSEL ====================

// Pausar carrusel automático cuando el usuario interactúa
const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
        stopAutoSlide();
        setTimeout(startAutoSlide, 3000);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
        stopAutoSlide();
        setTimeout(startAutoSlide, 3000);
    }
});

// ==================== TOUCH/SWIPE PARA MÓVILES ====================
let touchStartX = 0;
let touchEndX = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoSlide, 3000);
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe izquierda - siguiente
        moveCarousel(1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe derecha - anterior
        moveCarousel(-1);
    }
}

// ==================== EFECTO PARALLAX EN HERO ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar primer slide
    showSlide(0);
    
    // Iniciar carrusel automático
    startAutoSlide();
    
    // Mensaje de bienvenida en consola
    console.log('💕 Página de San Valentín cargada correctamente 💕');
});

// ==================== LAZY LOADING DE IMÁGENES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observar todas las imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== CONTADOR DE CORAZONES FLOTANTES ====================
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-50px';
    heart.style.opacity = '0.7';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 3s ease-in-out';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.bottom = '120vh';
        heart.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Crear corazones flotantes ocasionalmente
setInterval(() => {
    if (Math.random() > 0.7) {
        createFloatingHeart();
    }
}, 3000);

// ==================== MANEJO DE ERRORES DE IMÁGENES ====================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Si la imagen no carga, mostrar un placeholder
        this.style.background = 'linear-gradient(135deg, #FFD6E8 0%, #E6D9F5 100%)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.alt = '💕 Imagen de pareja de anime 💕';
    });
});