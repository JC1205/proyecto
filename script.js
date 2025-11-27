
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
const ITSON_ID = "252184";


const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
});


navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


async function getPublicProjects(itsonId) {
    try {
        const res = await fetch(`${API_BASE}/publicProjects/${itsonId}`);
        
        if (!res.ok) {
            throw new Error("Error al obtener proyectos desde la API");
        }
        
        const projects = await res.json();
        return projects;
        
    } catch (error) {
        console.error("Error fetching projects:", error);
        return getProyectosMock();
    }
}


async function renderProyectos() {
    const grid = document.getElementById('proyectos-grid');
    

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.2rem; color: #6b7280;">Cargando proyectos...</p></div>';
    
    try {
        const proyectos = await getPublicProjects(ITSON_ID);
        
        grid.innerHTML = '';
        
        if (!proyectos || proyectos.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.2rem; color: #6b7280;">No hay proyectos disponibles</p></div>';
            return;
        }
        
        proyectos.forEach((proyecto, index) => {
            const card = document.createElement('div');
            card.className = 'proyecto-card';
            card.style.animationDelay = `${index * 0.15}s`;
            
            const imagenUrl = proyecto.images && proyecto.images.length > 0 
                ? proyecto.images[0] 
                : `https://via.placeholder.com/400x250/667EEA/FFFFFF?text=${encodeURIComponent(proyecto.title)}`;
            
            const tecnologiasHTML = proyecto.technologies && proyecto.technologies.length > 0
                ? proyecto.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
                : '<span class="tech-tag">Sin tecnologías especificadas</span>';
            
            card.innerHTML = `
                <div class="proyecto-image">
                    <img src="${imagenUrl}" alt="${proyecto.title}" onerror="this.src='https://via.placeholder.com/400x250/667EEA/FFFFFF?text=Imagen+no+disponible'">
                    <div class="proyecto-overlay"></div>
                </div>
                <div class="proyecto-content">
                    <h3 class="proyecto-titulo">${proyecto.title}</h3>
                    <p class="proyecto-descripcion">${proyecto.description || 'Sin descripción disponible'}</p>
                    <div class="proyecto-tecnologias">
                        ${tecnologiasHTML}
                    </div>
                    <a href="${proyecto.repository || '#'}" target="_blank" class="proyecto-link" ${!proyecto.repository || proyecto.repository === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                        Ver Proyecto 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error("Error al renderizar proyectos:", error);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.2rem; color: #ef4444;">Error al cargar los proyectos. Por favor, intenta más tarde.</p></div>';
    }
}


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


document.addEventListener('DOMContentLoaded', () => {

    renderProyectos();
    
    setTimeout(() => {
        const proyectoCards = document.querySelectorAll('.proyecto-card');
        proyectoCards.forEach(card => observer.observe(card));
    }, 500);
    
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => observer.observe(card));
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const inicioContent = document.querySelector('.inicio-content');
    
    if (inicioContent && scrolled < window.innerHeight) {
        inicioContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        inicioContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

const btnVerProyectos = document.querySelector('.btn-secondary');
if (btnVerProyectos) {
    btnVerProyectos.addEventListener('click', () => {
        document.getElementById('proyectos').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}


document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});


if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#2563eb', '#9333ea', '#60a5fa', '#a78bfa']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#2563eb',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}