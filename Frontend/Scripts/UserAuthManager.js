/**
 * Clase encargada de la gestión de autenticación y autorización de usuarios
 * Proporciona funciones para verificar el estado de sesión y los roles de usuario
 * @requires API Requiere importar la API previamente
 */
import { API } from "./APIS.js";
class UserAuthManager {
    /**
     * Verifica el estado de sesión y rol del usuario actual
     * @returns {Object} Estado de sesión y datos del usuario según su rol
     */
    /**
     * Configura el botón de pedir cita para que siempre redirija al login
     */
    static configureLoginButton() {
        const pedirCitaBtn = document.getElementById('pedir-cita-btn');
        if (pedirCitaBtn) {
            // Clonar el botón para eliminar event listeners previos
            const oldBtn = pedirCitaBtn.cloneNode(true);
            pedirCitaBtn.parentNode.replaceChild(oldBtn, pedirCitaBtn);
            const newPedirCitaBtn = oldBtn;
            
            // Configurar siempre como botón de iniciar sesión
            newPedirCitaBtn.textContent = 'Iniciar Sesión';
            newPedirCitaBtn.removeAttribute('data-page');
            newPedirCitaBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'login.html';
            };
        }
    }
    
    /**
     * Verifica el estado de sesión y rol del usuario actual
     * @returns {Promise<Object>} Estado de sesión y datos del usuario según su rol
     */
    static async getUserStatus() {
        // Obtenemos datos del token almacenado en localStorage
        const storedToken = localStorage.getItem('sb-kmypwriazdbxpwdxfhaf-auth-token');
        
        // Si no hay token almacenado, devolver estado no autenticado
        if (!storedToken) {
            return { isLoggedIn: false };
        }
        
        try {
            // Parsear datos del token para obtener el ID del usuario
            const parsedToken = JSON.parse(storedToken);
            
            // Verificar si existe el ID de usuario en el token
            if (!parsedToken.user?.id) {
                console.error('Token inválido: no contiene ID de usuario');
                return { isLoggedIn: false };
            }
            
            // Obtener información del usuario desde la base de datos usando el ID del token
            const userId = parsedToken.user.id;
            const userResult = await API.obtenerUsuarioPorToken(userId);
            
            // Si hay error o no se encuentra el usuario, devolver estado no autenticado
            if (!userResult.success) {
                console.error('Error al obtener información del usuario:', userResult.error);
                return { isLoggedIn: false };
            }
            
            // Extraer datos del usuario y su rol desde la respuesta
            const { user: userData, userObject } = userResult.data;
            
            // Definir datos específicos y permisos para cada rol
            const roleData = {
                cliente: {
                    permissions: ['view_profile', 'manage_pets', 'schedule_appointments', 'view_history'],
                    clientData: {
                        petLimit: 10,
                        loyaltyPoints: userData.puntos_fidelidad || 0,
                        memberSince: userData.fecha_registro || new Date().toISOString()
                    }
                },
                empleado: {
                    permissions: ['view_profile', 'manage_clients', 'manage_appointments', 'view_internal_data'],
                    employeeData: {
                        department: userData.departamento || 'Atención al cliente',
                        position: userData.cargo || 'Asistente',
                        employeeId: userData.id_empleado || 'EMP' + Math.floor(1000 + Math.random() * 9000)
                    }
                },
                admin: {
                    permissions: ['view_profile', 'system_admin', 'code_access', 'debug_tools', 'manage_users'],
                    adminData: {
                        accessLevel: userData.nivel_acceso || 'Full',
                        gitUsername: userData.git_username || 'admin_' + parsedToken.user.email?.split('@')[0],
                        adminKey: userData.clave_admin || 'ADM' + Math.floor(100000 + Math.random() * 900000)
                    }
                }
            };
            
            // Obtener el rol del usuario desde la base de datos
            const userRole = userObject.role;
            
            // Verificar que sea un rol válido, de lo contrario usar 'cliente' como predeterminado
            const validRole = roleData[userRole] ? userRole : 'cliente';
            
            // Construir y devolver el objeto de estado del usuario con el rol de la base de datos
            return {
                isLoggedIn: true,
                userRole: validRole,
                userData: {
                    id: userData.id_usuario,
                    name: userData.nombre || parsedToken.user.email?.split('@')[0] || 'Usuario',
                    email: parsedToken.user.email || 'usuario@ejemplo.com',
                    photo: userData.foto_perfil || '/Frontend/imagenes/img_perfil.png',
                    // Añadir datos específicos del rol
                    ...(roleData[validRole][validRole + 'Data'] || {})
                },
                permissions: roleData[validRole].permissions,
                lastLogin: new Date(userData.ultimo_login || Date.now())
            };
            
        } catch (error) {
            console.error('Error al procesar el estado del usuario:', error);
            return { isLoggedIn: false };
        }
    }
    
    /**
     * Realiza el inicio de sesión con Supabase
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async login(email, password) {
        try {
            // Usar la API para iniciar sesión
            const resultado = await API.iniciarSesion(email, password);
            
            if (!resultado.success) {
                console.error('Error al iniciar sesión:', resultado.error);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error inesperado al iniciar sesión:', error);
            return false;
        }
    }
    
    /**
     * Cierra la sesión del usuario actual en Supabase
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async logout() {
        try {
            // Usar la API para cerrar sesión
            const resultado = await API.cerrarSesion();
            
            if (!resultado.success) {
                console.error('Error al cerrar sesión:', resultado.error);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error inesperado al cerrar sesión:', error);
            return false;
        }
    }
    
    /**
     * Verifica si el usuario tiene un permiso específico
     * @param {string} permission - Permiso a verificar
     * @returns {Promise<boolean>} - Promise que resuelve a true si tiene el permiso, false si no
     */
    static async hasPermission(permission) {
        const userStatus = await this.getUserStatus();
        
        // Si no hay sesión iniciada, no tiene permisos
        if (!userStatus.isLoggedIn) {
            return false;
        }
        
        // Verificar si el permiso existe en el array de permisos del usuario
        return userStatus.permissions.includes(permission);
    }
    
    /**
     * Actualiza los datos del usuario en sesión
     * @param {Object} userData - Nuevos datos del usuario
     * @returns {boolean} - Éxito de la operación
     */
    static updateUserData(userData) {
        // Obtener datos actuales
        const storedUser = localStorage.getItem('sb-kmypwriazdbxpwdxfhaf-auth-token');
        
        if (!storedUser) {
            return false;
        }
        
        // Parsear y actualizar con nuevos datos
        const currentUser = JSON.parse(storedUser);
        const updatedUser = {...currentUser, ...userData};
        
        // Guardar datos actualizados
        localStorage.setItem('sb-kmypwriazdbxpwdxfhaf-auth-token', JSON.stringify(updatedUser));
        
        return true;
    }
}

export { UserAuthManager };
