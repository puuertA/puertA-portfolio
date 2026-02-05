// ====================================
// Loading Screen
// ====================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Esconder loading após tudo carregar (mínimo 3s para dar tempo de ver a animação)
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remover do DOM após a transição
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 3000);
});

// ====================================
// Toast Notification System
// ====================================
function showToast(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    
    // Criar elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Ícones por tipo
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <p class="toast-title">${title}</p>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            ×
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover após duração
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }
    
    return toast;
}

// ====================================
// Toast Notification System
// ====================================
function showToast(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    
    // Criar elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Ícones por tipo
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <p class="toast-title">${title}</p>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            ×
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover após duração
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }
    
    return toast;
}

// ====================================
// Menu Mobile Toggle
// ====================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    
    // Animação do ícone hambúrguer
    const spans = menuToggle.querySelectorAll('span');
    if (nav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ====================================
// Alternância de Tema Escuro/Claro
// ====================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Verificar preferência salva ou preferência do sistema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Aplicar tema inicial
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-mode');
}

// Toggle do tema
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Adicionar animação de pulso
    themeToggle.classList.add('pulse');
    setTimeout(() => {
        themeToggle.classList.remove('pulse');
    }, 500);
    
    // Salvar preferência
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            nav.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ====================================
// Smooth Scroll Suave e Satisfatório
// ====================================
function smoothScrollTo(targetPosition, duration = 1200) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Função de easing (suavização) - easeInOutCubic para movimento bem suave
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            // Atualizar link ativo após completar
            updateActiveLink();
        }
    }

    requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar links vazios ou apenas "#"
        if (!href || href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            // Altura do header fixo
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - (-50);
            
            // Smooth scroll customizado (1200ms = 1.2 segundos)
            smoothScrollTo(offsetPosition, 1200);
            
            // Fechar menu mobile se estiver aberto
            if (window.innerWidth <= 768) {
                const nav = document.getElementById('nav');
                const menuToggle = document.getElementById('menuToggle');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    });
});

// ====================================
// Animação de Cards ao Scroll
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards de projeto e contato
document.querySelectorAll('.project-card, .contato-card').forEach(card => {
    observer.observe(card);
});

// ====================================
// Animação da Foto ao Scroll
// ====================================
const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const sobreImage = entry.target;
        if (entry.isIntersecting) {
            // Animação de entrada
            sobreImage.style.opacity = '0';
            sobreImage.style.transform = 'scale(0.8) rotate(-10deg)';
            
            setTimeout(() => {
                sobreImage.style.transition = 'opacity 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                sobreImage.style.opacity = '1';
                sobreImage.style.transform = 'scale(1) rotate(0deg)';
            }, 150);
            
            photoObserver.unobserve(sobreImage);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px'
});

// Observar a foto
const sobreImageElement = document.querySelector('.sobre-image');
if (sobreImageElement) {
    photoObserver.observe(sobreImageElement);
}

// ====================================
// Animação das Barras de Tecnologia (RPG Style)
// ====================================
const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const techItem = entry.target;
            const bar = techItem.querySelector('.tech-bar');
            const level = bar.getAttribute('data-level');
            const fill = bar.querySelector('.tech-bar-fill');
            
            // Adicionar classe de animação
            setTimeout(() => {
                techItem.classList.add('animated');
                fill.style.width = level + '%';
            }, 200);
            
            techObserver.unobserve(techItem);
        }
    });
}, observerOptions);

// Observar cada item de tecnologia
document.querySelectorAll('.tech-item').forEach(item => {
    techObserver.observe(item);
});

// ====================================
// Animações Snap no Scroll
// ====================================
const snapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            snapObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

// Observar elementos para animação snap
const observeOnScroll = () => {
    document.querySelectorAll('.section-title, .sobre-card, .tech-stack, .contato-wrapper, .project-card').forEach(el => {
        snapObserver.observe(el);
    });
};

// Executar após DOM carregar
setTimeout(observeOnScroll, 500);

// ====================================
// Scroll to Top - Header Visibility
// ====================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
    
    // Atualizar link ativo no menu
    updateActiveLink();
});

// ====================================
// Indicador de Seção Ativa no Menu
// ====================================
function updateActiveLink() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const header = document.querySelector('.header');
    
    if (sections.length === 0) return;
    
    let currentSection = '';
    const headerHeight = header ? header.offsetHeight : 80;
    const scrollPosition = window.pageYOffset + headerHeight + 50; // Offset ajustado
    
    // Encontrar a seção atual
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Se não encontrou nenhuma seção (topo da página), usar a primeira
    if (!currentSection && window.pageYOffset < 100) {
        const firstSection = sections[0];
        if (firstSection) {
            currentSection = firstSection.getAttribute('id');
        }
    }
    
    // Atualizar classes dos links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // ====================================
    // ANIMAÇÃO DO HEADER - Muda conforme a seção
    // ====================================
    if (header && currentSection) {
        // Remover todas as classes de seção ativa
        header.classList.remove(
            'section-sobre-active',
            'section-projetos-active',
            'section-tecnologias-active',
            'section-contato-active'
        );
        
        // Adicionar classe da seção atual
        header.classList.add(`section-${currentSection}-active`);
        
        // Pequena animação de "bounce" ao trocar de seção
        header.style.transform = 'scale(0.98)';
        setTimeout(() => {
            header.style.transform = 'scale(1)';
        }, 150);
    }
}

// Chamar no carregamento da página
window.addEventListener('load', updateActiveLink);

// ====================================
// Formulário de Contato - FormSubmit (Método HTML Form)
// ====================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Feedback visual ao enviar
        submitBtn.disabled = true;
        submitBtn.textContent = '📤 Enviando...';
        submitBtn.style.backgroundColor = 'var(--color-yellow)';
        
        // Salvar no localStorage que o formulário foi enviado
        localStorage.setItem('formSent', 'true');
        
        // O formulário será enviado normalmente via action do HTML
        // FormSubmit redirecionará de volta para o site
    });
    
    // Verificar se acabou de enviar o formulário
    if (localStorage.getItem('formSent') === 'true') {
        localStorage.removeItem('formSent');
        
        // Mostrar mensagem de sucesso com toast
        setTimeout(() => {
            showToast(
                'Mensagem enviada com sucesso!',
                'Obrigado pelo contato! Responderei em breve. 😊',
                'success',
                5000
            );
        }, 500);
    }
}

// ====================================
// Atualizar ano no footer
// ====================================
const footer = document.querySelector('.footer p');
if (footer) {
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `&copy; ${currentYear} puertA. Desenvolvido com ☕ e código.`;
}

// ====================================
// Carousel de Galeria do Projeto
// ====================================
function changeSlide(direction, button) {
    const carousel = button.closest('.project-gallery-carousel');
    const slides = carousel.querySelectorAll('.gallery-item');
    const dots = carousel.querySelectorAll('.gallery-dot');
    let currentIndex = 0;
    
    // Encontrar slide atual
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Remover active do slide e dot atual
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    // Calcular novo índice
    let newIndex = currentIndex + direction;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;
    
    // Adicionar active ao novo slide e dot
    slides[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
}

function setSlide(index, dot) {
    const carousel = dot.closest('.project-gallery-carousel');
    const slides = carousel.querySelectorAll('.gallery-item');
    const dots = carousel.querySelectorAll('.gallery-dot');
    
    // Remover active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // Adicionar active ao selecionado
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

// ====================================
// Lightbox para Imagens
// ====================================
function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('active');
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
}

// Fechar com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ====================================
// Carousel de Projetos
// ====================================
let currentProjectIndex = 0;
let projectsData = [];

// Carregar projetos do JSON
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        projectsData = data.projects;
        renderProjects();
        renderIndicators();
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
    }
}

// Renderizar projetos no carousel
function renderProjects() {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;
    
    carousel.innerHTML = projectsData.map((project, index) => {
        const isActive = index === 0 ? 'active' : '';
        const isCollapsed = project.expandable ? 'collapsed' : '';
        
        // Renderizar tags
        const tagsHTML = project.tags.map(tag => 
            `<span class="tag ${tag.class}">${tag.name}</span>`
        ).join('');
        
        // Renderizar galeria de imagens (se houver)
        let galleryHTML = '';
        if (project.images && project.images.length > 0) {
            const imagesHTML = project.images.map((img, idx) => 
                `<div class="gallery-item ${idx === 0 ? 'active' : ''}">
                    <img src="${img.src}" alt="${img.alt}" class="gallery-image" onclick='openLightbox("${img.src}", "${img.alt}")'>
                </div>`
            ).join('');
            
            const dotsHTML = project.images.map((_, idx) => 
                `<span class="gallery-dot ${idx === 0 ? 'active' : ''}" onclick="setSlide(${idx}, this)"></span>`
            ).join('');
            
            galleryHTML = `
                <div class="project-gallery-carousel">
                    <button class="gallery-nav gallery-prev" onclick="changeSlide(-1, this)" aria-label="Imagem anterior">‹</button>
                    <div class="gallery-slides">
                        ${imagesHTML}
                    </div>
                    <button class="gallery-nav gallery-next" onclick="changeSlide(1, this)" aria-label="Próxima imagem">›</button>
                    <div class="gallery-dots">
                        ${dotsHTML}
                    </div>
                </div>
            `;
        }
        
        // Renderizar botões
        const buttonsHTML = project.buttons.map(btn => {
            if (btn.url) {
                const target = btn.target ? `target="${btn.target}"` : '';
                return `<a href="${btn.url}" ${target} class="btn ${btn.class}">${btn.text}</a>`;
            } else if (btn.onclick) {
                return `<button class="btn ${btn.class}" onclick="${btn.onclick}">${btn.text}</button>`;
            }
            return '';
        }).join('');
        
        // Renderizar ícone de informação se existir
        const infoHTML = project.info ? `
            <div class="project-info-icon">
                <span>i</span>
                <div class="project-info-tooltip">${project.info}</div>
            </div>
        ` : '';
        
        // Renderizar badge de status
        const statusText = project.status === 'finished' ? '✓ Finalizado' : '⚙ Em Desenvolvimento';
        const statusClass = project.status === 'finished' ? 'finished' : 'in-development';
        const statusBadge = `<span class="project-status-badge ${statusClass}">${statusText}</span>`;
        
        return `
            <div class="project-card ${isActive}">
                ${infoHTML}
                <div class="project-header">
                    <div class="project-header-left">
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-tags">
                            ${tagsHTML}
                        </div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="project-content">
                    <p class="project-description">
                        ${project.description}
                    </p>
                    ${galleryHTML}
                </div>
                <div class="project-buttons">
                    ${buttonsHTML}
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar indicadores
function renderIndicators() {
    const indicators = document.getElementById('projectIndicators');
    if (!indicators) return;
    
    indicators.innerHTML = projectsData.map((_, index) => 
        `<span class="project-indicator ${index === 0 ? 'active' : ''}" onclick="setProject(${index})"></span>`
    ).join('');
}

function changeProject(direction) {
    const projects = document.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.project-indicator');
    
    if (projects.length === 0) return;
    
    // Remover active do projeto e indicador atual
    projects[currentProjectIndex].classList.remove('active');
    indicators[currentProjectIndex].classList.remove('active');
    
    // Calcular novo índice (com loop)
    currentProjectIndex += direction;
    if (currentProjectIndex >= projects.length) currentProjectIndex = 0;
    if (currentProjectIndex < 0) currentProjectIndex = projects.length - 1;
    
    // Adicionar active ao novo projeto e indicador
    projects[currentProjectIndex].classList.add('active');
    indicators[currentProjectIndex].classList.add('active');
}

function setProject(index) {
    const projects = document.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.project-indicator');
    
    if (projects.length === 0) return;
    
    // Remover active de todos
    projects[currentProjectIndex].classList.remove('active');
    indicators[currentProjectIndex].classList.remove('active');
    
    // Adicionar active ao selecionado
    currentProjectIndex = index;
    projects[index].classList.add('active');
    indicators[index].classList.add('active');
}

window.addEventListener('load', () => {
    loadProjects();
    loadTechnologies();
});

// ====================================
// Carregar e Renderizar Tecnologias
// ====================================
async function loadTechnologies() {
    try {
        const response = await fetch('technologies.json');
        const data = await response.json();
        renderTechnologies(data.techStacks);
    } catch (error) {
        console.error('Erro ao carregar tecnologias:', error);
    }
}

function renderTechnologies(techStacks) {
    const container = document.getElementById('techStacksContainer');
    if (!container) return;
    
    container.innerHTML = techStacks.map(stack => {
        const technologiesHTML = stack.technologies.map(tech => `
            <div class="tech-item" title="${tech.name} - ${tech.level}/100">
                <span class="tech-icon"><i class="${tech.icon}"></i></span>
                <span class="tech-level">${tech.level}/100</span>
            </div>
        `).join('');
        
        return `
            <div class="tech-stack">
                <h3 class="tech-stack-title">${stack.title}</h3>
                <div class="tech-list">
                    ${technologiesHTML}
                </div>
            </div>
        `;
    }).join('');
}

function animateTechBars() {
    // Não é mais necessário com o novo layout
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeProject(-1);
    } else if (e.key === 'ArrowRight') {
        changeProject(1);
    }
});

// Tooltip de informação do projeto
let activeTooltip = null;

function showInfoTooltip(event, text) {
    const icon = event.currentTarget;
    const tooltip = icon.querySelector('.project-info-tooltip');
    
    if (!tooltip) return;
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    const rect = icon.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Posicionar acima do ícone
    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Ajustar se sair da tela pela esquerda
    if (left < 10) left = 10;
    
    // Ajustar se sair da tela pela direita
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    
    // Se não couber em cima, mostrar embaixo
    if (top < 10) {
        top = rect.bottom + 10;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.opacity = '1';
    
    activeTooltip = tooltip;
}

function hideInfoTooltip() {
    if (activeTooltip) {
        activeTooltip.style.opacity = '0';
        setTimeout(() => {
            if (activeTooltip) {
                activeTooltip.style.display = 'none';
                activeTooltip = null;
            }
        }, 300);
    }
}

console.log('🎨 Portfolio Soft-Neobrutalismo carregado com sucesso!');
