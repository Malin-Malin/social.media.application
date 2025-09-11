import { loginUser, registerUser } from '../api/authService.js';

const form = document.querySelector('#auth-form');
const title = document.querySelector('#form-title');
const button = document.querySelector('#submit-button');
const toggle = document.querySelector('#toggle-mode');
const message = document.querySelector('#status-message');
const nameField = document.querySelector('#name-field')

let isLoginMode = true; 

// switch between Login and Sign up
toggle.addEventListener('click', () => {
  isLoginMode = !isLoginMode;
  title.textContent = isLoginMode ? 'Login' : 'Sign up';
  button.textContent = isLoginMode ? 'Login' : 'Sign up';
  toggle.textContent = isLoginMode ? 'Sign up' : 'Back to login';
  message.textContent = '';

  if (isLoginMode) {
    nameField.classList.add('d-none');
    nameField.firstChild.required = false; //FIX_ NOT WORKING
  } else {
    nameField.classList.remove('d-none');
    nameField.firstChild.required = true;
  }
});

// send in form
form.addEventListener('submit', async (e) => {
  e.preventDefault(); //keeps it from reloading the entire page

  const formData = new FormData(form);
  /* Can I write this instead?
  const formFiels = Object.fromEntries(formData); 
  check that those are in use
  */
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    message.textContent = isLoginMode ? 'Logging in...' : 'Signing up...';

    if (isLoginMode) {
      const profile = await loginUser(email, password);
      message.textContent = `Welcome back, ${profile.name || profile.email}!`;
    } else {
      await registerUser(name, email, password);
      toggle.click();
      message.textContent = `Account created! You can now log in.`;
    }
  } catch (error) {
    message.textContent = error.message;
  }
});

//is registrer user working?
