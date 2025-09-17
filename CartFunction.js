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

function renderCartAmount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById("cart-count").innerText = totalCount;
}

onload = renderCartAmount;

function updateCartAmount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) cartCountElem.innerText = totalCount;
}

function updateProductCardAndCheckout(idx) {
    let cartArr = getCart();
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        const item = cartArr[idx];
        const product = products[item.idx];
        // Update quantity in product card
        const qtyBtn = document.querySelector(`.quantity-display[data-i='${idx}']`);
        if (qtyBtn) qtyBtn.textContent = item.quantity;
        // Update checkout list item
        const checkoutLi = document.querySelector(`.checkout-list-item[data-i='${idx}']`);
        if (checkoutLi) {
          checkoutLi.innerHTML = `<strong>${product.brand} ${product.type}</strong> x${item.quantity} - ${(product.price * item.quantity).toFixed(2)}:- <br> <small>${product.weight}, ${product.origin}</small>`;
        }
        // Update total
        let total = 0;
        cartArr.forEach((item, i) => {
          const prod = products[item.idx];
          if (prod) total += prod.price * item.quantity;
        });
        document.getElementById('totalPrice').textContent = total.toFixed(2);
        updateCartAmount();
      });
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
                  <img src="${product.image}" class="img-fluid rounded" alt="${product.brand} ${product.type}">
                </div>
                <div class="col-md-6">
                  <div class="card-body">
                    <h5 class="card-title">${product.brand} ${product.type}</h5>
                    <p class="card-text">${product.weight}, ${product.origin}</p>
                    <p class="card-text"><small class="text-body-secondary">Price ${product.price.toFixed(2)}:-</small></p>
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
            updateCartAmount();
          });
        });
        document.querySelectorAll('.minus-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const i = parseInt(this.getAttribute('data-i'));
            let cartArr = getCart();
            if (cartArr[i].quantity > 1) {
              cartArr[i].quantity--;
              setCart(cartArr);
              updateProductCardAndCheckout(i);
            }
          });
        });
        document.querySelectorAll('.plus-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const i = parseInt(this.getAttribute('data-i'));
            let cartArr = getCart();
            cartArr[i].quantity++;
            setCart(cartArr);
            updateProductCardAndCheckout(i);
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
        cartArr.forEach((item, i) => {
          const product = products[item.idx];
          if (product) {
            const li = document.createElement('li');
            li.className = 'list-group-item checkout-list-item';
            li.setAttribute('data-i', i);
            li.innerHTML = `<strong>${product.brand} ${product.type}</strong> x${item.quantity} - ${(product.price * item.quantity).toFixed(2)}:- <br> <small>${product.weight}, ${product.origin}</small>`;
            checkoutList.appendChild(li);
            total += product.price * item.quantity;
          }
        });
        document.getElementById('totalPrice').textContent = total.toFixed(2);
      });
}

document.getElementById('clearCart').addEventListener('click', function() {
    localStorage.removeItem('cart');
    renderCheckoutList();
    renderCartProductCards();
    renderCartAmount();
});

document.getElementById('Receipt').addEventListener('click', function() {
    let cartArr = getCart();
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        let lines = ['Coffee Shop Receipt', ''];
        let total = 0;
        cartArr.forEach(item => {
            const product = products[item.idx];
            if (product) {
                lines.push(`${product.brand} ${product.type} x${item.quantity} - ${(product.price * item.quantity)}:-`);
                total += product.price * item.quantity;
            }
        });
        lines.push('', `Total: ${(total).toFixed(2)}:-`, 'Thank you for your purchase!');
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'receipt.txt';
        link.click();
      });
});


renderCheckoutList();
