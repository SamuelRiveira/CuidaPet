/**
 * Script de inicialización de la aplicación CuidaPet
 * Se encarga de configurar componentes de UI, gestión de sesión y roles
 */

// Inicializar el sistema de roles cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del gestor de UI basado en roles
    const roleManager = new RoleUIManager();
    
    // Configurar el botón de pedir cita según el estado de inicio de sesión
    const pedirCitaBtn = document.getElementById('pedir-cita-btn');
    if (pedirCitaBtn) {
        const userStatus = UserAuthManager.getUserStatus();
        
        // Eliminar cualquier event listener previo para evitar duplicados
        const oldBtn = pedirCitaBtn.cloneNode(true);
        pedirCitaBtn.parentNode.replaceChild(oldBtn, pedirCitaBtn);
        const newPedirCitaBtn = oldBtn;
        
        // Si no está iniciada la sesión, cambiar a botón de iniciar sesión
        if (!userStatus.isLoggedIn) {
            newPedirCitaBtn.textContent = 'Iniciar Sesión';
            newPedirCitaBtn.removeAttribute('data-page');
            newPedirCitaBtn.addEventListener('click', function(e) {
                e.preventDefault();
                abrir(); // Abrir el modal de inicio de sesión
            });
        }
        // Si está iniciada la sesión, mantener como botón de pedir cita
        else {
            newPedirCitaBtn.textContent = 'Pedir cita';
            newPedirCitaBtn.setAttribute('data-page', 'appointments');
            // Añadir nuevamente el event listener para la navegación a citas
            newPedirCitaBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('appointments');
                
                // Actualizar la navegación activa
                document.querySelectorAll('[data-page]').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-page') === 'appointments');
                });
            });
        }
    }
});
