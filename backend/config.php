<?php
declare(strict_types=1);

function createDatabaseConnection(): PDO
{
    $host = getenv('IOT_DB_HOST') ?: '127.0.0.1';
    $port = getenv('IOT_DB_PORT') ?: '3306';
    $database = getenv('IOT_DB_NAME') ?: 'smarthome_iot';
    $username = getenv('IOT_DB_USER') ?: 'root';
    $password = getenv('IOT_DB_PASSWORD');

    return new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $username,
        $password === false ? '' : $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ],
    );
}