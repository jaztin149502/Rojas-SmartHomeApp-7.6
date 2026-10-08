DELETE duplicate
FROM devices AS duplicate
INNER JOIN devices AS original
    ON duplicate.name = original.name
    AND duplicate.type = original.type
    AND duplicate.id > original.id;

ALTER TABLE devices
    ADD CONSTRAINT uq_devices_name_type UNIQUE (name, type);