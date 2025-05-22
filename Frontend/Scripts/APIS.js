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
            // Registrar usuario con Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
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
            
            if (sessionError) throw sessionError;
            if (!session) {
                throw new Error('No hay una sesión activa');
            }
            
            const userId = session.user.id;
            
            // Obtener los datos del perfil del usuario
            const { data: perfilData, error: perfilError } = await supabase
                .from('usuario')
                .select('nombre, apellidos, direccion, imagen')
                .eq('id_usuario', userId)
                .single();
                
            if (perfilError) throw perfilError;
            
            return { 
                success: true, 
                data: {
                    nombre: perfilData.nombre || '',
                    apellidos: perfilData.apellidos || '',
                    direccion: perfilData.direccion || '',
                    imagen: perfilData.imagen || ''
                } 
            };
            
        } catch (error) {
            console.error('Error al obtener el perfil del usuario:', error);
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
     * Obtiene información del usuario desde la base de datos usando el ID almacenado en el token
     * @param {string} userId - ID del usuario obtenido del token de autenticación
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
     */
    /**
     * Obtiene todas las mascotas del usuario actualmente autenticado
     * @returns {Promise<{success: boolean, data?: Array, error?: any}>} - Lista de mascotas del usuario
     */
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
     * Obtiene todas las mascotas del usuario actualmente autenticado
     * @returns {Promise<{success: boolean, data?: Array, error?: any}>} - Lista de mascotas del usuario
     */
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
                edad: datosMascota.edad,
                peso: datosMascota.peso || null,
                alergia: datosMascota.alergia || null,
                notas_especiales: datosMascota.notas_especiales || null,
                imagen: datosMascota.imagen || null
            };
            
            // Si se proporciona una imagen, subirla a Supabase Storage
            if (datosMascota.imagen) {
                // Generar un nombre único para el archivo
                const fileName = userId;
                
                // Subir el archivo a Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(`mascotas/${fileName}`, datosMascota.imagen, {
                        cacheControl: '3600',
                        upsert: true
                    });
                
                if (uploadError) throw uploadError;
                
                // Obtener la URL pública de la imagen
                const { data: urlData } = supabase.storage
                    .from('imagenes')
                    .getPublicUrl(`mascotas/${fileName}`);
                
                // Agregar la URL de la imagen a los datos de la mascota
                mascotaData.imagen = urlData.publicUrl;
            }
            
            // Insertar la mascota en la base de datos
            const { data: mascotaCreada, error: insertError } = await supabase
                .from('mascota')
                .insert([mascotaData])
                .select();
                
            if (insertError) throw insertError;
            
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
    
    static async obtenerMascotasUsuario() {
        try {
            // Obtener la sesión actual
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) {
                throw new Error('No hay sesión activa');
            }
            
            // Obtener las mascotas del usuario
            const { data: mascotas, error: mascotasError } = await supabase
                .from('mascota')
                .select('*')
                .eq('id_usuario', session.user.id);
                
            if (mascotasError) throw mascotasError;
            
            return { success: true, data: mascotas };
            
        } catch (error) {
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