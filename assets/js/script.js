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

// Initial Member Data (Core Team - Always Visible)
const coreMembers = [
    {
        name: "น.ส. ฟ้าใส ใจดี",
        role: "รองประธานฝ่ายวิชาการ",
        description: "มุ่งมั่นพัฒนาคุณภาพการเรียนการสอนและสนับสนุนกิจกรรมวิชาการ",
        img: "assets/images/member_vp_girl.png",
        instagram: "@faisai.academic",
        tags: ["ม.5", "วิชาการ", "เกียรตินิยม"]
    },
    {
        name: "นาย ตะวัน ยิ้มแย้ม",
        role: "หัวหน้าฝ่ายกิจกรรม",
        description: "สร้างสรรค์กิจกรรมสนุก ๆ และพัฒนาชมรมต่าง ๆ ให้น่าสนใจ",
        img: "assets/images/member_vp_boy.png",
        instagram: "@tawan.activity",
        tags: ["ม.5", "กิจกรรม", "ดนตรี"]
    },
    {
        name: "นาย ภูผา แข็งแกร่ง",
        role: "เหรัญญิก",
        description: "จัดการงบประมาณอย่างโปร่งใสและมีประสิทธิภาพ",
        img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop",
        instagram: "@phupha.finance",
        tags: ["ม.4", "การเงิน", "บัญชี"]
    },
    {
        name: "น.ส. ดาว ประดับ",
        role: "เลขานุการ",
        description: "บันทึกและประสานงานทุกกิจกรรมอย่างเป็นระบบ",
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop",
        instagram: "@dao.secretary",
        tags: ["ม.5", "ประสานงาน", "เอกสาร"]
    }
];

// Additional Members (Hidden by default)
const additionalMembers = [
    {
        name: "นาย สุริยา แสงจันทร์",
        role: "ฝ่ายประชาสัมพันธ์",
        description: "สื่อสารข่าวสารและกิจกรรมให้นักเรียนรับรู้",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        instagram: "@suriya.pr",
        tags: ["ม.4", "สื่อสาร", "โซเชียล"]
    },
    {
        name: "น.ส. มณี รัตนา",
        role: "ฝ่ายสวัสดิการ",
        description: "ดูแลสวัสดิการและความเป็นอยู่ของนักเรียน",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
        instagram: "@manee.welfare",
        tags: ["ม.5", "สวัสดิการ", "จิตอาสา"]
    },
    {
        name: "นาย ธนา วิริยะ",
        role: "ฝ่ายกีฬา",
        description: "จัดการแข่งขันกีฬาและส่งเสริมสุขภาพนักเรียน",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
        instagram: "@thana.sports",
        tags: ["ม.6", "กีฬา", "ฟุตบอล"]
    },
    {
        name: "น.ส. ปาล์ม สุขใจ",
        role: "ฝ่ายศิลปวัฒนธรรม",
        description: "อนุรักษ์และส่งเสริมศิลปะและวัฒนธรรม",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
        instagram: "@palm.culture",
        tags: ["ม.4", "ศิลปะ", "นาฏศิลป์"]
    },
    {
        name: "นาย ปฐม ก้าวหน้า",
        role: "ฝ่ายเทคโนโลยี",
        description: "พัฒนาระบบดิจิทัลและสนับสนุนด้านเทคโนโลยี",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        instagram: "@pathom.tech",
        tags: ["ม.5", "IT", "Coding"]
    },
    {
        name: "น.ส. ใบเฟิร์น สดใส",
        role: "ฝ่ายสิ่งแวดล้อม",
        description: "รณรงค์และดูแลสิ่งแวดล้อมภายในโรงเรียน",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
        instagram: "@fern.green",
        tags: ["ม.4", "สิ่งแวดล้อม", "ECO"]
    }
];

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
    const imgSrc = infoMembers.img && infoMembers.img.trim() !== ""
        ? infoMembers.img
        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    // Default description and instagram
    const description = infoMembers.description || "สมาชิกทีม Intha-NEXT";
    const instagram = infoMembers.instagram || "@intha.next_01";

    // Generate tags HTML
    const tags = infoMembers.tags || [];
    const tagsHTML = tags.length > 0
        ? `<div class="member-tags">${tags.map(tag => `<span class="member-tag">${tag}</span>`).join('')}</div>`
        : '';

    card.innerHTML = `
        <div class="team-img">
            <img src="${imgSrc}" alt="${infoMembers.name}" 
                 onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
                 loading="lazy">
        </div>
        <div class="team-info">
            <h4>${infoMembers.name}</h4>
            <span class="role">${infoMembers.role}</span>
            ${tagsHTML}
            <p class="description">${description}</p>
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
function initMembersSearchPage(container, searchInput) {
    // Clear any existing cards (safety)
    container.innerHTML = '';

    const allMembers = [...coreMembers, ...additionalMembers];

    allMembers.forEach(member => {
        window.AddCard(member, false);
    });

    const cards = Array.from(container.querySelectorAll('.team-card'));

    // Attach searchable text to each card
    cards.forEach((card, index) => {
        const member = allMembers[index];
        const searchText = [
            member.name || '',
            member.role || '',
            member.description || '',
            member.instagram || ''
        ].join(' ').toLowerCase();
        card.dataset.search = searchText;
    });

    const resultInfo = document.getElementById('member-search-result');

    const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            if (!query || card.dataset.search.includes(query)) {
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

    // Clone items for seamless loop
    const items = Array.from(carousel.children);

    // Check if we have enough items to scroll (at least a few)
    if (items.length === 0) return;

    // Clone items to ensure we have enough width for seamless scrolling
    // We clone the entire set once to create the seamless loop effect
    // corresponding with the translateX(-50%) animation
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // Accessibility
        carousel.appendChild(clone);
    });

    // Pause on hover is handled in CSS
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

