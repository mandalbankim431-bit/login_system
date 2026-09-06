const API_URL = "http://127.0.0.1:8001";


// ===============================
// SHOW SIGNUP
// ===============================

document.getElementById("showSignup").addEventListener("click", () => {

    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");

    document.getElementById("loginMessage").textContent = "";
});


// ===============================
// SHOW LOGIN
// ===============================

document.getElementById("showLogin").addEventListener("click", () => {

    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");

    document.getElementById("signupMessage").textContent = "";
});


// ===============================
// SIGNUP
// ===============================

document.getElementById("signupForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const message = document.getElementById("signupMessage");

    try {

        const response = await fetch(`${API_URL}/auth/signup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.detail || "Signup failed";

            return;
        }

        message.textContent = "Account created successfully!";

        document.getElementById("signupForm").reset();

        setTimeout(() => {

            document.getElementById("signupForm").classList.add("hidden");
            document.getElementById("loginForm").classList.remove("hidden");

        }, 1000);

    } catch (error) {

        message.textContent = "Backend is not running.";

        console.error(error);
    }

});


// ===============================
// LOGIN
// ===============================

document.getElementById("loginForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.detail || "Login failed";

            return;
        }

        // Save JWT
        localStorage.setItem("access_token", data.access_token);

        message.textContent = "Login successful!";

        console.log("JWT Token:", data.access_token);

        // Open dashboard
        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 500);

    } catch (error) {

        message.textContent = "Backend is not running.";

        console.error(error);
    }

});