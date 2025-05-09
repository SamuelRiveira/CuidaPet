/**
 * Clase de servicio para manejar las citas
 * Proporciona métodos para obtener, crear, actualizar y eliminar citas
 */
export class AppointmentManager {
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
                        veterinarian: "Dr. Martínez"
                    },
                    {
                        id: 2,
                        petId: 102,
                        petName: "Simba",
                        petImage: "/Frontend/imagenes/img_simba.jpg",
                        date: "2025-05-22",
                        time: "16:00",
                        type: "Revisión general",
                        veterinarian: "Dra. López"
                    },
                    {
                        id: 3,
                        petId: 103,
                        petName: "Rocky",
                        petImage: "/Frontend/imagenes/img_rocky.jpg",
                        date: "2025-06-03",
                        time: "12:15",
                        type: "Peluquería",
                        veterinarian: "Estilista Rodríguez"
                    }
                ];
                resolve(appointments);
            }, 500);
        });
    }
}
