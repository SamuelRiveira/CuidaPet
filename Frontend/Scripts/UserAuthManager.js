/**
 * Clase encargada de la gestión de autenticación y autorización de usuarios
 * Proporciona funciones para verificar el estado de sesión y los roles de usuario
 */
class UserAuthManager {
    /**
     * Verifica el estado de sesión y rol del usuario actual
     * @returns {Object} Estado de sesión y datos del usuario según su rol
     */
    static getUserStatus() {
        // En producción, esta función se conectaría con una API
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
            programador: {
                permissions: ['view_profile', 'system_admin', 'code_access', 'debug_tools', 'manage_users'],
                developerData: {
                    accessLevel: user.accessLevel || 'Full',
                    gitUsername: user.gitUsername || 'dev_' + user.username,
                    developerKey: user.developerKey || 'DEV' + Math.floor(100000 + Math.random() * 900000)
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
     * Simula inicio de sesión (para desarrollo y pruebas)
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña del usuario
     * @param {string} role - Rol del usuario (cliente, empleado, programador)
     * @returns {boolean} - Éxito de la operación
     */
    static login(username, password, role = 'cliente') {
        // En producción, esta función validaría las credenciales con el backend
        // Por ahora, simplemente almacenamos los datos en localStorage
        
        // Validar que los roles sean correctos
        if (!['cliente', 'empleado', 'programador'].includes(role)) {
            console.error('Rol inválido');
            return false;
        }
        
        // Simular ID de usuario
        const userId = 'user_' + Math.floor(1000 + Math.random() * 9000);
        
        // Crear objeto de usuario
        const user = {
            id: userId,
            username: username,
            name: username, // En una implementación real, estos serían diferentes
            email: `${username}@ejemplo.com`,
            role: role,
            lastLogin: new Date().toISOString(),
            photo: '/Frontend/imagenes/img_perfil.png'
        };
        
        // Añadir datos específicos según el rol
        if (role === 'cliente') {
            user.loyaltyPoints = 0;
            user.memberSince = new Date().toISOString();
        } else if (role === 'empleado') {
            user.department = 'General';
            user.position = 'Asistente';
            user.employeeId = 'EMP' + Math.floor(1000 + Math.random() * 9000);
        } else if (role === 'programador') {
            user.accessLevel = 'Full';
            user.gitUsername = 'dev_' + username;
            user.developerKey = 'DEV' + Math.floor(100000 + Math.random() * 900000);
        }
        
        // Guardar en localStorage
        localStorage.setItem('cuidapet_user', JSON.stringify(user));
        
        return true;
    }
    
    /**
     * Cierra la sesión del usuario actual
     * @returns {boolean} - Éxito de la operación
     */
    static logout() {
        // Remover los datos de usuario del localStorage
        localStorage.removeItem('cuidapet_user');
        return true;
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
