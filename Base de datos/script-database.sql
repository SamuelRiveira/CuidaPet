-- Tabla de roles
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
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

-- Tabla de alergias
CREATE TABLE alergia (
    id_alergia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de mascotas con referencia a usuario (UUID)
CREATE TABLE mascota (
    id_mascota SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),
    edad INTEGER,
    peso NUMERIC(5,2),
    notas_especiales TEXT,
    historial_medico TEXT,
    imagen TEXT,
    id_usuario UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE
    -- Nota: La restricción CHECK que verifica el rol del propietario se implementará mediante una función y un trigger.
);

-- Tabla intermedia para relacionar mascotas con alergias
CREATE TABLE mascota_alergia (
    id_mascota INTEGER REFERENCES mascota(id_mascota) ON DELETE CASCADE,
    id_alergia INTEGER REFERENCES alergia(id_alergia) ON DELETE RESTRICT,
    fecha_diagnostico DATE,
    PRIMARY KEY (id_mascota, id_alergia)
);

-- Tabla de estados de cita
CREATE TABLE estado_cita (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado TEXT NOT NULL UNIQUE CHECK (nombre_estado IN ('pendiente', 'completada', 'cancelada'))
);

-- Tabla de servicios
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL
);

-- Tabla de citas, referencia a id_empleado como UUID
CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    id_estado INTEGER NOT NULL DEFAULT 1 REFERENCES estado_cita(id_estado) ON DELETE RESTRICT,
    id_servicio INTEGER REFERENCES servicio(id_servicio) ON DELETE SET NULL,
    id_mascota INTEGER NOT NULL REFERENCES mascota(id_mascota) ON DELETE CASCADE,
    id_empleado UUID REFERENCES usuario(id_usuario) ON DELETE SET NULL
    CHECK (hora_final > hora_inicio)
    -- Nota: La restricción CHECK que verifica el rol del empleado se implementará mediante una función y un trigger.
);

-- Insertar roles predefinidos
INSERT INTO rol (nombre_rol) VALUES 
('cliente'),
('empleado'),
('admin');

-- Insertar estados de cita predefinidos
INSERT INTO estado_cita (nombre_estado) VALUES 
('pendiente'),
('completada'),
('cancelada');

-- Insertar algunas alergias comunes
INSERT INTO alergia (nombre) VALUES 
('Polen'),
('Ácaros del polvo'),
('Alimentos específicos'),
('Medicamentos'),
('Picaduras de insectos'),
('Productos químicos'),
('Kiwi'),
('Pelo de otros animales');

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
    ec.nombre_estado AS estado,
    s.nombre_servicio AS servicio,
    m.nombre AS mascota,
    m.especie,
    CONCAT(u_cliente.nombre, ' ', u_cliente.apellidos) AS propietario,
    CONCAT(u_empleado.nombre, ' ', u_empleado.apellidos) AS empleado_asignado
FROM cita c
LEFT JOIN estado_cita ec ON c.id_estado = ec.id_estado
LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
LEFT JOIN mascota m ON c.id_mascota = m.id_mascota
LEFT JOIN usuario u_cliente ON m.id_usuario = u_cliente.id_usuario
LEFT JOIN usuario u_empleado ON c.id_empleado = u_empleado.id_usuario;
