// Fetch products from the JSON file
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productCards = document.getElementById('product-cards');

    // Choose the 3 products you want to display
    const selectedProducts = [
      products[0], // Zoegas
      products[2], // Löfbergs
      products[5]  // Illy
    ];

    selectedProducts.forEach(product => {
      // Create a card for each selected product
      const card = document.createElement('div');
      card.className = 'col';
      card.innerHTML = `
        <div class="card" style="width: 18rem;">
          <img src="${product.image}" class="card-img-top" alt="${product.Brand} ${product.Type}">
          <div class="card-body">
            <h5 class="card-title">${product.Brand} - ${product.Type}</h5>
            <p class="card-text">
              Price: ${product.Price.toFixed(2)}:-<br>
              Weight: ${product.Weight}<br>
              Origin: ${product.Origin}
            </p>
            <a href="#" class="btn btn-primary">Buy Now</a>
          </div>
        </div>
      `;
      productCards.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching products:', error));