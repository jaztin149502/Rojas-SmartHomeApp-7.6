DELETE FROM sensor_readings
WHERE recorded_at < (
    SELECT latest_recorded_at
    FROM (
        SELECT MAX(recorded_at) AS latest_recorded_at
        FROM sensor_readings
    ) AS latest
);