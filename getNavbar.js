function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) cartCountElem.innerText = totalCount;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    // Reload the navbar to show the updated state
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = '';
        loadNavbar();
    }
    // Redirect to home page
    window.location.href = 'index.html';
}

function loadNavbar() {
const navbarShow = document.getElementById('navbar-container');

// Check if user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const userEmail = localStorage.getItem('userEmail');

// Create login/user section based on login status
let loginSection = '';
if (isLoggedIn && userEmail) {
    loginSection = `
        <ul class="navbar-item me-3">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${userEmail}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                </ul>
            </li>
        </ul>
    `;
} else {
    loginSection = `
        <ul class="navbar-item me-3">
            <li class="nav-item pt-3">
                <a class="nav-link active" aria-current="page" href="login.html">Login</a>
            </li>
        </ul>
    `;
}

const navbar = document.createElement('div');
        navbar.className = '';
        navbar.innerHTML = `
          <nav class="navbar navbar-expand-lg bg-custom border-bottom border-2 border-dark shadow p-3 mb-5 bg-body-tertiary fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">
            <img src="images/logo.png" alt="Coffee Shop Logo" height="40">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html">Home</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Products
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="coffee-products.html">Coffee</a></li>
                  <li><a class="dropdown-item" href="extras.html">Extras</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About Us</a>
              </li>
                <li class="nav-item">
                    <a class="nav-link" href="contact.html">Contact</a>
            </ul>
            ${loginSection}
            <ul class="navbar-nav">
                <li class="nav-item pt-3">
                    <p id="cart-count" style="color: rgb(255, 255, 255);">Cart Count</p>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="cart.html" style="color: black;">
                    <i class="fa-solid fa-cart-shopping"></i>
                  </a>
                </li>
            </ul>
          </div>
        </div>
      </nav>
        `;
        navbarShow.appendChild(navbar);
        updateCartCount();
}
document.addEventListener('DOMContentLoaded', loadNavbar);

function renderCartAmount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById("cart-count").innerText = totalCount;
}

onload = renderCartAmount;