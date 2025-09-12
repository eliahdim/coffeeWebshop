 var total = 0;

function renderCheckoutList() {
    const checkoutList = document.querySelector('.list-group-flush');
    checkoutList.innerHTML = '';
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-custom2';
        li.textContent = `${item.name}, $${item.price}`;
        checkoutList.appendChild(li);
    });
}

document.getElementById('clearCart').addEventListener('click', function() {
    localStorage.removeItem('cartItems');
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