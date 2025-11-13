document.addEventListener("DOMContentLoaded", function() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with a slight delay (smooth animation)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
});


// --- AUTH PAGE TOGGLE LOGIC ---
const x = document.getElementById("login-form");
const y = document.getElementById("register-form");
const z = document.getElementById("btn");
const toggleOptions = document.querySelectorAll('.toggle-option');

function register() {
    x.style.display = "none";
    y.style.display = "block";
    
    // CHANGED: Slide distance is now 150px because the box is wider
    z.style.left = "150px"; 
    
    toggleOptions[0].style.color = "#888";
    toggleOptions[1].style.color = "white";
}

function login() {
    x.style.display = "block";
    y.style.display = "none";
    
    z.style.left = "5px"; 
    
    toggleOptions[0].style.color = "white";
    toggleOptions[1].style.color = "#888";
}

document.addEventListener("DOMContentLoaded", function() {
    if(toggleOptions.length > 0){
        toggleOptions[0].style.color = "white";
    }
});


// --- DARK MODE LOGIC ---
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // 1. Check if user previously selected dark mode
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        if(toggle) toggle.checked = true;
    }

    // 2. Listen for toggle click
    if(toggle) {
        toggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark'); // Save preference
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light'); // Save preference
            }
        });
    }
});