/*
author - mehak kapur
date - 26th jan 2025

 */

"use strict";

// Assuming you're working within the context of the page that includes this JS
(function () {
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
        if (!opportunityContainer) {
            console.error("Opportunity container not found");
            return;
        }
        let data = "";

        opportunities.forEach((opportunity, index) => {
            data += opportunity.render(index);
        });

        opportunityContainer.innerHTML = data;

        // Add event listeners to Sign Up buttons
        const signupButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
        signupButtons.forEach((button) => {
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

        // Display confirmation message
        document.getElementById("confirmationMessage").style.display = "block";
        document.getElementById("signupForm").reset();

        // Close the modal after a delay
        // Close the modal after a delay
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById("signupModal"));
            if (modal){modal.hide();}

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

    /**
     * Initialize the opportunities page and form.
     */
    function start() {
        displayOpportunitiesPage();
        attachFormListeners();
        handleBackToHomeVisibility();
    }

    // Run the initialization function
    window.addEventListener("load", start);
})();