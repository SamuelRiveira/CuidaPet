import { supabase } from "./supabaseClient.js";

export class API{
    /**
     * Registra un nuevo usuario en Supabase y crea su perfil en la tabla usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async registrarUsuario(email, password) {
        try {
            // Registrar usuario con Supabase Auth sin iniciar sesión automáticamente
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin + '/Frontend/index.html',
                    data: {
                        // No guardar la sesión en el almacenamiento local
                        skipSession: true
                    }
                }
            });
            
            if (authError) throw authError;
            
            // Crear un registro en la tabla usuario con el id del usuario autenticado
            const { data: userData, error: userError } = await supabase
                .from('usuario')
                .insert([
                    {
                        id_usuario: authData.user.id,
                        id_rol: 1
                    }
                ]);
                
            if (userError) throw userError;
            
            return { success: true, data: { auth: authData, user: userData } };
            
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Inicia sesión del usuario usando Supabase Auth
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async iniciarSesion(email, password) {
        try {
            // Iniciar sesión con Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (authError) throw authError;
            
            // Obtener datos del usuario de la tabla usuario
            const { data: userData, error: userError } = await supabase
                .from('usuario')
                .select('*, rol:id_rol(*)')
                .eq('id_usuario', authData.user.id)
                .single();
                
            if (userError) throw userError;
            
            // Preparar objeto de usuario para almacenar en localStorage
            const userObject = {
                id: userData.id_usuario,
                email: authData.user.email,
                role: userData.rol.nombre_rol,
            };
            
            return { success: true, data: { auth: authData, user: userData, userObject } };
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Cierra la sesión del usuario actual
     * @returns {Promise<{success: boolean, error?: any}>} - Resultado de la operación
     */
    static async cerrarSesion() {
        try {
            // Primero intentamos limpiar el localStorage
            localStorage.removeItem('sb-kmypwriazdbxpwdxfhaf-auth-token');
            
            // Luego intentamos cerrar sesión en Supabase
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.warn('Advertencia al cerrar sesión en Supabase (puede ser normal si no hay sesión activa):', error.message);
                    // Continuamos aunque falle, ya que podríamos no tener una sesión activa
                }
            } catch (supabaseError) {
                console.warn('Error al comunicarse con Supabase (puede ser normal si no hay conexión):', supabaseError.message);
                // Continuamos aunque falle la comunicación con Supabase
            }
            
            // Forzar recarga para limpiar cualquier estado en memoria
            window.location.href = '/Frontend/';
            
            // Retornamos éxito ya que hemos limpiado todo lo local
            return { success: true };
        } catch (error) {
            console.error('Error inesperado en cerrarSesion:', error);
            // Aún así redirigimos al login
            window.location.href = '/Frontend/';
            return { success: false, error };
        }
    }
    
    /**
     * Obtiene el perfil del usuario actual basado en la sesión activa
     * @returns {Promise<{success: boolean, data?: {nombre: string, apellidos: string, direccion: string, imagen: string}, error?: any}>} - Perfil del usuario
     */
    static async obtenerPerfilUsuario() {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.warn('Error al verificar sesión:', sessionError);
                return { success: false, noSession: true, error: 'Error al verificar la sesión' };
            }
            
            if (!session) {
                // No hay sesión activa, retornamos un objeto indicando esto
                return { success: false, noSession: true, error: 'No hay una sesión activa' };
            }
            
            const userId = session.user.id;
            
            // Obtener los datos del perfil del usuario
            const { data: perfilData, error: perfilError } = await supabase
                .from('usuario')
                .select('nombre, apellidos, direccion, imagen')
                .eq('id_usuario', userId)
                .single();
                
            if (perfilError) {
                console.warn('Error al obtener datos del perfil:', perfilError);
                return { success: false, noSession: true, error: 'Error al obtener el perfil' };
            }
            
            return { 
                success: true, 
                data: {
                    nombre: perfilData?.nombre || '',
                    apellidos: perfilData?.apellidos || '',
                    direccion: perfilData?.direccion || '',
                    imagen: perfilData?.imagen || ''
                } 
            };
            
        } catch (error) {
            // No mostrar error en consola si no hay sesión activa
            if (error.message?.includes('No user') || error.message?.includes('No session')) {
                return { success: false, noSession: true, error: 'No hay sesión activa' };
            }
            console.error('Error al obtener el perfil del usuario:', error);
            return { success: false, noSession: true, error: 'Error al obtener el perfil' };
        }
    }
    
    /**
     * Actualiza el perfil del usuario actual (nombre, apellidos, dirección e imagen)
     * @param {Object} datosUsuario - Datos actualizados del usuario
     * @param {string} datosUsuario.nombre - Nombre del usuario
     * @param {string} datosUsuario.apellidos - Apellidos del usuario
     * @param {string} datosUsuario.direccion - Dirección del usuario
     * @param {string} datosUsuario.imagen - URL de la imagen de perfil
     * @param {File} [datosUsuario.imagenFile] - Archivo de imagen para subir (opcional)
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    /**
     * Obtiene un servicio por su ID
     * @param {number} servicioId - ID del servicio a obtener
     * @returns {Promise<{success: boolean, data?: Object, error?: any}>} - Resultado de la operación con los datos del servicio
     */
    static async obtenerServicioPorId(servicioId) {
        try {
            const { data, error } = await supabase
                .from('servicio')
                .select('nombre_servicio')
                .eq('id_servicio', servicioId)
                .single();
                
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener el servicio:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Actualiza el perfil del usuario actual (nombre, apellidos, dirección e imagen)
     * @param {Object} datosUsuario - Datos actualizados del usuario
     * @param {string} datosUsuario.nombre - Nombre del usuario
     * @param {string} datosUsuario.apellidos - Apellidos del usuario
     * @param {string} datosUsuario.direccion - Dirección del usuario
     * @param {string} datosUsuario.imagen - URL de la imagen de perfil
     * @param {File} [datosUsuario.imagenFile] - Archivo de imagen para subir (opcional)
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async actualizarPerfilUsuario(datosUsuario) {
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
                nombre: datosUsuario.nombre || '',
                apellidos: datosUsuario.apellidos || '',
                direccion: datosUsuario.direccion || ''
            };
            
            // Si hay un archivo de imagen nuevo, subirlo a Storage
            if (datosUsuario.imagenFile) {
                // Generar un nombre único para el archivo
                const fileName = userId;
                
                // Subir el archivo a Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(`perfiles/${fileName}`, datosUsuario.imagenFile, {
                        cacheControl: '3600',
                        upsert: true
                    });
                
                if (uploadError) throw uploadError;
                
                // Obtener la URL firmada del archivo con validez de 1 año
                const expiresIn = 365 * 24 * 60 * 60; // 1 año en segundos
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from('imagenes')
                    .createSignedUrl(`perfiles/${fileName}`, expiresIn);

                if (signedUrlError) {
                    console.error('Error creating signed URL:', signedUrlError);
                    throw signedUrlError;
                }
                
                // Agregar la URL firmada de la imagen a los datos a actualizar
                updateData.imagen = signedUrlData.signedUrl;
            } else if (datosUsuario.imagen) {
                // Si no hay archivo pero hay URL de imagen, usar esa URL
                updateData.imagen = datosUsuario.imagen;
            }
            
            // Actualizar los datos en la base de datos
            const { data: updateResult, error: updateError } = await supabase
                .from('usuario')
                .update(updateData)
                .eq('id_usuario', userId);
            
            if (updateError) throw updateError;
            
            return { success: true, data: updateResult };
            
        } catch (error) {
            console.error('Error al actualizar el perfil del usuario:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Obtiene las alergias de una mascota específica
     * @param {number} idMascota - ID de la mascota
     * @returns {Promise<{success: boolean, data?: Array<{id_alergia: number, nombre: string, fecha_diagnostico: string}>, error?: any}>} - Lista de alergias de la mascota
     */
    static async obtenerAlergiasMascota(idMascota) {
        try {
            if (!idMascota) {
                throw new Error('Se requiere el ID de la mascota');
            }
            
            // Obtener las alergias de la mascota con información de la alergia
            const { data, error } = await supabase
                .from('mascota_alergia')
                .select(`
                    alergia:alergia (
                        id_alergia,
                        nombre
                    ),
                    fecha_diagnostico
                `)
                .eq('id_mascota', idMascota);
                
            if (error) throw error;
            
            // Mapear los resultados para aplanar la estructura
            const alergias = data.map(item => ({
                id_alergia: item.alergia.id_alergia,
                nombre: item.alergia.nombre,
                fecha_diagnostico: item.fecha_diagnostico || 'Fecha no especificada'
            }));
            
            return { success: true, data: alergias };
            
        } catch (error) {
            console.error('Error al obtener alergias de la mascota:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Crea una nueva mascota para el usuario actual
     * @param {Object} datosMascota - Datos de la mascota a crear
     * @param {string} datosMascota.nombre - Nombre de la mascota
     * @param {string} datosMascota.especie - Especie de la mascota
     * @param {string} datosMascota.raza - Raza de la mascota
     * @param {string} datosMascota.fecha_nacimiento - Fecha de nacimiento de la mascota (formato YYYY-MM-DD)
     * @param {string} [datosMascota.genero] - Género de la mascota (opcional)
     * @param {string} [datosMascota.color] - Color de la mascota (opcional)
     * @param {string} [datosMascota.notas] - Notas adicionales (opcional)
     * @param {File} [datosMascota.imagen] - Archivo de imagen de la mascota (opcional)
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async crearMascota(datosMascota) {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) {
                throw new Error('No hay sesión activa');
            }
            
            const userId = session.user.id;
            
            // Preparar los datos básicos de la mascota
            const mascotaData = {
                id_usuario: userId,
                nombre: datosMascota.nombre,
                especie: datosMascota.especie,
                raza: datosMascota.raza,
                edad: datosMascota.edad ? Number(datosMascota.edad) : null,
                peso: datosMascota.peso ? Number(datosMascota.peso) : null,
                alergia: datosMascota.alergia || null,
                notas_especiales: datosMascota.notas_especiales || null
            };
            
            // Insertar la mascota en la base de datos sin la imagen primero
            const { data: mascotaCreada, error: insertError } = await supabase
                .from('mascota')
                .insert([mascotaData])
                .select();
                
            if (insertError) throw insertError;
            
            const idMascota = mascotaCreada[0].id_mascota;
            
            // Si hay una imagen, usar editarMascota para actualizarla
            if (datosMascota.imagen) {
                const resultadoEdicion = await this.editarMascota(idMascota, {
                    imagen: datosMascota.imagen
                });
                
                if (resultadoEdicion.success) {
                    return { 
                        success: true, 
                        data: resultadoEdicion.data,
                        message: 'Mascota creada y actualizada exitosamente' 
                    };
                }
            }
            
            return { 
                success: true, 
                data: mascotaCreada[0],
                message: 'Mascota creada exitosamente' 
            };
        } catch (error) {
            console.error('Error al crear la mascota:', error);
            return { 
                success: false, 
                error: error.message || 'Error al crear la mascota',
                details: error 
            };
        }
    }

    /**
     * Actualiza la información de una mascota existente
     * @param {number} idMascota - ID de la mascota a actualizar
     * @param {Object} datosMascota - Datos actualizados de la mascota
     * @param {string} [datosMascota.nombre] - Nuevo nombre de la mascota (opcional)
     * @param {string} [datosMascota.especie] - Nueva especie de la mascota (opcional)
     * @param {string} [datosMascota.raza] - Nueva raza de la mascota (opcional)
     * @param {string} [datosMascota.fecha_nacimiento] - Nueva fecha de nacimiento (formato YYYY-MM-DD) (opcional)
     * @param {string} [datosMascota.genero] - Nuevo género de la mascota (opcional)
     * @param {string} [datosMascota.color] - Nuevo color de la mascota (opcional)
     * @param {string} [datosMascota.notas] - Nuevas notas adicionales (opcional)
     * @param {File} [datosMascota.imagen] - Nueva imagen de la mascota (opcional)
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    static async editarMascota(idMascota, datosMascota) {
        try {
            if (!idMascota) {
                throw new Error('Se requiere el ID de la mascota para editar');
            }

            // Verificar que la mascota existe y pertenece al usuario
            const { success: mascotaExiste, data: mascotaExistente } = await this.obtenerMascotaPorId(idMascota);
            if (!mascotaExiste) {
                throw new Error('Mascota no encontrada o no tienes permiso para editarla');
            }

            // Preparar los datos a actualizar
            const datosActualizados = {};
            const camposPermitidos = ['nombre', 'especie', 'raza', 'edad', 'peso', 'alergia', 'notas_especiales', 'imagen', 'historial_medico'];
            
            // Agregar solo los campos que se proporcionaron
            Object.keys(datosMascota).forEach(key => {
                if (camposPermitidos.includes(key) && datosMascota[key] !== undefined) {
                    datosActualizados[key] = datosMascota[key];
                }
            });

            // Si hay una nueva imagen, subirla a Supabase Storage
            if (datosMascota.imagen) {
                const fileName = idMascota;
                
                // Subir la nueva imagen
                const { error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(`mascotas/${fileName}`, datosMascota.imagen, {
                        cacheControl: '3600',
                        upsert: true
                    });
                
                if (uploadError) throw uploadError;
                
                // Generar una URL firmada con validez de 1 año (en segundos)
                const EXPIRES_IN = 60 * 60 * 24 * 365; // 1 año en segundos
                const { data: signedUrlData } = await supabase.storage
                    .from('imagenes')
                    .createSignedUrl(`mascotas/${fileName}`, EXPIRES_IN);
                
                if (!signedUrlData || !signedUrlData.signedUrl) {
                    throw new Error('No se pudo generar la URL firmada para la imagen');
                }
                
                // Usar la URL firmada en lugar de la URL pública
                datosActualizados.imagen = signedUrlData.signedUrl;
            }

            // Si no hay datos para actualizar, retornar éxito
            if (Object.keys(datosActualizados).length === 0) {
                return { success: true, data: { mensaje: 'No se realizaron cambios' } };
            }

            // Actualizar la mascota en la base de datos
            const { data: mascotaActualizada, error: updateError } = await supabase
                .from('mascota')
                .update(datosActualizados)
                .eq('id_mascota', idMascota)
                .select();

            if (updateError) throw updateError;

            return {
                success: true,
                data: mascotaActualizada[0]
            };

        } catch (error) {
            console.error('Error al actualizar la mascota:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar la mascota'
            };
        }
    }
    
    /**
     * Obtiene todas las mascotas del usuario actualmente autenticado
     * @returns {Promise<{success: boolean, data?: Array, error?: any}>} - Lista de mascotas del usuario
     */
    static async obtenerMascotasUsuario() {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) return { success: false, noSession: true };
            
            // Obtener las mascotas del usuario
            const { data: mascotas, error: mascotasError } = await supabase
                .from('mascota')
                .select('*')
                .eq('id_usuario', session.user.id);
                
            if (mascotasError) throw mascotasError;
            
            return { success: true, data: mascotas };
            
        } catch (error) {
            // No mostrar error en consola si no hay sesión activa
            if (error.message?.includes('No user') || error.message?.includes('No session')) {
                return { success: false, noSession: true };
            }
            console.error('Error al obtener mascotas del usuario:', error);
            return { success: false, error };
        }
    }
    
    /**
     * Obtiene una mascota por su ID verificando que pertenezca al usuario autenticado
     * @param {number} idMascota - ID de la mascota a buscar
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Datos de la mascota
     */
    static async obtenerMascotaPorId(idMascota) {
        try {
            if (!idMascota) {
                throw new Error('Se requiere el ID de la mascota');
            }

            // Verificar que el usuario esté autenticado
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                throw new Error('Usuario no autenticado');
            }

            // Obtener la mascota con el ID especificado
            const { data: mascota, error } = await supabase
                .from('mascota')
                .select('*')
                .eq('id_mascota', idMascota)
                .single();

            if (error || !mascota) {
                throw new Error('Mascota no encontrada');
            }

            // Verificar que la mascota pertenezca al usuario
            if (mascota.id_usuario !== user.id) {
                throw new Error('No tienes permiso para acceder a esta mascota');
            }

            return { success: true, data: mascota };
            
        } catch (error) {
            console.error('Error al obtener la mascota:', error);
            return { 
                success: false, 
                error: error.message || 'Error al obtener la mascota',
                details: error 
            };
        }
    }
    
    /**
     * Elimina una mascota y su imagen asociada
     * @param {number} idMascota - ID de la mascota a eliminar
     * @returns {Promise<{success: boolean, error?: any}>} - Resultado de la operación
     */
    static async borrarMascota(idMascota) {
        try {
            if (!idMascota) {
                throw new Error('Se requiere el ID de la mascota');
            }

            // Verificar que la mascota existe y pertenece al usuario
            const { success: mascotaExiste, data: mascota } = await this.obtenerMascotaPorId(idMascota);
            if (!mascotaExiste) {
                throw new Error('Mascota no encontrada o no tienes permiso para eliminarla');
            }

            // Eliminar la imagen de la mascota si existe
            if (mascota.imagen) {
                const fileName = idMascota;
                const { error: deleteImageError } = await supabase.storage
                    .from('imagenes')
                    .remove([`mascotas/${fileName}`]);
                
                // No lanzar error si la imagen no existe, continuar con la eliminación del registro
                if (deleteImageError && !deleteImageError.message.includes('not found')) {
                    console.warn('Advertencia al eliminar la imagen de la mascota:', deleteImageError);
                    // Continuar con la eliminación del registro aunque falle la eliminación de la imagen
                }
            }

            // Eliminar la mascota de la base de datos
            const { error: deleteError } = await supabase
                .from('mascota')
                .delete()
                .eq('id_mascota', idMascota);
                
            if (deleteError) throw deleteError;
            
            return { success: true };
            
        } catch (error) {
            console.error('Error al eliminar la mascota:', error);
            return { 
                success: false, 
                error: error.message || 'Error al eliminar la mascota',
                details: error 
            };
        }
    }
    
    /**
     * Obtiene todas las citas de las mascotas del usuario actualmente autenticado
     * @returns {Promise<{success: boolean, data?: Array<{
     *   id_cita: string,
     *   fecha: string,
     *   hora_inicio: string,
     *   hora_final: string,
     *   is_canceled: boolean,
     *   mascota: { id_mascota: string, nombre: string },
     *   servicio: { id_servicio: number, nombre: string }
     * }>, error?: any}>} - Lista de citas de las mascotas del usuario
     */
    static async obtenerCitasMascotas() {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) return { success: false, noSession: true };
            
            // 1. Obtener todas las mascotas del usuario
            const { data: mascotas, error: mascotasError } = await supabase
                .from('mascota')
                .select('id_mascota')
                .eq('id_usuario', session.user.id);
                
            if (mascotasError) throw mascotasError;
            
            // Si el usuario no tiene mascotas, retornar array vacío
            if (!mascotas || mascotas.length === 0) {
                return { success: true, data: [] };
            }
            
            // Extraer los IDs de las mascotas
            const mascotasIds = mascotas.map(m => m.id_mascota);
            
            // 2. Obtener las citas para todas las mascotas del usuario
            const { data: citas, error: citasError } = await supabase
                .from('cita')
                .select(`
                    id_cita,
                    fecha,
                    hora_inicio,
                    hora_final,
                    is_canceled,
                    mascota: id_mascota (id_mascota, nombre),
                    servicio: id_servicio (id_servicio, nombre_servicio)
                `)
                .in('id_mascota', mascotasIds)
                .order('fecha', { ascending: true })
                .order('hora_inicio', { ascending: true });
                
            if (citasError) throw citasError;
            
            return { 
                success: true, 
                data: citas || [] 
            };
            
        } catch (error) {
            console.error('Error al obtener las citas de las mascotas:', error);
            return { 
                success: false, 
                error: error.message || 'Error al obtener las citas de las mascotas',
                details: error 
            };
        }
    }
    
    /**
     * Obtiene los datos de un usuario por su ID
     * @param {string} userId - ID del usuario
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Datos del usuario
     */
    static async obtenerUsuarioPorToken(userId) {
        try {
            // Si no hay ID de usuario, devolver error
            if (!userId) {
                throw new Error('No se proporcionó ID de usuario');
            }
            
            // Obtener datos del usuario desde la tabla usuario junto con su rol
            const { data: userData, error: userError } = await supabase
                .from('usuario')
                .select('*, rol:id_rol(*)')
                .eq('id_usuario', userId)
                .single();
                
            if (userError) throw userError;
            
            // Si no se encuentra el usuario, lanzar error
            if (!userData) {
                throw new Error('Usuario no encontrado en la base de datos');
            }
            
            // Preparar objeto de usuario con rol
            const userObject = {
                id: userData.id_usuario,
                role: userData.rol.nombre_rol,
                // Otros datos que puedan ser necesarios
            };
            
            return { success: true, data: { user: userData, userObject } };
            
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
            return { success: false, error };
        }
    }
}