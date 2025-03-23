"use strict";
import { LoadHeader } from "./header.js";

export class Router {
    routes;
    currentScript = null;
    currentModal = null;
    previousMainContent = null;

    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            this.loadRoute(path);
        });

        window.addEventListener("popstate", () => {
            this.cleanupPreviousRoute();
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path) {
        this.cleanupPreviousRoute();
        location.hash = path;
    }

    async loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);
        const basePath = path.split("#")[0];

        if (!this.routes[basePath]) {
            console.warn(`[WARNING] Route not found: ${basePath}`);
            return this.navigate("/404");
        }

        try {
            // Store previous content for cleanup
            this.previousMainContent = document.querySelector("main")?.innerHTML;

            // Load HTML content
            const response = await fetch(this.routes[basePath]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            // Update main element
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = html;

                // Load associated JavaScript
                await this.loadRouteScript(basePath);

                // Update header and fire event
                await LoadHeader();
                document.dispatchEvent(new CustomEvent("routeLoaded", {
                    detail: basePath
                }));
            }
        } catch (error) {
            console.error("[ERROR] Route loading failed:", error);
            this.navigate("/404");
        }
    }

    async loadRouteScript(path) {
        // Remove previous script
        if (this.currentScript) {
            document.body.removeChild(this.currentScript);
            this.currentScript = null;
        }

        // Create new script element
        const scriptPath = `js/${path.slice(1)}.js`;
        try {
            const script = document.createElement("script");
            script.type = "module";
            script.src = scriptPath;
            document.body.appendChild(script);
            this.currentScript = script;
        } catch (error) {
            console.error(`[ERROR] Failed to load script for ${path}:`, error);
        }
    }

    cleanupPreviousRoute() {
        // Cleanup modals and backdrop
        if (this.currentModal) {
            const modal = bootstrap.Modal.getInstance(this.currentModal);
            if (modal) {
                modal.hide();
                modal.dispose();
            }

            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.remove();

            this.currentModal = null;
        }

        // Clear event listeners from previous content
        if (this.previousMainContent) {
            const mainElement = document.querySelector("main");
            if (mainElement) {
                // Remove all event listeners by cloning
                const newMain = mainElement.cloneNode(false);
                newMain.innerHTML = "";
                mainElement.parentNode.replaceChild(newMain, mainElement);
            }
        }

        // Cleanup form submissions
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.reset();
            const confirmationMessages = form.querySelectorAll("[id^='confirmation']");
            confirmationMessages.forEach(msg => msg.style.display = "none");
        });
    }
}