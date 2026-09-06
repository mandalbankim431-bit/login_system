const API_URL = "http://127.0.0.1:8001";

const token = localStorage.getItem("access_token");


// ===============================
// CHECK LOGIN
// ===============================

if (!token) {
    window.location.href = "index.html";
}


// ===============================
// GET CURRENT USER
// ===============================

async function getUser() {

    try {

        const response = await fetch(`${API_URL}/me`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            localStorage.removeItem("access_token");

            window.location.href = "index.html";

            return;
        }

        document.getElementById("userInfo").innerHTML = `
            <h2>Welcome, ${data.name} 👋</h2>

            <p style="margin-top: 15px;">
                Email: ${data.email}
            </p>

            <p style="margin-top: 10px;">
                User ID: ${data.id}
            </p>
        `;

    } catch (error) {

        document.getElementById("userInfo").innerHTML =
            "<p>Unable to connect to backend.</p>";

        console.error(error);
    }
}


// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("access_token");

    window.location.href = "index.html";

});


getUser();