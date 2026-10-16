USE hospital;

-- 1. Tabla de Especialistas (se necesita para asociar a los doctores)
CREATE TABLE specialist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    specialist_name VARCHAR(100) NOT NULL
);

-- 2. Tabla de Usuarios / Pacientes (user_details)
CREATE TABLE user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 3. Tabla de Doctores (doctor)
CREATE TABLE doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(150) NOT NULL,
    dateOfBirth VARCHAR(50),
    qualification VARCHAR(200),
    specialist VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password VARCHAR(255) NOT NULL
);

-- 4. Tabla de Citas Médicas (appointment)
CREATE TABLE appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fullName VARCHAR(150) NOT NULL,
    gender VARCHAR(20),
    age VARCHAR(10),
    appointmentDate VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(30),
    diseases VARCHAR(255),
    doctorId INT NOT NULL,
    address TEXT,
    status VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES user_details(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE
);
