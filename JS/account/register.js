import { registerUser } from "../api.js";
import { showModal, closeModal } from "../components/modal.js";

const submitButton = document.querySelector("#submit");
const userInfo = document.querySelector("#user-info");

submitButton.addEventListener("click", async () => {
    const formData = new FormData(userInfo);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    
    let result = null;
    try {
        showModal("Creating account...", "info", "Creating account", null, false);
        if (!name || !email || !password) {
            throw new Error("Please fill in all fields");
        }
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (!email.includes("@")) {
            throw new Error("Please enter a valid email address");
        }
        
        result = await registerUser(name,email,password);
        closeModal();
    } catch (error) {
        closeModal();
        showModal(error.message, "error", "Error");
    }
    
    if (result) {
        showModal("Account created","welcome","Welcome",() => window.location.href = "/account/login.html");
    }
});

userInfo.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});