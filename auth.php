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

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

$email = trim($input['email']);
$password = trim($input['password']);

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

// Prepare and execute query
$stmt = mysqli_prepare($link, "SELECT id, email, password, user_type FROM Users WHERE email = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database query preparation failed']);
    mysqli_close($link);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    // Check password using PHP's password_verify() function
    if (password_verify($password, $row['password'])) {
        // Login successful
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $row['id'],
                'email' => $row['email'],
                'user_type' => $row['user_type']
            ]
        ]);
    } else {
        // Invalid password
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    // User not found
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}

mysqli_stmt_close($stmt);
mysqli_close($link);
?>
