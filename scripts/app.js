"use strict";


import {Router} from "./router.js";
import {LoadHeader} from "./header.js";
import {LoadFooter} from "./footer.js";
import {AuthGuard} from "./authguard.js";


/**
 * app.js
 *
 * Author: Mehak Kapur
 * Date - 23/2/2025
 *
 **/

const pageTitle = {
    "/" : "Home Page",
    "/home" : "Home Page",
    "/about" : "About Page",
    "/events" : "Events Page",
    "/opportunities" : "Volunteer Opportunities",
    "/contact" : "Contact",
    "/news" : "News Page",
    "/gallery" : "Gallery",
    "/login" : "Login Page",
    "/register" : "Register",
    "/terms-of-service" : "Terms-of-Service",
    "/privacy-policy" : "Privacy Policy",
    "/statistics": "Visitor Statistics",
    "/event-planning": "Event Planning",
    "/404" : "Page Not Found"
}

const routes = {
    "/" : "views/pages/home.html",
    "/home" : "views/pages/home.html",
    "/about" : "views/pages/about.html",
    "/opportunities" : "views/pages/opportunities.html",
    "/events" : "views/pages/events.html",
    "/contact" : "views/pages/contact.html",
    "/news" : "views/pages/news.html",
    "/gallery" : "views/pages/gallery.html",
    "/login" : "views/pages/login.html",
    "/register" : "views/pages/register.html",
    "/privacy-policy" : "views/pages/privacy-policy.html",
    "/terms-of-service" : "views/pages/terms-of-service.html",
    "/statistics": "views/pages/statistics.html",
    "/event-planning": "views/pages/event-planning.html",
    "/404" : "views/pages/404.html",
};

const router  = new Router(routes);



(function () {
    function handleLogOut(event) {
        event.preventDefault();
        sessionStorage.removeItem("user");
        console.log("[INFO] User logged out. Updating UI...");
        LoadHeader().then(() => {
            CheckLogin();
            router.navigate("/");
        });
    }

    function CheckLogin() {
        console.log("[INFO] Checking user login status.");
        const loginNav = document.getElementById("login");
        const loginItem = document.getElementById("loginItem");
        const userDropdown = document.getElementById("userDropdown");
        const welcomeMessage = document.getElementById("welcomeMessage");

        if (!loginNav || !loginItem || !userDropdown || !welcomeMessage) {
            console.warn("[WARNING] One or more elements not found!");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        try {
            if (userSession) {
                const user = JSON.parse(userSession);

                // Update login/logout link
                loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
                loginNav.href = "#";
                loginNav.onclick = handleLogOut;


                    userDropdown.classList.remove("d-none");
                    userDropdown.classList.add("d-block");
                    loginItem.classList.add("d-none");



                // Update user dropdown
                loginItem.style.display = "none";
                userDropdown.style.display = "block";
                welcomeMessage.textContent = `Welcome, ${user.DisplayName}`;
            } else {
                // Update for logged-out state
                loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
                loginNav.href = "#/login";
                loginNav.onclick = null;
                userDropdown.classList.add("d-none");
                loginItem.classList.remove("d-none");

                loginItem.style.display = "block";
                userDropdown.style.display = "none";
            }
        } catch (error) {
            console.error("[ERROR] Session parsing failed:", error);
            sessionStorage.removeItem("user");
            location.reload();
        }
    }



    /**
     * Handles user login.
     * - Fetches user data from users.json
     * - Validates credentials
     * - Stores session data if successful
     * - Displays error message if login fails
     */
    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage loaded.");
        if (sessionStorage.getItem("user")) {
            router.navigate("/home");
            return;
        }

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM.");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("[DEBUG] Login button clicked!");

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                const response = await fetch("data/users.json");
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                const jsonData = await response.json();
                const users = jsonData.users;

                let success = false;
                let authenticatedUser = null;
                for (const user of users) {
                    if (user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));

                    if (messageArea) {
                        messageArea.classList.remove("alert", "alert-danger");
                        messageArea.style.display = "none";
                    }

                    await LoadHeader();
                    router.navigate("/home");
                }
                else {
                    if (messageArea) {
                        messageArea.classList.add("alert", "alert-danger");
                        messageArea.textContent = "Invalid username or password. Please try again.";
                        messageArea.style.display = "block";
                    }

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Login failed:", error);
            }
        });

        // Check if cancelButton exists before adding event listener
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", () => {
                loginForm.reset();
                router.navigate("/");
            });
        }
        else {
            console.warn("[WARNING] cancelButton or loginForm not found.");
        }
    }
    /**
     * Redirects user back to the Contact List page
     */
    function handleCancelClick() {
        router.navigate("/login");
    }


    function attachValidationListeners() {
        console.log("[INFO] attaching validation listeners...");
        Object.keys(VALIDATION_RULES).forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field) {
                console.warn(`[WARN] field '${fieldId}' not found. Skipping listeners attachment`);
                return;
            }
            // Attach event listener using a centralized validation method
            addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
        });
    }

    function validateInput(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}_error`);
        const rule = VALIDATION_RULES[fieldId];
        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rules not found for: ${fieldId}`);
            return false;
        }
        // Check if the input field is empty
        if (field.value.trim() === "") {
            errorElement.textContent = "The field is required";
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px";
            return false;
        }
        // Check if the input does not match the expected regex pattern
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = "The field is required";
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px";
            return false;
        }
        // Clear the error message if validation passes
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }
    const VALIDATION_RULES = {
        fullName: {
            // Allow for only letters and spaces
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Full name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Invalid Email address format"
        }
    };



    function addEventListenerOnce(elementId, event, handler) {
        // Retrieve the DOM element by its ID
        const element = document.getElementById(elementId);
        // Check if the element exists before attempting to modify event listeners
        if (element) {
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        }
        else {
            console.warn(`[WARNING] Element with ID '${elementId}' not found.`);
        }
    }
    /**
     * Validates the entire form by checking the validity of each input field.
     *
     * This function ensures that all required fields meet the specified validation
     * criteria before submission. If any field fails validation, the form is considered
     * invalid, and submission should be prevented.
     *
     * @returns {boolean} - Returns `true` if all fields pass validation, otherwise `false`.
     */
    function validateForm() {
        return (validateInput("fullName") && // Validate full name field
            validateInput("contactNumber") && // Validate contact number field
            validateInput("emailAddress") // Validate email address field
        );
    }


    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
        const aboutUsButton = document.getElementById("AboutUsBtn");
        if (aboutUsButton) {
            aboutUsButton.addEventListener("click", () => {
                console.log("About button clicked!");
                router.navigate("/about");
            });
        }
    }

    class Event {
        constructor(title, description, date, category) {
            this.title = title;
            this.description = description;
            this.date = new Date(date); // Convert string to Date object
            this.category = category; // e.g., 'Fundraiser', 'Workshop', 'Cleanup'
        }

        // Method to render event details in calendar grid
        render() {
            return `
            <div class="event-card" data-category="${this.category}" data-date="${this.date.toISOString()}">
                <h5 class="event-title">${this.title}</h5>
                <p class="event-description">${this.description}</p>
                <p class="event-date">${this.date.toDateString()}</p>
                <p class="event-category">${this.category}</p>
            </div>
        `;
        }
    }

    /**
     * Fetches event data from the `events.json` file and converts it into Event objects.
     * @async
     * @returns {Promise<Event[]>} A promise resolving to an array of Event objects.
     */
    async function fetchEventsData() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error('Failed to load events data');
            }
            const eventsData = await response.json();
            return eventsData.map(event => new Event(event.title, event.description, event.date, event.category));
        } catch (error) {
            console.error("[ERROR] Unable to fetch events data:", error);
            return [];
        }
    }

    /**
     * Displays the events on the page by fetching data and rendering each event.
     * @async
     * @returns {Promise<void>}
     */
    async function displayEventsPage() {
        console.log("Displaying Events Page...");

        const eventContainer = document.getElementById('event-list');
        if (!eventContainer) {
            console.error("Event container not found");
            return;
        }

        eventContainer.innerHTML = "";  // Clear previous events

        const events = await fetchEventsData();
        events.forEach(event => {
            eventContainer.innerHTML += event.render();
        });

        // Attach filter event listener
        attachFilterEventListeners();
    }



    // Updated filterByCategory to use proper parameter
    function filterByCategory(category) {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const cardCategory = card.dataset.category;
            card.style.display = (category === "All" || cardCategory === category)
                ? 'block'
                : 'none';
        });
    }

// Updated event handler attachment
    function attachFilterEventListeners() {
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', function() {
                filterByCategory(this.dataset.category);
            });
        });
    }

    /**
     * Fetch and display Oshawa news using the News API.
     * Retrieves up to 5 recent articles and updates the webpage.
     *
     * @async
     * @returns {Promise<void>}
     */
    async function DisplayNews() {
        console.log("[INFO] Fetching news articles for Oshawa...");

        const apiKey = "b14f7074148089fab941a1db5a29fd63";
        const apiUrl = `https://cors-anywhere.herokuapp.com/https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${apiKey}`;


        console.log("[DEBUG] Fetching news from:",`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${apiKey}` );

        try {
            // Adding the required headers (Origin or X-Requested-With)
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // This header is now included
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("[DEBUG] Fetched news data:", data);

            const newsContainer = document.getElementById("news-list");
            if (!newsContainer) {
                console.error("[ERROR] News container not found in the DOM");
                return;
            }

            newsContainer.innerHTML = ""; // Clear existing news

            if (data.articles.length === 0) {
                newsContainer.innerHTML = "<p>No recent news available for Oshawa.</p>";
                return;
            }

            // Debugging log to verify articles
            console.log("[DEBUG] Articles to display:", data.articles);

            // Display up to 5 news articles
            data.articles.slice(0, 5).forEach((article, index) => {
                console.log(`[DEBUG] Displaying article #${index + 1}:`, article);
                const articleElement = document.createElement("div");
                articleElement.classList.add("news-article");
                articleElement.innerHTML = `
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p>${article.description || "No description available."}</p>
                <small>Published: ${new Date(article.publishedAt).toLocaleDateString()}</small>
            `;
                newsContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error("[ERROR] Failed to fetch news data:", error);
            const newsContainer = document.getElementById("news-list");
            if (newsContainer) {
                newsContainer.innerHTML = "<p>Unable to load news at this time.</p>";
            }
        }
    }

    /**
     * loadGalleryImages()
     *
     * Fetches gallery image data from a JSON file and displays each image in the gallery container.
     * Initializes a lightbox for viewing images in full screen.
     *
     * @returns {void}
     */

    async function loadGalleryImages() {
        try {
            // Fetch the gallery data (JSON)
            const response = await fetch('data/gallery.json');
            if (!response.ok) {
                throw new Error('Failed to load gallery data');
            }

            const galleryData = await response.json();
            const galleryContainer = document.getElementById('gallery-container');

            // Loop through the images and create HTML for each image
            galleryData.images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('col-md-4', 'mb-4'); // Bootstrap grid for responsive layout

                const imageLink = document.createElement('a');
                imageLink.href = image.src; // Link to the full-size image for lightbox

                const imgElement = document.createElement('img');
                imgElement.src = image.thumbnail; // Thumbnail for preview
                imgElement.alt = image.title;
                imgElement.classList.add('img-fluid', 'rounded'); // Make image responsive

                // Append image to the link, and the link to the container
                imageLink.appendChild(imgElement);
                imageItem.appendChild(imageLink);
                galleryContainer.appendChild(imageItem);
            });

            // After images are added, initialize LightGallery
            lightGallery(document.getElementById('gallery-container'), {
                selector: 'a', // Set selector to anchor tags, since images are wrapped in <a> tags
                download: false // Disable the download button in the lightbox
            });

        } catch (error) {
            console.error('[ERROR] Failed to load gallery images:', error);
        }
    }

    /**
     * Filters events based on the user's search input.
     * @param {string} query - The search query input by the user.
     */
    function filterEvents(query) {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const description = card.querySelector('.event-description').textContent.toLowerCase();
            card.style.display = (title.includes(query) || description.includes(query))
                ? ''
                : 'none';
        });
    }


    /**
     * Represents a volunteer opportunity.
     */
    class VolunteerOpportunity {
        constructor(title, description, dateTime) {
            this.title = title;
            this.description = description;
            this.dateTime = dateTime;
        }

        // Function to render the opportunity card
        render(index) {
            return `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${this.title}</h5>
                            <p class="card-text">${this.description}</p>
                            <p class="card-text"><strong>Date & Time:</strong> ${this.dateTime}</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signupModal" data-opportunity-index="${index}">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }



    // Array to hold the volunteer opportunities
    const opportunities = [
        new VolunteerOpportunity("Beach Cleanup", "Help clean up the local beach and protect marine life.", "02/05/2025 09:00"),
        new VolunteerOpportunity("Food Bank Donation", "Assist in organizing and packing food donations for families in need.", "02/06/2025 10:00"),
        new VolunteerOpportunity("Tree Planting", "Join us to plant trees and contribute to environmental conservation.", "02/07/2025 08:30"),
    ];

    /**
     * Displays the list of volunteer opportunities on the page.
     * Populates the container with opportunity cards.
     *
     *
     */
    function displayOpportunitiesPage() {
        const opportunityContainer = document.getElementById("opportunity-cards");
        if (!opportunityContainer) return;

        let data = "";
        opportunities.forEach((opportunity, index) => {
            data += opportunity.render(index);
        });

        opportunityContainer.innerHTML = data;

        // Clean up existing listeners first
        const existingButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
        existingButtons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        // Add new listeners
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
            button.addEventListener("click", handleSignupButtonClick);
        });
    }

    /**
     * Handles the "Sign Up" button click event.
     * Opens the modal and logs the selected opportunity index.
     * @param {Event} event - The click event object.
     */
    function handleSignupButtonClick(event) {
        const opportunityIndex = event.target.getAttribute("data-opportunity-index");
        console.log(`Sign Up clicked for Opportunity Index: ${opportunityIndex}`);
    }

    /**
     * Handles form submission for signing up to an opportunity.
     * Validates input fields and displays a confirmation message.
     * @param {Event} event - The form submission event.
     */
    function handleSignupFormSubmit(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const role = document.getElementById("role").value;

        if (!name || !email || !role) {
            alert("All fields are required!");
            return;
        }

        // Get modal instance before reset
        const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));

        // Display confirmation message
        document.getElementById("confirmationMessage").style.display = "block";
        document.getElementById("signupForm").reset();

        // Close modal using proper Bootstrap methods
        if (modal) {
            modal.hide();
            // Clean up modal backdrop
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.remove();
        }

        // Remove confirmation after delay
        setTimeout(() => {
            document.getElementById("confirmationMessage").style.display = "none";
        }, 2000);
    }
    /**
     * Attach event listeners to the form.
     */
    function attachFormListeners() {
        const form = document.getElementById("signupForm");
        if (form) {
            form.addEventListener("submit", handleSignupFormSubmit);
        }
    }



    // statistics.js
    async function DisplayStatisticsPage() {
        // Auth check
        if (!sessionStorage.getItem("user")) {
            router.navigate("/login");
            return;
        }

        try {
            // Fetch data
            const response = await fetch("data/statistics.json");
            const statsData = await response.json();

            // Create charts using Chart.js's built-in class
            createVisitorChart(statsData);
            createEngagementChart(statsData);

        } catch (error) {
            console.error("Error loading statistics:", error);
        }
    }

    function createVisitorChart(data) {
        new Chart(document.getElementById("visitorChart"), {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Monthly Visitors',
                    data: data.visitors,
                    borderColor: '#4e73df',
                    tension: 0.4
                }]
            }
        });
    }

    function createEngagementChart(data) {
        new Chart(document.getElementById("engagementChart"), {
            type: 'doughnut',
            data: {
                labels: ['Events', 'Opportunities', 'News'],
                datasets: [{
                    data: data.engagement,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
                }]
            }
        });
    }

     class EventPlanner {
        constructor() {
            this.events = [];
            this.loadEvents();
        }

        async loadEvents() {
            try {
                const response = await fetch("data/events.json");
                this.events = await response.json();
                this.renderEvents();
            } catch (error) {
                console.error("Error loading events:", error);
            }
        }

        renderEvents() {
            const container = document.getElementById("eventsList");
            container.innerHTML = this.events.map(event => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5>${event.title}</h5>                        
                        <p>${event.description}</p>
                        <p>${event.category}</p>
                        <p>${event.date}
                    </div>
                </div>
            </div>
        `).join('');
        }

        validateForm(form) {
            // Add validation logic
            return form.checkValidity();
        }

        async saveEvent(eventData) {
            try {
                await fetch("data/events.json", {
                    method: 'POST',
                    body: JSON.stringify(eventData),
                    headers: { 'Content-Type': 'application/json' }
                });
                await this.loadEvents();
            } catch (error) {
                console.error("Error saving event:", error);
            }
        }
    }


    /**
     * Handle back-to-home button visibility on scroll.
     */
    function handleBackToHomeVisibility() {
        const backToHomeButton = document.getElementById("backToHome");
        window.onscroll = () => {
            if (window.scrollY > 300) {
                backToHomeButton.style.display = "block";
            } else {
                backToHomeButton.style.display = "none";
            }
        };
    }



    document.addEventListener("routeLoaded", (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
            console.warn("[WARNING] RECIVED AN INAVLID ROUTE LOADED EVENT ");
            return;
        }
        const newPath = event.detail;
        console.log(`[INFO] New Route Loaded: ${newPath}`);
        LoadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });

    window.addEventListener("sessionExpired", () => {
        console.warn("[SESSION] Redirecting to login due to inactivity.");
        router.navigate("/login");
    });

    async function handlePageLogic(path) {

        const mainContent = document.getElementById("main-content");
        if (mainContent) {
            mainContent.innerHTML = "";
        }
        document.title = pageTitle[path] || "Untitled Page";
        const protectedRoutes = ["/statistics", "/event-planning", "/contact-list", "/edit"];
        if (protectedRoutes.includes(path)) {
            AuthGuard();
        }
        switch (path) {
            case "/home":
                DisplayHomePage();
                break;
            case "/events":
                await displayEventsPage();
                filterEvents();
                filterByCategory(category);
                break;
            case "/opportunities":
                const signupModal = new bootstrap.Modal(document.getElementById("signupModal"));
                displayOpportunitiesPage();
                attachFormListeners();
                handleBackToHomeVisibility();
                break;
            case "/news":
                try {
                    await DisplayNews(); // Awaiting the asynchronous call
                    console.log("[DEBUG] News articles fetched and displayed successfully.");
                } catch (error) {
                    console.error("[ERROR] Failed to fetch or display news articles:", error);
                }
                break;
            case "/gallery":
                try {
                    await loadGalleryImages(); // Awaiting the asynchronous call
                } catch (error) {
                    console.error("[ERROR] Failed to load gallery images:", error);
                }
                break;
            case "/statistics":
                await DisplayStatisticsPage();
                break;
            case "/event-planning":
                const planner = new EventPlanner();
                document.getElementById("eventForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    if (planner.validateForm(e.target)) {
                        const formData = new FormData(e.target);
                        planner.saveEvent(Object.fromEntries(formData));
                    }
                });
                break;

            case "/contact":
                attachValidationListeners();
                break;
            case "/login":
                DisplayLoginPage();
                CheckLogin();
                break;
            default:
                console.error(`[WARNING] No page logic matching for path: ${path}`);
        }
    }
    async function start() {
        console.log("Start App...");
        console.log(`Current document title is ${document.title}`);
        // Load header first, then run CheckLogin after
        await LoadHeader();
        await LoadFooter();
        AuthGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
        await handlePageLogic(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM is fully loaded and parsed");
        start();
    });
})();