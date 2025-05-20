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
     * Obtiene información del usuario desde la base de datos usando el ID almacenado en el token
     * @param {string} userId - ID del usuario obtenido del token de autenticación
     * @returns {Promise<{success: boolean, data?: any, error?: any}>} - Resultado de la operación
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