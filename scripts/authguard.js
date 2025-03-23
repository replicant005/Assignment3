"use strict";

let sessionTimeout;

// Session timeout duration (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        console.warn("[SESSION] Session expired due to inactivity");
        sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }, SESSION_TIMEOUT);
}

// Event listeners for user activity
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);
document.addEventListener("click", resetSessionTimeout);

export function AuthGuard() {
    return new Promise((resolve, reject) => {
        const currentPath = location.hash.slice(1);
        const protectedRoutes = [
            "/contact-list",
            "/edit",
            "/statistics",
            "/event-planning"
        ];

        const user = sessionStorage.getItem("user");

        // If user is accessing protected route without authentication
        if (protectedRoutes.includes(currentPath) && !user) {
            console.warn(`[AUTHGUARD] Blocked unauthorized access to ${currentPath}`);
            window.dispatchEvent(new CustomEvent("sessionExpired"));
            reject();
            return;
        }

        // If user is authenticated and accessing protected route
        if (user) {
            resetSessionTimeout();
            resolve();
            return;
        }

        // For non-protected routes
        resolve();
    });
}