// --- Router State and Elements (Must be available to the global `MapsTo` function) ---
const homePage = document.getElementById('home-page');
const contactPage = document.getElementById('contact-page');
const actDetailsContainer = document.getElementById('act-details-container');

// Detail page elements
const act1Detail = document.getElementById('act-1-detail');
const act2Detail = document.getElementById('act-2-detail');
const act3Detail = document.getElementById('act-3-detail');
const pageTitle = document.querySelector('title'); 

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

/**
 * Shows the custom modal.
 * @param {string} title - The title for the modal.
 * @param {string} message - The message content for the modal (can contain HTML).
 * @param {boolean} isSuccess - Determines the title color (true = gold, false = accent).
 * @param {Function} callback - Function to run after the modal is closed.
 */
const showModal = (title, message, isSuccess = false, callback = null) => {
    // Check if modal elements exist before trying to update them
    if (!modal || !modalTitle || !modalMessage || !modalCloseButton) {
        console.error("Modal elements not found.");
        return;
    }
    
    modalTitle.textContent = title;
    modalMessage.innerHTML = message;
    
    // Remove the custom hiding class
    modal.classList.remove('modal-hidden');
    // Ensure it displays as a flex container (as defined in style.css)
    modal.style.display = 'flex'; 
    
    // Set up the close button action
    modalCloseButton.onclick = () => {
        modal.classList.add('modal-hidden');
        modal.style.display = 'none'; // Explicitly hide
        if (callback) {
            callback();
        }
    };

    // Attach listener to overlay to close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('modal-hidden');
            modal.style.display = 'none';
        }
    };
};


// --- Utility: Page Hiding Logic ---

/**
 * Hides all main content containers.
 */
const hideAllPages = () => {
    const allContainers = [
        homePage, 
        contactPage, 
        actDetailsContainer, 
        act1Detail, 
        act2Detail, 
        act3Detail
    ].filter(Boolean);

    allContainers.forEach(el => {
        el.classList.add('page-hidden');
        el.classList.remove('page-visible');
    });
};


// --- Core Router Function (Exposed to the global scope) ---

/**
 * Navigates to a specified page/section ID, updating visibility and title.
 * @param {string} page - The ID of the page/section to display (e.g., 'home-page', 'contact-page', 'act-1-detail').
 */
window.navigateTo = (page) => {
    hideAllPages();

    let newTitle = "INNER MUSIC - Sangre House Consulting";
    let targetPage = page === 'home' ? 'home-page' : page; // Handle header click alias

    // Logic to show main pages
    if (targetPage === 'home-page' && homePage) {
        homePage.classList.remove('page-hidden');
        homePage.classList.add('page-visible');
        newTitle = "INNER MUSIC - Method Overview";

    } else if (targetPage === 'contact-page' && contactPage) {
        contactPage.classList.remove('page-hidden');
        contactPage.classList.add('page-visible');
        newTitle = "INNER MUSIC - Booking Inquiry";

    } else if (targetPage.includes('act-') && actDetailsContainer) {
        // Logic for Act Detail pages
        actDetailsContainer.classList.remove('page-hidden');
        actDetailsContainer.classList.add('page-visible');
        
        let detailElement = null;
        let detailName = "";

        if (targetPage === 'act-1-detail' && act1Detail) {
            detailElement = act1Detail;
            detailName = "ACT I: ACTIVE LISTENING";
        } else if (targetPage === 'act-2-detail' && act2Detail) {
            detailElement = act2Detail;
            detailName = "ACT II: INTERNAL INSTRUMENT";
        } else if (targetPage === 'act-3-detail' && act3Detail) {
            detailElement = act3Detail;
            detailName = "ACT III: INTENTIONALITY";
        }

        if (detailElement) {
            detailElement.classList.remove('page-hidden');
            detailElement.classList.add('page-visible');
            newTitle = `INNER MUSIC - ${detailName}`;
        }
    }
    
    // 3. Update title and scroll
    if (pageTitle) {
        pageTitle.textContent = newTitle;
    }
    
    // Scroll to the top of the content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


// --- Form Submission Handler (Formspree Integration) ---
const handleFormSubmission = async (event) => {
    event.preventDefault();

    if (!form || !submitButton) return;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Log data for debugging/simulated email content construction
    console.log("Attempting submission with data:", data);

    try {
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Inner Music Inquiry from ${data['Full Name']}`,
                _replyto: data['Email'], // Use _replyto for easy email reply
                ...data
            })
        });

        if (response.ok) {
            showModal('INQUIRY SENT', 'Thank you! Your inquiry has been successfully sent. We will review your details and be in touch via email within 48 hours to confirm scheduling and payment.', true, () => {
                form.reset();
                navigateTo('home-page'); // Navigate back to the main page
            });
        } else {
            // Handle Formspree error response (e.g., rate limiting, bad data)
            const errorData = await response.json();
            const errorMessage = errorData.error || `Server status: ${response.status}.`;
            showModal('SUBMISSION FAILED', `We could not process your inquiry. Error: ${errorMessage}`, false);
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
    // --- 1. Initialize Global/DOM Elements ---
    form = document.getElementById('contact-form');
    submitButton = document.getElementById('submit-button');
    modal = document.getElementById('custom-modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalCloseButton = document.getElementById('modal-close-button');

    // --- 2. Set up form listener ---
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // --- 3. Set initial page view ---
    // Check for a deep link (e.g., #contact-page) or default to 'home-page'
    const initialPage = window.location.hash.substring(1) || 'home-page';
    navigateTo(initialPage);
});