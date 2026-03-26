CREATE TABLE appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    clinic_id INT,
    doctor_id INT,
    patient_id INT,
    created_by INT,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL
);