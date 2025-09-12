// Fetch products from the JSON file
let product1 = Math.floor(Math.random() * 6);
let product2 = Math.floor(Math.random() * 6);
let product3 = Math.floor(Math.random() * 6);

console.log(product1, product2, product3);

fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productCards = document.getElementById('product-cards');

    // Choose the 3 products you want to display
    const selectedProducts = [
      { product: products[product1], index: product1 },
      { product: products[product2], index: product2 },
      { product: products[product3], index: product3 }
    ];

    selectedProducts.forEach(({ product, index }) => {
      // Create a card for each selected product
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
  })
  .catch(error => console.error('Error fetching products:', error));

console.log("Products loaded successfully");

// Function to add product index to localStorage
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Product with index ${productId} added to cart!`);
}
