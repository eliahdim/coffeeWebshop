<?php
// Script to generate password hashes for the database
// Run this script to get the proper hashes for your passwords

$admin_password = 'admin123';
$customer_password = 'customer123';

$admin_hash = password_hash($admin_password, PASSWORD_DEFAULT);
$customer_hash = password_hash($customer_password, PASSWORD_DEFAULT);

echo "Admin password hash for 'admin123':\n";
echo $admin_hash . "\n\n";

echo "Customer password hash for 'customer123':\n";
echo $customer_hash . "\n\n";

echo "SQL INSERT statements:\n";
echo "INSERT INTO Users (email, password, user_type) VALUES \n";
echo "('admin@example.com', '" . $admin_hash . "', 'admin'),\n";
echo "('customer@example.com', '" . $customer_hash . "', 'customer');\n\n";

// Test the hashes to make sure they work
echo "Testing password verification:\n";
echo "Admin password 'admin123' verification: " . (password_verify($admin_password, $admin_hash) ? "SUCCESS" : "FAILED") . "\n";
echo "Customer password 'customer123' verification: " . (password_verify($customer_password, $customer_hash) ? "SUCCESS" : "FAILED") . "\n";
?>
