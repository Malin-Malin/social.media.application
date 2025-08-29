import { login } from "../api.js";
import { showModal, closeModal } from "../components/modal.js";

const submitButton = document.querySelector("#submit");
const userInfo = document.querySelector("#user-info");

submitButton.addEventListener("click", async () => {
    const formData = new FormData(userInfo);
    const email = formData.get("email");
    const password = formData.get("password");
    let result = null;
    try {
        showModal("Logging in...", "info", "Please wait", null, false);
        if (!email || !password) {
            throw new Error("Please fill in all fields");
        }
        result = await login(email,password);
    
    } catch (error) {
        closeModal();
        showModal(error.message, "error", "Failed to login", null, true);
        return;
    }
    if (result) {
        closeModal();
        showModal("Login successful!", "welcome", "Welcome back " + localStorage.getItem("name"), () => {
            window.location.href = "/index.html";
        });
    }
});

userInfo.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});