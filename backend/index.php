<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

function respond(int $status, mixed $payload = null): never
{
    http_response_code($status);
    if ($status !== 204) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    respond(204);
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('#^/api(?=/|$)#', '', $path) ?: '/';
$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST' && in_array($path, ['/gateway/connect', '/gateway/disconnect'], true)) {
    respond(204);
}

try {
    $database = createDatabaseConnection();

    if ($method === 'GET' && $path === '/devices') {
        $rows = $database->query('SELECT id, name, type, icon, status FROM devices ORDER BY id')->fetchAll();
        $devices = array_map(static fn (array $device): array => [
            'id' => (int) $device['id'],
            'name' => $device['name'],
            'type' => $device['type'],
            'icon' => $device['icon'],
            'status' => (bool) $device['status'],
        ], $rows);
        respond(200, $devices);
    }

    if ($method === 'GET' && $path === '/sensors') {
        $reading = $database->query(
            'SELECT temperature, humidity, light_level FROM sensor_readings ORDER BY id DESC LIMIT 1',
        )->fetch();
        if (!$reading) {
            respond(404, ['message' => 'No sensor readings found.']);
        }
        respond(200, [
            'temperature' => (float) $reading['temperature'],
            'humidity' => (float) $reading['humidity'],
            'lightLevel' => (int) $reading['light_level'],
        ]);
    }

    if ($method === 'PATCH' && preg_match('#^/devices/(\d+)/status$#', $path, $matches)) {
        $body = json_decode(file_get_contents('php://input') ?: '', true);
        if (!is_array($body) || !is_bool($body['status'] ?? null)) {
            respond(400, ['message' => 'Request body must contain a boolean status.']);
        }

        $deviceId = (int) $matches[1];
        $update = $database->prepare('UPDATE devices SET status = :status WHERE id = :id');
        $update->execute(['status' => (int) $body['status'], 'id' => $deviceId]);
        $select = $database->prepare('SELECT id, name, type, icon, status FROM devices WHERE id = :id');
        $select->execute(['id' => $deviceId]);
        $device = $select->fetch();
        if (!$device) {
            respond(404, ['message' => 'Device was not found.']);
        }

        respond(200, [
            'id' => (int) $device['id'],
            'name' => $device['name'],
            'type' => $device['type'],
            'icon' => $device['icon'],
            'status' => (bool) $device['status'],
        ]);
    }

    respond(404, ['message' => 'Endpoint was not found.']);
} catch (Throwable $error) {
    error_log((string) $error);
    respond(500, ['message' => 'Database request failed. Check the PHP server log.']);
}