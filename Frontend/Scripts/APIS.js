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
            // Paso 1: Registrar usuario con Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });
            
            if (authError) throw authError;
            
            // Paso 2: Crear un registro en la tabla usuario con el id del usuario autenticado
            const { data: userData, error: userError } = await supabase
                .from('usuario')
                .insert([
                    {
                        id_usuario: authData.user.id,
                        id_rol: 1 // Id_rol 1 como se solicitó
                    }
                ]);
                
            if (userError) throw userError;
            
            return { success: true, data: { auth: authData, user: userData } };
            
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return { success: false, error };
        }
    }
}