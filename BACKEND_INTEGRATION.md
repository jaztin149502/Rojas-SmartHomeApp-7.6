# Backend Integration

The Expo app calls a PHP API, which reads and writes the `smarthome_iot` MySQL database in Laragon. The API is in `backend/` and implements the endpoints below. The root `.env.local` configures the app to call `http://localhost:8000/api` for local web development.

## Run Locally

1. Start Apache and MySQL in Laragon and import the SQL schema/data you created into `smarthome_iot`. For repeated sample data, apply `backend/migrations/001_unique_devices.sql` once to deduplicate devices. If the sample sensor readings were also inserted multiple times, apply `backend/migrations/002_keep_latest_sensor_seed_batch.sql` once to keep only the newest timestamp batch. The sensor cleanup permanently removes older reading history, so use it only for repeated demo seed data.
2. In a terminal at the project root, start the PHP API:

	```powershell
	& 'C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe' -S 0.0.0.0:8000 -t backend backend/index.php
	```

	This uses the Laragon PHP installation with `pdo_mysql` enabled. Adjust the PHP folder if your Laragon version differs.

3. In another terminal, start Expo with the current environment configuration:

	```powershell
	npx expo start
	```

Laragon's usual MySQL defaults (host `127.0.0.1`, port `3306`, user `root`, blank password) are used unless overridden with `IOT_DB_HOST`, `IOT_DB_PORT`, `IOT_DB_NAME`, `IOT_DB_USER`, or `IOT_DB_PASSWORD`. Set those variables in the terminal before starting PHP if your MySQL credentials differ. Never put database credentials in `EXPO_PUBLIC_*` variables.

For a physical phone, replace `localhost` in `.env.local` with your computer's LAN IP, for example `http://192.168.1.25:8000/api`, and ensure the phone and computer are on the same network. Android emulators typically use `http://10.0.2.2:8000/api`. Restart Expo after changing `.env.local`.

The gateway connect/disconnect routes currently acknowledge requests only; they do not yet connect to Azure IoT Hub or send commands to an ESP32. Sensor readings are returned from the newest row in `sensor_readings`.

The base URL must not end with a slash.

## Endpoints

| Method | Path | Expected response |
| --- | --- | --- |
| `POST` | `/gateway/connect` | `204 No Content` or any successful JSON response |
| `POST` | `/gateway/disconnect` | `204 No Content` or any successful JSON response |
| `GET` | `/devices` | `Device[]` |
| `GET` | `/sensors` | `SensorData` |
| `PATCH` | `/devices/:id/status` | Updated `Device`; request body: `{ "status": boolean }` |

A `Device` response uses the fields from `src/models/IoTModels.ts`: numeric `id`, string `name` and `type`, a valid Ionicons `icon`, and boolean `status`. `SensorData` contains numeric `temperature`, `humidity`, and `lightLevel` fields.

For non-success responses, the app displays a JSON `message` field when provided, or a generic message containing the HTTP status. Browser backends must allow requests from the app origin through CORS. The base URL is public app configuration, not a secret; do not put credentials in `EXPO_PUBLIC_*` variables.
