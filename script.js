// --- Router State and Elements (Must be available to the global `MapsTo` function) ---
const homePage = document.getElementById('home-page');
const contactPage = document.getElementById('contact-page');
const actDetailsContainer = document.getElementById('act-details-container');
const mainContentWrapper = document.getElementById('main-content-wrapper');

// Detail page elements (can be null before DOMContentLoaded, but we check their existence)
const act1Detail = document.getElementById('act-1-detail');
const act2Detail = document.getElementById('act-2-detail');
const act3Detail = document.getElementById('act-3-detail');
const mainNav = document.getElementById('main-nav');
const pageTitle = document.querySelector('title'); // Use querySelector('title') for the page title tag

// Form and Modal Elements (Initialized in DOMContentLoaded)
let form;
let submitButton;
let modal;
let modalTitle;
let modalMessage;
let modalCloseButton;

// Formspree setup (Replace with your actual endpoint)
const formspreeEndpoint = "https://formspree.io/f/xzzjogqq";


// --- Utility: Show/Hide Modal ---
const showModal = (title, message, isSuccess = false, callback = null) => {
    // Check if modal elements exist before trying to update them
    if (!modal || !modalTitle || !modalMessage || !modalCloseButton) return;
    
    modalTitle.textContent = title;
    modalMessage.innerHTML = message;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Use tailwind classes for color management
    modalTitle.classList.remove('text-primary-accent', 'text-gold-accent');
    modalTitle.classList.add(isSuccess ? 'text-gold-accent' : 'text-primary-accent');
    
    // Set up the close button action
    modalCloseButton.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (callback) {
            callback();
        }
    };
};


// --- Navigation Active State Handler (Simple for two main links) ---
const updateNavActiveState = (page) => {
    // Note: The navigation buttons use onclick directly in the HTML and do not need
    // to be dynamically rebuilt unless you want to add an 'active' style.
    // Since the HTML already uses `onclick="navigateTo('page-id')"` this function 
    // is simplified to manage a theoretical 'active' visual state on the buttons if needed.
    // For now, we rely on the direct onclick in the HTML for navigation.
    
    // We can hide/show the Contact button logic here if needed, but the original HTML is static.
};


// --- Core Router Function (Exposed to the global scope via `window` or default definition) ---
window.navigateTo = (page) => {
    // 1. Hide all main containers
    const pagesToHide = [homePage, contactPage, actDetailsContainer, act1Detail, act2Detail, act3Detail].filter(Boolean);
    pagesToHide.forEach(el => el.classList.add('hidden'));

    let newTitle = "INNER MUSIC - Sangre House Consulting";
    let targetPage = page;
    
    // If navigating via the header click, targetPage is 'home'
    if (page === 'home') {
        targetPage = 'home-page'; 
    }
    // If navigating from the nav bar 'Book Session'
    if (page === 'contact-page') {
        targetPage = 'contact-page';
    }


    // 2. Update Visibility based on new page
    if (targetPage === 'home-page') {
        homePage.classList.remove('hidden');
        newTitle = "INNER MUSIC - Method Overview";
    } else if (targetPage === 'contact-page') {
        contactPage.classList.remove('hidden');
        newTitle = "INNER MUSIC - Booking Inquiry";
    } else if (targetPage === 'act-1-detail' && actDetailsContainer && act1Detail) {
        actDetailsContainer.classList.remove('hidden');
        act1Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT I: ACTIVE LISTENING";
    } else if (targetPage === 'act-2-detail' && actDetailsContainer && act2Detail) {
        actDetailsContainer.classList.remove('hidden');
        act2Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT II: INTERNAL INSTRUMENT";
    } else if (targetPage === 'act-3-detail' && actDetailsContainer && act3Detail) {
        actDetailsContainer.classList.remove('hidden');
        act3Detail.classList.remove('hidden');
        newTitle = "INNER MUSIC - ACT III: INTENTIONALITY";
    } else {
        // Fallback to home if page ID is unrecognized (e.g., from header click)
        homePage.classList.remove('hidden');
    }

    // 3. Update title and scroll
    if (pageTitle) {
        pageTitle.textContent = newTitle;
    }
    
    if (mainContentWrapper) {
        mainContentWrapper.scrollIntoView({ behavior: 'smooth' }); // Scroll to the content area
    }
    
    updateNavActiveState(targetPage);
};


// --- Form Submission Handler (Simulated Formspree Integration) ---
const handleFormSubmission = async (event) => {
    event.preventDefault();

    if (!form || !submitButton) return;

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
        // Formspree submission (Ensure this is set up correctly in a real environment)
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Inner Music Inquiry from ${data['Full Name']}`,
                _cc: data['Email'],
                ...data,
                'Inquiry Details': messageBody 
            })
        });

        if (response.ok) {
            showModal('INQUIRY SENT', 'Thank you! Your inquiry has been successfully sent. We will review your details and be in touch via email within 48 hours to confirm scheduling and payment.', true, () => {
                form.reset();
                navigateTo('home-page'); // Navigate back to the main page
            });
        } else {
            // Handle Formspree-specific error response
            const errorText = await response.text();
            showModal('SUBMISSION FAILED', `We could not process your inquiry. Server status: ${response.status}. Error details: ${errorText.substring(0, 100)}`, false);
        }
    } catch (error) {
        // Handle critical network error
        console.error('Submission Error:', error);
        showModal('SUBMISSION FAILED', `A critical network error occurred: ${error.message}. Please check your connection and try again later.`, false);
    } finally {
        submitButton.textContent = 'Send Inquiry';
        submitButton.disabled = false;
    }
};


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements used by the modal/form handler
    form = document.getElementById('contact-form');
    submitButton = document.getElementById('submit-button');
    modal = document.getElementById('custom-modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalCloseButton = document.getElementById('modal-close-button');

    // Set up form listener (Formspree simulation)
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Set initial page view to ensure 'home-page' is visible on load
    navigateTo('home-page'); 
});