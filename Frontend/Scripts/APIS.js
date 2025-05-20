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
            // Cerrar sesión en Supabase
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            // Eliminar datos de sesión del localStorage
            localStorage.removeItem('cuidapet_user');
            
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return { success: false, error };
        }
    }
}