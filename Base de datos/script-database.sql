-- Tabla de roles
CREATE TABLE rol (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol TEXT NOT NULL UNIQUE CHECK (nombre_rol IN ('cliente', 'empleado', 'admin'))
);

-- Tabla de usuarios con UUID
CREATE TABLE usuario (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    direccion TEXT,
    imagen TEXT,
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT
);

-- Tabla de mascotas con referencia a usuario (UUID)
CREATE TABLE mascota (
    id_mascota UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),
    edad INTEGER,
    peso NUMERIC(5,2),
    notas_especiales TEXT,
    historial_medico TEXT,
    imagen TEXT,
    alergia TEXT,
    id_usuario UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE
    -- Nota: La restricción CHECK que verifica el rol del propietario se implementará mediante una función y un trigger.
);

-- Tabla de servicios
CREATE TABLE servicio (
    id_servicio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL
);

-- Tabla de citas, referencia a id_empleado como UUID
CREATE TABLE cita (
    id_cita UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    is_canceled BOOLEAN NOT NULL,
    id_servicio INTEGER NOT NULL REFERENCES servicio(id_servicio) ON DELETE SET NULL,
    id_mascota UUID NOT NULL REFERENCES mascota(id_mascota) ON DELETE CASCADE
    CHECK (hora_final > hora_inicio)
    -- Nota: La restricción CHECK que verifica el rol del empleado se implementará mediante una función y un trigger.
);

-- Insertar roles predefinidos
INSERT INTO rol (nombre_rol) VALUES 
('cliente'),
('empleado'),
('admin');

-- Insertar algunos servicios básicos
INSERT INTO servicio (nombre_servicio) VALUES 
('Consulta general'),
('Vacunación'),
('Desparasitación'),
('Cirugía menor'),
('Limpieza dental'),
('Análisis de sangre');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_mascota_usuario ON mascota(id_usuario);
CREATE INDEX idx_cita_fecha ON cita(fecha);
CREATE INDEX idx_cita_mascota ON cita(id_mascota);
CREATE INDEX idx_cita_empleado ON cita(id_empleado);

-- Crear vista para consultas frecuentes
CREATE VIEW vista_citas_detalle AS
SELECT 
    c.id_cita,
    c.fecha,
    c.hora_inicio,
    c.hora_final,
    s.nombre_servicio AS servicio,
    m.nombre AS mascota,
    m.especie,
    CONCAT(u_cliente.nombre, ' ', u_cliente.apellidos) AS propietario,
    CONCAT(u_empleado.nombre, ' ', u_empleado.apellidos) AS empleado_asignado
FROM cita c
LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
LEFT JOIN mascota m ON c.id_mascota = m.id_mascota
LEFT JOIN usuario u_cliente ON m.id_usuario = u_cliente.id_usuario
LEFT JOIN usuario u_empleado ON c.id_empleado = u_empleado.id_usuario;
