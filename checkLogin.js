function checkLogin() {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;

    if (email == '' || password == '') {
        alert("Please fill in all fields");
        return;
    }
    else if (email == 'admin@admin.com' && password == 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin.html';
    }

}

// New login function for regular users
function login() {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;

    if (email == '' || password == '') {
        alert("Please fill in all fields");
        return false;
    }
    
    // Send login request to PHP authentication endpoint
    fetch('auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Login successful
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userType', data.user.user_type);
            localStorage.setItem('userId', data.user.id);
            
            // Redirect based on user type
            if (data.user.user_type === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'coffee-products.html';
            }
        } else {
            // Login failed
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
    });
    
    return false; // Prevent form submission
}
