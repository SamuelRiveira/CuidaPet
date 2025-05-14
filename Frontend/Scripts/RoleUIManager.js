/**
 * Clase encargada de gestionar la interfaz según el rol del usuario
 * Controla la visualización de elementos y opciones de menú basado en permisos
 */
class RoleUIManager {
    constructor() {
        this.userStatus = null;
        this.init();
    }
    
    /**
     * Inicializa el gestor de UI basado en roles
     */
    init() {
        // Obtener estado actual del usuario
        this.refreshUserStatus();
        
        // Configurar la UI según el estado y rol
        this.setupUI();
        
        // Configurar listeners de eventos
        this.setupEventListeners();
    }
    
    /**
     * Actualiza el estado del usuario desde el gestor de autenticación
     */
    refreshUserStatus() {
        this.userStatus = UserAuthManager.getUserStatus();
    }
    
    /**
     * Configura la UI basada en el estado de sesión y rol del usuario
     */
    setupUI() {
        // Configurar menú de navegación
        this.setupNavigation();
        
        // Configurar botones de sesión
        this.setupSessionButtons();
        
        // Si tiene sesión iniciada, cargar componentes específicos del rol
        if (this.userStatus.isLoggedIn) {
            this.loadRoleSpecificComponents();
        }
    }
    
    /**
     * Configura el menú de navegación según el rol
     */
    setupNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        // Guardar enlaces existentes para referencia
        const existingLinks = Array.from(nav.querySelectorAll('a'));
        const homeLink = existingLinks.find(link => link.getAttribute('data-page') === 'home');
        const profileLink = existingLinks.find(link => link.getAttribute('data-page') === 'profile');
        
        // Limpiar el menú actual
        nav.innerHTML = '';
        
        // Agregar enlace de inicio (siempre visible)
        if (homeLink) {
            nav.appendChild(homeLink);
        }
        
        // Si no hay sesión iniciada, solo mostrar "Inicio"
        if (!this.userStatus.isLoggedIn) {
            return;
        }
        
        // Si hay sesión iniciada, agregar enlaces según el rol
        if (this.userStatus.userRole === 'cliente') {
            // Para clientes: mostrar enlaces existentes (mascotas, citas, etc.)
            existingLinks.forEach(link => {
                const page = link.getAttribute('data-page');
                if (page !== 'home') { // Home ya fue agregado
                    nav.appendChild(link);
                }
            });
        } else if (this.userStatus.userRole === 'empleado') {
            // Para empleados: enlaces específicos
            this.addNavLink(nav, 'client-management', 'Clientes', `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            `);
            
            this.addNavLink(nav, 'appointments-admin', 'Gestión Citas', `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            `);
            
            // Agregar enlace de perfil
            if (profileLink) {
                nav.appendChild(profileLink);
            }
        } else if (this.userStatus.userRole === 'programador') {
            // Para programadores: enlaces de administración y desarrollo
            this.addNavLink(nav, 'system-admin', 'Administración', `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
            `);
            
            this.addNavLink(nav, 'debug-tools', 'Herramientas', `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
            `);
            
            this.addNavLink(nav, 'users-admin', 'Usuarios', `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            `);
            
            // Agregar enlace de perfil
            if (profileLink) {
                nav.appendChild(profileLink);
            }
        }
    }
    
    /**
     * Agrega un enlace de navegación
     * @param {HTMLElement} navEl - Elemento nav donde se agregará el enlace
     * @param {string} page - ID de la página destino
     * @param {string} text - Texto del enlace
     * @param {string} iconHTML - HTML del ícono
     */
    addNavLink(navEl, page, text, iconHTML) {
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('data-page', page);
        link.innerHTML = `<i class="icon">${iconHTML}</i> ${text}`;
        navEl.appendChild(link);
    }
    
    /**
     * Configura los botones de control de sesión
     */
    setupSessionButtons() {
        const sessionControl = document.querySelector('.session-control');
        if (!sessionControl) return;
        
        if (this.userStatus.isLoggedIn) {
            // Mostrar botón de cierre de sesión si está autenticado
            sessionControl.innerHTML = `
                <a href="#" class="btn btn-outline" id="logout-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        style="transform: translateY(1.3px);">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                </a>
            `;
            
            // Agregar el evento de cierre de sesión
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    UserAuthManager.logout();
                    // Recargar la página para actualizar el estado
                    window.location.reload();
                });
            }
        } else {
            // Mostrar botón de inicio de sesión si no está autenticado
            sessionControl.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="abrir()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        style="transform: translateY(1.3px);">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Iniciar Sesión
                </a>
            `;
        }
    }
    
    /**
     * Carga componentes específicos según el rol del usuario
     */
    loadRoleSpecificComponents() {
        // Crear las páginas necesarias para cada rol
        this.createRolePages();
        
        // Actualizar el nombre en la interfaz si está disponible
        if (this.userStatus.userData && this.userStatus.userData.name) {
            // Actualizar nombre en ProfileManager para mantener compatibilidad con componentes existentes
            if (typeof ProfileManager !== 'undefined') {
                const currentProfile = ProfileManager.getUserProfile();
                const updatedProfile = {
                    ...currentProfile,
                    name: this.userStatus.userData.name,
                    personalInfo: {
                        ...currentProfile.personalInfo,
                        name: this.userStatus.userData.name
                    }
                };
                
                // Si existe un método para actualizar el perfil
                if (typeof ProfileManager.updateUserProfile === 'function') {
                    ProfileManager.updateUserProfile(updatedProfile);
                }
            }
        }
    }
    
    /**
     * Crea las páginas específicas para cada rol
     */
    createRolePages() {
        const main = document.body;
        
        if (this.userStatus.userRole === 'empleado') {
            // Crear páginas de empleado si no existen
            if (!document.getElementById('client-management-page')) {
                this.createEmployeePages(main);
            }
        } else if (this.userStatus.userRole === 'programador') {
            // Crear páginas de programador si no existen
            if (!document.getElementById('system-admin-page')) {
                this.createDeveloperPages(main);
            }
        }
    }
    
    /**
     * Crea las páginas específicas para empleados
     * @param {HTMLElement} container - Contenedor donde se agregarán las páginas
     */
    createEmployeePages(container) {
        // Página de gestión de clientes
        const clientManagementPage = document.createElement('div');
        clientManagementPage.id = 'client-management-page';
        clientManagementPage.className = 'page';
        clientManagementPage.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>Gestión de Clientes</h1>
                    <p>Administra la información de los clientes de CuidaPet</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Listado de Clientes</h3>
                        <div class="search-container">
                            <input type="text" class="search-input" placeholder="Buscar cliente...">
                            <button class="btn btn-primary">Buscar</button>
                        </div>
                    </div>
                    <div class="client-list">
                        <!-- Tarjetas de clientes de ejemplo -->
                        <div class="client-card">
                            <div class="client-avatar">
                                <img src="/Frontend/imagenes/img_perfil.png" alt="Avatar" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                            </div>
                            <div class="client-info">
                                <h4>Ana García Martínez</h4>
                                <p><i class="fas fa-phone"></i> +34 612 345 678</p>
                                <p><i class="fas fa-map-marker-alt"></i> Calle Mayor 123, Madrid</p>
                                <p><i class="fas fa-paw"></i> 2 mascotas</p>
                                <hr class="client-card-divider">
                                <div class="client-card-actions">
                                    <button class="btn btn-secondary view-pets-btn" onclick="RoleUIManager.showClientPets(this)">Ver Mascotas</button>
                                </div>
                            </div>
                        </div>

                        <div class="client-card">
                            <div class="client-avatar">
                                <img src="/Frontend/imagenes/img_perfil.png" alt="Avatar" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                            </div>
                            <div class="client-info">
                                <h4>Carlos Rodríguez López</h4>
                                <p><i class="fas fa-phone"></i> +34 623 456 789</p>
                                <p><i class="fas fa-map-marker-alt"></i> Avenida de la Paz 45, Barcelona</p>
                                <p><i class="fas fa-paw"></i> 1 mascota</p>
                                <hr class="client-card-divider">
                                <div class="client-card-actions">
                                    <button class="btn btn-secondary view-pets-btn" onclick="RoleUIManager.showClientPets(this)">Ver Mascotas</button>
                                </div>
                            </div>
                        </div>

                        <div class="client-card">
                            <div class="client-avatar">
                                <img src="/Frontend/imagenes/img_perfil.png" alt="Avatar" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                            </div>
                            <div class="client-info">
                                <h4>Elena Fernández Sánchez</h4>
                                <p><i class="fas fa-phone"></i> +34 634 567 890</p>
                                <p><i class="fas fa-map-marker-alt"></i> Plaza del Sol 7, Valencia</p>
                                <p><i class="fas fa-paw"></i> 3 mascotas</p>
                                <hr class="client-card-divider">
                                <div class="client-card-actions">
                                    <button class="btn btn-secondary view-pets-btn" onclick="RoleUIManager.showClientPets(this)">Ver Mascotas</button>
                                </div>
                            </div>
                        </div>

                        <div class="client-card">
                            <div class="client-avatar">
                                <img src="/Frontend/imagenes/img_perfil.png" alt="Avatar" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                            </div>
                            <div class="client-info">
                                <h4>Miguel Torres Ruiz</h4>
                                <p><i class="fas fa-phone"></i> +34 645 678 901</p>
                                <p><i class="fas fa-map-marker-alt"></i> Rambla de Cataluña 22, Sevilla</p>
                                <p><i class="fas fa-paw"></i> 2 mascotas</p>
                                <hr class="client-card-divider">
                                <div class="client-card-actions">
                                    <button class="btn btn-secondary view-pets-btn" onclick="RoleUIManager.showClientPets(this)">Ver Mascotas</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(clientManagementPage);
        
        // Página de administración de citas
        const appointmentsAdminPage = document.createElement('div');
        appointmentsAdminPage.id = 'appointments-admin-page';
        appointmentsAdminPage.className = 'page';
        appointmentsAdminPage.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>Administración de Citas</h1>
                    <p>Gestiona todas las citas programadas en CuidaPet</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Calendario de Citas</h3>
                        <div class="filter-container">
                            <select class="filter-select">
                                <option value="all">Todas las citas</option>
                                <option value="pending">Pendientes</option>
                                <option value="completed">Completadas</option>
                                <option value="cancelled">Canceladas</option>
                            </select>
                            <input type="date" class="date-filter">
                        </div>
                    </div>
                    <div class="appointments-calendar">
                        <p>Cargando calendario de citas...</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(appointmentsAdminPage);
    }
    
    /**
     * Crea las páginas específicas para programadores
     * @param {HTMLElement} container - Contenedor donde se agregarán las páginas
     */
    createDeveloperPages(container) {
        // Página de administración del sistema
        const systemAdminPage = document.createElement('div');
        systemAdminPage.id = 'system-admin-page';
        systemAdminPage.className = 'page';
        systemAdminPage.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>Administración del Sistema</h1>
                    <p>Panel de control para la configuración del sistema</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Configuración General</h3>
                    </div>
                    <div class="system-settings">
                        <div class="setting-group">
                            <h4>Información del Sistema</h4>
                            <div class="setting-item">
                                <span>Versión:</span>
                                <span>1.0.0</span>
                            </div>
                            <div class="setting-item">
                                <span>Último despliegue:</span>
                                <span>${new Date().toLocaleDateString()}</span>
                            </div>
                            <div class="setting-item">
                                <span>Estado:</span>
                                <span class="status-active">Activo</span>
                            </div>
                        </div>
                        <div class="setting-group">
                            <h4>Mantenimiento</h4>
                            <button class="btn btn-primary">Actualizar sistema</button>
                            <button class="btn btn-outline">Modo mantenimiento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(systemAdminPage);
        
        // Página de herramientas de desarrollo
        const debugToolsPage = document.createElement('div');
        debugToolsPage.id = 'debug-tools-page';
        debugToolsPage.className = 'page';
        debugToolsPage.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>Herramientas de Desarrollo</h1>
                    <p>Herramientas para depuración y desarrollo</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Consola de Depuración</h3>
                    </div>
                    <div class="debug-console">
                        <div class="console-output" id="console-output">
                            <div class="log-entry">Sistema iniciado correctamente.</div>
                            <div class="log-entry error">Error en la conexión a la base de datos.</div>
                            <div class="log-entry warning">Advertencia: memoria baja.</div>
                        </div>
                        <div class="console-input">
                            <input type="text" placeholder="Ingrese comando...">
                            <button class="btn btn-primary">Ejecutar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(debugToolsPage);
        
        // Página de administración de usuarios
        const usersAdminPage = document.createElement('div');
        usersAdminPage.id = 'users-admin-page';
        usersAdminPage.className = 'page';
        usersAdminPage.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>Administración de Usuarios</h1>
                    <p>Gestiona los usuarios y sus roles en el sistema</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Usuarios del Sistema</h3>
                        <button class="btn btn-primary">Crear usuario</button>
                    </div>
                    <div class="users-list">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="6">Cargando usuarios...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(usersAdminPage);
    }
    
    /**
     * Configura los listeners de eventos para la UI
     */
    setupEventListeners() {
        // Escuchar clics en los enlaces de navegación
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('nav a');
            if (navLink) {
                e.preventDefault();
                this.handleNavigation(navLink.getAttribute('data-page'));
            }
        });
        
        // Modificar el login.js existente para manejar los roles
        this.enhanceLoginForm();
    }
    
    /**
     * Mejora el formulario de login para manejar roles
     */
    enhanceLoginForm() {
        // Buscar formularios de login y registro
        const loginForm = document.querySelector('.forma-caja.login form');
        const registerForm = document.querySelector('.forma-caja.register form');
        
        // Mejorar formulario de login
        if (loginForm) {
            // Prevenir el comportamiento predeterminado y usar nuestro sistema
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const username = loginForm.querySelector('input[type="text"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                
                // Simular inicio de sesión para desarrollo
                if (username && password) {
                    // Determinar rol (en una implementación real, esto vendría del backend)
                    let role = 'cliente'; // Por defecto
                    
                    // Asignar roles para pruebas según nombre de usuario
                    if (username.includes('empleado')) {
                        role = 'empleado';
                    } else if (username.includes('admin') || username.includes('dev')) {
                        role = 'programador';
                    }
                    
                    // Intentar iniciar sesión
                    const success = UserAuthManager.login(username, password, role);
                    
                    if (success) {
                        // Cerrar el modal de login
                        document.querySelector('.contenedor').style.display = 'none';
                        
                        // Recargar la página para mostrar la interfaz correcta
                        window.location.reload();
                    }
                }
            });
        }
        
        // Mejorar formulario de registro
        if (registerForm) {
            // Prevenir el comportamiento predeterminado y usar nuestro sistema
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const username = registerForm.querySelector('input[type="text"]').value;
                const password = registerForm.querySelector('input[type="password"]').value;
                
                // Comprobar si aceptó términos
                const termsAccepted = registerForm.querySelector('input[type="checkbox"]').checked;
                
                if (username && password && termsAccepted) {
                    // Registrar siempre como cliente
                    const success = UserAuthManager.login(username, password, 'cliente');
                    
                    if (success) {
                        // Cerrar el modal de registro
                        document.querySelector('.contenedor').style.display = 'none';
                        
                        // Recargar la página
                        window.location.reload();
                    }
                }
            });
        }
    }
    
    /**
     * Maneja la navegación entre páginas
     * @param {string} pageId - ID de la página a mostrar
     */
    handleNavigation(pageId) {
        // Obtener todas las páginas
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('nav a');
        
        // Verificar permisos para la página solicitada
        if (!this.canAccessPage(pageId)) {
            console.error('No tienes permiso para acceder a esta página');
            return;
        }
        
        // Ocultar todas las páginas
        pages.forEach(page => {
            page.classList.remove('active-page');
        });
        
        // Desactivar todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar la página solicitada
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active-page');
            
            // Activar el enlace correspondiente
            const activeLink = document.querySelector(`nav a[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    /**
     * Verifica si el usuario puede acceder a una página específica
     * @param {string} pageId - ID de la página a verificar
     * @returns {boolean} - True si puede acceder, false si no
     */
    canAccessPage(pageId) {
        // Si es la página de inicio, siempre permitir
        if (pageId === 'home') {
            return true;
        }
        
        // Si no tiene sesión iniciada, solo permitir home
        if (!this.userStatus.isLoggedIn) {
            return false;
        }
        
        // Mapeo de páginas a permisos requeridos
        const pagePermissions = {
            // Páginas de cliente
            'pets': ['manage_pets'],
            'profile': ['view_profile'],
            'appointments': ['schedule_appointments'],
            
            // Páginas de empleado
            'client-management': ['manage_clients'],
            'appointments-admin': ['manage_appointments'],
            
            // Páginas de programador
            'system-admin': ['system_admin'],
            'debug-tools': ['debug_tools'],
            'users-admin': ['manage_users']
        };
        
        // Si la página no requiere permisos específicos, permitir
        if (!pagePermissions[pageId]) {
            return true;
        }
        
        // Verificar si tiene al menos uno de los permisos requeridos
        return pagePermissions[pageId].some(permission => 
            UserAuthManager.hasPermission(permission)
        );
    }
    
    /**
     * Muestra las mascotas de un cliente específico
     * @param {HTMLElement} button - Botón que activó la acción
     * @static
     */
    static showClientPets(button) {
        // Obtener la tarjeta del cliente desde el botón
        const clientCard = button.closest('.client-card');
        if (!clientCard) return;
        
        // Obtener el nombre del cliente
        const clientName = clientCard.querySelector('h4').textContent;
        
        // Crear un modal para mostrar las mascotas
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mascotas de ${clientName}</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pets-list">
                        <!-- Aquí se cargarán las mascotas del cliente -->
                        <p>Cargando mascotas...</p>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar el modal al DOM
        document.body.appendChild(modal);
        
        // Mostrar el modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Simular carga de mascotas (en una implementación real, esto vendría de una API)
        setTimeout(() => {
            const petsList = modal.querySelector('.pets-list');
            
            // Generar mascotas de ejemplo basadas en el cliente
            if (clientName.includes('Ana')) {
                petsList.innerHTML = `
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_luna.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Luna</h4>
                            <p>Perro - Labrador</p>
                            <p>5 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_mia.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Mia</h4>
                            <p>Gato - Siamés</p>
                            <p>3 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                `;
            } else if (clientName.includes('Carlos')) {
                petsList.innerHTML = `
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_max.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Max</h4>
                            <p>Perro - Bulldog</p>
                            <p>2 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                `;
            } else if (clientName.includes('Elena')) {
                petsList.innerHTML = `
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_rocky.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Rocky</h4>
                            <p>Perro - Pastor Alemán</p>
                            <p>4 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_simba.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Simba</h4>
                            <p>Gato - Persa</p>
                            <p>2 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_perfil.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Bolita</h4>
                            <p>Conejo - Enano</p>
                            <p>1 año</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                `;
            } else {
                petsList.innerHTML = `
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_perfil.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Toby</h4>
                            <p>Perro - Golden Retriever</p>
                            <p>3 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                    <div class="pet-card">
                        <img src="/Frontend/imagenes/img_perfil.jpg" alt="Mascota" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                        <div class="pet-info">
                            <h4>Felix</h4>
                            <p>Gato - Atigrado</p>
                            <p>2 años</p>
                            <button class="btn btn-primary">Ver historial</button>
                        </div>
                    </div>
                `;
            }
        }, 800);
        
        // Configurar evento para cerrar el modal
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
}
