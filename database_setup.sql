-- MariaDB Setup for CoffeeShop
-- Run the SQL commands as a MariaDB administrator (sudo mysql)

-- Create the database
CREATE DATABASE IF NOT EXISTS CoffeeShop;

-- Create user
-- Replace 'YOUR_SECURE_PASSWORD_HERE' with the actual password you want to use
CREATE USER IF NOT EXISTS 'Coffee'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD_HERE';

GRANT ALL PRIVILEGES ON CoffeeShop.* TO 'Coffee'@'localhost';

FLUSH PRIVILEGES;

-- Switch to the CoffeeShop database
USE CoffeeShop;

-- Create the CoffeeProducts table
CREATE TABLE IF NOT EXISTS CoffeeProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    weight INT NOT NULL,
    origin VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL
);

-- Some test data
INSERT INTO CoffeeProducts (brand, type, price, weight, origin, image) VALUES 
('Zoegas', 'Skånerost', 79.90, 500, 'Sweden', 'images/zoegas.png');

-- Test to see that it works correctly by:
SELECT * FROM CoffeeProducts;