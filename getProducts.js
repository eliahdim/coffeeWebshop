fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productCards = document.getElementById('product-cards');

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
                Price: ${product.Price.toFixed(2)}:-<br>
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
                Price: ${product.Price.toFixed(2)}:-<br>
                Weight: ${product.Weight}<br>
                Origin: ${product.Origin}
              </p>
              <button type="button" class="btn btn-primary" onclick="addToCart(${index})">Add to cart</button>
            </div>
          </div>
        `;
        productCards.appendChild(card);
        document.getElementById("cart-count").innerText = JSON.parse(localStorage.getItem("cart") || "[]").length;
      });
    }
  })
  .catch(error => console.error('Error fetching products:', error));

// add product to cart via localStorage
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Product with index ${productId} added to cart!`);
  document.getElementById("cart-count").innerText = JSON.parse(localStorage.getItem("cart") || "[]").length;
}
