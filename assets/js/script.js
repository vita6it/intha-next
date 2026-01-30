// ===================================================
// INTHA-NEXT Modern Interactive JavaScript
// Enhanced animations and interactive effects
// ===================================================

// Prevent double initialization
if (window.inthaNextInitialized) {
    console.warn('Intha-NEXT: Already initialized');
} else {
    window.inthaNextInitialized = true;

    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Initialize all modules
            initRevealAnimations();
            initSmoothScrolling();
            initHeaderEffects();
            initStatsCounter();
            initMobileMenu();
            initMemberCards();
            initInteractiveEffects();
            initScrollIndicator();
            initActiveNavigation();
            initImageLoading();
            initInfiniteCarousel(); // Add infinite carousel logic
            initHeroSlider(); // Add hero slider logic

            // Mark body as loaded for CSS animations
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');

            console.log('Intha-NEXT: Initialized successfully');
        } catch (error) {
            console.error('Intha-NEXT: Initialization error', error);
        }
    });
}

// ===================================================
// SCROLL INDICATOR
// ===================================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide scroll indicator on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ===================================================
// REVEAL ANIMATIONS ON SCROLL
// ===================================================
function initRevealAnimations() {
    // Select all reveal variations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    // Use IntersectionObserver for better performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Fallback for older browsers
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
    }
}

// ===================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================================
function initSmoothScrolling() {
    // Handle smooth scroll for same-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement);
            }
        });
    });

    // Handle cross-page hash links (e.g., index.html#about)
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && href.includes('#') && !href.startsWith('#')) {
            anchor.addEventListener('click', function (e) {
                const [page, hash] = href.split('#');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';

                // If same page, smooth scroll
                if (page === currentPage || page === '' || (page === 'index.html' && currentPage === '')) {
                    e.preventDefault();
                    const targetElement = document.querySelector('#' + hash);
                    if (targetElement) {
                        scrollToElement(targetElement);
                    }
                }
            });
        }
    });

    // Handle initial hash in URL
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                scrollToElement(targetElement);
            }
        }, 100);
    }
}

function scrollToElement(element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ===================================================
// HEADER SCROLL EFFECTS
// ===================================================
function initHeaderEffects() {
    const header = document.querySelector('header');
    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
        const scrollY = window.scrollY;

        // Add scrolled class for styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ===================================================
// ACTIVE NAVIGATION STATE
// ===================================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active from all links
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                });

                // Add active to matching links
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && (href === `#${id}` || href === `index.html#${id}` || href.endsWith(`#${id}`))) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Set initial active state based on URL hash or first section
    const hash = window.location.hash;
    if (hash) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith(hash)) {
                link.classList.add('nav-active');
            }
        });
    } else {
        // Check if on members page
        if (window.location.pathname.includes('members')) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === 'members.html') {
                    link.classList.add('nav-active');
                }
            });
        }
    }
}

// ===================================================
// STATS COUNTER ANIMATION
// ===================================================
function initStatsCounter() {
    const statElements = document.querySelectorAll('.stat-value[data-value]');
    if (!statElements.length) return;

    const animateStat = (el) => {
        const targetValue = parseInt(el.getAttribute('data-value'), 10);
        if (isNaN(targetValue) || targetValue <= 0) return;

        const originalText = (el.textContent || '').trim();
        const prefixMatch = originalText.match(/^\D*/);
        const suffixMatch = originalText.match(/\D*$/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const suffix = suffixMatch ? suffixMatch[0] : '';

        let startTimestamp = null;
        const duration = 1500; // ms

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * targetValue);

            el.textContent = `${prefix}${currentValue.toLocaleString('th-TH')}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30% 0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statElements.forEach(el => observer.observe(el));
}

// ===================================================
// MOBILE / TOGGLE TAB MENU
// ===================================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');

    if (!menuToggle || !mobileMenu || !backdrop) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const toggleMenu = () => {
        const isActive = mobileMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close when clicking on backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close when clicking on any mobile link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Ensure menu is reset on resize to desktop
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    }, 150));

    // ---------------------------------------------------
    // Touch swipe gestures (mobile) - slide tab in/out
    // ---------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const SWIPE_THRESHOLD = 60; // min horizontal distance (px)
    const VERTICAL_TOLERANCE = 40; // ignore mostly-vertical swipes

    const onTouchStart = (e) => {
        if (window.innerWidth > 1024 || !e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
    };

    const onTouchMove = (e) => {
        if (window.innerWidth > 1024 || !e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
    };

    const onTouchEnd = () => {
        if (window.innerWidth > 1024) return;

        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchEndY - touchStartY);

        // ignore if mostly vertical movement
        if (deltaY > VERTICAL_TOLERANCE) return;

        const menuIsOpen = mobileMenu.classList.contains('active');

        // Swipe from right edge to left to OPEN menu
        if (!menuIsOpen) {
            const startedNearRightEdge = touchStartX > window.innerWidth * 0.7;
            if (startedNearRightEdge && deltaX > SWIPE_THRESHOLD) {
                openMenu();
            }
            return;
        }

        // Swipe from left to right to CLOSE menu
        if (menuIsOpen && deltaX < -SWIPE_THRESHOLD) {
            closeMenu();
        }
    };

    // Attach swipe listeners (passive so we don't block scroll)
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
}

// ===================================================
// INTERACTIVE EFFECTS
// ===================================================
function initInteractiveEffects() {
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 0;
                height: 0;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out forwards;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Card tilt effect on hover (subtle 3D)
    const cards = document.querySelectorAll('.policy-card, .team-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Parallax effect removed as per user request to fix slider stability
}

// ===================================================
// MEMBER CARDS FUNCTIONALITY
// ===================================================

const coreMembers = [
    {
        name: "นางสาวกมลทิพย์ คำเมือง",
        nickname: "บ๋อมแบ๋ม",
        img: "",
        instagram: "faisai.academic",
        tags: ["รองประธานคนที่ 1", "4/13"]
    },
    {
        name: "นายภาณุพงศ์ นาใจคง",
        nickname: "ปลื้ม",

        img: "assets/images/SSW_IMAGE/carousel-card/IMG_5740.PNG",
        instagram: "pn_pg09",
        tags: ["รองประธานคนที่ 2", "4/5"]
    },
    {
        name: "นางสาวขวัญชนก ธัญญะประกอบ",
        nickname: "อิ้งค์",
        img: "assets/images/SSW_IMAGE/carousel-card/Screenshot_20260130_101313_Gallery.jpg",
        instagram: "phupha.finance",
        tags: ["รองประธานคนที่ 3", "4/13"]
    },
    {
        name: "นางสาวปวริศา บุตเพ็ง",
        nickname: "ซีน",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_2254.JPG",
        instagram: "dao.secretary",
        tags: ["รองประธานคนที่ 4", "4/13"]
    },
    {
        name: "นางสาวกัญญาณัท ภาวะโน",
        nickname: "แก้ว",

        img: "assets/images/SSW_IMAGE/carousel-card/cute1.PNG",
        instagram: "kxny4i",
        tags: ["คณะกรรมการ", "4/1", "น่ารักที่สุด"]
    },
    {
        name: "นางสาวธงศิริยา รัตนวิชา",
        nickname: "อุ๋งอิ๋ง",

        img: "assets/images/SSW_IMAGE/carousel-card/IMG_1249.JPG",
        instagram: "ab00utug",
        tags: ["คณะกรรมการ", "4/14"]
    },
    {
        name: "นางสาววลัยพรรณ จันทร์คำ",
        nickname: "มิ้น",

        img: "assets/images/SSW_IMAGE/carousel-card/DSC09776_Original.JPG",
        instagram: "meowmin_.t",
        tags: ["คณะกรรมการ", "4/13"]
    },
    {
        name: "นางสาวกัญญ์ณณัฐ ภาวะโน",
        nickname: "แก้ม",

        img: "assets/images/SSW_IMAGE/carousel-card/IMG_4293.JPG",
        instagram: "kann4.ii",
        tags: ["คณะกรรมการ", "4/1"]
    },
    {
        name: "นางสาวปรียดา พารี",
        nickname: "โอปอ",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_0048.JPG",
        instagram: "_priyada.09",
        tags: ["คณะกรรมการ", "4/2"]
    },
    {
        name: "นายสิทธิชัย ศรีบัวรินทร์",
        nickname: "แน็กกี้",
        img: "assets/images/SSW_IMAGE/carousel-card/5E442E96-FE9D-48BD-B16D-1CF73003752E.png",
        instagram: "naekkyhahaha",
        tags: ["คณะกรรมการ", "4/9"]
    },
    {
        name: "นางสาวศุภากร นามวงค์",
        nickname: "น้ำเหนือ",
        img: "",
        instagram: "apriltwentyfourr.r",
        tags: ["คณะกรรมการ", "4/13"]
    },
    {
        name: "นางสาวอุทุมพร แก้วผาบ",
        nickname: "ออม",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_20260123_225728.jpg",
        instagram: "sparks.mppp",
        tags: ["คณะกรรมการ", "4/9"]
    },

    {
        name: "นางสาวทองดี กองศรีเกษ",
        nickname: "ปูเป้",
        img: "assets/images/SSW_IMAGE/carousel-card/MEITU_20260122_202651311.jpg",
        instagram: "_itsoflife27_",
        tags: ["คณะกรรมการ", "4/3"]
    },

    {
        name: "นางสาวภาณิชา สวดสม",
        nickname: "เฟิร์ส",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_1708.JPG",
        instagram: "first__ps",
        tags: ["คณะกรรมการ", "4/5"]
    },

    {
        name: "นางสาวกัญญาลักษณ์ สายสุนา",
        nickname: "มีนา",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_2618.PNG",
        instagram: "kanyalak._24",
        tags: ["คณะกรรมการ", "4/2"]
    },

    {
        name: "นางสาววรรณ​ภรณ์ ​พิมพ์​สารี​",
        nickname: "นุ่มนิ่ม",
        img: "assets/images/SSW_IMAGE/carousel-card/ไม่มีชื่อ 408_20260122162613.png",
        instagram: "kansirinon",
        tags: ["คณะกรรมการ", "4/6"]
    },

    {
        name: "นางสาวชญานี โยธี",
        nickname: "แจมมี่",
        img: "assets/images/SSW_IMAGE/carousel-card/1.jpg",
        instagram: "jemmy_cn._.03",
        tags: ["คณะกรรมการ", "4/6"]
    },

    {
        name: "นางสาวธัญรัตน์ หาทอน",
        nickname: "อันดา",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_4199.JPG",
        instagram: "shabu_nah",
        tags: ["คณะกรรมการ", "4/2"]
    },

    {
        name: "นายชลทรัพย์ เกษทองมา",
        nickname: "นน",
        img: "assets/images/SSW_IMAGE/carousel-card/Boy3.jpg",
        instagram: "chocolate18x",
        tags: ["คณะกรรมการ", "4/9"]
    },

    {
        name: "นายอภิรุจ มณีสวาท",
        nickname: "แชมป์",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_20260122_160458_545.webp",
        instagram: "ap.mn_ch.am",
        tags: ["คณะกรรมการ", "4/15"]
    },

    {
        name: "นางสาวณัฐชา พรมวงค์",
        nickname: "อ๋อมแอ๋ม",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_2536.JPG",
        instagram: "natcha_09__",
        tags: ["คณะกรรมการ", "4/2"]
    },

    {
        name: "นางสาวธัญรัตน์ ตาคำนิล",
        nickname: "แพรว",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_0038.JPG",
        instagram: "21prxew._",
        tags: ["คณะกรรมการ", "4/2"]
    },

    {
        name: "นางสาวพิชญาดา ละคร",
        nickname: "พิซซ่า",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_5779.JPG",
        instagram: "phitchayada3._",
        tags: ["คณะกรรมการ", "4/3"]
    },

    {
        name: "นายพลพัฒน์ น้อยอ่อนโพธิ์",
        nickname: "เตอร์",
        img: "assets/images/SSW_IMAGE/carousel-card/Boy1.JPG",
        instagram: "pn8tevil",
        tags: ["คณะกรรมการ", "4/5"]
    },

    {
        name: "นายธนาธิป พลซา",
        nickname: "เกิ้ล",
        img: "assets/images/SSW_IMAGE/carousel-card/Boy2.jpg",
        instagram: "kappkp",
        tags: ["คณะกรรมการ", "4/15"]
    },

    {
        name: "นายกิตติชัย นามทอง",
        nickname: "โฟม",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_5757.JPG",
        instagram: "kn19_foam",
        tags: ["คณะกรรมการ", "4/5"]
    },

    {
        name: "นายกิตติภพ จันทร์โยธา",
        nickname: "ฟีโน่",
        img: "assets/images/SSW_IMAGE/carousel-card/IMG_4510.JPG",
        instagram: "k1tt1p0p",
        tags: ["คณะกรรมการ", "4/13"]
    },

    {
        name: "นางสาวพิชญ์นรี บุตะเขียว",
        nickname: "เพ้นท์",
        img: "assets/images/SSW_IMAGE/carousel-card/lv_0_20260123211910.jpg",
        instagram: "pxin_tx",
        tags: ["คณะกรรมการ", "4/13"]
    },
];

// Additional Members (Empty for now as all displayed in core)
const additionalMembers = [];

let isShowingAll = false;

// Function to Add Card (Public function)
window.AddCard = function (infoMembers, isAdditional = false) {
    const container = document.getElementById('members-container');
    if (!container) return;

    // Create Card Elements
    const card = document.createElement('div');
    card.className = isAdditional
        ? "team-card reveal active additional-member"
        : "team-card reveal active";

    // Add entrance animation for new cards
    if (isAdditional) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }

    // Default image if none provided
    let imgSrc = infoMembers.img || '';

    // Sanitize path
    imgSrc = imgSrc.trim();
    if (imgSrc.includes('\\')) {
        imgSrc = imgSrc.replace(/\\/g, '/');
    }

    if (!imgSrc) {
        imgSrc = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    // Default description and instagram
    const description = infoMembers.description || "สมาชิกทีม Intha-NEXT";
    const instagram = infoMembers.instagram || "@intha.next_01";

    // Generate tags HTML
    const tags = infoMembers.tags || [];
    const tagsHTML = tags.length > 0
        ? `<div class="member-tags">${tags.map(tag => `<span class="member-tag">${tag}</span>`).join('')}</div>`
        : '';

    // Nickname formatting
    const nicknameHTML = infoMembers.nickname
        ? `<br><span style="display:block; font-size:0.85em; opacity:0.8; font-weight:500; margin-top:4px;">( ${infoMembers.nickname} )</span>`
        : '';

    card.innerHTML = `
        <div class="team-img">
            <img src="${imgSrc}" alt="${infoMembers.name}" 
                 onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
                 loading="lazy">
        </div>
        <div class="team-info">
            <h4>${infoMembers.name}${nicknameHTML}</h4>
            ${tagsHTML}
            <a href="https://instagram.com/${instagram.replace('@', '')}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="instagram-btn">
                <i class="fa-brands fa-instagram"></i>
                <span>${instagram}</span>
            </a>
        </div>
    `;

    container.appendChild(card);

    // Re-initialize card effects for the new card
    initCardTiltEffect(card);
};

// Initialize card tilt effect for a specific card
function initCardTiltEffect(card) {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// Initialize Members on Load
function initMemberCards() {
    const membersContainer = document.getElementById('members-container');

    // If there is no members container on this page, do nothing
    if (!membersContainer) return;

    // Dedicated /members page (has search bar)
    const searchInput = document.getElementById('member-search-input');
    if (searchInput) {
        initMembersSearchPage(membersContainer, searchInput);
        return;
    }

    // Home page members preview
    coreMembers.forEach(member => window.AddCard(member, false));

    updateMemberCount();

    const viewAllBtn = document.getElementById('btn-view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', toggleAllMembers);
    }
}

function toggleAllMembers() {
    const viewAllBtn = document.getElementById('btn-view-all');
    const additionalCards = document.querySelectorAll('.additional-member');

    if (!isShowingAll) {
        // Show all members with staggered animation
        additionalMembers.forEach((member, index) => {
            setTimeout(() => {
                window.AddCard(member, true);
            }, index * 100);
        });

        viewAllBtn.innerHTML = '<i class="fa-solid fa-users-slash"></i><span>ซ่อนสมาชิกเพิ่มเติม</span>';
        isShowingAll = true;
    } else {
        // Hide additional members with animation
        additionalCards.forEach((card, index) => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => card.remove(), 300);
        });

        viewAllBtn.innerHTML = '<i class="fa-solid fa-users"></i><span>ดูสมาชิกทั้งหมด</span>';
        isShowingAll = false;
    }

    // Delay count update for add animation
    setTimeout(updateMemberCount, isShowingAll ? additionalMembers.length * 100 : 300);
}

function updateMemberCount() {
    const countElement = document.getElementById('member-count');
    const totalMembers = coreMembers.length + additionalMembers.length + 1; // +1 for leader
    const currentShowing = isShowingAll ? totalMembers : coreMembers.length + 1;

    if (countElement) {
        // Animate the counter
        animateCounter(countElement, currentShowing, totalMembers);
    }
}

// ===================================================
// MEMBERS SEARCH PAGE
// ===================================================
// ===================================================
// MEMBERS SEARCH PAGE
// ===================================================
function initMembersSearchPage(container, searchInput) {
    // Always clear container to sync with JS data
    container.innerHTML = '';

    const allMembers = [...coreMembers, ...additionalMembers];

    allMembers.forEach(member => {
        window.AddCard(member, false);
    });

    const cards = Array.from(container.querySelectorAll('.team-card'));
    const resultInfo = document.getElementById('member-search-result');

    // Attach searchable text to each card
    cards.forEach((card, index) => {
        const member = allMembers[index];
        const searchText = [
            member.name || '',
            member.nickname || '',
            (member.tags || []).join(' '),
            member.description || '',
            member.instagram || ''
        ].join(' ').toLowerCase();
        card.dataset.search = searchText;
    });

    const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const searchData = (card.dataset.search || card.innerText).toLowerCase();
            if (!query || searchData.includes(query)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (resultInfo) {
            if (!query) {
                resultInfo.textContent = `แสดงสมาชิกทั้งหมด ${cards.length} คน`;
            } else if (visibleCount === 0) {
                resultInfo.textContent = `ไม่พบสมาชิกที่ตรงกับ "${searchInput.value}"`;
            } else {
                resultInfo.textContent = `พบสมาชิก ${visibleCount} คน ที่ตรงกับ "${searchInput.value}"`;
            }
        }
    };

    const debouncedSearch = debounce(handleSearch, 100);
    searchInput.addEventListener('input', debouncedSearch);

    // Initial text
    handleSearch();
}

function animateCounter(element, current, total) {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = '0';

    setTimeout(() => {
        element.textContent = `แสดง ${current} จาก ${total} คน`;
        element.style.opacity = '1';
    }, 150);
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================================
// IMAGE LOADING HANDLER
// ===================================================
function initImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        // Add loaded class when image loads
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                this.classList.add('loaded');
            });

            // Handle error - set fallback
            img.addEventListener('error', function () {
                if (!this.dataset.errorHandled) {
                    this.dataset.errorHandled = 'true';
                    // Use a simple placeholder if onerror isn't already set
                    if (!this.onerror) {
                        this.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
                    }
                }
            });
        }
    });

    // Also handle eager loaded images
    const eagerImages = document.querySelectorAll('img[loading="eager"], img:not([loading])');
    eagerImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                this.classList.add('loaded');
            });
        }
    });
}

// ===================================================
// PERFORMANCE: Lazy load check on scroll
// ===================================================
function checkLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    lazyImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 200;

        if (isVisible && img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
    });
}

// ===================================================
// ERROR BOUNDARY
// ===================================================
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Intha-NEXT Error:', {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    return false;
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function (event) {
    console.error('Intha-NEXT Unhandled Promise Rejection:', event.reason);
});

// ===================================================
// INFINITE CAROUSEL
// ===================================================
function initInfiniteCarousel() {
    const carousel = document.getElementById('members-carousel');
    if (!carousel) return;

    // Clear existing content to populate from data
    carousel.innerHTML = '';

    // Combine members
    const allMembers = [...coreMembers, ...(typeof additionalMembers !== 'undefined' ? additionalMembers : [])];

    if (allMembers.length === 0) return;

    // Populate carousel
    allMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'carousel-card';

        const img = document.createElement('img');
        let imgSrc = member.img || '';

        // Sanitize path
        imgSrc = imgSrc.trim();
        if (imgSrc.includes('\\')) {
            imgSrc = imgSrc.replace(/\\/g, '/');
        }

        // Set Source
        if (imgSrc) {
            img.src = imgSrc;
        } else {
            img.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        }

        img.alt = member.name || 'Member';
        // Use eager loading for carousel to ensure images are ready before scrolling starts
        img.loading = 'eager';

        // Error handling
        img.onerror = function () {
            // Prevent infinite loop if fallback fails
            if (!this.getAttribute('data-error')) {
                this.setAttribute('data-error', 'true');
                console.warn('Intha-NEXT: Image load failed for', imgSrc);
                this.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            }
        };

        card.appendChild(img);
        carousel.appendChild(card);
    });

    // Clone items for seamless loop
    const items = Array.from(carousel.children);

    if (items.length === 0) return;

    // Clone items to ensure we have enough width for seamless scrolling
    // We clone the entire set once to create the seamless loop effect
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // Accessibility
        carousel.appendChild(clone);
    });

    // Determine animation duration based on number of items
    // More items = longer duration to keep speed consistent
    const duration = items.length * 5; // 5s per item approx
    carousel.style.animationDuration = `${Math.max(20, duration)}s`;
}


// ===================================================
// HERO SLIDER FUNCTIONALITY
// ===================================================
function initHeroSlider() {
    const container = document.querySelector('.hero-slider-container');
    const wrapper = document.querySelector('.hero-slider-wrapper');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    if (!wrapper || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to update slider UI
    function updateSlider() {
        // Move wrapper
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navigation functions
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe Left -> Next
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe Right -> Prev
        }
    }
}

