<?php
function loadEnv($path) {
    if (!file_exists($path)) {
        echo ".env file not found at: $path<br>";
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

$envLoaded = loadEnv(__DIR__ . '/.env');

$host = getenv('DB_HOST');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_DATABASE');

echo "Host: $host<br>";
echo "Username: $username<br>";
echo "Password: " . (empty($password) ? "(empty)" : "***") . "<br>";
echo "Database: $database<br><br>";

$link = mysqli_connect($host, $username, $password, $database);
if($link) {
    $query = mysqli_query($link, "SELECT * FROM CoffeeProducts");
    
    while($array = mysqli_fetch_array($query)) {
        echo $array['brand']."<br />";
    } 
} else {
    echo "MySQL error :".mysqli_error();
}
?>