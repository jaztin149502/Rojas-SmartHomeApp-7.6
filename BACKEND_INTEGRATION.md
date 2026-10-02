# Backend Integration

The app uses the simulated IoT service by default. Set `EXPO_PUBLIC_IOT_API_URL` to the backend origin to use HTTP instead, for example:

```env
EXPO_PUBLIC_IOT_API_URL=http://localhost:3000/api
```

Restart Expo after changing the environment variable. The base URL should not end with a slash.

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
