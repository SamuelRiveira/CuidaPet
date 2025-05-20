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
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async updateUserProfile(profileData) {
        try {
            // Preparar los datos para la API
            const datosActualizacion = {
                nombre: profileData.personalInfo.name,
                apellidos: profileData.personalInfo.surnames,
                direccion: profileData.personalInfo.address,
                imagen: profileData.originalPhoto
            };
            
            // Si hay una nueva foto, incluir el archivo para subir
            if (profileData.photoFile) {
                datosActualizacion.imagenFile = profileData.photoFile;
            }
            
            // Llamar al método de la API para actualizar el perfil
            const resultado = await API.actualizarPerfilUsuario(datosActualizacion);
            
            if (!resultado.success) {
                throw resultado.error || new Error('Error al actualizar el perfil');
            }
            
            // Si se subió una nueva imagen, actualizar la URL de la imagen en los datos de retorno
            if (profileData.photoFile) {
                // Obtener la URL de la imagen del resultado o de los datos de actualización
                const nuevaImagenUrl = resultado.data?.imagen || 
                                     (await API.obtenerPerfilUsuario())?.data?.imagen;
                
                if (nuevaImagenUrl) {
                    resultado.data = { ...resultado.data, imagen: nuevaImagenUrl };
                }
            }
            
            return { success: true, data: resultado.data };
            
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            return { success: false, error };
        }
    }
}

export { ProfileManager };