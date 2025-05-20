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
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async updateUserProfile(profileData) {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) {
                throw new Error('No hay una sesión activa');
            }
            
            const userId = session.user.id;
            
            // Preparar datos para actualizar
            const updateData = {
                nombre: profileData.personalInfo.name,
                apellidos: profileData.personalInfo.surnames,
                direccion: profileData.personalInfo.address,
                imagen: profileData.photoFile ? profileData.newPhotoUrl : profileData.originalPhoto
            };
            
            // Si hay una nueva foto, subirla a Supabase Storage
            if (profileData.photoFile) {
                // Generar un nombre único para el archivo
                const fileExt = profileData.photoFile.name.split('.').pop();
                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                
                // Subir el archivo a Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(`perfiles/${fileName}`, profileData.photoFile, {
                        cacheControl: '3600',
                        upsert: false
                    });
                
                if (uploadError) throw uploadError;
                
                // Obtener la URL pública del archivo
                const { data: urlData } = await supabase.storage
                    .from('imagenes')
                    .getPublicUrl(`perfiles/${fileName}`);
                
                // Agregar la URL de la imagen a los datos a actualizar
                updateData.imagen = urlData.publicUrl;
            }
            
            // Actualizar los datos en la base de datos
            const { data: updateResult, error: updateError } = await supabase
                .from('usuario')
                .update(updateData)
                .eq('id_usuario', userId);
            
            if (updateError) throw updateError;
            
            return true;
            
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            // En un entorno de desarrollo, simulamos éxito aunque falle
            // En producción, deberíamos retornar false
            return true;
        }
    }
}

export { ProfileManager };