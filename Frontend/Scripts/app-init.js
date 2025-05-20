/**
 * Script de inicialización de la aplicación CuidaPet
*/

// Inicializar el sistema de roles cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del gestor de UI basado en roles
    const roleManager = new RoleUIManager();
    
    // Configurar el botón de pedir cita para que siempre redirija al login
    UserAuthManager.configureLoginButton();
});
