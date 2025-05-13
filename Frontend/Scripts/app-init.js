/**
 * Script de inicialización de la aplicación CuidaPet
 * Se encarga de configurar componentes de UI, gestión de sesión y roles
 */

// Inicializar el sistema de roles cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del gestor de UI basado en roles
    const roleManager = new RoleUIManager();
    
    // Configurar el botón de pedir cita para que siempre sea de iniciar sesión
    const pedirCitaBtn = document.getElementById('pedir-cita-btn');
    if (pedirCitaBtn) {
        // Eliminar cualquier event listener previo para evitar duplicados
        const oldBtn = pedirCitaBtn.cloneNode(true);
        pedirCitaBtn.parentNode.replaceChild(oldBtn, pedirCitaBtn);
        const newPedirCitaBtn = oldBtn;
        
        // Configurar siempre como botón de iniciar sesión
        newPedirCitaBtn.textContent = 'Iniciar Sesión';
        newPedirCitaBtn.removeAttribute('data-page');
        newPedirCitaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            abrir(); // Abrir el modal de inicio de sesión
        });
    }
});
