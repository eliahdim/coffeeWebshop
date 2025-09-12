// Fetch products from the JSON file
let product1 = Math.floor(Math.random()*6);
let product2 = Math.floor(Math.random()*6);
let product3 = Math.floor(Math.random()*6);



console.log(product1);

fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productCards = document.getElementById('product-cards');

    // Choose the 3 products you want to display
    const selectedProducts = [
      products[product1], // Zoegas
      products[product2], // Löfbergs
      products[product3]  // Illy
    ];

    selectedProducts.forEach(product => {
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
            <button type="button" class="btn btn-primary" onclick="addToCart()">Buy Now</button>
          </div>
        </div>
      `;
      productCards.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

  console.log("Products loaded successfully");

  function addToCart() {
    document.cookie = "product="
    alert("Product added to cart!");
  }
