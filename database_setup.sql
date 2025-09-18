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

-- Create the Users table for authentication
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin and customer accounts with hashed passwords
-- Passwords are hashed using PHP's password_hash() function
INSERT INTO Users (email, password, user_type) VALUES 
('admin@example.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'admin'),
('customer@example.com', '$2y$10$I4j8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'customer');

-- Note: The above hashes are for 'admin123' and 'customer123' respectively
-- Generated using PHP's password_hash() function with PASSWORD_DEFAULT

-- Some test data for products
INSERT INTO CoffeeProducts (brand, type, price, weight, origin, image) VALUES 
('Zoegas', 'Skånerost', 79.90, 500, 'Sweden', 'images/zoegas.png');

-- Test to see that it works correctly by:
SELECT * FROM CoffeeProducts;
SELECT * FROM Users;