/* =========================================
   1. GLOBAL FUNCTIONS (For HTML onclick)
   ========================================= */

// Switch to Register View
function register() {
    const x = document.getElementById("login-form");
    const y = document.getElementById("register-form");
    const z = document.getElementById("btn");
    const toggleOptions = document.querySelectorAll('.toggle-option');

    if (x && y && z && toggleOptions.length >= 2) {
        x.style.display = "none";
        y.style.display = "block";
        z.style.left = "150px"; // Move pill right
        
        // Update text colors
        toggleOptions[0].style.color = "#888"; 
        toggleOptions[1].style.color = "white"; 
        
        // ✨ SAVE STATE: Remember "register"
        localStorage.setItem('authTab', 'register');
    }
}

// Switch to Login View
function login() {
    const x = document.getElementById("login-form");
    const y = document.getElementById("register-form");
    const z = document.getElementById("btn");
    const toggleOptions = document.querySelectorAll('.toggle-option');

    if (x && y && z && toggleOptions.length >= 2) {
        x.style.display = "block";
        y.style.display = "none";
        z.style.left = "5px"; // Move pill left
        
        // Update text colors
        toggleOptions[0].style.color = "white"; 
        toggleOptions[1].style.color = "#888"; 
        
        // ✨ SAVE STATE: Remember "login"
        localStorage.setItem('authTab', 'login');
    }
}

// Scroll Page Helper
function scrollPage(direction) {
    if (direction === 'up') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}


/* =========================================
   2. IMMEDIATE LISTENERS (Cursor & Parallax)
   ========================================= */

// Custom Cursor
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Homepage Parallax
document.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    let scrollPosition = window.pageYOffset;
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed'));
        if (speed) {
            const yPos = -scrollPosition * speed + (window.innerHeight * 0.1); 
            element.style.transform = `translateY(${yPos}px)`;
        }
    });
}, { passive: true });


/* =========================================
   3. MAIN INITIALIZATION (On Page Load)
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {

    // --- A. AUTH TAB RESTORE (THE FIX) ---
    // Only runs if we are on the Auth page
    if (document.getElementById("login-form")) {
        const savedTab = localStorage.getItem('authTab');
        
        // If memory says "register", force switch to register
        if (savedTab === 'register') {
            register(); 
        } else {
            login(); // Default to login
        }
    }


    // --- B. DARK MODE LOGIC ---
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');

    // Apply saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        if (toggle) toggle.checked = true;
    }

    // Listen for toggle clicks
    if (toggle) {
        toggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }


    // --- C. INTERACTIVE WIGGLE ICONS ---
    const wigglyItems = document.querySelectorAll('.wiggle-on-press');
    wigglyItems.forEach(item => {
        item.addEventListener('mousedown', function() {
            this.classList.add('is-wiggling');
            this.addEventListener('animationend', () => {
                this.classList.remove('is-wiggling');
            }, { once: true });
        });
    });


    // --- D. RANDOMIZE FLOATING ICONS ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function randomizeFloatingIcons() {
        const icons = document.querySelectorAll('.float-item');
        if (icons.length === 0) return;

        const numCols = 6; 
        const numRows = 3; 
        const totalCells = numCols * numRows;
        const cellWidth = 100 / numCols; 
        const cellHeight = 100 / numRows;

        let cellIndices = Array.from(Array(totalCells).keys());
        shuffleArray(cellIndices);

        icons.forEach((icon, index) => {
            if (index >= totalCells) {
                icon.style.top = `${Math.random() * 90 + 5}vh`;
                icon.style.left = `${Math.random() * 90 + 5}vw`;
            } else {
                const cellIndex = cellIndices[index];
                const row = Math.floor(cellIndex / numCols);
                const col = cellIndex % numCols;
                const baseX = col * cellWidth;
                const baseY = row * cellHeight;
                const jitterX = Math.random() * (cellWidth - 8) + 4;
                const jitterY = Math.random() * (cellHeight - 10) + 5;
                icon.style.top = `${baseY + jitterY}vh`;
                icon.style.left = `${baseX + jitterX}vw`;
            }
            const randSize = Math.random() * 25 + 15;
            const randSpeed = Math.random() * 7 + 4;
            const randDelay = Math.random() * 5;
            icon.style.fontSize = `${randSize}px`;
            icon.style.animationDelay = `${randDelay}s`;
            icon.style.setProperty('--float-speed', `${randSpeed}s`);
        });
    }
    randomizeFloatingIcons(); 


    // --- E. CUSTOM SCROLLBAR DOTS ---
    const dotsContainer = document.getElementById('scrollDots');
    const scrollUpArrow = document.getElementById('scrollUpArrow');
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    
    if (dotsContainer && scrollUpArrow && scrollDownArrow) {
        scrollUpArrow.onclick = () => scrollPage('up');
        scrollDownArrow.onclick = () => scrollPage('down');
        const pageHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        const totalDots = Math.max(3, Math.min(10, Math.ceil(pageHeight / viewportHeight)));
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('scroll-dot');
            dot.addEventListener('click', () => {
                const totalHeight = document.body.scrollHeight - window.innerHeight;
                const targetY = totalHeight > 0 ? (i / (totalDots - 1)) * totalHeight : 0;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }

        function updateScrollDots() {
            const dots = dotsContainer.querySelectorAll('.scroll-dot');
            if (dots.length === 0) return;
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight;
            const winHeight = window.innerHeight;
            if (docHeight <= winHeight) {
                const middleIndex = Math.floor(dots.length / 2);
                dots.forEach((dot, index) => dot.classList.toggle('active', index === middleIndex));
                return;
            }
            const scrollPercent = scrollTop / (docHeight - winHeight);
            let activeIndex = Math.round(scrollPercent * (totalDots - 1));
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= totalDots) activeIndex = totalDots - 1;
            dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
        }
        window.addEventListener('scroll', updateScrollDots, { passive: true });
        updateScrollDots(); 
    }


    // --- F. AUTO-DISMISS FLASH MESSAGES ---
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            alert.style.transition = "opacity 0.5s ease";
            alert.style.opacity = "0";
            setTimeout(() => alert.remove(), 500); 
        });
    }, 4000);


    // --- G. PREVENT FORM RESUBMISSION ---
    if (window.history.replaceState && (document.getElementById("login-form") || document.getElementById("register-form"))) {
        window.history.replaceState(null, null, window.location.href);
    }
});