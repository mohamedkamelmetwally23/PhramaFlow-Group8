// Imports
import { getUsersData } from '../api/signinApi.js';
import showNotification from '../utils/notification.js';

// State
let users = [];
let valid = 0;

// Elements
let email = document.getElementById('emailInput');
let pass = document.getElementById('passInput');
let check = document.getElementById('check-me');
let signinbtn = document.getElementById('sign-in');

// get users data
getUsersData().then((data) => {
  users = data.data;
});

// Genrate random token
function generateToken(userId) {
  const payload = `${userId}:${Date.now()}:${Math.random()}`;
  return btoa(payload);
}

// Set cokkie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

// validating and sign in
signinbtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (email.validity.typeMismatch) {
    showNotification('error', 'Please enter a valid Email Address');
    return;
  }

  if (email.validity.valueMissing) {
    showNotification('error', 'Please enter Email Address');
    return;
  }

  if (pass.validity.valueMissing) {
    showNotification('error', 'Please enter Password');
    return;
  }

  const foundUser = users.find(
    (person) => person.email === email.value && person.password === pass.value,
  );

  if (foundUser) {
    valid = 1;
    showNotification(
      'success',
      `Welcome on board ${foundUser.role} ${foundUser.name}`,
    );

    const userData = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };

    localStorage.setItem('loggedInUser', JSON.stringify(userData));

    const token = generateToken(foundUser.id);
    setCookie('authToken', token, 2);

    if (check.checked) {
      setCookie('authToken', token, 7);
    }

    setTimeout(() => {
      window.location.href = './views/dashboard.html';
    }, 1500);
  } else {
    showNotification('error', 'Please enter valid Email and Password');
  }
});
