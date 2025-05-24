/**
 * Clase encargada de gestionar la interfaz según el rol del usuario
 * Controla la visualización de elementos y opciones de menú basado en permisos
 */
import { UserAuthManager } from "./UserAuthManager.js";
import { ProfileManager } from "./ProfileManager.js";
import { API } from "./APIS.js";
import { renderPetCards } from "./PetView.js";
// La función abrir está disponible globalmente desde openLogin.js
class RoleUIManager {
    constructor() {
        this.userStatus = null;
        this.init();
    }
    
    /**
     * Inicializa el gestor de UI basado en roles
     */
    async init() {
        // Obtener estado actual del usuario
        await this.refreshUserStatus();
        
        // Configurar la UI según el estado y rol
        this.setupUI();
        
        // Configurar listeners de eventos
        this.setupEventListeners();
    }
    
    /**
     * Actualiza el estado del usuario desde el gestor de autenticación
     * @returns {Promise<void>}
     */
    async refreshUserStatus() {
        this.userStatus = await UserAuthManager.getUserStatus();
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
            this.createRolePages();
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
        const sessionControl = existingLinks.find(link => link.classList.contains('session-control'));
        
        // Limpiar el menú actual
        nav.innerHTML = '';
        
        // Agregar enlace de inicio (siempre visible)
        if (homeLink) {
            nav.appendChild(homeLink);
        }
        
        // Si no hay sesión iniciada, solo mostrar "Inicio" y el botón de iniciar sesión
        if (!this.userStatus.isLoggedIn) {
            // Añadir el botón de iniciar sesión al final del menú
            this.addSessionControlButton(nav, false);
            return;
        }
        
        // Si hay sesión iniciada, agregar enlaces según el rol
        if (this.userStatus.userRole === 'cliente') {
            // Para clientes: mostrar enlaces existentes (mascotas, citas, etc.)
            existingLinks.forEach(link => {
                const page = link.getAttribute('data-page');
                if (page !== 'home' && !link.classList.contains('session-control')) {
                    nav.appendChild(link);
                }
            });
        } else if (this.userStatus.userRole === 'empleado') {
            // Para empleados: enlaces específicos
            this.addNavLink(nav, 'client-management', 'Usuarios', `
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
        } else if (this.userStatus.userRole === 'admin') {
            // Para admins: enlaces de administración y desarrollo
            
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
        
        // Añadir el botón de cerrar sesión al final del menú
        this.addSessionControlButton(nav, true);
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
     * Añade el botón de control de sesión al menú de navegación
     * @param {HTMLElement} navEl - Elemento de navegación donde añadir el botón
     * @param {boolean} isLoggedIn - Si el usuario está autenticado
     */
    addSessionControlButton(navEl, isLoggedIn) {
        const sessionControlButton = document.createElement('a');
        sessionControlButton.href = 'javascript:void(0);'; // Usar javascript:void(0) para prevenir navegación
        sessionControlButton.classList.add('btn', 'btn-outline', 'session-control');
        
        if (isLoggedIn) {
            // Mostrar botón de cierre de sesión si está autenticado
            sessionControlButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
            `;
            
            // Agregar el evento de cierre de sesión
            sessionControlButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Detener la propagación del evento
                UserAuthManager.logout();
                // Recargar la página para actualizar el estado
                window.location.reload();
            });
        } else {
            // Mostrar botón de inicio de sesión si no está autenticado
            sessionControlButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: translateY(1.3px);">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Iniciar Sesión
            `;
            
            // Agregar el evento de inicio de sesión
            sessionControlButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Detener la propagación del evento
                // Mostrar el popup de login sin afectar la navegación
                this.openLoginPopup(e);
            });
        }
        
        // Asegurarnos de que el botón se agregue al final del menú
        navEl.appendChild(sessionControlButton);
    }

    /**
     * Abre el popup de inicio de sesión
     * @param {Event} e - Evento del clic
     */
    openLoginPopup(e) {
        e.preventDefault();
        // Llamamos a la función abrir importada desde openLogin.js
        // pero también nos aseguramos que el evento funcione con el onclick
        abrir();
    }

    /**
     * Configura los botones de control de sesión (mantenido por compatibilidad)
     */
    setupSessionButtons() {
        // Esta función se mantiene para compatibilidad con código existente
        // Toda la funcionalidad ahora está en setupNavigation y addSessionControlButton
    };
    
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
        } else if (this.userStatus.userRole === 'admin') {
            // Crear páginas de admin si no existen
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
                    <h1>Gestión de Usuarios</h1>
                    <p>Administra la información de los Usuarios de CuidaPet</p>
                </div>
                <div class="content-card">
                    <div class="card-header">
                        <h3>Listado de Usuarios</h3>
                        <div class="search-filter-container">
                            <div class="search-container">
                                <input type="text" id="user-search-input" class="search-input" placeholder="Buscar usuario...">
                                <button id="user-search-btn" class="btn btn-primary">Buscar</button>
                            </div>
                            <div class="filter-container">
                                <select id="user-role-filter" class="filter-select">
                                    <option value="all">Todos los usuarios</option>
                                    <option value="cliente">Solo clientes</option>
                                    <option value="empleado">Solo empleados</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="client-list" class="client-list">
                        <div class="loading-container">
                            <div class="loader"></div>
                            <p>Cargando usuarios...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(clientManagementPage);

        // Cargar usuarios cuando se crea la página
        this.loadAndDisplayUsers();

        // Configurar eventos de búsqueda y filtrado
        const searchInput = document.getElementById('user-search-input');
        const searchButton = document.getElementById('user-search-btn');
        const roleFilter = document.getElementById('user-role-filter');

        // Evento para el botón de búsqueda
        searchButton.addEventListener('click', () => {
            this.filterUsers(searchInput.value, roleFilter.value);
        });

        // Evento para buscar al presionar Enter en el campo de búsqueda
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.filterUsers(searchInput.value, roleFilter.value);
            }
        });

        // Evento para el filtro de rol
        roleFilter.addEventListener('change', () => {
            this.filterUsers(searchInput.value, roleFilter.value);
        });

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
                            <select class="filter-select" id="appointment-status-filter">
                                <option value="all">Todas las citas</option>
                                <option value="pending">Pendientes</option>
                                <option value="completed">Completadas</option>
                                <option value="cancelled">Canceladas</option>
                            </select>
                            <input type="date" class="date-filter" id="appointment-date-filter">
                        </div>
                    </div>
                    <div class="appointments-calendar">
                        <div class="appointments-grid" id="appointments-grid">
                            <p>Cargando calendario de citas...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(appointmentsAdminPage);
    }
    
    /**
     * Carga y muestra todos los usuarios en la página de gestión de usuarios
     */
    async loadAndDisplayUsers() {
        try {
            const clientList = document.getElementById('client-list');
            if (!clientList) return;

            // Intentar obtener todos los usuarios mediante el ProfileManager
            const { success, data, error } = await ProfileManager.getAllUsers();
            
            if (!success || !data) {
                throw new Error(error || 'Error al cargar los usuarios');
            }
            
            // Guardar los datos originales para usarlos en filtrado
            this.allUsers = data;
            
            // Mostrar los usuarios
            this.renderUserCards(data);
            
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            const clientList = document.getElementById('client-list');
            if (clientList) {
                clientList.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error al cargar los usuarios. Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    /**
     * Renderiza las tarjetas de usuarios basado en los datos proporcionados
     * @param {Array} users - Array de objetos usuario para mostrar
     */
    renderUserCards(users) {
        const clientList = document.getElementById('client-list');
        if (!clientList) return;
        
        // Si no hay usuarios para mostrar
        if (!users || users.length === 0) {
            clientList.innerHTML = '<p class="no-results">No se encontraron usuarios con los criterios especificados.</p>';
            return;
        }
        
        // Limpiar la lista antes de agregar nuevas tarjetas
        clientList.innerHTML = '';
        
        // Crear una tarjeta para cada usuario
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'client-card';
            userCard.dataset.userId = user.id_usuario;
            userCard.dataset.userRole = user.rol?.nombre_rol || 'N/A';
            
            // Determinar los botones según el rol
            let actionButtons = '';
            if (user.rol?.nombre_rol === 'cliente') {
                actionButtons = `
                    <button class="btn btn-secondary view-profile-btn" data-user-id="${user.id_usuario}">Ver Perfil</button>
                    <button class="btn btn-secondary view-pets-btn" data-user-id="${user.id_usuario}">Ver Mascotas</button>
                `;
            } else {
                actionButtons = `
                    <button class="btn btn-secondary view-profile-btn" data-user-id="${user.id_usuario}">Ver Perfil</button>
                `;
            }
            
            // Construir HTML de la tarjeta
            userCard.innerHTML = `
                <div class="client-avatar">
                    <img src="${user.imagen || '/Frontend/imagenes/img_perfil.png'}" alt="Avatar" 
                         onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                </div>
                <div class="client-info">
                    <h4>${user.nombre || ''} ${user.apellidos || ''}</h4>
                    <p><i class="fas fa-user-tag"></i> ${user.rol?.nombre_rol || 'Sin rol'}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${user.direccion || 'Dirección no especificada'}</p>
                    <hr class="client-card-divider">
                    <div class="client-card-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
            
            clientList.appendChild(userCard);
        });
        
        // Agregar event listeners para los botones
        this.setupUserCardEventListeners();
    }
    
    /**
     * Configura los event listeners para los botones en las tarjetas de usuario
     */
    setupUserCardEventListeners() {
        // Event listener para botones "Ver Mascotas"
        const viewPetsButtons = document.querySelectorAll('.view-pets-btn');
        viewPetsButtons.forEach(button => {
            button.addEventListener('click', function() {
                RoleUIManager.showClientPets(this);
            });
        });
        
        // Event listener para botones "Ver Perfil"
        const viewProfileButtons = document.querySelectorAll('.view-profile-btn');
        viewProfileButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aquí iría el código para mostrar el perfil del usuario
                // Por ejemplo:
                alert('Ver perfil del usuario: ' + this.dataset.userId);
                // Implementar la funcionalidad de ver perfil
            });
        });
    }
    
    /**
     * Filtra los usuarios según el texto de búsqueda y el rol seleccionado
     * @param {string} searchText - Texto para buscar en nombres de usuarios
     * @param {string} roleFilter - Filtro de rol ('all', 'cliente', 'empleado')
     */
    filterUsers(searchText, roleFilter) {
        // Si no tenemos datos de usuarios, no podemos filtrar
        if (!this.allUsers) return;
        
        // Convertir a minúsculas para comparación insensible a mayúsculas/minúsculas
        const search = searchText.toLowerCase();
        
        // Filtrar los usuarios
        const filteredUsers = this.allUsers.filter(user => {
            // Filtrar por texto de búsqueda en nombre y apellidos
            const fullName = `${user.nombre || ''} ${user.apellidos || ''}`.toLowerCase();
            const matchesSearch = search === '' || fullName.includes(search);
            
            // Filtrar por rol
            const userRole = user.rol?.nombre_rol || '';
            const matchesRole = roleFilter === 'all' || userRole === roleFilter;
            
            return matchesSearch && matchesRole;
        });
        
        // Renderizar los usuarios filtrados
        this.renderUserCards(filteredUsers);
    }
    
    /**
     * Crea las páginas específicas para admins
     * @param {HTMLElement} container - Contenedor donde se agregarán las páginas
     */
    createDeveloperPages(container) {        
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
        
        // Carga de citas si el usuario es empleado
        if (this.userStatus.isLoggedIn && this.userStatus.userRole === 'empleado') {
            this.initAppointmentsCalendar();
        }
    }
    
    /**
     * Inicializa el calendario de citas para empleados
     */
    initAppointmentsCalendar() {
        // Esperar a que el DOM esté completamente cargado para manipularlo
        document.addEventListener('DOMContentLoaded', () => {
            this.loadAppointments();
        });

        // Si el DOM ya está cargado, inicializar directamente
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.loadAppointments();
        }

        // Configurar los filtros de citas
        const statusFilter = document.getElementById('appointment-status-filter');
        const dateFilter = document.getElementById('appointment-date-filter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.loadAppointments();
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.loadAppointments();
            });
        }
    }

    /**
     * Carga las citas usando el gestor de datos de citas
     */
    async loadAppointments() {
        try {
            const appointmentsGrid = document.getElementById('appointments-grid');
            if (!appointmentsGrid) return;

            appointmentsGrid.innerHTML = '<p>Cargando citas...</p>';

            // Obtener los valores de los filtros
            const statusFilter = document.getElementById('appointment-status-filter');
            const dateFilter = document.getElementById('appointment-date-filter');

            const filters = {};
            if (statusFilter && statusFilter.value !== 'all') {
                filters.status = statusFilter.value;
            }
            if (dateFilter && dateFilter.value) {
                filters.date = dateFilter.value;
            }

            // Cargar las citas usando el gestor de datos
            const appointmentManager = new AppointmentDataManager();
            const appointments = await appointmentManager.getAppointments(filters);

            // Si no hay citas, mostrar mensaje
            if (appointments.length === 0) {
                appointmentsGrid.innerHTML = '<p>No hay citas que coincidan con los filtros seleccionados.</p>';
                return;
            }

            // Limpiar el contenedor
            appointmentsGrid.innerHTML = '';

            // Crear las tarjetas de citas
            appointments.forEach(appointment => {
                const appointmentCard = this.createAppointmentCard(appointment);
                appointmentsGrid.appendChild(appointmentCard);
            });

            // Aplicar estilo de grid al contenedor
            appointmentsGrid.style.display = 'grid';
            appointmentsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            appointmentsGrid.style.gap = '2rem';
        } catch (error) {
            console.error('Error al cargar las citas:', error);
            const appointmentsGrid = document.getElementById('appointments-grid');
            if (appointmentsGrid) {
                appointmentsGrid.innerHTML = '<p>Error al cargar las citas. Por favor, intente de nuevo más tarde.</p>';
            }
        }
    }

    /**
     * Crea una tarjeta de cita con el formato especificado
     * @param {Object} appointment - Datos de la cita
     * @returns {HTMLElement} - Elemento de la tarjeta de cita
     */
    createAppointmentCard(appointment) {
        const appointmentDate = appointment.date;
        const day = appointmentDate.getDate();
        const month = AppointmentDataManager.getMonthName(appointmentDate.getMonth());
        const time = AppointmentDataManager.formatTime(appointmentDate);
        const statusLabel = AppointmentDataManager.getStatusLabel(appointment.status);

        // Crear el elemento de la tarjeta
        const cardElement = document.createElement('div');
        cardElement.className = 'appointment-card';
        cardElement.dataset.appointmentId = appointment.id;
        
        // Agregar clase según el estado
        if (statusLabel.class) {
            cardElement.classList.add(statusLabel.class);
        }

        // Construir el HTML de la tarjeta
        cardElement.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="appointment-time">
                    <span class="time-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 148.000000 148.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,148.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
                            <path d="M635 1471 c-295 -47 -526 -252 -606 -536 -32 -112 -32 -278 0 -390 71 -253 263 -445 516 -516 112 -32 278 -32 390 0 253 71 445 263 516 516 29 103 31 277 5 375 -42 153 -82 202 -135 162 -33 -24 -32 -52 4 -150 157 -436 -250 -893 -710 -797 -232 48 -432 248 -480 480 -29 141 -11 268 57 405 101 200 324 339 545 340 115 0 264 -48 361 -117 54 -38 74 -41 102 -13 47 47 11 96 -120 164 -124 65 -313 98 -445 77z"></path>
                            <path d="M696 1208 c-13 -19 -16 -61 -16 -255 0 -220 1 -234 20 -253 18 -18 33 -20 195 -20 162 0 177 2 195 20 11 11 20 29 20 40 0 11 -9 29 -20 40 -18 18 -33 20 -155 20 l-135 0 0 193 c0 215 -6 237 -60 237 -18 0 -34 -8 -44 -22z"></path>
                            </g>
                        </svg>
                    </span>
                    <span class="time">${time}</span>
                </div>
            </div>
            <div class="appointment-content">
                <div class="pet-info-brief">
                    <img src="${appointment.pet.imageUrl}" alt="${appointment.pet.name}" class="pet-thumbnail">
                    <div class="pet-details">
                        <h4>${appointment.pet.name}</h4>
                        <p>${appointment.pet.type} - ${appointment.pet.breed}</p>
                    </div>
                </div>
                <div class="appointment-service">
                    <div class="service-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16 14v.5"></path>
                            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
                            <path d="M8 14v.5"></path>
                            <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
                        </svg>
                    </div>
                    <span class="service-name">${appointment.service.name}</span>
                </div>
                <div class="appointment-owner">
                    <div class="owner-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <span class="owner-name">${appointment.owner.name}</span>
                </div>
                <div class="appointment-vet">
                    <div class="vet-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.908.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <span class="vet-name">${appointment.owner.phone}</span>
                </div>
                <div class="appointment-status">
                    <span class="status-badge ${statusLabel.class}">${statusLabel.text}</span>
                    <div class="appointment-actions">
                        <button class="btn-action btn-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16 14v.5"></path>
                                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
                                <path d="M8 14v.5"></path>
                                <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Mostrar/ocultar botón de edición según el rol del usuario
        const editButton = cardElement.querySelector('.btn-edit');
        if (editButton) {
            // Solo mostrar el botón de edición para empleados
            if (this.userStatus.userRole === 'empleado' || this.userStatus.userRole === 'admin') {
                editButton.style.display = 'flex';
                
                // Agregar evento para cambiar estado de forma cíclica
                editButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    try {
                        // Obtener el estado actual de la cita
                        const currentStatus = appointment.status;
                        
                        // Cambiar al siguiente estado en el ciclo
                        let newStatus;
                        switch (currentStatus) {
                            case 'pending':
                                newStatus = 'completed';
                                break;
                            case 'completed':
                                newStatus = 'cancelled';
                                break;
                            case 'cancelled':
                            default:
                                newStatus = 'pending';
                                break;
                        }
                        
                        // Actualizar el estado en el objeto de la cita
                        appointment.status = newStatus;
                        
                        // Actualizar la UI para reflejar el cambio
                        // Eliminar clases de estado anteriores
                        cardElement.classList.remove('status-pending', 'status-completed', 'status-cancelled');
                        
                        // Obtener la nueva etiqueta y añadir la clase correspondiente
                        const statusLabel = AppointmentDataManager.getStatusLabel(newStatus);
                        cardElement.classList.add(statusLabel.class);
                        
                        // Actualizar el texto del estado
                        const statusBadge = cardElement.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.textContent = statusLabel.text;
                            statusBadge.className = `status-badge ${statusLabel.class}`;
                        }
                        
                        console.log(`Estado de cita ${appointment.id} actualizado a: ${newStatus}`);
                        
                        // En una implementación real, aquí enviaríamos el cambio a la API
                        // const appointmentManager = new AppointmentDataManager();
                        // appointmentManager.updateAppointmentStatus(appointment.id, newStatus);
                    } catch (error) {
                        console.error('Error al actualizar el estado de la cita:', error);
                    }
                });
            } else {
                // Ocultar el botón para clientes
                editButton.style.display = 'none';
            }
        }

        const cancelButton = cardElement.querySelector('.btn-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`Cancelar cita: ${appointment.id}`);
                // Aquí se implementaría la lógica para cancelar la cita
            });
        }

        return cardElement;
    }
    
    /**
     * Maneja la navegación entre páginas
     * @param {string} pageId - ID de la página a mostrar
     */
    handleNavigation(pageId) {
        // Obtener todas las páginas
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('nav a');
        
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
     * Muestra las mascotas de un cliente específico en una página dedicada
     * @param {HTMLElement} button - Botón que activó la acción
     * @static
     */
    static showClientPets(button) {
        // Obtener la tarjeta del cliente desde el botón
        const clientCard = button.closest('.client-card');
        if (!clientCard) return;
        
        // Obtener el nombre del cliente
        const clientName = clientCard.querySelector('h4').textContent;
        
        // Almacenar el nombre del cliente para usarlo en la página
        localStorage.setItem('currentClientName', clientName);
        
        // Obtener la página actual para poder volver a ella después
        const currentPage = document.querySelector('.active-page').id;
        localStorage.setItem('previousPage', currentPage);
        
        // Configurar el botón de retorno y el título de la página
        const backButton = document.getElementById('client-pets-back-button');
        backButton.dataset.page = currentPage.replace('-page', '');
        
        const clientPetsTitle = document.getElementById('client-pets-title');
        clientPetsTitle.textContent = `Mascotas de ${clientName}`;
        
        // Limpiar la lista de mascotas existente
        const petsList = document.querySelector('#client-pets-page .pets-list');
        petsList.innerHTML = '<p>Cargando mascotas...</p>';
        
        // Cambiar a la página de mascotas del cliente
        RoleUIManager.navigateToPage('client-pets');
        
        // Obtener el ID del usuario desde el atributo data-user-id del botón
        const userId = button.dataset.userId;
        
        if (!userId) {
            console.error('No se pudo obtener el ID del usuario');
            petsList.innerHTML = '<p class="error-message">Error al cargar las mascotas. No se pudo identificar al usuario.</p>';
            return;
        }
        
        // Cargar las mascotas del usuario usando la API
        this.loadUserPets(userId, petsList);
    }
    
    /**
     * Carga las mascotas de un usuario específico usando la API
     * @param {string} userId - ID del usuario cuyas mascotas se quieren obtener
     * @param {HTMLElement} petsList - Elemento donde se mostrarán las mascotas
     * @static
     */
    static async loadUserPets(userId, petsList) {
        // TODO: renderPetCards(userId);
        try {
            // Llamar a la API para obtener las mascotas del usuario específico
            const response = await API.obtenerMascotasPorUsuario(userId);
            
            // Verificar si la petición fue exitosa
            if (!response.success) {
                throw new Error(response.error || 'Error al obtener las mascotas');
            }
            
            // Verificar si hay mascotas
            if (!response.data || response.data.length === 0) {
                petsList.innerHTML = '<p class="no-pets-message">Este usuario no tiene mascotas registradas.</p>';
                return;
            }
            
            // Generar HTML para cada mascota
            let petsHTML = '';
            
            response.data.forEach(mascota => {
                // Determinar la edad de la mascota como texto
                const edad = mascota.edad ? `${mascota.edad} ${mascota.edad === 1 ? 'año' : 'años'}` : 'Edad desconocida';
                
                // Construir el HTML para esta mascota
                petsHTML += `
                    <div class="pet-card" data-pet-id="${mascota.id_mascota}" data-pet-name="${mascota.nombre}" data-pet-type="${mascota.tipo || 'No especificado'}" data-pet-breed="${mascota.raza || 'No especificada'}" data-pet-age="${edad}">
                        <div style="position: relative;">
                            <img src="${mascota.imagen || '/Frontend/imagenes/img_perfil.png'}" alt="Foto de ${mascota.nombre}" onerror="this.src='/Frontend/imagenes/img_perfil.png'">
                            <span class="pet-age">${edad}</span>
                        </div>
                        <div class="pet-info">
                            <span class="pet-type">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11.25 16.25h1.5L12 17z"></path>
                                    <path d="M16 14v.5"></path>
                                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
                                    <path d="M8 14v.5"></path>
                                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
                                </svg>
                                ${mascota.tipo || 'No especificado'}
                            </span>
                            <h3 class="pet-name">${mascota.nombre}</h3>
                            <p class="pet-breed">${mascota.raza || 'No especificada'}</p>
                            <div class="pet-appointment">
                                <strong>Próxima cita:</strong> ${mascota.proxima_cita ? new Date(mascota.proxima_cita).toLocaleDateString() : 'No programada'}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // Actualizar el contenido de la lista de mascotas
            petsList.innerHTML = petsHTML;
            
            // Permitir hacer clic en toda la tarjeta para ver el detalle
            const petCards = document.querySelectorAll('#client-pets-page .pet-card');
            petCards.forEach(card => {
                card.addEventListener('click', () => {
                    RoleUIManager.showPetDetail(card);
                });
            });
            
        } catch (error) {
            console.error('Error al cargar las mascotas:', error);
            petsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar las mascotas: ${error.message || 'Se produjo un error desconocido'}</p>
                </div>
            `;
        }

    }
    
    /**
     * Método estático para navegar entre páginas
     * @param {string} pageId - ID de la página a mostrar sin el sufijo "-page"
     * @static
     */
    static navigateToPage(pageId) {
        // Obtener todas las páginas
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('nav a');
        
        // Ocultar todas las páginas
        pages.forEach(page => {
            page.classList.remove('active-page');
        });
        
        // Desactivar todos los enlaces de navegación
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar la página solicitada
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active-page');
            
            // Activar el enlace correspondiente si existe
            const activeLink = document.querySelector(`nav a[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    /**
     * Muestra los detalles de una mascota en la página de detalle
     * @param {HTMLElement} petCard - Tarjeta de la mascota que se quiere ver en detalle
     * @static
     */
    static showPetDetail(petCard) {
        if (!petCard) return;
        
        // Obtener los datos de la mascota desde los atributos data
        const petId = petCard.dataset.petId;
        const petName = petCard.dataset.petName;
        const petType = petCard.dataset.petType;
        const petBreed = petCard.dataset.petBreed;
        const petAge = petCard.dataset.petAge;
        
        // Obtener la imagen de la mascota
        const petImage = petCard.querySelector('img').src;
        
        // Obtener el nombre del cliente (dueño de la mascota)
        const clientName = localStorage.getItem('currentClientName') || 'Cliente';
        
        // Guardar la página actual para poder volver
        const currentPage = document.querySelector('.active-page').id;
        localStorage.setItem('previousPetPage', currentPage);
        
        // Configurar el botón de retorno en la página de detalle
        const backButton = document.querySelector('#pet-detail-page .back-button');
        backButton.dataset.page = currentPage.replace('-page', '');
        backButton.innerHTML = `<span>\u2190</span> Volver a mascotas de ${clientName}`;
        
        // Actualizar la información en la página de detalle
        const detailPage = document.getElementById('pet-detail-page');
        
        // Actualizar el nombre de la mascota
        const petNameElement = detailPage.querySelector('h1');
        petNameElement.textContent = petName;
        
        // Agregar botón de editar junto al título
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'Editar';
        editButton.style.marginLeft = '15px';
        editButton.addEventListener('click', () => {
            // Lógica para editar la mascota
            console.log(`Editar mascota: ${petName}`);
        });
        
        // Actualizar el tipo y raza
        const petTypeElement = detailPage.querySelector('.pet-type');
        petTypeElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11.25 16.25h1.5L12 17z"></path>
                <path d="M16 14v.5"></path>
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
                <path d="M8 14v.5"></path>
                <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
            </svg>
            ${petType}
        `;
        
        const petTypeRaceElement = detailPage.querySelector('.pet-type').nextSibling;
        petTypeRaceElement.textContent = ` ${petBreed}`;
        
        // Actualizar la imagen
        const petImageElement = detailPage.querySelector('.pet-photo img');
        petImageElement.src = petImage;
        petImageElement.alt = `Foto de ${petName}`;
        
        // Actualizar la información básica
        const ageElement = detailPage.querySelector('.info-item:nth-child(1) .info-value');
        ageElement.textContent = petAge;
        
        const weightElement = detailPage.querySelector('.info-item:nth-child(2) .info-value');
        weightElement.textContent = `${Math.floor(Math.random() * 20) + 1} kg`; // Peso aleatorio para demo
        
        const ownerElement = detailPage.querySelector('.info-item:nth-child(3) .info-value');
        ownerElement.textContent = clientName;
        
        // Actualizar próxima cita (fecha aleatoria para demo)
        const nextAppointmentElement = detailPage.querySelector('.container-right h2');
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30) + 1);
        nextAppointmentElement.textContent = randomDate.toLocaleDateString();
        
        // Generar historial médico aleatorio
        const medicalHistoryList = detailPage.querySelector('.medical-list');
        medicalHistoryList.innerHTML = `
            <li><span class="date">${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span> - Vacunación anual</li>
            <li><span class="date">${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span> - Revisión general</li>
            <li><span class="date">${new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span> - Tratamiento antiparasitario</li>
        `;
        
        // Generar alergias aleatorias
        const allergiesSection = detailPage.querySelector('.allergies');
        if (Math.random() > 0.5) {
            allergiesSection.innerHTML = `
                <h3>Alergias</h3>
                <span class="allergy-tag">Pollo</span>
                <span class="allergy-tag">Penicilina</span>
            `;
        } else {
            allergiesSection.innerHTML = `
                <h3>Alergias</h3>
                <p>No se han registrado alergias.</p>
            `;
        }
        
        // Generar notas especiales aleatorias
        const notesSection = detailPage.querySelector('.special-notes');
        if (Math.random() > 0.5) {
            notesSection.innerHTML = `
                <h3>Notas especiales</h3>
                <p>Requiere atención especial debido a una lesión previa en la pata trasera derecha.</p>
            `;
        } else {
            notesSection.innerHTML = `
                <h3>Notas especiales</h3>
                <p>Sin notas específicas.</p>
            `;
        }
        
        // Navegar a la página de detalle
        RoleUIManager.navigateToPage('pet-detail');
    }
}

export { RoleUIManager };
