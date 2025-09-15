var total = 0;

function renderCheckoutList() {
    const checkoutList = document.querySelector('.list-group-flush');
    checkoutList.innerHTML = '';
    const cartIndices = JSON.parse(localStorage.getItem('cart') || '[]');
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        cartIndices.forEach(idx => {
          const product = products[idx];
          if (product) {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-custom2';
            li.innerHTML = `<strong>${product.Brand} ${product.Type}</strong> - $${product.Price} <br> <small>${product.Weight}, ${product.Origin}</small>`;
            checkoutList.appendChild(li);
          }
        });
      });
}

document.getElementById('clearCart').addEventListener('click', function() {
    localStorage.removeItem('cart');
    renderCheckoutList();
});



document.getElementById('addTestItem').addEventListener('click', function() {
    const testItem = { name: 'Test Coffee', price: '9.99' };
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(testItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCheckoutList();
});

renderCheckoutList();