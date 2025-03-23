// author - mehak kapur
// date - 28th jan 2025
"use strict";

// Event class to store event details
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

    const eventContainer = document.getElementById('event-list')
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

/**
 * Filters displayed events based on the selected category.
 * @param {string} category - The category to filter events by ('All' for no filter).
 */
function filterEvents(category) {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        if (category === "All" || card.getAttribute('data-category') === category) {
            card.style.display = "block"; // Show matching event
        } else {
            card.style.display = "none"; // Hide non-matching event
        }
    });
}

/**
 * Attaches click event listeners to filter buttons to filter events by category.
 */
function attachFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterEvents(category);
        });
    });
}

/**
 * Initializes the events page by fetching and displaying events.
 */
function start() {
    console.log("Starting Events Page...");
    displayEventsPage();
}

// Call start function when the page loads
window.addEventListener("load", start);