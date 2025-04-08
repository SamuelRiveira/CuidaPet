CREATE TABLE Usuario (
  idUsuario INTEGER   NOT NULL ,
  nombre VARCHAR    ,
  contraseña VARCHAR    ,
  rol ENUM('programador', 'empleado', 'cliente')      ,
PRIMARY KEY(idUsuario));




CREATE TABLE Programador (
  idProgramador INTEGER   NOT NULL ,
  Usuario_idUsuario INTEGER   NOT NULL ,
  dni VARCHAR    ,
  telefono VARCHAR    ,
  direccion VARCHAR    ,
  fecha_contratacion DATE      ,
PRIMARY KEY(idProgramador),
  FOREIGN KEY(Usuario_idUsuario)
    REFERENCES Usuario(idUsuario));


CREATE INDEX IFK_Rel_08 ON Programador (Usuario_idUsuario);


CREATE TABLE Cliente (
  idCliente INTEGER   NOT NULL ,
  Usuario_idUsuario INTEGER   NOT NULL ,
  direccion VARCHAR    ,
  telefono VARCHAR      ,
PRIMARY KEY(idCliente),
  FOREIGN KEY(Usuario_idUsuario)
    REFERENCES Usuario(idUsuario));


CREATE INDEX IFK_Rel_01 ON Cliente (Usuario_idUsuario);


CREATE TABLE Empleado (
  idEmpleado INTEGER   NOT NULL ,
  Usuario_idUsuario INTEGER   NOT NULL ,
  especialidad VARCHAR    ,
  nombre_completo VARCHAR    ,
  dni VARCHAR    ,
  telefono VARCHAR    ,
  direccion VARCHAR    ,
  fecha_contratacion DATE      ,
PRIMARY KEY(idEmpleado),
  FOREIGN KEY(Usuario_idUsuario)
    REFERENCES Usuario(idUsuario));


CREATE INDEX IFK_Rel_05 ON Empleado (Usuario_idUsuario);


CREATE TABLE Mascota (
  idMascota INTEGER   NOT NULL ,
  Cliente_idCliente INTEGER   NOT NULL ,
  nombre VARCHAR    ,
  especie VARCHAR    ,
  raza VARCHAR    ,
  edad INTEGER      ,
PRIMARY KEY(idMascota),
  FOREIGN KEY(Cliente_idCliente)
    REFERENCES Cliente(idCliente));


CREATE INDEX IFK_Rel_02 ON Mascota (Cliente_idCliente);


CREATE TABLE Cita (
  idCita INTEGER   NOT NULL ,
  Empleado_idEmpleado INTEGER   NOT NULL ,
  Mascota_idMascota INTEGER   NOT NULL ,
  fecha DATE    ,
  hora TIME    ,
  estado ENUM('pendiente', 'confirmada', 'cancelada')    ,
  motivo VARCHAR      ,
PRIMARY KEY(idCita),
  FOREIGN KEY(Mascota_idMascota)
    REFERENCES Mascota(idMascota),
  FOREIGN KEY(Empleado_idEmpleado)
    REFERENCES Empleado(idEmpleado));


CREATE INDEX IFK_Rel_03 ON Cita (Mascota_idMascota);
CREATE INDEX IFK_Rel_04 ON Cita (Empleado_idEmpleado);


CREATE TABLE Ficha_Medica (
  idFicha_Medica INTEGER   NOT NULL ,
  Empleado_idEmpleado INTEGER   NOT NULL ,
  Mascota_idMascota INTEGER   NOT NULL ,
  fecha DATE    ,
  diagnostico VARCHAR    ,
  tratamiento VARCHAR    ,
  observaciones TEXT      ,
PRIMARY KEY(idFicha_Medica),
  FOREIGN KEY(Mascota_idMascota)
    REFERENCES Mascota(idMascota),
  FOREIGN KEY(Empleado_idEmpleado)
    REFERENCES Empleado(idEmpleado));


CREATE INDEX IFK_Rel_06 ON Ficha_Medica (Mascota_idMascota);
CREATE INDEX IFK_Rel_07 ON Ficha_Medica (Empleado_idEmpleado);



