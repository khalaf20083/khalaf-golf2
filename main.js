const ThemeManager = {
    init() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.root = document.documentElement;
        this.body = document.body;
        this.toggleCircle = this.themeToggle?.querySelector('.toggle-circle');

        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme !== 'light') {
            this.applyTheme(savedTheme);
        }

        // قم بحفظ الثيم عند فتح الصفحة
        this.applyTheme(savedTheme);

        this.themeToggle?.addEventListener('click', () => {
            const currentTheme = this.root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            localStorage.setItem('theme', newTheme);

            this.applyTheme(newTheme);
        });
    },

    applyTheme(theme) {
        this.root.setAttribute('data-theme', theme);
        this.body.setAttribute('data-theme', theme);

        if (this.toggleCircle) {
            if (theme === 'dark') {
                this.toggleCircle.style.transform = 'translateX(28px)';
            } else {
                this.toggleCircle.style.transform = 'translateX(0)';
            }
        }

        // ألأنتقال السلس
        this.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            this.body.style.transition = '';
        }, 500);
    }
};

const NavigationManager = {
    init() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.body = document.body;

        this.setupEventListeners();
        this.initActiveLinks();
    },

    setupEventListeners() {
        // Toggle menu
        this.menuToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        //  إغلاق القائمة عند النقر على الرابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.toggleMenu());
        });

        // إغلاق القائمة عند النقر الخارجي
        document.addEventListener('click', (e) => {
            if (this.navLinks?.classList.contains('active') &&
                !this.menuToggle?.contains(e.target) &&
                !this.navLinks?.contains(e.target)) {
                this.toggleMenu();
            }
        });

        //إغلاق القائمة
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks?.classList.contains('active')) {
                this.toggleMenu();
            }
        });
    },

    toggleMenu() {
        this.menuToggle?.classList.toggle('active');
        this.navLinks?.classList.toggle('active');
        this.body.style.overflow = this.body.style.overflow === 'hidden' ? '' : 'hidden';
    },

    initActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const onScroll = () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop &&
                    scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            if (scrollPosition < 100) {
                navLinks.forEach(link => link.classList.remove('active'));
            }
        };

        window.addEventListener('scroll', onScroll);
        onScroll(); 
    }
};

/**
 * نظام الرسوم المتحركة
 */
const AnimationManager = {
    init() {
        this.initHeaderAnimation();
        this.initParticles();
        this.initDecorations();
    },

    initHeaderAnimation() {
        const element = document.querySelector('.header-content h1');
        if (!element) return;

        const text = "منتجع الجولف الأول في البرتغال";
        let index = 0;
        let isDeleting = false;
        let isWaiting = false;

        const animate = () => {
            const currentText = text.substring(0, index);
            element.textContent = currentText;

            let speed = isDeleting ? 50 : 100;

            if (!isDeleting && index === text.length) {
                if (!isWaiting) {
                    isWaiting = true;
                    speed = 1000;
                } else {
                    isDeleting = true;
                    isWaiting = false;
                }
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                speed = 300;
            } else {
                index = isDeleting ? index - 1 : index + 1;
            }

            setTimeout(animate, speed);
        };

        animate();
    },

    initParticles() {
        const particlesConfig = {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#b9ff66"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#b9ff66",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                }
            },
            retina_detect: true
        };

        ['about', 'services', 'packages', 'contact'].forEach(section => {
            const element = document.getElementById(`${section}-particles`);
            if (element) {
                particlesJS(element.id, section === 'contact' ? {
                    ...particlesConfig,
                    particles: {
                        ...particlesConfig.particles,
                        number: {
                            value: 40,
                            density: { enable: true, value_area: 800 }
                        }
                    }
                } : particlesConfig);
            }
        });
    },

    initDecorations() {
        const landingPage = document.querySelector('.landing-page');
        if (!landingPage) return;

        ['dots-1', 'dots-2'].forEach(className => {
            const dots = document.createElement('div');
            dots.className = `decorative-dots ${className}`;
            landingPage.appendChild(dots);
        });

        ['shape-1', 'shape-2'].forEach(className => {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${className}`;
            landingPage.appendChild(shape);
        });

      
        this.initGSAPAnimations();
    },

    initGSAPAnimations() {

        gsap.to('.dots-1', {
            rotation: 360,
            duration: 30,
            repeat: -1,
            ease: 'none'
        });

        gsap.to('.dots-2', {
            rotation: -360,
            duration: 35,
            repeat: -1,
            ease: 'none'
        });

        gsap.to('.shape-1', {
            y: 30,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });

        gsap.to('.shape-2', {
            y: -30,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }
};

/**
 * نظام الموشر
 */
const CursorManager = {
    init() {
        this.cursor = document.querySelector('.custom-cursor');

        if (this.cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            this.show();
            this.setupCursorMovement();
        } else if (this.cursor) {
            this.hide();
            this.resetDefaultCursors();
        }
    },

    show() {
        this.cursor.style.display = 'block';
        document.body.style.cursor = 'none';
    },

    hide() {
        this.cursor.style.display = 'none';
    },

    resetDefaultCursors() {
        // للعناصر التفاعلية
        const elements = document.querySelectorAll('a, button, .logo-item, .feature-card');
        elements.forEach(element => {
            element.style.cursor = 'pointer';
        });
        document.body.style.cursor = 'auto';
    },

    setupCursorMovement() {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            this.cursor.style.left = `${mouseX}px`;
            this.cursor.style.top = `${mouseY}px`;
        });
        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            requestAnimationFrame(animate);
        };

        animate();
        const interactiveElements = document.querySelectorAll('a, button, .logo-item, .feature-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
            });
        });
    }
};

/**
 * الأزرار وحركتها
 */
const GoToTopManager = {
    init() {
        this.btn = document.querySelector('.go-top-btn');
        if (!this.btn) return;

        // تكبير الزر عند تمرير الموثر
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                this.btn.classList.add('visible');
            } else {
                this.btn.classList.remove('visible');
            }
        });

        // التمرير السلس في الرسوم المتحركة
        this.btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    },

    scrollToTop() {
  
        const currentPosition = window.scrollY;
        const startTime = performance.now();
        const duration = 500; 

        //التمرير السلس للرسوم المتحركة
        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // تسريع الحركة ألأولية
            const easeOutQuart = t => 1 - (--t) * t * t * t;

            window.scrollTo(0, currentPosition * (1 - easeOutQuart(progress)));

            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }
};

// إضافة تحميل بطيئ للصور
const ImageManager = {
    init() {
        // لكل الصور
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        // للصور
        images.forEach(img => imageObserver.observe(img));
    }
};

const loadLibraries = () => {
    if ('IntersectionObserver' in window) {
        const librariesToLoad = [
            'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
        ];

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                librariesToLoad.forEach(lib => {
                    const script = document.createElement('script');
                    script.src = lib;
                    script.defer = true;
                    document.body.appendChild(script);
                });
                observer.disconnect();
            }
        });

        observer.observe(document.querySelector('footer'));
    }
};

/**
 * نظام التعامل مع النماذج
 */
const FormManager = {
    init() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const emailBtn = document.querySelector('.email-btn');
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const contactForm = document.querySelector('#contactForm');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.dataset.tab === 'whatsapp') {
                    emailBtn.style.display = 'none';
                    whatsappBtn.style.display = 'flex';
                } else {
                    emailBtn.style.display = 'flex';
                    whatsappBtn.style.display = 'none';
                }
            });
        });

        // زر الواتساب للأنتقال
        whatsappBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const message = document.querySelector('#message').value;

            const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
            const whatsappNumber = '201234567890';

            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
        });
    }
};

/**
 * المعرض
 * شريط التمرير في المعرض
 */
const GalleryManager = {
    init() {
        this.initSlider();
        this.initPopup();
    },

    initSlider() {
        new Swiper('.gallery-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2.5 },
            }
        });
    },

    initPopup() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const backdrop = document.querySelector('.overlay-backdrop');
        const closeBtn = document.querySelector('.close-btn');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.add('active');
                backdrop.classList.add('active');
                closeBtn.classList.add('active');
            });
        });

        closeBtn?.addEventListener('click', () => {
            document.querySelector('.gallery-item.active')?.classList.remove('active');
            backdrop?.classList.remove('active');
            closeBtn.classList.remove('active');
        });
    }
};

/**
 *معالج اللغة يدعم اكثر من لغة
 */
const LanguageManager = {
    init() {
        const langBtn = document.querySelector('.lang-btn') || document.querySelector('.floating-lang-btn');
        if (!langBtn) return;

        langBtn.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            const isEnglish = currentPath.includes('holo-in-one-en');

            // الحصول على اسم الصفحة الحالية على سبيل المثال(e.g., 'about.html', 'index.html', etc.)
            const pageName = currentPath.split('/').pop();

            if (isEnglish) {
                // تحويل اللغة
                window.location.href = currentPath.replace('holo-in-one-en', 'hole-in-one-ar');
            } else {
                //تحويل اللغة
                window.location.href = currentPath.replace('hole-in-one-ar', 'holo-in-one-en');
            }
        });
    }
};

/**
 * تهيئة كافة ألأنظمة عند التحميل
 */
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    NavigationManager.init();
    AnimationManager.init();
    CursorManager.init();
    GoToTopManager.init();
    ImageManager.init();
    FormManager.init();
    GalleryManager.init();
    LanguageManager.init();

    // دعم ال AOS 
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }

    //الروابط النشطة
    handleActiveLinks();
});

const handleActiveLinks = () => {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `${currentPage}.html` || (currentPage === 'index' && href === '#')) {
            link.classList.add('active');
        }
    });
};