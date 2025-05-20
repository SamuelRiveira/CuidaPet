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
     * @returns {Object} Estado de sesión y datos del usuario según su rol
     */
    static getUserStatus() {
        // TODO: Implementar llamada a API
        // Por ahora, obtenemos datos del localStorage para simulación
        const storedUser = localStorage.getItem('cuidapet_user');
        
        // Si no hay usuario almacenado, devolver estado no autenticado
        if (!storedUser) {
            return { isLoggedIn: false };
        }
        
        // Parsear datos del usuario almacenado
        const user = JSON.parse(storedUser);
        
        // Definir datos específicos y permisos para cada rol
        const roleData = {
            cliente: {
                permissions: ['view_profile', 'manage_pets', 'schedule_appointments', 'view_history'],
                clientData: {
                    petLimit: 10,
                    loyaltyPoints: user.loyaltyPoints || 0,
                    memberSince: user.memberSince || new Date().toISOString()
                }
            },
            empleado: {
                permissions: ['view_profile', 'manage_clients', 'manage_appointments', 'view_internal_data'],
                employeeData: {
                    department: user.department || 'Atención al cliente',
                    position: user.position || 'Asistente',
                    employeeId: user.employeeId || 'EMP' + Math.floor(1000 + Math.random() * 9000)
                }
            },
            admin: {
                permissions: ['view_profile', 'system_admin', 'code_access', 'debug_tools', 'manage_users'],
                adminData: {
                    accessLevel: user.accessLevel || 'Full',
                    gitUsername: user.gitUsername || 'admin_' + user.username,
                    adminKey: user.adminKey || 'ADM' + Math.floor(100000 + Math.random() * 900000)
                }
            }
        };
        
        // Asegurar que el rol del usuario sea válido
        const userRole = roleData[user.role] ? user.role : 'cliente';
        
        // Construir y devolver el objeto de estado del usuario
        return {
            isLoggedIn: true,
            userRole: userRole,
            userData: {
                id: user.id || '1',
                name: user.name || 'Usuario',
                email: user.email || 'usuario@ejemplo.com',
                photo: user.photo || '/Frontend/imagenes/img_perfil.png',
                // Añadir datos específicos del rol
                ...(roleData[userRole][userRole + 'Data'] || {})
            },
            permissions: roleData[userRole].permissions,
            lastLogin: new Date(user.lastLogin || Date.now())
        };
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
     * @returns {boolean} - True si tiene el permiso, false si no
     */
    static hasPermission(permission) {
        const userStatus = this.getUserStatus();
        
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
        const storedUser = localStorage.getItem('cuidapet_user');
        
        if (!storedUser) {
            return false;
        }
        
        // Parsear y actualizar con nuevos datos
        const currentUser = JSON.parse(storedUser);
        const updatedUser = {...currentUser, ...userData};
        
        // Guardar datos actualizados
        localStorage.setItem('cuidapet_user', JSON.stringify(updatedUser));
        
        return true;
    }
}

export { UserAuthManager };
