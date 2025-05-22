/**
 * Clase de servicio para manejar las citas
 * Proporciona métodos para obtener, crear, actualizar y eliminar citas
 */

import { API } from "./APIS.js";

class AppointmentManager {
    /**
     * Obtiene la lista de citas del usuario
     * @returns {Promise<Array>} - Promise que resuelve con el array de citas
     */
    async getAppointments() {
        try {
            // Obtener las citas de las mascotas del usuario desde la API
            const { success, data: citas, error } = await API.obtenerCitasMascotas();
            
            if (!success) {
                console.error('Error al obtener las citas:', error);
                return [];
            }
            
            // Mapear los datos de la API al formato esperado por la aplicación
            return citas.map(cita => ({
                id: cita.id_cita,
                petId: cita.mascota.id_mascota,
                petName: cita.mascota.nombre,
                petImage: "/Frontend/imagenes/default-pet.jpg", // Imagen por defecto o podrías obtenerla de la mascota si está disponible
                date: cita.fecha,
                time: cita.hora_inicio,
                type: cita.servicio?.nombre || 'Sin especificar',
                veterinarian: 'Veterinario por asignar', // Este dato no viene en la API actual
                status: cita.is_canceled ? 'cancelled' : 'pending' // Mapear el estado según corresponda
            }));
        } catch (error) {
            console.error('Error inesperado al obtener las citas:', error);
            return [];
        }
    }

    /**
     * Manejador para cancelar una cita
     * @param {number} appointmentId - ID de la cita a cancelar
     */
    handleCancelAppointment(appointmentId) {
        // TODO: Implementar llamada a API
        return true;
    }

    /**
     * Manejador para editar una cita
     * @param {number} appointmentId - ID de la cita a editar
     */
    handleEditAppointment(appointmentId) {
        // TODO: Implementar llamada a API
        return true;
    }

    /**
     * Manejador para eliminar una cita
     * @param {number} appointmentId - ID de la cita a eliminar
     */
    handleDeleteAppointment(appointmentId) {
        // TODO: Implementar llamada a API
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
        // TODO: Implementar llamada a API
        return true;
    }

    /**
     * Obtiene los datos para el formulario de citas
     * @returns {Promise} Promesa que resuelve con los datos del formulario
     */
    getAppointmentFormData() {
        // TODO: Implementar llamada a API
        return new Promise((resolve) => {
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
        });
    }
}

export {AppointmentManager};
