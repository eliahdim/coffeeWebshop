<?php
function loadEnv($path) {
    if (!file_exists($path)) {
        echo json_encode(['success' => false, 'message' => '.env file not found']);
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
    return true;
}

// Set content type to JSON
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST requests allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Action is required']);
    exit;
}

// Check admin authentication
if (!isset($input['user_type']) || $input['user_type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

// Load environment variables
$envLoaded = loadEnv(__DIR__ . '/.env');

$host = getenv('DB_HOST');
$username = getenv('DB_USERNAME');
$password_db = getenv('DB_PASSWORD');
$database = getenv('DB_DATABASE');

// Connect to database
$link = mysqli_connect($host, $username, $password_db, $database);

if (!$link) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit;
}

mysqli_set_charset($link, "utf8");

$action = $input['action'];

switch ($action) {
    case 'get_products':
        $query = mysqli_query($link, "SELECT * FROM CoffeeProducts ORDER BY id DESC");
        $products = [];
        while($row = mysqli_fetch_assoc($query)) {
            $products[] = $row;
        }
        echo json_encode(['success' => true, 'products' => $products]);
        break;

    case 'add_product':
        $brand = trim($input['brand']);
        $type = trim($input['type']);
        $price = floatval($input['price']);
        $weight = intval($input['weight']);
        $origin = trim($input['origin']);
        $image = trim($input['image']);

        if (empty($brand) || empty($type) || $price <= 0 || $weight <= 0 || empty($origin) || empty($image)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required and must be valid']);
            break;
        }

        $stmt = mysqli_prepare($link, "INSERT INTO CoffeeProducts (brand, type, price, weight, origin, image) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database query preparation failed']);
            break;
        }

        mysqli_stmt_bind_param($stmt, "ssdiss", $brand, $type, $price, $weight, $origin, $image);
        
        if (mysqli_stmt_execute($stmt)) {
            $product_id = mysqli_insert_id($link);
            echo json_encode(['success' => true, 'message' => 'Product added successfully', 'product_id' => $product_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add product: ' . mysqli_error($link)]);
        }
        
        mysqli_stmt_close($stmt);
        break;

    case 'update_product':
        $id = intval($input['id']);
        $brand = trim($input['brand']);
        $type = trim($input['type']);
        $price = floatval($input['price']);
        $weight = intval($input['weight']);
        $origin = trim($input['origin']);
        $image = trim($input['image']);

        if ($id <= 0 || empty($brand) || empty($type) || $price <= 0 || $weight <= 0 || empty($origin) || empty($image)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required and must be valid']);
            break;
        }

        $stmt = mysqli_prepare($link, "UPDATE CoffeeProducts SET brand=?, type=?, price=?, weight=?, origin=?, image=? WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database query preparation failed']);
            break;
        }

        mysqli_stmt_bind_param($stmt, "ssdissi", $brand, $type, $price, $weight, $origin, $image, $id);
        
        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Product not found or no changes made']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update product: ' . mysqli_error($link)]);
        }
        
        mysqli_stmt_close($stmt);
        break;

    case 'delete_product':
        $id = intval($input['id']);

        if ($id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
            break;
        }

        $stmt = mysqli_prepare($link, "DELETE FROM CoffeeProducts WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database query preparation failed']);
            break;
        }

        mysqli_stmt_bind_param($stmt, "i", $id);
        
        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Product not found']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete product: ' . mysqli_error($link)]);
        }
        
        mysqli_stmt_close($stmt);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

mysqli_close($link);
?>
