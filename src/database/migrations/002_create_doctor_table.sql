CREATE TABLE doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    clinic_id INT NOT NULL,
    crm VARCHAR(20) NOT NULL UNIQUE,
    specialty VARCHAR(100) NOT NULL
);