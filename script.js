// ====================================
// Motion Layer - Lenis + GSAP
// ====================================
let lenis = null;
let loadingFinished = false;
let motionStarted = false;
let pageAssetsLoaded = false;
let loadingIntroComplete = false;
let loadingExitStarted = false;
let loadingAmbientTweens = [];

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
    gsap.set('.hero-frame', {
        autoAlpha: 0,
        scaleX: 0.94,
        scaleY: 0.96,
        transformOrigin: 'center center'
    });
    gsap.set('.hero-video-wash, .hero-noise, .hero-video-accent', { autoAlpha: 0 });
    gsap.set('.hero-bottom', { autoAlpha: 0, y: 30 });
    gsap.set('.hero-tension-track', {
        autoAlpha: 0,
        scaleX: 0.38,
        transformOrigin: 'center center'
    });
    gsap.set('.hero-scroll-label, .hero-scroll-arrow', { autoAlpha: 0 });
    gsap.set('.hero-tension-bar', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.hero-prelude', { autoAlpha: 0 });
    gsap.set('.hero-video', { autoAlpha: 0, scale: 1.12 });
    gsap.set('.hero-title-accent', { clipPath: 'inset(0 100% 0 0)' });

    const heroTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            // O wash define o contraste do tema e precisa permanecer totalmente
            // visível depois do reveal. A timeline de scroll não deve capturar o
            // estado opacity: 0 usado somente durante o loading.
            gsap.set('.hero-video-wash', { autoAlpha: 1 });
            document.body.classList.add('hero-intro-complete');
            if (window.scrollY > 24) {
                gsap.set('.hero-scroll-indicator', { autoAlpha: 0, y: 20 });
            }
        }
    });

    heroTimeline
        .from('.header', { y: -90, autoAlpha: 0, duration: 0.65 }, 0)
        .to('.hero-frame', {
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1.1,
            ease: 'expo.out'
        }, 0)
        .to('.hero-video', { autoAlpha: 1, scale: 1.045, duration: 1.7, ease: 'power3.out' }, 0)
        .to('.hero-video-wash', { autoAlpha: 1, duration: 1.2, ease: 'power3.out' }, 0.04)
        .to('.hero-noise', { autoAlpha: 0.2, duration: 1.05, ease: 'power3.out' }, 0.1)
        .to('.hero-video-accent', { autoAlpha: 1, duration: 1.15, ease: 'expo.out' }, 0.14)
        .to('.hero-prelude', { autoAlpha: 1, duration: 0.65 }, 0.16)
        .to('.hero-tension-track', {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.8,
            ease: 'expo.out'
        }, 0.2)
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
        .to('.hero-bottom', { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 1.72)
        .to('.hero-description', { autoAlpha: 1, duration: 0.65 }, 1.82)
        .from('.hero-description', { y: 28, duration: 0.72 }, 1.82)
        .to('.hero-actions .btn', { autoAlpha: 1, duration: 0.65, stagger: 0.04 }, 1.92)
        .from('.hero-actions .btn', { y: 24, stagger: 0.08, duration: 0.72 }, 1.92)
        .to('.hero-corner', { autoAlpha: 1, stagger: 0.08, duration: 0.65 }, 2.08)
        .to('.hero-scroll-indicator', { autoAlpha: 1, duration: 0.7 }, 2.2)
        .from('.hero-scroll-line', {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 0.7,
            ease: 'expo.out'
        }, 2.18)
        .to('.hero-scroll-label, .hero-scroll-arrow', {
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out'
        }, 2.24);

    // A primeira pintura só é liberada depois de todos os estados iniciais
    // da timeline existirem, evitando o flash do hero antes do loading.
    releaseFirstPaint();
    requestAnimationFrame(() => heroTimeline.play(0));
}

function initHeroAmbientMotion() {
    const hero = document.querySelector('.section-hero');

    if (!hero || !window.gsap) return;
    if (hero.dataset.ambientMotionBound === 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.dataset.ambientMotionBound = 'true';

    gsap.to('.hero-scroll-arrow', {
        y: 6,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'power3.inOut'
    });

    gsap.to('.hero-noise', {
        xPercent: 0.45,
        yPercent: -0.45,
        scale: 1.025,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: 'power3.inOut'
    });

    gsap.to('.hero-video-accent', {
        xPercent: 3.5,
        yPercent: -1.5,
        rotation: 0.45,
        scale: 1.025,
        duration: 6.4,
        repeat: -1,
        yoyo: true,
        ease: 'expo.inOut'
    });
}

function initHeroInteractiveMotion() {
    const hero = document.querySelector('.section-hero');

    if (!hero || !window.gsap) return;
    if (hero.dataset.interactiveMotionBound === 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.dataset.interactiveMotionBound = 'true';

    const readHeroColor = name => getComputedStyle(hero).getPropertyValue(name).trim();

    hero.querySelectorAll('.hero-actions .btn').forEach((button, index) => {
        const isPrimary = button.classList.contains('btn-primary');

        const animateIn = () => {
            const shadow = readHeroColor(isPrimary ? '--hero-primary-shadow' : '--hero-secondary-shadow');

            gsap.to(button, {
                x: -4,
                y: -4,
                rotation: index % 2 === 0 ? -0.65 : 0.65,
                backgroundColor: '#5E81F4',
                color: isPrimary ? '#111111' : '#FFFFFF',
                borderColor: '#111111',
                boxShadow: `6px 6px 0 ${shadow}`,
                duration: 0.65,
                ease: 'expo.out',
                overwrite: 'auto'
            });
        };

        const animateOut = () => {
            const prefix = isPrimary ? '--hero-primary' : '--hero-secondary';

            gsap.to(button, {
                x: 0,
                y: 0,
                rotation: 0,
                backgroundColor: readHeroColor(`${prefix}-bg`),
                color: readHeroColor(`${prefix}-ink`),
                borderColor: readHeroColor(`${prefix}-border`),
                boxShadow: `4px 4px 0 ${readHeroColor(`${prefix}-shadow`)}`,
                duration: 0.7,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(button, {
                    clearProps: 'transform,backgroundColor,color,borderColor,boxShadow'
                })
            });
        };

        button.addEventListener('mouseenter', animateIn);
        button.addEventListener('mouseleave', animateOut);
        button.addEventListener('focus', animateIn);
        button.addEventListener('blur', animateOut);
    });

    const scrollIndicator = hero.querySelector('.hero-scroll-indicator');
    const scrollArrow = scrollIndicator?.querySelector('.hero-scroll-arrow');

    if (!scrollIndicator || !scrollArrow) return;

    const animateIndicatorIn = () => {
        gsap.to(scrollIndicator, {
            x: -5,
            color: '#FEE440',
            duration: 0.65,
            ease: 'expo.out',
            overwrite: 'auto'
        });
        gsap.to(scrollArrow, {
            rotation: -8,
            scale: 1.12,
            duration: 0.65,
            ease: 'expo.out',
            overwrite: 'auto'
        });
    };

    const animateIndicatorOut = () => {
        gsap.to(scrollIndicator, {
            x: 0,
            color: readHeroColor('--hero-ink'),
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto'
        });
        gsap.to(scrollArrow, {
            rotation: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto'
        });
    };

    scrollIndicator.addEventListener('mouseenter', animateIndicatorIn);
    scrollIndicator.addEventListener('mouseleave', animateIndicatorOut);
    scrollIndicator.addEventListener('focus', animateIndicatorIn);
    scrollIndicator.addEventListener('blur', animateIndicatorOut);
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
        const gridGlow = section.querySelector('.camera-grid-glow');
        const cameraFrame = section.querySelector('.camera-frame');
        const frameCorners = gsap.utils.toArray('.camera-frame-corner', section);
        const sectionNumber = section.querySelector('.camera-section-number');
        const topbar = section.querySelector('.camera-topbar');
        const progress = section.querySelector('.camera-progress');
        const progressDetails = gsap.utils.toArray('.camera-progress-label, .camera-progress-track, .camera-progress-time', section);
        const progressFill = section.querySelector('.camera-progress-fill');
        const orbitA = section.querySelector('.camera-orbit-a');
        const orbitB = section.querySelector('.camera-orbit-b');
        const cards = gsap.utils.toArray('.camera-card', section);
        const cardDetails = cards.flatMap(card => Array.from(card.querySelectorAll('.camera-card-index, h3, p')));
        const cardShapes = gsap.utils.toArray('.camera-card-shape', section);

        gsap.set(sequenceItems, {
            autoAlpha: 0,
            y: isMobile ? 36 : 48,
            z: -40,
            scale: 0.96,
            rotateX: 4,
            transformOrigin: 'center bottom'
        });
        gsap.set(cameraFrame, {
            autoAlpha: 0,
            scaleX: 0.96,
            scaleY: 0.96,
            transformOrigin: 'center center'
        });
        gsap.set(frameCorners, {
            autoAlpha: 0,
            scale: 0.35,
            transformOrigin: 'center center'
        });
        gsap.set(sectionNumber, {
            autoAlpha: 0,
            yPercent: 8,
            scale: 0.9,
            transformOrigin: 'right bottom'
        });
        gsap.set(topbar, { autoAlpha: 0, y: -22, scaleX: 0.92, transformOrigin: 'left center' });
        gsap.set(progress, { autoAlpha: 0, x: isMobile ? 0 : 20, y: isMobile ? 14 : 0 });
        gsap.set(progressDetails, { autoAlpha: 0, scale: 0.86 });
        gsap.set(gridGlow, { autoAlpha: 0, scale: 1.12, rotation: -2 });
        gsap.set([orbitA, orbitB], { autoAlpha: 0 });
        gsap.set(cardDetails, { autoAlpha: 0, y: 18, rotation: -1.5 });
        gsap.set(cardShapes, { autoAlpha: 0, scale: 0.4, rotation: -28 });
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
                { scale: 1.18, xPercent: -4, yPercent: -3, autoAlpha: 0 },
                {
                    scale: 1.02,
                    xPercent: 2,
                    yPercent: 2,
                    autoAlpha: 1,
                    backgroundPosition: '108px 54px',
                    duration: 2.8,
                    ease: 'power3.out'
                },
                0
            )
            .to(cameraFrame, {
                autoAlpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 1.05,
                ease: 'expo.out'
            }, 0.04)
            .to(frameCorners, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.72,
                stagger: 0.08,
                ease: 'expo.out'
            }, 0.1)
            .to(sectionNumber, {
                autoAlpha: 0.065,
                yPercent: 0,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out'
            }, 0.08)
            .to(gridGlow, {
                autoAlpha: 1,
                scale: 1,
                rotation: 0,
                duration: 1.4,
                ease: 'expo.out'
            }, 0.14)
            .to(topbar, {
                autoAlpha: 1,
                y: 0,
                scaleX: 1,
                duration: 0.75,
                ease: 'power3.out'
            }, 0.24)
            .to(progress, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.75,
                ease: 'power3.out'
            }, 0.28)
            .to(progressDetails, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out'
            }, 0.34)
            .to(progressFill, { scaleX: 1, scaleY: 1, duration: 2.8, ease: 'power3.inOut' }, 0)
            .to(orbitA, {
                autoAlpha: 1,
                xPercent: -65,
                yPercent: 34,
                rotate: 75,
                scale: 0.82,
                duration: 2.5,
                ease: 'power3.out'
            }, 0.15)
            .to(orbitB, {
                autoAlpha: 1,
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

        cards.forEach((card, index) => {
            const details = card.querySelectorAll('.camera-card-index, h3, p');
            const shape = card.querySelector('.camera-card-shape');
            const cardStart = (index + 3) * 0.2 + 0.12;

            cameraTimeline.to(details, {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out'
            }, cardStart);

            cameraTimeline.to(shape, {
                autoAlpha: 1,
                scale: 1,
                rotation: 18,
                duration: 0.75,
                ease: 'power3.out'
            }, cardStart + 0.08);
        });

        cameraTimeline.to(cameraWorld, {
            scale: isMobile ? 0.97 : 0.94,
            xPercent: isMobile ? -2 : -3,
            yPercent: -4,
            duration: 1.05,
            ease: 'power3.out'
        }, 1.78);

        cameraTimeline
            .to(sectionNumber, {
                autoAlpha: 0.025,
                yPercent: -4,
                scale: 1.035,
                duration: 1.05,
                ease: 'power3.inOut'
            }, 1.78)
            .to(cameraFrame, {
                autoAlpha: 0.38,
                scaleX: 0.985,
                scaleY: 0.985,
                duration: 1.05,
                ease: 'power3.inOut'
            }, 1.78)
            .to(progress, {
                autoAlpha: 0.35,
                duration: 0.7,
                ease: 'expo.inOut'
            }, 2.08);

        return () => cameraTimeline.scrollTrigger?.kill();
    });
}

function initAboutSectionAnimations() {
    const section = document.querySelector('.section-sobre');

    if (!section || !window.gsap || !window.ScrollTrigger) return;
    if (section.dataset.motionBound === 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    section.dataset.motionBound = 'true';

    const grid = section.querySelector('.section-sobre-grid');
    const backgroundNumber = section.querySelector('.section-sobre-number');
    const masthead = section.querySelector('.section-masthead');
    const sectionIndex = section.querySelector('.section-index');
    const sectionTitle = section.querySelector('.section-title');
    const sectionNote = section.querySelector('.section-note');
    const imageWrapper = section.querySelector('.sobre-image-wrapper');
    const imageLabel = section.querySelector('.sobre-image-label');
    const imageCorner = section.querySelector('.sobre-image-corner');
    const card = section.querySelector('.sobre-card');
    const eyebrow = section.querySelector('.sobre-eyebrow');
    const name = section.querySelector('.sobre-text h3');
    const paragraphs = section.querySelectorAll('.sobre-text > p');
    const academic = section.querySelector('.sobre-academic');
    const academicHeaderItems = section.querySelectorAll('.academic-label, .academic-semester');
    const academicProgram = section.querySelector('.academic-program');
    const academicProgramItems = section.querySelectorAll('.academic-program > span, .academic-program h4, .academic-program p');
    const academicFacts = section.querySelectorAll('.academic-facts > div');
    const coursework = section.querySelector('.academic-coursework');
    const courseworkLabel = section.querySelector('.academic-coursework > span');
    const courseworkItems = section.querySelectorAll('.academic-coursework li');
    const footer = section.querySelector('.sobre-card-footer');
    const footerItems = section.querySelectorAll('.sobre-tags span, .sobre-card-footer .btn');

    const aboutTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'bottom 12%',
            toggleActions: 'play reverse play reverse'
        }
    });

    aboutTimeline
        .fromTo(grid,
            { autoAlpha: 0, scale: 1.08, backgroundPosition: '-54px -54px' },
            {
                autoAlpha: 1,
                scale: 1,
                backgroundPosition: '0px 0px',
                duration: 1.2,
                ease: 'power3.out'
            },
            0
        )
        .fromTo(backgroundNumber,
            { autoAlpha: 0, yPercent: 18, scale: 0.88, rotation: 3 },
            {
                autoAlpha: 0.09,
                yPercent: 0,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                ease: 'expo.out'
            },
            0.04
        )
        .from(masthead, { autoAlpha: 0, y: -26, duration: 0.85, ease: 'power3.out' }, 0.08)
        .from(sectionIndex, { autoAlpha: 0, x: -28, rotation: -3, duration: 0.72, ease: 'expo.out' }, 0.12)
        .fromTo(sectionTitle,
            { autoAlpha: 0, x: -48, y: 30 },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.9,
                ease: 'expo.out'
            },
            0.18
        )
        .from(sectionNote, { autoAlpha: 0, x: 28, duration: 0.72, ease: 'power3.out' }, 0.28)
        .from(imageWrapper, {
            autoAlpha: 0,
            y: 72,
            rotation: -3,
            scale: 0.95,
            duration: 0.95,
            ease: 'expo.out'
        }, 0.34)
        .fromTo(card,
            {
                autoAlpha: 0,
                y: 62,
                rotation: 1.5,
                scale: 0.98
            },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.95,
                ease: 'expo.out'
            },
            0.38
        )
        .from([imageLabel, imageCorner], {
            autoAlpha: 0,
            scale: 0.45,
            rotation: -18,
            duration: 0.72,
            stagger: 0.1,
            ease: 'expo.out'
        }, 0.5)
        .from(eyebrow, { autoAlpha: 0, x: -30, rotation: -2, duration: 0.7, ease: 'power3.out' }, 0.54)
        .from(name, { autoAlpha: 0, y: 36, duration: 0.85, ease: 'expo.out' }, 0.62)
        .from(paragraphs, {
            autoAlpha: 0,
            y: 28,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out'
        }, 0.76)
        .from(academic, { autoAlpha: 0, y: 34, duration: 0.85, ease: 'expo.out' }, 0.96)
        .from(academicHeaderItems, {
            autoAlpha: 0,
            y: 18,
            rotation: -2,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out'
        }, 1.08)
        .from(academicProgram, {
            autoAlpha: 0,
            y: 28,
            scale: 0.97,
            duration: 0.82,
            ease: 'power3.out'
        }, 1.2)
        .from(academicProgramItems, {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out'
        }, 1.3)
        .from(academicFacts, {
            autoAlpha: 0,
            y: 24,
            duration: 0.72,
            stagger: 0.1,
            ease: 'power3.out'
        }, 1.48)
        .from(coursework, { autoAlpha: 0, y: 28, duration: 0.8, ease: 'expo.out' }, 1.66)
        .from(courseworkLabel, { autoAlpha: 0, x: -20, duration: 0.65, ease: 'power3.out' }, 1.76)
        .from(courseworkItems, {
            autoAlpha: 0,
            y: 18,
            rotation: -2,
            scale: 0.9,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out'
        }, 1.84)
        .from(footer, { autoAlpha: 0, y: 28, duration: 0.78, ease: 'power3.out' }, 2.02)
        .from(footerItems, {
            autoAlpha: 0,
            y: 18,
            rotation: -2,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out'
        }, 2.12);
}

function addProjectCardReveal(timeline, card, startAt = 0) {
    if (!timeline || !card) return;

    const infoIcon = card.querySelector('.project-info-icon');
    const count = card.querySelector('.project-count');
    const title = card.querySelector('.project-title');
    const status = card.querySelector('.project-status-badge');
    const tags = card.querySelectorAll('.project-tags .tag');
    const description = card.querySelector('.project-description');
    const projectNumber = card.querySelector('.project-number-display');
    const gallery = card.querySelector('.project-gallery-carousel');
    const galleryImage = card.querySelector('.gallery-item.active .gallery-image');
    const galleryControls = card.querySelectorAll('.gallery-nav, .gallery-dot');
    const buttons = card.querySelectorAll('.project-buttons .btn');

    if (infoIcon) {
        timeline.fromTo(infoIcon,
            { autoAlpha: 0, scale: 0.55, rotation: -18 },
            {
                autoAlpha: 1,
                scale: 1,
                rotation: 0,
                duration: 0.7,
                ease: 'expo.out'
            },
            startAt
        );
    }

    if (count) {
        timeline.fromTo(count,
            { autoAlpha: 0, x: -22 },
            {
                autoAlpha: 1,
                x: 0,
                duration: 0.68,
                ease: 'expo.out'
            },
            startAt
        );
    }

    if (title) {
        timeline.fromTo(title,
            { autoAlpha: 0, y: 34, clipPath: 'inset(0 0 100% 0)' },
            {
                autoAlpha: 1,
                y: 0,
                clipPath: 'inset(0 0 0% 0)',
                duration: 0.9,
                ease: 'expo.out'
            },
            startAt + 0.14
        );
    }

    if (status) {
        timeline.fromTo(status,
            { autoAlpha: 0, x: 24, rotation: 3 },
            {
                autoAlpha: 1,
                x: 0,
                rotation: 0,
                duration: 0.72,
                ease: 'power3.out'
            },
            startAt + 0.26
        );
    }

    if (tags.length) {
        timeline.fromTo(tags,
            { autoAlpha: 0, y: 18, rotation: -3, scale: 0.9 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out'
            },
            startAt + 0.34
        );
    }

    if (description) {
        timeline.fromTo(description,
            { autoAlpha: 0, x: -32, clipPath: 'inset(0 100% 0 0)' },
            {
                autoAlpha: 1,
                x: 0,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.78,
                ease: 'expo.out'
            },
            startAt + 0.62
        );
    }

    if (projectNumber) {
        timeline.fromTo(projectNumber,
            { autoAlpha: 0, x: 46, y: 28, rotation: 4, scale: 0.82 },
            {
                autoAlpha: 0.18,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 1,
                ease: 'expo.out'
            },
            startAt + 0.78
        );
    }

    if (gallery) {
        timeline.fromTo(gallery,
            {
                autoAlpha: 0,
                x: 42,
                rotation: 1.5,
                scale: 0.96,
                clipPath: 'inset(0 100% 0 0)'
            },
            {
                autoAlpha: 1,
                x: 0,
                rotation: 0,
                scale: 1,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.9,
                ease: 'expo.out'
            },
            startAt + 0.72
        );
    }

    if (galleryImage) {
        timeline.fromTo(galleryImage,
            { autoAlpha: 0, scale: 1.08 },
            {
                autoAlpha: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power3.out'
            },
            startAt + 0.86
        );
    }

    if (galleryControls.length) {
        timeline.fromTo(galleryControls,
            { autoAlpha: 0, y: 14, rotation: -5, scale: 0.82 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out'
            },
            startAt + 1.02
        );
    }

    if (buttons.length) {
        timeline.fromTo(buttons,
            { autoAlpha: 0, y: 18, rotation: -2 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'expo.out'
            },
            startAt + 1.12
        );
    }
}

function resetProjectCardChangeState(card) {
    if (!card || !window.gsap) return;

    if (projectRevealFrame !== null) {
        cancelAnimationFrame(projectRevealFrame);
        projectRevealFrame = null;
    }

    if (activeProjectRevealTimeline) {
        activeProjectRevealTimeline.kill();
        activeProjectRevealTimeline = null;
    }

    const motionTargets = [
        card,
        ...card.querySelectorAll([
            '.project-info-icon',
            '.project-count',
            '.project-title',
            '.project-status-badge',
            '.project-tags .tag',
            '.project-description',
            '.project-number-display',
            '.project-gallery-carousel',
            '.gallery-item.active .gallery-image',
            '.gallery-nav',
            '.gallery-dot',
            '.project-buttons .btn'
        ].join(','))
    ];

    gsap.killTweensOf(motionTargets);
    gsap.set(motionTargets, {
        clearProps: 'opacity,visibility,transform,clipPath,boxShadow'
    });
}

function animateProjectCardChangeReveal(card, direction = 1) {
    if (!card || !window.gsap) {
        projectTransitioning = false;
        return;
    }

    const infoIcon = card.querySelector('.project-info-icon');
    const count = card.querySelector('.project-count');
    const title = card.querySelector('.project-title');
    const status = card.querySelector('.project-status-badge');
    const tags = card.querySelectorAll('.project-tags .tag');
    const description = card.querySelector('.project-description');
    const projectNumber = card.querySelector('.project-number-display');
    const gallery = card.querySelector('.project-gallery-carousel');
    const galleryImage = card.querySelector('.gallery-item.active .gallery-image');
    const galleryControls = card.querySelectorAll('.gallery-nav, .gallery-dot');
    const buttons = card.querySelectorAll('.project-buttons .btn');
    const animatedTargets = [
        infoIcon,
        count,
        title,
        status,
        ...tags,
        description,
        projectNumber,
        gallery,
        galleryImage,
        ...galleryControls,
        ...buttons
    ].filter(Boolean);

    gsap.killTweensOf([card, ...animatedTargets]);

    // Estes estados são aplicados depois que o card já recebeu .active.
    // A timeline só começa no próximo frame, evitando o conteúdo pronto piscar.
    gsap.set(card, {
        autoAlpha: 1,
        x: direction * 52,
        y: 18,
        rotation: direction * 1.6,
        scale: 0.955
    });

    if (count) gsap.set(count, { autoAlpha: 0, x: direction * -26 });
    if (title) gsap.set(title, { autoAlpha: 0, y: 38, clipPath: 'inset(0 0 100% 0)' });
    if (infoIcon) gsap.set(infoIcon, { autoAlpha: 0, x: 24, scale: 0.55, rotation: -18 });
    if (status) gsap.set(status, { autoAlpha: 0, x: 32, rotation: 4 });
    if (tags.length) gsap.set(tags, { autoAlpha: 0, y: 22, rotation: -4, scale: 0.86 });
    if (description) {
        gsap.set(description, {
            autoAlpha: 0,
            x: direction * -38,
            clipPath: 'inset(0 100% 0 0)'
        });
    }
    if (projectNumber) {
        gsap.set(projectNumber, {
            autoAlpha: 0,
            x: direction * 54,
            y: 34,
            rotation: direction * 5,
            scale: 0.78
        });
    }
    if (gallery) {
        gsap.set(gallery, {
            autoAlpha: 0,
            x: direction * 48,
            rotation: direction * 1.8,
            scale: 0.95,
            clipPath: direction > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
        });
    }
    if (galleryImage) gsap.set(galleryImage, { autoAlpha: 0, scale: 1.1 });
    if (galleryControls.length) {
        gsap.set(galleryControls, { autoAlpha: 0, y: 16, rotation: -6, scale: 0.8 });
    }
    if (buttons.length) gsap.set(buttons, { autoAlpha: 0, y: 22, rotation: -3, scale: 0.94 });

    const revealTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            gsap.set(card, { clearProps: 'opacity,visibility,transform,boxShadow' });
            activeProjectRevealTimeline = null;
            projectTransitioning = false;
        }
    });

    activeProjectRevealTimeline = revealTimeline;

    revealTimeline.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.92,
        ease: 'expo.out'
    }, 0);

    if (count) {
        revealTimeline.to(count, { autoAlpha: 1, x: 0, duration: 0.68, ease: 'expo.out' }, 0.08);
    }
    if (title) {
        revealTimeline.to(title, {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            ease: 'expo.out'
        }, 0.18);
    }
    if (infoIcon) {
        revealTimeline.to(infoIcon, {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: 'expo.out'
        }, 0.26);
    }
    if (status) {
        revealTimeline.to(status, {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            duration: 0.72,
            ease: 'power3.out'
        }, 0.34);
    }
    if (tags.length) {
        revealTimeline.to(tags, {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out'
        }, 0.42);
    }
    if (description) {
        revealTimeline.to(description, {
            autoAlpha: 1,
            x: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.82,
            ease: 'expo.out'
        }, 0.72);
    }
    if (gallery) {
        revealTimeline.to(gallery, {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.92,
            ease: 'expo.out'
        }, 0.84);
    }
    if (projectNumber) {
        revealTimeline.to(projectNumber, {
            autoAlpha: 0.18,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'expo.out'
        }, 0.92);
    }
    if (galleryImage) {
        revealTimeline.to(galleryImage, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out'
        }, 1.02);
    }
    if (galleryControls.length) {
        revealTimeline.to(galleryControls, {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out'
        }, 1.18);
    }
    if (buttons.length) {
        revealTimeline.to(buttons, {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out'
        }, 1.3);
    }

    projectRevealFrame = requestAnimationFrame(() => {
        projectRevealFrame = null;
        revealTimeline.play(0);
    });
}

function initProjectSectionAnimations() {
    const section = document.querySelector('.section-projetos');
    const cards = section ? section.querySelectorAll('.project-card') : [];

    if (!section || !cards.length || !window.gsap || !window.ScrollTrigger) return;
    if (section.dataset.motionBound === 'true') return;
    section.dataset.motionBound = 'true';
    document.body.classList.add('project-motion-ready');

    const grid = section.querySelector('.section-projetos-grid');
    const backgroundNumber = section.querySelector('.section-projetos-number');
    const masthead = section.querySelector('.section-masthead');
    const sectionIndex = section.querySelector('.section-index');
    const sectionTitle = section.querySelector('.section-title');
    const sectionNote = section.querySelector('.section-note');
    const carouselWrapper = section.querySelector('.projetos-carousel-wrapper');
    const activeCard = section.querySelector('.project-card.active');
    const projectNav = section.querySelectorAll('.project-nav');
    const indicators = section.querySelector('.project-indicators');
    const indicatorItems = section.querySelectorAll('.project-indicator');

    initProjectInteractiveMotion(section);

    const projectTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'bottom 12%',
            toggleActions: 'play reverse play reverse'
        }
    });

    projectTimeline
        .fromTo(grid,
            { autoAlpha: 0, scale: 1.08, backgroundPosition: '-54px -54px' },
            {
                autoAlpha: 1,
                scale: 1,
                backgroundPosition: '0px 0px',
                duration: 1.2,
                ease: 'power3.out'
            },
            0
        )
        .fromTo(backgroundNumber,
            { autoAlpha: 0, yPercent: 18, scale: 0.88, rotation: -3 },
            {
                autoAlpha: 0.09,
                yPercent: 0,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                ease: 'expo.out'
            },
            0.04
        )
        .fromTo(masthead,
            { autoAlpha: 0, y: -26 },
            { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' },
            0.08
        )
        .fromTo(sectionIndex,
            { autoAlpha: 0, x: -28, rotation: -3 },
            { autoAlpha: 1, x: 0, rotation: 0, duration: 0.72, ease: 'expo.out' },
            0.12
        )
        .fromTo(sectionTitle,
            { autoAlpha: 0, x: -48, y: 30 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.9, ease: 'expo.out' },
            0.18
        )
        .fromTo(sectionNote,
            { autoAlpha: 0, x: 28 },
            { autoAlpha: 1, x: 0, duration: 0.72, ease: 'power3.out' },
            0.28
        )
        .fromTo(carouselWrapper,
            { autoAlpha: 0, y: 70, rotation: 1.2, scale: 0.98 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.95,
                ease: 'expo.out'
            },
            0.34
        );

    if (activeCard) {
        projectTimeline.fromTo(activeCard,
            { autoAlpha: 0, y: 48, rotation: -1.2, scale: 0.96 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.95,
                ease: 'expo.out'
            },
            0.42
        );

        addProjectCardReveal(projectTimeline, activeCard, 0.58);
    }

    if (projectNav.length) {
        projectTimeline.fromTo(projectNav,
            { autoAlpha: 0, y: 22, rotation: index => index ? 7 : -7, scale: 0.82 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.72,
                stagger: 0.1,
                ease: 'expo.out'
            },
            1.62
        );
    }

    if (indicators) {
        projectTimeline.fromTo(indicators,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.78, ease: 'power3.out' },
            1.68
        );
    }

    if (indicatorItems.length) {
        projectTimeline.fromTo(indicatorItems,
            { autoAlpha: 0, y: 16, rotation: -2, scale: 0.9 },
            {
                autoAlpha: 1,
                y: index => index === currentProjectIndex ? -3 : 0,
                rotation: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out'
            },
            1.76
        );
    }
}

function initProjectInteractiveMotion(section) {
    if (!section || !window.gsap) return;

    const bindHover = (element, animateIn, animateOut) => {
        if (!element || element.dataset.gsapHoverBound === 'true') return;

        element.dataset.gsapHoverBound = 'true';
        element.addEventListener('mouseenter', animateIn);
        element.addEventListener('mouseleave', animateOut);
        element.addEventListener('focus', animateIn);
        element.addEventListener('blur', animateOut);
    };

    section.querySelectorAll('.project-card').forEach(card => {
        bindHover(card,
            () => {
                if (!card.classList.contains('active') || projectTransitioning) return;
                const accent = getComputedStyle(section).getPropertyValue('--section-accent-alt').trim();
                gsap.to(card, {
                    x: -4,
                    y: -4,
                    rotation: -0.25,
                    boxShadow: `14px 14px 0 ${accent}`,
                    duration: 0.72,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            },
            () => {
                if (projectTransitioning) return;
                const accent = getComputedStyle(section).getPropertyValue('--section-accent-alt').trim();
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    boxShadow: `10px 10px 0 ${accent}`,
                    duration: 0.72,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            }
        );
    });

    section.querySelectorAll('.project-nav').forEach((button, index) => {
        bindHover(button,
            () => gsap.to(button, {
                x: -3,
                y: -3,
                rotation: index ? 2 : -2,
                scale: 1.04,
                duration: 0.68,
                ease: 'expo.out',
                overwrite: 'auto'
            }),
            () => gsap.to(button, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.68,
                ease: 'power3.out',
                overwrite: 'auto'
            })
        );
    });

    section.querySelectorAll('.project-indicator').forEach(indicator => {
        bindHover(indicator,
            () => gsap.to(indicator, {
                y: indicator.classList.contains('active') ? -5 : -3,
                scale: 1.035,
                duration: 0.65,
                ease: 'expo.out',
                overwrite: 'auto'
            }),
            () => gsap.to(indicator, {
                y: indicator.classList.contains('active') ? -3 : 0,
                scale: 1,
                duration: 0.65,
                ease: 'power3.out',
                overwrite: 'auto'
            })
        );
    });

    section.querySelectorAll('.project-tags .tag').forEach((tag, index) => {
        const mark = tag.querySelector('.tag-mark');
        if (mark) gsap.set(mark, { autoAlpha: 0, x: -8, yPercent: -50, rotation: -18 });

        bindHover(tag,
            () => {
                gsap.to(tag, {
                    y: -4,
                    rotation: index % 2 ? 1.5 : -1.5,
                    scale: 1.04,
                    duration: 0.68,
                    ease: 'expo.out',
                    overwrite: 'auto'
                });
                if (mark) {
                    gsap.to(mark, {
                        autoAlpha: 1,
                        x: 0,
                        rotation: 0,
                        duration: 0.65,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                }
            },
            () => {
                gsap.to(tag, {
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.68,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
                if (mark) {
                    gsap.to(mark, {
                        autoAlpha: 0,
                        x: -8,
                        rotation: -18,
                        duration: 0.65,
                        ease: 'expo.out',
                        overwrite: 'auto'
                    });
                }
            }
        );
    });

    section.querySelectorAll('.project-buttons .btn').forEach(button => {
        const label = button.querySelector('.project-button-label');
        const arrow = button.querySelector('.project-button-arrow');

        if (arrow) gsap.set(arrow, { autoAlpha: 0, x: -10 });

        bindHover(button,
            () => {
                gsap.to(button, {
                    x: -3,
                    y: -3,
                    scale: 1.015,
                    duration: 0.68,
                    ease: 'expo.out',
                    overwrite: 'auto'
                });
                if (label) gsap.to(label, { x: -2, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
                if (arrow) {
                    gsap.to(arrow, {
                        autoAlpha: 1,
                        x: 0,
                        rotation: -8,
                        duration: 0.68,
                        ease: 'expo.out',
                        overwrite: 'auto'
                    });
                }
            },
            () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.68,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
                if (label) gsap.to(label, { x: 0, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
                if (arrow) {
                    gsap.to(arrow, {
                        autoAlpha: 0,
                        x: -10,
                        rotation: 0,
                        duration: 0.65,
                        ease: 'expo.out',
                        overwrite: 'auto'
                    });
                }
            }
        );
    });

    section.querySelectorAll('.project-info-icon').forEach(icon => {
        const tooltip = icon.querySelector('.project-info-tooltip');
        if (!tooltip) return;

        gsap.set(tooltip, { autoAlpha: 0, y: 10, scale: 0.96 });
        bindHover(icon,
            () => {
                gsap.to(icon, { scale: 1.08, rotation: 4, duration: 0.68, ease: 'expo.out', overwrite: 'auto' });
                gsap.to(tooltip, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    ease: 'expo.out',
                    overwrite: 'auto'
                });
            },
            () => {
                gsap.to(icon, { scale: 1, rotation: 0, duration: 0.68, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(tooltip, {
                    autoAlpha: 0,
                    y: 10,
                    scale: 0.96,
                    duration: 0.68,
                    ease: 'expo.out',
                    overwrite: 'auto'
                });
            }
        );
    });

    section.querySelectorAll('.gallery-nav').forEach((button, index) => {
        gsap.set(button, { yPercent: -50 });
        bindHover(button,
            () => gsap.to(button, {
                x: -3,
                y: -3,
                rotation: index % 2 ? 3 : -3,
                scale: 1.06,
                duration: 0.68,
                ease: 'expo.out',
                overwrite: 'auto'
            }),
            () => gsap.to(button, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.68,
                ease: 'power3.out',
                overwrite: 'auto'
            })
        );
    });

    section.querySelectorAll('.gallery-dot').forEach(dot => {
        bindHover(dot,
            () => gsap.to(dot, {
                y: -3,
                scale: 1.22,
                rotation: 12,
                duration: 0.65,
                ease: 'expo.out',
                overwrite: 'auto'
            }),
            () => gsap.to(dot, {
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.65,
                ease: 'power3.out',
                overwrite: 'auto'
            })
        );
    });

    section.querySelectorAll('.gallery-image').forEach(image => {
        bindHover(image,
            () => gsap.to(image, { scale: 1.025, duration: 0.75, ease: 'power3.out', overwrite: 'auto' }),
            () => gsap.to(image, { scale: 1, duration: 0.75, ease: 'power3.out', overwrite: 'auto' })
        );
    });

    initProjectLightboxMotion();
}

function syncProjectIndicators(activeIndex, animate = true) {
    const indicators = document.querySelectorAll('.project-indicator');

    indicators.forEach((indicator, index) => {
        const isActive = index === activeIndex;
        indicator.classList.toggle('active', isActive);

        if (!window.gsap || !animate || !document.body.classList.contains('project-motion-ready')) return;

        gsap.to(indicator, {
            y: isActive ? -3 : 0,
            scale: 1,
            rotation: 0,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto'
        });
    });
}

function initProjectLightboxMotion() {
    const closeButton = document.querySelector('.lightbox-close');
    if (!closeButton || closeButton.dataset.gsapHoverBound === 'true' || !window.gsap) return;

    closeButton.dataset.gsapHoverBound = 'true';

    const animateIn = () => gsap.to(closeButton, {
        x: -3,
        y: -3,
        rotation: 4,
        scale: 1.04,
        duration: 0.68,
        ease: 'expo.out',
        overwrite: 'auto'
    });
    const animateOut = () => gsap.to(closeButton, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.68,
        ease: 'power3.out',
        overwrite: 'auto'
    });

    closeButton.addEventListener('mouseenter', animateIn);
    closeButton.addEventListener('mouseleave', animateOut);
    closeButton.addEventListener('focus', animateIn);
    closeButton.addEventListener('blur', animateOut);
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
        }, 0)
        .to('.hero-frame', {
            autoAlpha: 0.22,
            scaleX: 0.98,
            scaleY: 0.98,
            duration: 1.1,
            ease: 'power3.inOut'
        }, 0)
        .to('.hero-noise', {
            opacity: 0.06,
            duration: 1.1,
            ease: 'power3.inOut'
        }, 0)
        .to('.hero-video-accent', {
            opacity: 0.22,
            duration: 1.1,
            ease: 'power3.inOut'
        }, 0)
        .to('.hero-corner', {
            autoAlpha: 0,
            duration: 0.9,
            ease: 'expo.inOut'
        }, 0);

    initPinnedCameraSequence();
    initAboutSectionAnimations();
    initProjectSectionAnimations();

    gsap.utils.toArray('.section-title').forEach((title) => {
        if (title.closest('.section-sobre, .section-projetos')) return;

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

    gsap.utils.toArray('.contato-form-container, .contato-social-container').forEach((el, index) => {
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

    gsap.utils.toArray('.social-card, .form-group').forEach((el, index) => {
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

function initAboutPhotoHoverMotion() {
    const wrapper = document.querySelector('.section-sobre .sobre-image-wrapper');
    const decorations = wrapper ? Array.from(wrapper.querySelectorAll('.photo-decor')) : [];
    const imageFrame = wrapper?.querySelector('.sobre-image');
    const portrait = imageFrame?.querySelector('img');
    const section = wrapper?.closest('.section-sobre');
    const cvButton = section?.querySelector('.sobre-card-footer .btn');

    if (!wrapper || !imageFrame || !portrait || decorations.length === 0 || !window.gsap) return;
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

    document.body.classList.add('photo-motion-ready', 'about-motion-ready');

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

    hoverTimeline
        .to(imageFrame, {
            x: -4,
            y: -4,
            rotation: -1.5,
            boxShadow: '16px 16px 0 var(--section-accent-alt)',
            duration: 0.9,
            ease: 'expo.out'
        }, 0)
        .to(portrait, {
            filter: 'grayscale(0) contrast(1.08)',
            scale: 1.025,
            duration: 0.9,
            ease: 'power3.out'
        }, 0);

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

    if (cvButton && section) {
        const readSectionColor = name => getComputedStyle(section).getPropertyValue(name).trim();

        const animateButtonIn = () => {
            gsap.to(cvButton, {
                x: -4,
                y: -4,
                rotation: -0.65,
                backgroundColor: readSectionColor('--section-accent-alt'),
                color: '#111111',
                borderColor: readSectionColor('--section-panel-line'),
                boxShadow: `8px 8px 0 ${readSectionColor('--section-panel-line')}`,
                duration: 0.65,
                ease: 'expo.out',
                overwrite: 'auto'
            });
        };

        const animateButtonOut = () => {
            gsap.to(cvButton, {
                x: 0,
                y: 0,
                rotation: 0,
                backgroundColor: readSectionColor('--section-accent'),
                color: '#111111',
                borderColor: readSectionColor('--section-panel-line'),
                boxShadow: `6px 6px 0 ${readSectionColor('--section-panel-line')}`,
                duration: 0.7,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(cvButton, {
                    clearProps: 'transform,backgroundColor,color,borderColor,boxShadow'
                })
            });
        };

        cvButton.addEventListener('mouseenter', animateButtonIn);
        cvButton.addEventListener('mouseleave', animateButtonOut);
        cvButton.addEventListener('focus', animateButtonIn);
        cvButton.addEventListener('blur', animateButtonOut);
    }

    if (wrapper.matches(':hover')) hoverTimeline.play();
}

function startMotionWhenReady() {
    if (motionStarted || !loadingFinished) return;

    motionStarted = true;
    animatePageIntro();
    initHeroAmbientMotion();
    initHeroInteractiveMotion();
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
function startLoadingAmbientMotion(loadingScreen) {
    if (!window.gsap || !loadingScreen) return;

    const loadingLogoImage = loadingScreen.querySelector('.loading-logo-img');
    const loadingDecorations = loadingScreen.querySelectorAll('.loading-decor');
    const loadingTags = loadingScreen.querySelectorAll('.spinner-dot');

    loadingAmbientTweens = [
        gsap.to(loadingScreen, {
            backgroundPosition: '44px 44px, 44px 44px',
            duration: 5.6,
            repeat: -1,
            yoyo: true,
            ease: 'power3.inOut'
        }),
        gsap.to(loadingLogoImage, {
            rotation: 5,
            scale: 1.035,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: 'power3.inOut'
        }),
        gsap.to(loadingDecorations, {
            y: index => index === 0 ? -6 : 5,
            rotation: index => index === 0 ? 18 : -10,
            duration: 1.1,
            stagger: 0.12,
            repeat: -1,
            yoyo: true,
            ease: 'expo.inOut'
        }),
        gsap.to(loadingTags, {
            y: -4,
            rotation: index => index % 2 === 0 ? -1.5 : 1.5,
            duration: 0.8,
            stagger: 0.12,
            repeat: -1,
            yoyo: true,
            ease: 'power3.inOut'
        })
    ];
}

function initLoadingScreenMotion() {
    const loadingScreen = document.getElementById('loadingScreen');

    if (!loadingScreen || !window.gsap) {
        document.documentElement.classList.remove('loading-motion-pending');
        loadingIntroComplete = true;
        return;
    }

    const loadingContent = loadingScreen.querySelector('.loading-content');
    const loadingDecorations = loadingScreen.querySelectorAll('.loading-decor');
    const loadingLogo = loadingScreen.querySelector('.loading-logo');
    const loadingLogoImage = loadingScreen.querySelector('.loading-logo-img');
    const loadingEyebrow = loadingScreen.querySelector('.loading-eyebrow');
    const loadingTitle = loadingScreen.querySelector('.loading-title');
    const loadingSubtitle = loadingScreen.querySelector('.loading-subtitle');
    const loadingBarContainer = loadingScreen.querySelector('.loading-bar-container');
    const loadingBar = loadingScreen.querySelector('.loading-bar');
    const loadingTags = loadingScreen.querySelectorAll('.spinner-dot');

    gsap.set(loadingContent, { autoAlpha: 0, y: 34, rotation: -4, scale: 0.94 });
    gsap.set(loadingDecorations, { autoAlpha: 0, scale: 0.35, rotation: -24 });
    gsap.set(loadingLogo, { autoAlpha: 0, y: 24, scale: 0.72, rotation: -8 });
    gsap.set(loadingLogoImage, { rotation: -7, scale: 0.9 });
    gsap.set([loadingEyebrow, loadingTitle, loadingSubtitle], { autoAlpha: 0, y: 22 });
    gsap.set(loadingBarContainer, { autoAlpha: 0, scaleX: 0.7, transformOrigin: 'center center' });
    gsap.set(loadingBar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(loadingTags, { autoAlpha: 0, y: 26, scale: 0.82, rotation: -3 });
    document.documentElement.classList.remove('loading-motion-pending');

    const loadingTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            loadingIntroComplete = true;
            startLoadingAmbientMotion(loadingScreen);
            finishLoadingWhenReady();
        }
    });

    loadingTimeline
        .to(loadingScreen, {
            backgroundPosition: '22px 22px, 22px 22px',
            duration: 2.2,
            ease: 'power3.out'
        }, 0)
        .to(loadingContent, {
            autoAlpha: 1,
            y: 0,
            rotation: -1,
            scale: 1,
            duration: 0.9,
            ease: 'expo.out'
        }, 0)
        .to(loadingDecorations, {
            autoAlpha: 1,
            scale: 1,
            rotation: index => index === 0 ? 12 : 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'expo.out'
        }, 0.16)
        .to(loadingLogo, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.78,
            ease: 'expo.out'
        }, 0.26)
        .to(loadingLogoImage, {
            rotation: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power3.out'
        }, 0.34)
        .to(loadingEyebrow, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'expo.out' }, 0.44)
        .to(loadingTitle, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.52)
        .to(loadingSubtitle, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.64)
        .to(loadingBarContainer, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.7,
            ease: 'expo.out'
        }, 0.72)
        .to(loadingBar, {
            scaleX: 1,
            duration: 1.55,
            ease: 'expo.inOut'
        }, 0.82)
        .to(loadingTags, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out'
        }, 1.02);
}

function finishLoadingWhenReady() {
    if (!pageAssetsLoaded || !loadingIntroComplete || loadingExitStarted) return;

    const loadingScreen = document.getElementById('loadingScreen');

    if (!loadingScreen) {
        loadingFinished = true;
        startMotionWhenReady();
        return;
    }

    loadingExitStarted = true;
    loadingAmbientTweens.forEach(tween => tween.kill());
    loadingAmbientTweens = [];

    const finish = () => {
        loadingScreen.remove();
        loadingFinished = true;
        startMotionWhenReady();
    };

    if (!window.gsap) {
        finish();
        return;
    }

    const loadingContent = loadingScreen.querySelector('.loading-content');
    const loadingDecorations = loadingScreen.querySelectorAll('.loading-decor');
    const loadingBarContainer = loadingScreen.querySelector('.loading-bar-container');
    const loadingTags = loadingScreen.querySelectorAll('.spinner-dot');
    const loadingCopy = loadingScreen.querySelectorAll('.loading-logo, .loading-eyebrow, .loading-title, .loading-subtitle');

    const loadingExit = gsap.timeline({
        defaults: { ease: 'power3.in' },
        onComplete: finish
    });

    loadingExit
        .to(loadingTags, {
            autoAlpha: 0,
            y: 18,
            rotation: 3,
            duration: 0.65,
            stagger: { each: 0.08, from: 'end' },
            ease: 'expo.in'
        }, 0)
        .to(loadingBarContainer, {
            autoAlpha: 0,
            scaleX: 0.35,
            duration: 0.7,
            ease: 'power3.in'
        }, 0.08)
        .to(loadingCopy, {
            autoAlpha: 0,
            y: -18,
            duration: 0.7,
            stagger: { each: 0.06, from: 'end' },
            ease: 'expo.in'
        }, 0.12)
        .to(loadingDecorations, {
            autoAlpha: 0,
            scale: 0.35,
            rotation: 28,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.in'
        }, 0.18)
        .to(loadingContent, {
            autoAlpha: 0,
            y: -30,
            rotation: 2,
            scale: 0.96,
            duration: 0.8,
            ease: 'expo.in'
        }, 0.3)
        .to(loadingScreen, {
            autoAlpha: 0,
            y: -14,
            duration: 0.75,
            ease: 'expo.in'
        }, 0.46);
}

initLoadingScreenMotion();
initLenis();
window.addEventListener('load', () => {
    pageAssetsLoaded = true;
    finishLoadingWhenReady();
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
const HERO_THEME_MOTION_PROPERTIES = [
    '--hero-bg',
    '--hero-ink',
    '--hero-frame',
    '--hero-video-filter',
    '--hero-wash-start',
    '--hero-wash-middle',
    '--hero-wash-end',
    '--hero-wash-top',
    '--hero-wash-bottom',
    '--hero-wash-base',
    '--hero-noise-line',
    '--hero-grid-line',
    '--hero-status',
    '--hero-panel-bg',
    '--hero-panel-ink',
    '--hero-panel-border',
    '--hero-panel-shadow',
    '--hero-primary-bg',
    '--hero-primary-ink',
    '--hero-primary-border',
    '--hero-primary-shadow',
    '--hero-secondary-bg',
    '--hero-secondary-ink',
    '--hero-secondary-border',
    '--hero-secondary-shadow',
    '--hero-corner-bg',
    '--hero-corner-ink',
    '--hero-corner-border'
];
const CAMERA_THEME_MOTION_PROPERTIES = [
    '--camera-bg',
    '--camera-ink',
    '--camera-grid',
    '--camera-frame'
];
const ABOUT_THEME_MOTION_PROPERTIES = [
    '--section-bg',
    '--section-ink',
    '--section-line',
    '--section-panel',
    '--section-panel-ink',
    '--section-panel-line',
    '--section-grid',
    '--section-accent',
    '--section-accent-alt'
];
const PROJECTS_THEME_MOTION_PROPERTIES = [...ABOUT_THEME_MOTION_PROPERTIES];

function readHeroThemeMotionState(hero) {
    const computed = getComputedStyle(hero);

    return HERO_THEME_MOTION_PROPERTIES.reduce((state, property) => {
        state[property] = computed.getPropertyValue(property).trim();
        return state;
    }, {});
}

function clearHeroThemeMotionState(hero) {
    HERO_THEME_MOTION_PROPERTIES.forEach(property => hero.style.removeProperty(property));
}

function readCameraThemeMotionState(cameraSection) {
    const computed = getComputedStyle(cameraSection);

    return CAMERA_THEME_MOTION_PROPERTIES.reduce((state, property) => {
        state[property] = computed.getPropertyValue(property).trim();
        return state;
    }, {});
}

function clearCameraThemeMotionState(cameraSection) {
    CAMERA_THEME_MOTION_PROPERTIES.forEach(property => cameraSection.style.removeProperty(property));
}

function readAboutThemeMotionState(aboutSection) {
    const computed = getComputedStyle(aboutSection);

    return ABOUT_THEME_MOTION_PROPERTIES.reduce((state, property) => {
        state[property] = computed.getPropertyValue(property).trim();
        return state;
    }, {});
}

function clearAboutThemeMotionState(aboutSection) {
    ABOUT_THEME_MOTION_PROPERTIES.forEach(property => aboutSection.style.removeProperty(property));
}

function readProjectsThemeMotionState(projectsSection) {
    const computed = getComputedStyle(projectsSection);

    return PROJECTS_THEME_MOTION_PROPERTIES.reduce((state, property) => {
        state[property] = computed.getPropertyValue(property).trim();
        return state;
    }, {});
}

function clearProjectsThemeMotionState(projectsSection) {
    PROJECTS_THEME_MOTION_PROPERTIES.forEach(property => projectsSection.style.removeProperty(property));
}

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
    const hero = document.querySelector('.section-hero');
    const cameraSection = document.querySelector('.section-camera');
    const aboutSection = document.querySelector('.section-sobre');
    const projectsSection = document.querySelector('.section-projetos');
    let previousHeroTheme = null;
    let previousCameraTheme = null;
    let previousAboutTheme = null;
    let previousProjectsTheme = null;

    if (hero && window.gsap) {
        previousHeroTheme = readHeroThemeMotionState(hero);
        gsap.killTweensOf(hero);
        clearHeroThemeMotionState(hero);
    }

    if (cameraSection && window.gsap) {
        previousCameraTheme = readCameraThemeMotionState(cameraSection);
        gsap.killTweensOf(cameraSection);
        clearCameraThemeMotionState(cameraSection);
    }

    if (aboutSection && window.gsap) {
        previousAboutTheme = readAboutThemeMotionState(aboutSection);
        gsap.killTweensOf(aboutSection);
        clearAboutThemeMotionState(aboutSection);
    }

    if (projectsSection && window.gsap) {
        previousProjectsTheme = readProjectsThemeMotionState(projectsSection);
        gsap.killTweensOf(projectsSection);
        clearProjectsThemeMotionState(projectsSection);
    }

    body.classList.toggle('dark-mode');
    syncThemeToggleState();

    if (hero && previousHeroTheme && window.gsap) {
        const nextHeroTheme = readHeroThemeMotionState(hero);

        gsap.set(hero, previousHeroTheme);
        gsap.to(hero, {
            ...nextHeroTheme,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => clearHeroThemeMotionState(hero)
        });
    }

    if (cameraSection && previousCameraTheme && window.gsap) {
        const nextCameraTheme = readCameraThemeMotionState(cameraSection);

        gsap.set(cameraSection, previousCameraTheme);
        gsap.to(cameraSection, {
            ...nextCameraTheme,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => clearCameraThemeMotionState(cameraSection)
        });
    }

    if (aboutSection && previousAboutTheme && window.gsap) {
        const nextAboutTheme = readAboutThemeMotionState(aboutSection);

        gsap.set(aboutSection, previousAboutTheme);
        gsap.to(aboutSection, {
            ...nextAboutTheme,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => clearAboutThemeMotionState(aboutSection)
        });
    }

    if (projectsSection && previousProjectsTheme && window.gsap) {
        const nextProjectsTheme = readProjectsThemeMotionState(projectsSection);

        gsap.set(projectsSection, previousProjectsTheme);
        gsap.to(projectsSection, {
            ...nextProjectsTheme,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => clearProjectsThemeMotionState(projectsSection)
        });
    }
    
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
function transitionGallerySlide(carousel, newIndex, direction = 1) {
    if (!carousel || carousel.dataset.sliding === 'true') return;

    const slides = Array.from(carousel.querySelectorAll('.gallery-item'));
    const dots = Array.from(carousel.querySelectorAll('.gallery-dot'));
    const currentIndex = slides.findIndex(slide => slide.classList.contains('active'));

    if (currentIndex < 0 || !slides[newIndex] || newIndex === currentIndex) return;

    const outgoing = slides[currentIndex];
    const incoming = slides[newIndex];
    const incomingDot = dots[newIndex];
    const canAnimate = window.gsap
        && document.body.classList.contains('project-motion-ready');

    dots.forEach((dot, index) => dot.classList.toggle('active', index === newIndex));

    if (!canAnimate) {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        return;
    }

    carousel.dataset.sliding = 'true';
    incoming.classList.add('active');
    gsap.set(incoming, {
        autoAlpha: 0,
        xPercent: direction * 8,
        scale: 1.035,
        zIndex: 2,
        pointerEvents: 'none'
    });
    gsap.set(outgoing, { zIndex: 1, pointerEvents: 'none' });

    const slideTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            outgoing.classList.remove('active');
            gsap.set(outgoing, { clearProps: 'opacity,visibility,transform,zIndex,pointerEvents' });
            gsap.set(incoming, { clearProps: 'opacity,visibility,transform,zIndex,pointerEvents' });
            delete carousel.dataset.sliding;
        }
    });

    slideTimeline
        .to(outgoing, {
            autoAlpha: 0,
            xPercent: direction * -6,
            scale: 0.985,
            duration: 0.68,
            ease: 'expo.inOut'
        }, 0)
        .to(incoming, {
            autoAlpha: 1,
            xPercent: 0,
            scale: 1,
            duration: 0.82,
            ease: 'expo.out'
        }, 0.18);

    if (incomingDot) {
        slideTimeline.fromTo(incomingDot,
            { scale: 0.72, rotation: -14 },
            { scale: 1, rotation: 0, duration: 0.65, ease: 'expo.out' },
            0.24
        );
    }
}

function changeSlide(direction, button) {
    const carousel = button.closest('.project-gallery-carousel');
    const slides = carousel ? carousel.querySelectorAll('.gallery-item') : [];
    const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    if (!carousel || !slides.length || currentIndex < 0) return;

    let newIndex = currentIndex + direction;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;

    transitionGallerySlide(carousel, newIndex, direction);
}

function setSlide(index, dot) {
    const carousel = dot.closest('.project-gallery-carousel');
    const slides = carousel ? Array.from(carousel.querySelectorAll('.gallery-item')) : [];
    const currentIndex = slides.findIndex(slide => slide.classList.contains('active'));

    if (!carousel || currentIndex < 0) return;

    transitionGallerySlide(carousel, index, index >= currentIndex ? 1 : -1);
}

// ====================================
// Lightbox para Imagens
// ====================================
let lightboxTransitioning = false;

function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeButton = lightbox?.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImage || lightboxTransitioning) return;
    
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!window.gsap || !document.body.classList.contains('project-motion-ready')) return;

    lightboxTransitioning = true;
    gsap.set(lightbox, { autoAlpha: 0 });

    const lightboxTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            lightboxTransitioning = false;
        }
    });

    lightboxTimeline
        .to(lightbox, { autoAlpha: 1, duration: 0.72, ease: 'expo.out' }, 0)
        .fromTo(lightboxImage,
            { autoAlpha: 0, y: 34, rotation: -1.5, scale: 0.93 },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.9,
                ease: 'expo.out'
            },
            0.08
        );

    if (closeButton) {
        lightboxTimeline.fromTo(closeButton,
            { autoAlpha: 0, x: 24, y: -24, rotation: 12, scale: 0.78 },
            {
                autoAlpha: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.72,
                ease: 'expo.out'
            },
            0.18
        );
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeButton = lightbox?.querySelector('.lightbox-close');

    if (!lightbox || !lightbox.classList.contains('active') || lightboxTransitioning) return;

    if (!window.gsap || !document.body.classList.contains('project-motion-ready')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        return;
    }

    lightboxTransitioning = true;

    const lightboxTimeline = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
            lightbox.classList.remove('active');
            gsap.set([lightbox, lightboxImage, closeButton], { clearProps: 'opacity,visibility,transform' });
            document.body.style.overflow = '';
            lightboxTransitioning = false;
        }
    });

    if (closeButton) {
        lightboxTimeline.to(closeButton, {
            autoAlpha: 0,
            x: 20,
            y: -20,
            rotation: 10,
            duration: 0.65
        }, 0);
    }

    lightboxTimeline
        .to(lightboxImage, {
            autoAlpha: 0,
            y: 28,
            rotation: 1.2,
            scale: 0.95,
            duration: 0.72
        }, 0)
        .to(lightbox, { autoAlpha: 0, duration: 0.72 }, 0.08);
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
let projectTransitioning = false;
let activeProjectRevealTimeline = null;
let projectRevealFrame = null;

// Carregar projetos do JSON
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        projectsData = data.projects;
        currentProjectIndex = 0;
        renderProjects();
        renderIndicators();

        if (motionStarted) {
            initProjectSectionAnimations();
            if (window.ScrollTrigger) {
                requestAnimationFrame(() => ScrollTrigger.refresh());
            }
        }
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
            `<span class="tag ${tag.class}"><span class="tag-mark" aria-hidden="true">◆</span><span class="tag-label">${tag.name}</span></span>`
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
            const buttonContent = `<span class="project-button-label">${btn.text}</span><span class="project-button-arrow" aria-hidden="true">→</span>`;

            if (btn.url) {
                const target = btn.target ? `target="${btn.target}"` : '';
                return `<a href="${btn.url}" ${target} class="btn ${btn.class}">${buttonContent}</a>`;
            } else if (btn.onclick) {
                return `<button class="btn ${btn.class}" onclick="${btn.onclick}">${buttonContent}</button>`;
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

    const sectionNote = document.querySelector('.section-projetos .section-note');
    const total = String(projectsData.length).padStart(2, '0');

    indicators.style.setProperty('--project-count', String(projectsData.length));
    if (sectionNote) sectionNote.textContent = `SELEÇÃO / ${total}`;
    
    indicators.innerHTML = projectsData.map((project, index) =>
        `<button type="button" class="project-indicator ${index === 0 ? 'active' : ''}" onclick="setProject(${index})" aria-label="Abrir projeto ${project.title}">${String(index + 1).padStart(2, '0')}</button>`
    ).join('');
}

function transitionToProject(newIndex, direction = 1) {
    const projects = Array.from(document.querySelectorAll('.project-card'));
    const section = document.querySelector('.section-projetos');

    if (!projects.length || !projects[newIndex] || newIndex === currentProjectIndex) return;

    if (window.gsap && section && !document.body.classList.contains('project-motion-ready')) {
        document.body.classList.add('project-motion-ready');
        initProjectInteractiveMotion(section);
    }

    const outgoing = projects[currentProjectIndex];
    const incoming = projects[newIndex];
    const canAnimate = window.gsap
        && document.body.classList.contains('project-motion-ready');

    if (!canAnimate) {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        currentProjectIndex = newIndex;
        syncProjectIndicators(newIndex, false);
        return;
    }

    projectTransitioning = true;
    resetProjectCardChangeState(outgoing);
    resetProjectCardChangeState(incoming);

    outgoing.classList.remove('active');
    incoming.classList.add('active');
    currentProjectIndex = newIndex;
    syncProjectIndicators(newIndex, true);
    animateProjectCardChangeReveal(incoming, direction);
}

function changeProject(direction) {
    const projects = document.querySelectorAll('.project-card');
    if (!projects.length) return;

    let newIndex = currentProjectIndex + direction;
    if (newIndex >= projects.length) newIndex = 0;
    if (newIndex < 0) newIndex = projects.length - 1;

    transitionToProject(newIndex, direction >= 0 ? 1 : -1);
}

function setProject(index) {
    if (index === currentProjectIndex) return;
    transitionToProject(index, index > currentProjectIndex ? 1 : -1);
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
