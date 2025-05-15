/**
 * Clase de servicio para manejar las citas
 * Proporciona métodos para obtener, crear, actualizar y eliminar citas
 */
class AppointmentManager {
    /**
     * Obtiene la lista de citas del usuario
     * @returns {Promise<Array>} - Promise que resuelve con el array de citas
     */
    getAppointments() {
        // Por ahora devolvemos datos simulados
        return new Promise((resolve) => {
            // Simula un retraso de red de 500ms
            setTimeout(() => {
                // Puedes cambiar este valor a [] para simular que no hay citas
                const appointments = [
                    {
                        id: 1,
                        petId: 101,
                        petName: "Luna",
                        petImage: "/Frontend/imagenes/img_luna.jpg",
                        date: "2025-05-15",
                        time: "10:30",
                        type: "Vacunación",
                        veterinarian: "Dr. Martínez",
                        status: "pending" // Estado pendiente
                    },
                    {
                        id: 2,
                        petId: 102,
                        petName: "Simba",
                        petImage: "/Frontend/imagenes/img_simba.jpg",
                        date: "2025-05-22",
                        time: "16:00",
                        type: "Revisión general",
                        veterinarian: "Dra. López",
                        status: "completed" // Estado completada
                    },
                    {
                        id: 3,
                        petId: 103,
                        petName: "Rocky",
                        petImage: "/Frontend/imagenes/img_rocky.jpg",
                        date: "2025-06-03",
                        time: "12:15",
                        type: "Peluquería",
                        veterinarian: "Estilista Rodríguez",
                        status: "cancelled" // Estado cancelada
                    }
                ];
                resolve(appointments);
            }, 500);
        });
    }

    /**
     * Manejador para cancelar una cita
     * @param {number} appointmentId - ID de la cita a cancelar
     */
    handleCancelAppointment(appointmentId) {
        // Aquí iría la lógica para cancelar la cita
        return true;
    }

    /**
     * Manejador para editar una cita
     * @param {number} appointmentId - ID de la cita a editar
     */
    handleEditAppointment(appointmentId) {
        // Aquí iría la lógica para editar la cita
        return true;
    }

    /**
     * Manejador para eliminar una cita
     * @param {number} appointmentId - ID de la cita a eliminar
     */
    handleDeleteAppointment(appointmentId) {
        // Aquí iría la lógica para eliminar la cita
        return true;
    }

    /**
     * Manejador para crear una cita
     * @param {string} petId - ID de la mascota
     * @param {string} serviceId - ID del servicio
     * @param {string} date - Fecha de la cita
     * @param {string} time - Hora de la cita
     * @returns {boolean} - Resultado de la operación
     */
    handleCreateAppointment(petId, serviceId, date, time) {
        // Aquí iría la lógica para crear la cita
        return true;
    }

    /**
     * Obtiene los datos para el formulario de citas
     * @returns {Promise} Promesa que resuelve con los datos del formulario
     */
    getAppointmentFormData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const formData = {
                    pets: [
                        { value: 'luna', label: 'Luna' },
                        { value: 'simba', label: 'Simba' },
                        { value: 'rocky', label: 'Rocky' },
                        { value: 'mia', label: 'Mia' },
                        { value: 'max', label: 'Max' }
                    ],
                    services: [
                        { value: 'vacunas', label: 'Vacunas' },
                        { value: 'revision', label: 'Revisión general' },
                        { value: 'esterilizacion', label: 'Esterilización/Castración' },
                        { value: 'peluqueria', label: 'Peluquería' },
                        { value: 'desparasitacion', label: 'Desparasitación' }
                    ],
                    occupiedTimeSlots: [
                        { date: '2025-05-15', start: '09:00', end: '09:30' },
                        { date: '2025-05-15', start: '10:15', end: '10:45' },
                        { date: '2025-05-16', start: '14:30', end: '15:00' },
                        { date: '2025-05-17', start: '16:45', end: '17:15' },
                        { date: '2025-05-20', start: '09:00', end: '09:30' }
                    ]
                };
                resolve(formData);
            }, 500);
        });
    }
}
