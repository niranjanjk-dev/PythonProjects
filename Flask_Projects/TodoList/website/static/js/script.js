/* =========================================
   1. CUSTOM CURSOR LOGIC
   ========================================= */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener("mousemove", function (e) {
    if (!cursorDot || !cursorOutline) return;
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});


/* =========================================
   2. AUTH PAGE TOGGLE LOGIC
   ========================================= */
const x = document.getElementById("login-form");
const y = document.getElementById("register-form");
const z = document.getElementById("btn");
const toggleOptions = document.querySelectorAll('.toggle-option');

function register() {
    if (x && y && z && toggleOptions.length > 0) {
        x.style.display = "none";
        y.style.display = "block";
        z.style.left = "150px"; 
    }
}

function login() {
    if (x && y && z && toggleOptions.length > 0) {
        x.style.display = "block";
        y.style.display = "none";
        z.style.left = "5px"; 
    }
}

/* =========================================
   3. DARK MODE & ALL OTHER INITIALIZERS
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');

    // --- PART 1: APPLY THEME ON EVERY PAGE LOAD ---
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        if (toggle) { 
            toggle.checked = true;
        }
    }

    // --- PART 2: LISTEN FOR CLICKS (Profile Page Only) ---
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

    // --- AUTH TOGGLE (Set default state) ---
    if(toggleOptions.length > 0 && z){
        login(); 
    }
    
    // --- INTERACTIVE FLOATING ICONS (Wiggle) ---
    const wigglyItems = document.querySelectorAll('.wiggle-on-press');

    wigglyItems.forEach(item => {
        item.addEventListener('mousedown', function() {
            this.classList.add('is-wiggling');
            this.addEventListener('animationend', () => {
                this.classList.remove('is-wiggling');
            }, { once: true });
        });
    });

    // --- RANDOMIZE ICON POSITIONS (No Clustering) ---
    
    // Helper function to shuffle an array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function randomizeFloatingIcons() {
        const icons = document.querySelectorAll('.float-item');
        const numIcons = icons.length;

        // 1. Create a grid system
        const numCols = 6;
        const numRows = 3;
        const totalCells = numCols * numRows; // 18 cells
        const cellWidth = 100 / numCols;
        const cellHeight = 100 / numRows;

        // 2. Create and shuffle the list of cell indexes
        let cellIndices = Array.from(Array(totalCells).keys()); // [0, 1, 2, ... 17]
        shuffleArray(cellIndices);

        icons.forEach((icon, index) => {
            if (index >= totalCells) return; // Failsafe if you add more icons than cells

            // 3. Pick a unique, shuffled cell for this icon
            const cellIndex = cellIndices[index];
            const row = Math.floor(cellIndex / numCols);
            const col = cellIndex % numCols;

            // 4. Calculate the base position of the cell
            const baseX = col * cellWidth;
            const baseY = row * cellHeight;

            // 5. Add "jitter" (a random offset *within* the cell)
            const jitterX = Math.random() * (cellWidth - 8) + 4; // Jitter between 4% and (width-4)%
            const jitterY = Math.random() * (cellHeight - 10) + 5; // Jitter between 5% and (height-5)%

            const finalTop = baseY + jitterY;
            const finalLeft = baseX + jitterX;

            // 6. Apply random size, speed, and delays
            const randSize = Math.random() * 25 + 15; // 15px to 40px
            const randSpeed = Math.random() * 7 + 4; // 4s to 11s duration
            const randDelay = Math.random() * 5; // 0s to 5s delay

            // 7. Apply all styles to the icon
            icon.style.top = `${finalTop}vh`;
            icon.style.left = `${finalLeft}vw`;
            icon.style.fontSize = `${randSize}px`;
            icon.style.animationDelay = `${randDelay}s`;
            icon.style.setProperty('--float-speed', `${randSpeed}s`);
        });
    }

    // Run the new function on page load
    randomizeFloatingIcons();


    // --- ✨ CUSTOM DOT SCROLLBAR LOGIC ✨ ---
    const dotsContainer = document.getElementById('scrollDots');
    const scrollUpArrow = document.getElementById('scrollUpArrow');
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    
    // Check if the scrollbar elements exist on this page
    if (dotsContainer && scrollUpArrow && scrollDownArrow) {
        
        // Link arrows to the function
        scrollUpArrow.onclick = () => scrollPage('up');
        scrollDownArrow.onclick = () => scrollPage('down');

        // --- DYNAMIC DOTS LOGIC ---
        const pageHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate how many "screens" high the page is
        // Math.max(3, ...) ensures a minimum of 3 dots
        // Math.min(10, ...) ensures a maximum of 10 dots
        // Math.ceil rounds up (e.g., 2.3 screens = 3 dots)
        const totalDots = Math.max(3, Math.min(10, Math.ceil(pageHeight / viewportHeight)));
        
        // **FIX 1: Create Dots ALWAYS (Moved out of 'if' block)**
        // This ensures dots appear even on short pages.
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
                dot.classList.add('scroll-dot');
                
                dot.addEventListener('click', () => {
                    const totalHeight = document.body.scrollHeight - window.innerHeight;
                    const targetY = (i / (totalDots - 1)) * totalHeight; 
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                });
            
            dotsContainer.appendChild(dot);
        }

        // Only add scroll listener if the page is actually scrollable
        if (pageHeight > viewportHeight) {
            // Listen for scroll events
            window.addEventListener('scroll', updateScrollDots, { passive: true });
        }
        // --- END DYNAMIC DOTS ---

        // Update Active Dot on Scroll
        function updateScrollDots() {
            const dots = dotsContainer.querySelectorAll('.scroll-dot');
            if (dots.length === 0) return;

            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight;
            const winHeight = window.innerHeight;
            
            // --- FIX: Highlight MIDDLE dot on short pages ---
            if (docHeight <= winHeight) {
                // Find the middle index
                const middleIndex = Math.floor(dots.length / 2);

                dots.forEach((dot, index) => {
                    // Toggle 'active' class based on middle index
                    dot.classList.toggle('active', index === middleIndex);
                });
                return;
            }
            // --- END FIX ---

            const scrollPercent = scrollTop / (docHeight - winHeight);
            let activeIndex = Math.round(scrollPercent * (totalDots - 1));
            
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= totalDots) activeIndex = totalDots - 1;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }


        // Listen for scroll events
        window.addEventListener('scroll', updateScrollDots, { passive: true });
        
        // Run once on load to set the initial state
        updateScrollDots();
    }
    // --- END OF MOVED SCROLLBAR LOGIC ---

});


/* =========================================
   4. HOMEPAGE PARALLAX SCROLL
   ========================================= */
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
});

/* =========================================
   5. INTERACTIVE FLOATING ICONS (DELETED)
   ========================================= */
/* This section is now empty because its logic was
   merged into Section 3's "DOMContentLoaded" listener.
*/

/* =========================================
   6. CUSTOM DOT SCROLLBAR LOGIC (MOVED)
   ========================================= */

// 1. Scroll Arrow Click Functionality
function scrollPage(direction) {
    // **FIX 2: Changed to scroll to absolute top/bottom**
    if (direction === 'up') {
        // Scroll to the very top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Scroll to the very bottom of the page
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}

// 2. Generate Dots & Handle Active State
/* THIS SECTION IS NOW EMPTY. 
   Its logic was moved into the listener in Section 3
   to fix the bug.
*/

// --- ✨ FLASH MESSAGE AUTO-DISMISS ✨ ---
    // Automatically fades out alerts after 4 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            // 1. Start the fade out transition
            alert.style.transition = "opacity 0.5s ease";
            alert.style.opacity = "0";
            
            // 2. Completely remove the element from the HTML after the fade finishes (0.5s)
            setTimeout(() => alert.remove(), 500); 
        });
    }, 4000); // 4000ms = 4 seconds delay before fading starts


// --- ✨ PREVENT FORM RESUBMISSION ON REFRESH (Auth Page Only) ✨ ---
// We check if the 'login-form' OR 'register-form' element exists to confirm we are on the Auth page
if (document.getElementById("login-form") || document.getElementById("register-form")) {
    // This stops the browser from asking to resubmit the form when you hit F5
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}