function getCart() {
    // Returns array of {idx, quantity}
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // If cart is array of indices, convert to [{idx, quantity: 1}]
    if (cart.length && typeof cart[0] === 'number') {
        cart = cart.map(idx => ({ idx, quantity: 1 }));
    }
    return cart;
}

function setCart(cartArr) {
    localStorage.setItem('cart', JSON.stringify(cartArr));
}

function renderCartProductCards() {
    const cardsContainer = document.getElementById('cart-product-cards');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    let cartArr = getCart();
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        cartArr.forEach((item, i) => {
          const product = products[item.idx];
          if (product) {
            const card = document.createElement('div');
            card.className = 'card mb-3 border-0';
            card.style.background = '#ffffff';
            card.style.boxShadow = '2px 2px 5px black';
            card.innerHTML = `
              <div class="row g-0 p-1">
                <div class="col-md-4">
                  <img src="${product.image}" class="img-fluid rounded" alt="${product.Brand} ${product.Type}">
                </div>
                <div class="col-md-6">
                  <div class="card-body">
                    <h5 class="card-title">${product.Brand} ${product.Type}</h5>
                    <p class="card-text">${product.Weight}, ${product.Origin}</p>
                    <p class="card-text"><small class="text-body-secondary">Price ${product.Price.toFixed(2)}:-</small></p>
                  </div>
                </div>
                <div class="col-md-2 d-flex flex-column justify-content-center align-items-center">
                  <button type="button" class="btn btn-primary remove-cart-item" data-i="${i}">remove</button>
                  <br>
                  <div class="btn-group" role="group" aria-label="Basic outlined example">
                    <button type="button" class="btn btn-outline-primary minus-item" data-i="${i}">-</button>
                    <button type="button" class="btn btn-outline-primary quantity-display" data-i="${i}">${item.quantity}</button>
                    <button type="button" class="btn btn-outline-primary plus-item" data-i="${i}">+</button>
                  </div>
                </div>
              </div>
            `;
            cardsContainer.appendChild(card);
          }
        });
        document.querySelectorAll('.remove-cart-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const i = parseInt(this.getAttribute('data-i'));
            let cartArr = getCart();
            cartArr.splice(i, 1);
            setCart(cartArr);
            renderCartProductCards();
            renderCheckoutList();
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            document.getElementById("cart-count").innerText = totalCount;
          });
        });
        document.querySelectorAll('.minus-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const i = parseInt(this.getAttribute('data-i'));
            let cartArr = getCart();
            if (cartArr[i].quantity > 1) {
            cartArr[i].quantity--;
            setCart(cartArr);
            renderCartProductCards();
            renderCheckoutList();
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
document.getElementById("cart-count").innerText = totalCount;
            }
          });
        });
        document.querySelectorAll('.plus-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const i = parseInt(this.getAttribute('data-i'));
            let cartArr = getCart();
            cartArr[i].quantity++;
            setCart(cartArr);
            renderCartProductCards();
            renderCheckoutList();
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            document.getElementById("cart-count").innerText = totalCount;
          });
        });
    });
}

renderCartProductCards();

function renderCheckoutList() {
    const checkoutList = document.querySelector('.list-group-flush');
    checkoutList.innerHTML = '';
    let cartArr = getCart();
    let total = 0;
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        cartArr.forEach(item => {
          const product = products[item.idx];
          if (product) {
            const li = document.createElement('li');
            li.className = 'list-group-item ';
            li.innerHTML = `<strong>${product.Brand} ${product.Type}</strong> x${item.quantity} - ${(product.Price * item.quantity).toFixed(2)}:- <br> <small>${product.Weight}, ${product.Origin}</small>`;
            checkoutList.appendChild(li);
            total += product.Price * item.quantity;
          }
        });
        document.getElementById('totalPrice').textContent = total.toFixed(2);
      });
}

document.getElementById('clearCart').addEventListener('click', function() {
    localStorage.removeItem('cart');
    renderCheckoutList();
    renderCartProductCards();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
document.getElementById("cart-count").innerText = totalCount;
});

renderCheckoutList();