// Admin Panel JavaScript
let currentProductId = null;

// Check admin access on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
});

function checkAdminAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    
    if (!isLoggedIn || userType !== 'admin') {
        document.getElementById('access-denied').style.display = 'block';
        document.getElementById('admin-content').style.display = 'none';
        return;
    }
    
    document.getElementById('access-denied').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    
    // Load products when admin content is shown
    loadProducts();
}

// Add Product Form Handler
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    addProduct();
});

function addProduct() {
    const formData = new FormData(document.getElementById('add-product-form'));
    const productData = {
        action: 'add_product',
        user_type: localStorage.getItem('userType'),
        brand: formData.get('brand'),
        type: formData.get('type'),
        price: parseFloat(formData.get('price')),
        weight: parseInt(formData.get('weight')),
        origin: formData.get('origin'),
        image: formData.get('image')
    };

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset();
            loadProducts(); // Refresh the products list
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the product.');
    });
}

function loadProducts() {
    const loadingDiv = document.getElementById('products-loading');
    const containerDiv = document.getElementById('products-container');
    
    loadingDiv.style.display = 'block';
    containerDiv.innerHTML = '';

    const requestData = {
        action: 'get_products',
        user_type: localStorage.getItem('userType')
    };

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        loadingDiv.style.display = 'none';
        
        if (data.success) {
            displayProducts(data.products);
        } else {
            containerDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading products: ${data.message}
                </div>
            `;
        }
    })
    .catch(error => {
        loadingDiv.style.display = 'none';
        console.error('Error:', error);
        containerDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                An error occurred while loading products.
            </div>
        `;
    });
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle me-2"></i>
                No products found. Add your first product using the "Add Product" tab.
            </div>
        `;
        return;
    }

    let html = '<div class="row">';
    
    products.forEach(product => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-img-top-container" style="height: 200px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                        <img src="${product.image}" alt="${product.brand} ${product.type}" 
                             style="max-height: 100%; max-width: 100%; object-fit: contain;"
                             onerror="this.src='images/logo.png'">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.brand} ${product.type}</h5>
                        <p class="card-text">
                            <strong>Price:</strong> ${product.price} SEK<br>
                            <strong>Weight:</strong> ${product.weight}g<br>
                            <strong>Origin:</strong> ${product.origin}
                        </p>
                        <div class="mt-auto">
                            <div class="btn-group w-100" role="group">
                                <button type="button" class="btn btn-outline-primary btn-sm" 
                                        onclick="editProduct(${product.id})">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm" 
                                        onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function editProduct(productId) {
    currentProductId = productId;
    
    // Find the product data
    const requestData = {
        action: 'get_products',
        user_type: localStorage.getItem('userType')
    };

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const product = data.products.find(p => p.id == productId);
            if (product) {
                // Populate the edit form
                document.getElementById('edit-product-id').value = product.id;
                document.getElementById('edit-brand').value = product.brand;
                document.getElementById('edit-type').value = product.type;
                document.getElementById('edit-price').value = product.price;
                document.getElementById('edit-weight').value = product.weight;
                document.getElementById('edit-origin').value = product.origin;
                document.getElementById('edit-image').value = product.image;
                
                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
                modal.show();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading product data.');
    });
}

function updateProduct() {
    const formData = new FormData(document.getElementById('edit-product-form'));
    const productData = {
        action: 'update_product',
        user_type: localStorage.getItem('userType'),
        id: parseInt(formData.get('id')),
        brand: formData.get('brand'),
        type: formData.get('type'),
        price: parseFloat(formData.get('price')),
        weight: parseInt(formData.get('weight')),
        origin: formData.get('origin'),
        image: formData.get('image')
    };

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product updated successfully!');
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();
            // Refresh the products list
            loadProducts();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the product.');
    });
}

function deleteProduct(productId) {
    currentProductId = productId;
    
    // Show the confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
}

function confirmDelete() {
    if (!currentProductId) return;

    const requestData = {
        action: 'delete_product',
        user_type: localStorage.getItem('userType'),
        id: currentProductId
    };

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product deleted successfully!');
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
            modal.hide();
            // Refresh the products list
            loadProducts();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the product.');
    });
    
    currentProductId = null;
}
