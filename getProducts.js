fetch('getProducts.php')
  .then(response => response.json())
  .then(products => {
    const productCards = document.getElementById('product-cards');

    document.getElementById("cart-count").innerText = JSON.parse(localStorage.getItem("cart") || "[]").length;

    // Check which page is being loaded
    const isIndexPage = window.location.pathname.includes('index.html');
    const isCoffeeProductsPage = window.location.pathname.includes('coffee-products.html');

    if (isIndexPage) {
      const randomIndices = [];
      while (randomIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * products.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      const selectedProducts = randomIndices.map(index => ({ product: products[index], index }));

      selectedProducts.forEach(({ product, index }) => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
          <div class="card">
            <img src="${product.image}" class="card-img-top pt-4" alt="${product.Brand} ${product.Type}">
            <div class="card-body">
              <h4 class="card-title">${product.Brand}</h4>
              <h5 class="card-title">${product.Type}</h5>
              <p class="card-text">
                Price: ${product.Price}:-<br>
                Weight: ${product.Weight}<br>
              </p>
              <button type="button" class="btn btn-primary" onclick="addToCart(${index})">Add to cart</button>
            </div>
          </div>
        `;
        productCards.appendChild(card);
      });
    } else if (isCoffeeProductsPage) {
      // products on the coffee-products page
      products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'col-4 pt-4';
        card.innerHTML = `
          <div class="card">
            <img src="${product.image}" class="card-img-top pt-4" alt="${product.Brand} ${product.Type}">
            <div class="card-body">
              <h4 class="card-title">${product.Brand}</h4>
              <h5 class="card-title">${product.Type}</h5>
              <p class="card-text">
                Price: ${product.Price}:-<br>
                Weight: ${product.Weight}<br>
                Origin: ${product.Origin}
              </p>
              <button type="button" class="btn btn-primary" onclick="addToCart(${index})">Add to cart</button>
            </div>
          </div>
        `;
        productCards.appendChild(card);
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.getElementById("cart-count").innerText = totalCount;
      });
    }
  })

// add product to cart via localStorage
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // If cart is array of indices, convert to [{idx, quantity: 1}]
  if (cart.length && typeof cart[0] === 'number') {
    cart = cart.map(idx => ({ idx, quantity: 1 }));
  }
  // Check if product already exists in cart
  const existing = cart.find(item => item.idx === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ idx: productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Product with index ${productId} added to cart!`);
  if (document.getElementById("cart-count")) {
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}
