// ====================================
// Motion Layer - Lenis + GSAP
// ====================================
let lenis = null;
let loadingFinished = false;
let motionStarted = false;

function initLenis() {
    if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    lenis = new Lenis({
        duration: 1.35,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

function animatePageIntro() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const releaseFirstPaint = () => document.documentElement.classList.remove('site-booting');

    if (!window.gsap) {
        releaseFirstPaint();
        document.body.classList.add('hero-intro-complete');
        return;
    }

    document.body.classList.add('gsap-ready');

    if (prefersReducedMotion) {
        releaseFirstPaint();
        document.body.classList.add('hero-intro-complete');
        return;
    }

    gsap.set('.hero-reveal-inner', { yPercent: 118, rotate: 2.5 });
    gsap.set('.hero-meta, .hero-description, .hero-actions .btn, .hero-scroll-indicator, .hero-corner', {
        autoAlpha: 0
    });
    gsap.set('.hero-tension-bar', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.hero-prelude', { autoAlpha: 0 });
    gsap.set('.hero-video', { autoAlpha: 0, scale: 1.12 });
    gsap.set('.hero-title-accent', { clipPath: 'inset(0 100% 0 0)' });

    const heroTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            document.body.classList.add('hero-intro-complete');
            if (window.scrollY > 24) {
                gsap.set('.hero-scroll-indicator', { autoAlpha: 0, y: 20 });
            }
        }
    });

    heroTimeline
        .from('.header', { y: -90, autoAlpha: 0, duration: 0.65 }, 0)
        .to('.hero-video', { autoAlpha: 1, scale: 1.045, duration: 1.7, ease: 'power3.out' }, 0)
        .to('.hero-prelude', { autoAlpha: 1, duration: 0.65 }, 0.16)
        .from('.hero-prelude-index, .hero-prelude-status', {
            y: 12,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'expo.out'
        }, 0.2)
        .to('.hero-tension-bar', { scaleX: 1, duration: 0.88, ease: 'power3.in' }, 0.26)
        .to('.hero-prelude-status', { letterSpacing: '0.22em', duration: 0.72, ease: 'power3.in' }, 0.38)
        .to('.hero-tension-bar', {
            scaleX: 0,
            transformOrigin: 'right center',
            duration: 0.6,
            ease: 'expo.in'
        }, 1.14)
        .to('.hero-prelude', { autoAlpha: 0, y: -10, duration: 0.65, ease: 'expo.in' }, 1.24)
        .from('.hero-meta span', { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.68 }, 1.25)
        .to('.hero-meta', { autoAlpha: 1, duration: 0.65 }, 1.25)
        .to('.hero-reveal-inner', {
            yPercent: 0,
            rotate: 0,
            duration: 0.92,
            stagger: 0.13,
            ease: 'expo.out'
        }, 1.37)
        .to('.hero-title-accent', {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.72,
            ease: 'expo.inOut'
        }, 1.62)
        .to('.hero-description', { autoAlpha: 1, duration: 0.65 }, 1.82)
        .from('.hero-description', { y: 28, duration: 0.72 }, 1.82)
        .to('.hero-actions .btn', { autoAlpha: 1, duration: 0.65, stagger: 0.04 }, 1.92)
        .from('.hero-actions .btn', { y: 24, stagger: 0.08, duration: 0.72 }, 1.92)
        .to('.hero-corner', { autoAlpha: 1, stagger: 0.08, duration: 0.65 }, 2.08)
        .to('.hero-scroll-indicator', { autoAlpha: 1, duration: 0.7 }, 2.2)
        .from('.hero-scroll-line', { scaleY: 0, transformOrigin: 'top', duration: 0.7 }, 2.18);

    // A primeira pintura só é liberada depois de todos os estados iniciais
    // da timeline existirem, evitando o flash do hero antes do loading.
    releaseFirstPaint();
    requestAnimationFrame(() => heroTimeline.play(0));
}

function initPinnedCameraSequence() {
    const section = document.querySelector('.section-camera');
    const cameraPin = section?.querySelector('.camera-pin');
    const cameraWorld = section?.querySelector('.camera-world');

    if (!section || !cameraPin || !cameraWorld) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cameraMedia = gsap.matchMedia();

    cameraMedia.add({
        isMobile: '(max-width: 768px)',
        isDesktop: '(min-width: 769px)'
    }, (context) => {
        const isMobile = context.conditions.isMobile;
        const sequenceItems = gsap.utils.toArray('.camera-sequence-item', section);
        const cameraGrid = section.querySelector('.camera-grid');
        const progressFill = section.querySelector('.camera-progress-fill');
        const orbitA = section.querySelector('.camera-orbit-a');
        const orbitB = section.querySelector('.camera-orbit-b');

        gsap.set(sequenceItems, {
            autoAlpha: 0,
            y: isMobile ? 36 : 48,
            z: -40,
            scale: 0.96,
            rotateX: 4,
            transformOrigin: 'center bottom'
        });
        gsap.set(progressFill, {
            scaleX: isMobile ? 0 : 1,
            scaleY: isMobile ? 1 : 0,
            transformOrigin: isMobile ? 'left center' : 'center top'
        });

        const cameraTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${Math.round(window.innerHeight * (isMobile ? 3.1 : 3.15))}`,
                pin: cameraPin,
                pinSpacing: true,
                scrub: 1.15,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        cameraTimeline
            .fromTo(cameraWorld,
                {
                    scale: isMobile ? 1.14 : 1.22,
                    xPercent: isMobile ? 5 : 8,
                    yPercent: 7,
                    rotateZ: -1.2,
                    transformPerspective: 1200
                },
                {
                    scale: 1,
                    xPercent: 0,
                    yPercent: 0,
                    rotateZ: 0,
                    duration: 1.35,
                    ease: 'power3.out'
                },
                0
            )
            .fromTo(cameraGrid,
                { scale: 1.18, xPercent: -4, yPercent: -3 },
                {
                    scale: 1.02,
                    xPercent: 2,
                    yPercent: 2,
                    backgroundPosition: '108px 54px',
                    duration: 2.8,
                    ease: 'power3.out'
                },
                0
            )
            .to(progressFill, { scaleX: 1, scaleY: 1, duration: 2.8, ease: 'power3.inOut' }, 0)
            .to(orbitA, {
                xPercent: -65,
                yPercent: 34,
                rotate: 75,
                scale: 0.82,
                duration: 2.5,
                ease: 'power3.out'
            }, 0.15)
            .to(orbitB, {
                xPercent: 78,
                yPercent: -52,
                rotate: -45,
                scale: 1.16,
                duration: 2.5,
                ease: 'power3.out'
            }, 0.15);

        // Cada entrada começa exatamente 0.2s depois da anterior.
        sequenceItems.forEach((item, index) => {
            cameraTimeline.to(item, {
                autoAlpha: 1,
                y: 0,
                z: 0,
                scale: 1,
                rotateX: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, index * 0.2);
        });

        cameraTimeline.to(cameraWorld, {
            scale: isMobile ? 0.97 : 0.94,
            xPercent: isMobile ? -2 : -3,
            yPercent: -4,
            duration: 1.05,
            ease: 'power3.out'
        }, 1.78);

        return () => cameraTimeline.scrollTrigger?.kill();
    });
}

function initTechnologyScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.utils.toArray('.tech-stack:not([data-motion-bound])').forEach((stack, index) => {
        stack.dataset.motionBound = 'true';

        gsap.fromTo(stack,
            { y: 50, opacity: 0, rotate: index % 2 ? 1.5 : -1.5 },
            {
                y: 0,
                opacity: 1,
                rotate: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: stack,
                    start: 'top 82%',
                    end: 'bottom 12%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );

        const list = stack.querySelector('.tech-list');
        if (!list) return;

        gsap.fromTo(list.querySelectorAll('.tech-item'),
            { y: 28, scale: 0.82, opacity: 0, rotate: -4 },
            {
                y: 0,
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 0.7,
                stagger: 0.045,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: list,
                    start: 'top 86%',
                    end: 'bottom 10%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });
}

function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
    }

    ScrollTrigger.create({
        trigger: '.section-hero',
        start: 'top top-=24',
        end: 'bottom top',
        onEnter: () => {
            gsap.to('.hero-scroll-indicator', {
                autoAlpha: 0,
                y: 20,
                duration: 0.65,
                ease: 'expo.out',
                overwrite: true
            });
        },
        onLeaveBack: () => {
            if (!document.body.classList.contains('hero-intro-complete')) return;
            gsap.to('.hero-scroll-indicator', {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: 'expo.out',
                overwrite: true
            });
        }
    });

    const heroExit = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true
        }
    });

    heroExit
        .to('.hero-stage', {
            yPercent: -8,
            autoAlpha: 0.18,
            duration: 1.1,
            ease: 'power3.inOut',
        }, 0)
        .to('.hero-video', {
            yPercent: 9,
            scale: 1.14,
            duration: 1.1,
            ease: 'power3.inOut'
        }, 0);

    initPinnedCameraSequence();

    gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(title,
            { x: -36, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    gsap.fromTo('.sobre-image',
        { y: 70, rotate: -4, opacity: 0 },
        {
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.section-sobre',
                start: 'top 70%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            }
        }
    );

    gsap.utils.toArray('.sobre-card, .contato-form-container, .contato-social-container').forEach((el, index) => {
        gsap.fromTo(el,
            { y: 50, opacity: 0, rotate: index % 2 ? 1.5 : -1.5 },
            {
                y: 0,
                opacity: 1,
                rotate: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 82%',
                    end: 'bottom 12%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    initTechnologyScrollAnimations();

    gsap.utils.toArray('.project-card.active').forEach((card) => {
        gsap.fromTo(card,
            { scale: 0.92, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.75,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.section-projetos',
                    start: 'top 70%',
                    end: 'bottom 15%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    gsap.utils.toArray('.social-card, .form-group, .project-tags .tag, .project-buttons .btn').forEach((el, index) => {
        gsap.fromTo(el,
            { y: 24, opacity: 0, rotate: index % 2 ? 1.5 : -1.5 },
            {
                y: 0,
                opacity: 1,
                rotate: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    end: 'bottom 8%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    ScrollTrigger.refresh();
}

function animateActiveProject(card) {
    if (!window.gsap || !card) return;

    gsap.fromTo(card,
        { x: 34, rotate: 1.5, opacity: 0, scale: 0.96 },
        { x: 0, rotate: 0, opacity: 1, scale: 1, duration: 0.72, ease: 'expo.out' }
    );
}

function initAboutPhotoHoverMotion() {
    const wrapper = document.querySelector('.section-sobre .sobre-image-wrapper');
    const decorations = wrapper ? Array.from(wrapper.querySelectorAll('.photo-decor')) : [];

    if (!wrapper || decorations.length === 0 || !window.gsap) return;
    if (wrapper.dataset.hoverMotionBound === 'true') return;

    wrapper.dataset.hoverMotionBound = 'true';

    const restingStates = [
        { xPercent: 28, yPercent: 82, scale: 0.62, rotation: 18 },
        { xPercent: -42, yPercent: 34, scale: 0.58, rotation: -20 },
        { xPercent: 34, yPercent: -48, scale: 0.62, rotation: -15 },
        { xPercent: -38, yPercent: -58, scale: 0.6, rotation: 17 }
    ];

    const desktopStates = [
        { xPercent: -15, yPercent: -230, rotation: -8 },
        { xPercent: 180, yPercent: -20, rotation: 16 },
        { xPercent: -150, yPercent: 20, rotation: 7 },
        { xPercent: 25, yPercent: 220, rotation: -10 }
    ];

    const mobileStates = [
        { xPercent: -10, yPercent: -195, rotation: -8 },
        { xPercent: 130, yPercent: -15, rotation: 16 },
        { xPercent: -10, yPercent: 245, rotation: 7 },
        { xPercent: 18, yPercent: 195, rotation: -10 }
    ];

    document.body.classList.add('photo-motion-ready');

    decorations.forEach((decoration, index) => {
        gsap.set(decoration, {
            xPercent: restingStates[index].xPercent,
            yPercent: restingStates[index].yPercent,
            scale: restingStates[index].scale,
            rotation: restingStates[index].rotation,
            opacity: 0,
            transformOrigin: '50% 50%'
        });
    });

    const destination = window.matchMedia('(max-width: 768px)').matches
        ? mobileStates
        : desktopStates;

    const hoverTimeline = gsap.timeline({ paused: true });

    decorations.forEach((decoration, index) => {
        hoverTimeline.to(decoration, {
            xPercent: destination[index].xPercent,
            yPercent: destination[index].yPercent,
            rotation: destination[index].rotation,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out'
        }, index * 0.08);
    });

    let touchOpen = false;

    wrapper.addEventListener('mouseenter', () => hoverTimeline.play());
    wrapper.addEventListener('mouseleave', () => hoverTimeline.reverse());

    wrapper.addEventListener('pointerup', event => {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
        touchOpen = !touchOpen;
        if (touchOpen) hoverTimeline.play();
        else hoverTimeline.reverse();
    });

    if (wrapper.matches(':hover')) hoverTimeline.play();
}

function startMotionWhenReady() {
    if (motionStarted || !loadingFinished) return;

    motionStarted = true;
    animatePageIntro();
    initScrollAnimations();
}

function initHeroVideoPlayback() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    // Alguns navegadores só liberam autoplay quando as propriedades também
    // são definidas em JavaScript antes da primeira tentativa de reprodução.
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    const markPlaying = () => {
        document.body.classList.add('hero-video-playing');
        document.body.classList.remove('hero-video-paused', 'hero-video-error');
    };

    const requestPlayback = () => {
        let playAttempt;

        try {
            playAttempt = heroVideo.play();
        } catch {
            document.body.classList.add('hero-video-error');
            return;
        }

        if (!playAttempt) return;

        playAttempt
            .then(markPlaying)
            .catch(() => document.body.classList.add('hero-video-paused'));
    };

    heroVideo.addEventListener('playing', markPlaying);
    heroVideo.addEventListener('canplay', requestPlayback, { once: true });
    heroVideo.addEventListener('error', () => {
        document.body.classList.add('hero-video-error');
        document.body.classList.remove('hero-video-playing');
    });

    // Reexecuta após voltar para a aba e após a primeira interação, cobrindo
    // Safari/iOS, economia de energia e políticas de autoplay mais restritas.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && heroVideo.paused) requestPlayback();
    });
    window.addEventListener('pageshow', requestPlayback);
    document.addEventListener('pointerdown', requestPlayback, { once: true, passive: true });
    document.addEventListener('touchstart', requestPlayback, { once: true, passive: true });
    document.addEventListener('keydown', requestPlayback, { once: true });

    requestPlayback();
}

initHeroVideoPlayback();
initAboutPhotoHoverMotion();

// ====================================
// Loading Screen
// ====================================
initLenis();
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');

    if (!loadingScreen) {
        loadingFinished = true;
        startMotionWhenReady();
        return;
    }

    if (sessionStorage.getItem('portfolioLoaded') === 'true') {
        loadingScreen.remove();
        loadingFinished = true;
        startMotionWhenReady();
        return;
    }
    
    // Esconder loading após tudo carregar (mínimo 3s para dar tempo de ver a animação)
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remover do DOM após a transição
        setTimeout(() => {
            loadingScreen.remove();
            sessionStorage.setItem('portfolioLoaded', 'true');
            loadingFinished = true;
            startMotionWhenReady();
        }, 800);
    }, 1900);
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
            }, 750);
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
            }, 750);
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
    const isMenuOpen = nav.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
    menuToggle.setAttribute('aria-label', isMenuOpen ? 'Fechar menu' : 'Abrir menu');
    
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

function syncThemeToggleState() {
    const isDarkMode = body.classList.contains('dark-mode');
    themeToggle.setAttribute('aria-pressed', String(isDarkMode));
    themeToggle.setAttribute('aria-label', isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro');
}

syncThemeToggleState();

// Toggle do tema
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    syncThemeToggleState();
    
    // Adicionar animação de pulso
    themeToggle.classList.add('pulse');
    setTimeout(() => {
        themeToggle.classList.remove('pulse');
    }, 750);
    
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
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
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
    if (lenis) {
        lenis.scrollTo(targetPosition, {
            duration: duration / 1000,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        return;
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Fallback com expo.out para manter a mesma linguagem de movimento do GSAP.
    function expoOut(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = expoOut(progress);
        
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
    if (document.body.classList.contains('gsap-ready')) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.7s var(--ease-power3-out), transform 0.7s var(--ease-power3-out)';
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
    if (document.body.classList.contains('gsap-ready')) return;

    entries.forEach(entry => {
        const sobreImage = entry.target;
        if (entry.isIntersecting) {
            // Animação de entrada
            sobreImage.style.opacity = '0';
            sobreImage.style.transform = 'scale(0.8) rotate(-10deg)';
            
            setTimeout(() => {
                sobreImage.style.transition = 'opacity 0.8s var(--ease-expo-out), transform 0.8s var(--ease-expo-out)';
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
    if (document.body.classList.contains('gsap-ready')) return;

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
    if (document.body.classList.contains('gsap-ready')) return;

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
let activeHeaderSection = '';

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    header.classList.toggle('is-scrolled', currentScroll > 24);
    
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
    if (header && currentSection && activeHeaderSection !== currentSection) {
        activeHeaderSection = currentSection;
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
        }, 700);
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
const footerYear = document.querySelector('[data-footer-year]');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = currentYear;
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
        const hasGallery = project.images && project.images.length > 0 ? 'has-gallery' : '';
        const projectNumber = String(index + 1).padStart(2, '0');
        const projectTotal = String(projectsData.length).padStart(2, '0');
        
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
            <article class="project-card ${isActive} ${hasGallery}" data-project-index="${projectNumber}">
                ${infoHTML}
                <div class="project-header">
                    <div class="project-header-left">
                        <span class="project-count">${projectNumber} / ${projectTotal}</span>
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-tags">
                            ${tagsHTML}
                        </div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="project-content">
                    <div class="project-copy">
                        <p class="project-description">
                            ${project.description}
                        </p>
                        <span class="project-number-display" aria-hidden="true">${projectNumber}</span>
                    </div>
                    ${galleryHTML}
                </div>
                <div class="project-buttons">
                    ${buttonsHTML}
                </div>
            </article>
        `;
    }).join('');
}

// Renderizar indicadores
function renderIndicators() {
    const indicators = document.getElementById('projectIndicators');
    if (!indicators) return;
    
    indicators.innerHTML = projectsData.map((project, index) =>
        `<button type="button" class="project-indicator ${index === 0 ? 'active' : ''}" onclick="setProject(${index})" aria-label="Abrir projeto ${project.title}">${String(index + 1).padStart(2, '0')}</button>`
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
    animateActiveProject(projects[currentProjectIndex]);
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
    animateActiveProject(projects[index]);
}

window.addEventListener('load', async () => {
    await Promise.all([loadProjects(), loadTechnologies()]);

    if (motionStarted && window.ScrollTrigger) {
        requestAnimationFrame(() => ScrollTrigger.refresh());
    }
});

// ====================================
// Carregar e Renderizar Tecnologias
// ====================================
async function loadTechnologies() {
    try {
        const response = await fetch('technologies.json?v=2');
        const data = await response.json();
        renderTechnologies(data.techStacks);
    } catch (error) {
        console.error('Erro ao carregar tecnologias:', error);
    }
}

function renderTechnologies(techStacks) {
    const container = document.getElementById('techStacksContainer');
    if (!container) return;
    
    container.innerHTML = techStacks.map((stack, stackIndex) => {
        const technologiesHTML = stack.technologies.map(tech => `
            <div class="tech-item" title="${tech.name} - ${tech.level}/100" data-tech-name="${tech.name}">
                <span class="tech-icon"><i class="${tech.icon}"></i></span>
                <span class="tech-name">${tech.name}</span>
                <span class="tech-level">${tech.level}/100</span>
            </div>
        `).join('');
        
        return `
            <div class="tech-stack">
                <div class="tech-stack-header">
                    <span class="tech-stack-index">${String(stackIndex + 1).padStart(2, '0')}</span>
                    <h3 class="tech-stack-title">${stack.title}</h3>
                </div>
                <div class="tech-list">
                    ${technologiesHTML}
                </div>
            </div>
        `;
    }).join('');

    if (motionStarted) {
        initTechnologyScrollAnimations();
    }
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
        }, 700);
    }
}

console.log('🎨 Portfolio Soft-Neobrutalismo carregado com sucesso!');
