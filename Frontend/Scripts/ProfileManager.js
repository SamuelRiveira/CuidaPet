import { API } from './APIS.js';

/**
 * Clase encargada de la gestión de datos del perfil de usuario
 */
class ProfileManager {
    /**
     * Obtiene los datos del perfil de usuario
     * @returns {Promise<Object>} Datos del perfil
     */
    static async getUserProfile() {
        try {
            const { success, data, error } = await API.obtenerPerfilUsuario();
            
            if (!success) {
                console.error('Error al obtener el perfil:', error);
                throw new Error('No se pudo cargar el perfil del usuario');
            }
            
            // Formatear los datos para que coincidan con el formato esperado
            return {
                photo: data.imagen || "/Frontend/imagenes/img_perfil.png",
                name: `${data.nombre || ''} ${data.apellidos || ''}`.trim() || 'Usuario',
                stats: {
                    pets: 5, // TODO: Obtener número real de mascotas cuando esté disponible en la API
                    appointments: 3 // TODO: Obtener número real de citas cuando esté disponible en la API
                },
                personalInfo: {
                    name: data.nombre || '',
                    surnames: data.apellidos || '',
                    address: data.direccion || 'Dirección no especificada'
                }
            };
        } catch (error) {
            console.error('Error en getUserProfile:', error);
            // Devolver datos por defecto en caso de error
            return {
                photo: "/Frontend/imagenes/img_perfil.png",
                name: "Usuario",
                stats: { pets: 0, appointments: 0 },
                personalInfo: { name: "", surnames: "", address: "" }
            };
        }
    }

    /**
     * Actualiza los datos del perfil de usuario
     * @param {Object} profileData - Datos actualizados del perfil
     * @returns {boolean} - Éxito de la operación
     */
    static updateUserProfile(profileData) {
        // TODO: Implementar llamada a API
        // Simulamos una operación exitosa
        return true;
    }
}

export { ProfileManager };