fetch('getProducts.php')
.then(response => response.json())
.then(products => {
    console.log('Fetched products:', products);
    
    const container = document.getElementById('product-container') || document.body;
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.style.cssText = `
        border: 1px solid #ccc; 
        margin: 10px; 
        padding: 15px; 
        border-radius: 5px;
        display: inline-block;
        width: 250px;
      `;
        
        card.innerHTML = `
        <h3>${product.brand}</h3>
        <h4>${product.type}</h4>
        <p>Price: ${product.price}:-</p>
        <p>Weight: ${product.weight}g</p>
        <p>Origin: ${product.origin}</p>
        <img src="${product.image}" style="width: 100px; height: auto;" alt="${product.brand}">
        <br><br>
      `;
        
        container.appendChild(card);
    });
})
.catch(error => {
    console.error('Error fetching products:', error);
    document.body.innerHTML = '<p style="color: red;">Error loading products. Check console for details.</p>';
});