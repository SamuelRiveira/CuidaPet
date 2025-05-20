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
            
            // Guardar en localStorage para mantener la sesión
            localStorage.setItem('cuidapet_user', JSON.stringify(userObject));
            
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
            localStorage.removeItem('cuidapet_user');
            
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
            window.location.href = '/Frontend/HTML/Login.html';
            
            // Retornamos éxito ya que hemos limpiado todo lo local
            return { success: true };
            
        } catch (error) {
            console.error('Error inesperado en cerrarSesion:', error);
            // Aún así redirigimos al login
            window.location.href = '/Frontend/HTML/Login.html';
            return { success: false, error };
        }
    }
}