// --- Tailwind Configuration Script (Normally in the HTML head) ---
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                // Standardize all font utilities to EB Garamond for the consistent look
                sans: ['EB Garamond', 'serif'],
                serif: ['EB Garamond', 'serif'], 
                mono: ['EB Garamond', 'serif'], 
            },
            colors: {
                // Deep Crimson Background (Slightly darker for the main body)
                'dark-bg': '#5C0000', 
                // Darker Card Color (Subtle contrast against the background)
                'dark-card': '#4A0000',
                // Accent Color (Silver/Light Gray for contrast)
                'primary-accent': '#C0C0C0', 
                // Text and Highlight Color
                'light-text': '#F0F0F0', 
                'muted-text': '#E0E0E0', 
                'divider': '#A00000', // Slightly lighter crimson for dividers
                'gold-accent': '#F0F0F0', // Gold for highlights (used in contact)
            },
        }
    }
}


// --- Main Router and Logic Script (Normally at the end of the body) ---
// --- Router State ---
let currentPage = 'home';
const homePage = document.getElementById('home-page');
const contactPage = document.getElementById('contact-page');
const actDetailsContainer = document.getElementById('act-details-container');
const act1Detail = document.getElementById('act-1-detail');
const act2Detail = document.getElementById('act-2-detail');
const act3Detail = document.getElementById('act-3-detail');
const mainNav = document.getElementById('main-nav');
const pageTitle = document.getElementById('page-title');

// Form Elements
const form = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');
const formspreeEndpoint = "https://formspree.io/f/xzzjogqq"; // The original Formspree endpoint
const formspreeCustomKey = 'REPLACE_WITH_YOUR_FORMSPREE_CUSTOM_KEY'; 


// --- Utility: Show/Hide Modal ---
const showModal = (title, message, isSuccess = false, callback = null) => {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
    document.getElementById('custom-modal').classList.add('flex');
    // Use tailwind classes for color management
    document.getElementById('modal-title').classList.remove('text-primary-accent', 'text-gold-accent');
    document.getElementById('modal-title').classList.add(isSuccess ? 'text-gold-accent' : 'text-primary-accent');
    
    // Set up the close button action
    const closeButton = document.getElementById('custom-modal').querySelector('button');
    closeButton.onclick = () => {
        document.getElementById('custom-modal').classList.add('hidden');
        document.getElementById('custom-modal').classList.remove('flex');
        if (callback) {
            callback();
        }
    };
};

// --- Core Router Function ---
const navigateTo = (page) => {
    currentPage = page;
    window.scrollTo(0, 0); // Always scroll to top on page change

    // 1. Hide all main containers
    homePage.classList.add('hidden');
    contactPage.classList.add('hidden');
    actDetailsContainer.classList.add('hidden');
    act1Detail.classList.add('hidden');
    act2Detail.classList.add('hidden');
    act3Detail.classList.add('hidden');
    
    // 2. Update Visibility based on new page
    let newTitle = "INNER MUSIC - Sangre House Consulting";

    if (page === 'home') {
        homePage.classList.remove('hidden');
        newTitle = "INNER MUSIC - Method Overview";
    } else if (page === 'contact') {
        contactPage.classList.remove('hidden');
        newTitle = "INNER MUSIC - Booking Inquiry";
    } else if (page === 'act-1-detail') {
        actDetailsContainer.classList.remove('hidden');
        act1Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT I: ACTIVE LISTENING";
    } else if (page === 'act-2-detail') {
        actDetailsContainer.classList.remove('hidden');
        act2Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT II: INTERNAL INSTRUMENT";
    } else if (page === 'act-3-detail') {
        actDetailsContainer.classList.remove('hidden');
        act3Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT III: INTENTIONALITY";
    }

    pageTitle.textContent = newTitle;
    updateNavActiveState(page);
};

// --- Navigation Active State Handler (Simple for two main links) ---
const updateNavActiveState = (page) => {
    // Rebuild the nav links to include the current active page
    mainNav.innerHTML = `
        <a href="#" class="block ${page === 'home' || page.includes('act') ? 'text-light-text font-bold' : 'text-muted-text'} hover:text-light-text transition-colors duration-200" onclick="navigateTo('home')">Method</a>
        <a href="#" class="block ${page === 'contact' ? 'text-light-text font-bold' : 'text-muted-text'} hover:text-light-text transition-colors duration-200" onclick="navigateTo('contact')">Inquiry</a>
    `;
};

// --- Form Submission Handler (Simulated Formspree Integration) ---
const handleFormSubmission = async (event) => {
    event.preventDefault();
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Create the full message content for simulation/email body
    let messageBody = `
        <h4 style="color:#C0C0C0; font-weight:bold; font-size:1.5rem; border-bottom:1px solid #A00000; padding-bottom:5px;">Contact Details</h4>
        <ul style="list-style:none; padding:0; margin-top:10px; font-size:1.1rem;">
            <li><strong>Name:</strong> ${data['Full Name']}</li>
            <li><strong>Email:</strong> ${data['Email']}</li>
            <li><strong>Phone:</strong> ${data['Phone Number']}</li>
            <li><strong>DOB:</strong> ${data['Date of Birth']}</li>
            <li><strong>Address:</strong> ${data['Address']}</li>
        </ul>
        
        <h4 style="color:#C0C0C0; font-weight:bold; font-size:1.5rem; border-bottom:1px solid #A00000; padding-top:20px; padding-bottom:5px;">Session & Goal Details</h4>
        <ul style="list-style:none; padding:0; margin-top:10px; font-size:1.1rem;">
            <li><strong>Type:</strong> ${data['Session Type']}</li>
            <li><strong>Package:</strong> ${data['Package Type']}</li>
            <li><strong>Instrument Focus:</strong> ${data['Instrument Focus']}</li>
            <li><strong>Availability:</strong> ${data['Availability']}</li>
        </ul>
        <h4 style="color:#C0C0C0; font-weight:bold; font-size:1.5rem; border-bottom:1px solid #A00000; padding-top:20px; padding-bottom:5px;">Goal Description</h4>
        <p style="white-space:pre-wrap; font-size:1.1rem; margin-top:10px;">${data['Note/Goal Description']}</p>
    `;


    try {
        // Simulate Formspree submission
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Inner Music Inquiry from ${data['Full Name']}`,
                _cc: data['Email'], // Optionally CC the sender
                ...data, // Include original form data
                'Inquiry Details': messageBody 
            })
        });

        if (response.ok) {
            showModal('Inquiry Sent', 'Thank you for your interest in Inner Music. Your consultation inquiry has been successfully sent. We will review your details and be in touch via email within 48 hours to confirm scheduling and payment.', true, () => {
                form.reset();
                navigateTo('home');
            });
        } else {
            // This handles non-OK status codes (e.g., 400, 500) from Formspree
            const errorData = await response.json();
            const errorMessage = errorData.error ? `Server Error: ${errorData.error}` : 'An unknown error occurred while trying to send the inquiry.';
            showModal('Submission Failed', `We could not process your inquiry. Please check your network connection and try again. ${errorMessage}`, false);
        }
    } catch (error) {
        // This handles critical network errors (e.g., fetch failed)
        console.error('Submission Error:', error);
        showModal('Submission Failed', `A critical network error occurred: ${error.message}. Please try again later.`, false);
    } finally {
        submitButton.textContent = 'Send Inquiry';
        submitButton.disabled = false;
    }
};


// --- Initialization ---
window.onload = function() {
    // Set up form listener (Formspree simulation)
    form.addEventListener('submit', handleFormSubmission);
    
    // Set initial page view
    navigateTo('home'); 
}