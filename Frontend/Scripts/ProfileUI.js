/**
 * Clase encargada de la interfaz de usuario de la página de perfil
 */

import { ProfileManager } from "./ProfileManager.js";

class ProfileUI {
    constructor() {
        this.profileContainer = document.querySelector('.profile-container');
        this.profileData = null;
        this.isEditing = false;
        this.originalHTML = '';
        this.init();
    }

    /**
     * Inicializa la interfaz del perfil
     */
    init() {
        this.loadProfileData();
        this.setupEventListeners();
    }

    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
        // Agregar evento para modal de confirmación
        document.getElementById('profile-page').addEventListener('click', (e) => {
            // Botón de editar perfil
            if (e.target.closest('.action-buttons2 .btn-primary') || e.target.matches('.action-buttons2 .btn-primary svg path')) {
                e.preventDefault();
                this.toggleEditMode();
            }
        });

        // Configurar eventos para los modales
        this.setupModalEvents();
    }

    /**
     * Configura los eventos para los modales
     */
    setupModalEvents() {
        // Cerrar modal al hacer clic en la X
        const closeButtons = document.querySelectorAll('.close-profile-modal, .close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.pet-modal');
                if (modal) {
                    modal.style.display = 'none';
                    // Si estamos cerrando el modal de actualización, cancelamos la edición
                    if (modal.id === 'profile-update-modal') {
                        this.cancelEdit();
                    }
                }
            });
        });

        // Botón cancelar del modal
        const cancelButton = document.getElementById('cancel-profile-edit-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.cancelEdit();
            });
        }

        // Botón confirmar del modal
        const confirmButton = document.getElementById('confirm-profile-update-btn');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                this.updateProfile();
            });
        }
    }

    /**
     * Carga los datos del perfil y construye el HTML dinámicamente
     */
    async loadProfileData() {
        try {
            // Obtener datos del perfil desde ProfileManager
            this.profileData = await ProfileManager.getUserProfile();
            
            // Limpiar el contenedor del perfil
            if (this.profileContainer && this.profileData) {
            this.profileContainer.innerHTML = '';
            
            // Construir la estructura completa del perfil
            this.profileContainer.innerHTML = `
                <!-- Sidebar con información personal -->
                <div class="profile-sidebar">
                    <div class="profile-photo">
                        <img src="${this.profileData.photo}" alt="Foto de perfil">
                    </div>
                    <div class="profile-name">
                        <h2>${this.profileData.name}</h2>
                        </div>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <div class="stat-value">${this.profileData.stats.pets}</div>
                                <div class="stat-label">Mascotas</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${this.profileData.stats.appointments}</div>
                                <div class="stat-label">Citas</div>
                            </div>
                        </div>
                        <div class="action-buttons2">
                            <a href="#" class="btn btn-primary btn-block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                                Editar perfil
                            </a>
                            <a href="#" class="btn btn-outline btn-block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                Contactar Soporte
                            </a>
                        </div>
                    </div>

                    <!-- Contenido principal del perfil -->
                    <div class="profile-content">
                        <!-- Información personal -->
                        <div class="content-card">
                            <div class="card-header">
                                <h3>Información Personal</h3>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Nombre</label>
                                        <input type="text" class="form-control" value="${this.profileData.personalInfo.name}" disabled>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Apellidos</label>
                                        <input type="text" class="form-control" value="${this.profileData.personalInfo.surnames}" disabled>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Dirección</label>
                                <input type="text" class="form-control" value="${this.profileData.personalInfo.address}" disabled>
                            </div>
                        </div>
                    </div>
                `;
                this.originalHTML = this.profileContainer.innerHTML;
            } else {
                console.error('No se pudo cargar el perfil: Datos no disponibles');
                this.profileContainer.innerHTML = '<p>No se pudieron cargar los datos del perfil. Por favor, intente recargar la página.</p>';
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            if (this.profileContainer) {
                this.profileContainer.innerHTML = '<p>Error al cargar el perfil. Por favor, intente nuevamente.</p>';
            }
        }
    }

    /**
     * Activa/desactiva el modo de edición del perfil
     */
    toggleEditMode() {
        if (!this.isEditing) {
            // Guardar el HTML original antes de cambiarlo
            this.originalHTML = this.profileContainer.innerHTML;
            
            // Activar modo edición
            this.enableEditMode();
        } else {
            // Mostrar modal de confirmación
            this.showConfirmationModal();
        }
    }

    /**
     * Habilita el modo de edición en el formulario
     */
    enableEditMode() {
        // Cambiar el estado de edición
        this.isEditing = true;
        
        // Buscar todos los inputs en el área de información personal y habilitarlos
        const inputs = this.profileContainer.querySelectorAll('.content-card input');
        inputs.forEach(input => {
            input.disabled = false;
        });
        
        // Cambiar el texto del botón de editar y agregar botón de cancelar
        const actionButtonsContainer = this.profileContainer.querySelector('.action-buttons2');
        if (actionButtonsContainer) {
            // Guardar referencia al botón de soporte si existe
            const supportButton = actionButtonsContainer.querySelector('.btn-outline');
            const supportButtonHTML = supportButton ? supportButton.outerHTML : '';
            
            // Actualizar los botones
            actionButtonsContainer.innerHTML = `
                <a href="#" class="btn btn-primary btn-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    Guardar cambios
                </a>
                <a href="#" class="btn btn-outline btn-block cancel-edit-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancelar cambios
                </a>
                ${supportButtonHTML}
            `;
            
            // Añadir evento al botón de cancelar
            const cancelEditBtn = actionButtonsContainer.querySelector('.cancel-edit-btn');
            if (cancelEditBtn) {
                cancelEditBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.cancelEdit();
                });
            }
        }
    }

    /**
     * Muestra el modal de confirmación para actualizar el perfil
     */
    showConfirmationModal() {
        const modal = document.getElementById('profile-update-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    /**
     * Cierra el modal especificado
     * @param {string} modalId - ID del modal a cerrar
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Cancela la edición y restaura el HTML original
     */
    cancelEdit() {
        this.isEditing = false;
        
        // Restaurar HTML original
        this.profileContainer.innerHTML = this.originalHTML;
        
        // Cerrar el modal si está abierto
        this.closeModal('profile-update-modal');
        
        // Reconfigurar eventos después de restaurar el HTML
        this.setupEventListeners();
    }

    /**
     * Actualiza el perfil con los datos editados
     */
    updateProfile() {
        // Obtener los valores actualizados
        const name = this.profileContainer.querySelector('.content-card input[type="text"]').value;
        const phone = this.profileContainer.querySelector('.content-card input[type="tel"]').value;
        const address = this.profileContainer.querySelectorAll('.content-card input')[2].value;
        
        // Actualizar los datos del perfil
        const updatedProfileData = {
            ...this.profileData,
            name: name,
            personalInfo: {
                name: name,
                phone: phone,
                address: address
            }
        };
        
        // Llamar a la función del ProfileManager (que sigue vacía por ahora)
        const success = ProfileManager.updateUserProfile(updatedProfileData);
        
        if (success) {
            // Actualizar los datos locales
            this.profileData = updatedProfileData;
            
            // Cerrar el modal de confirmación
            this.closeModal('profile-update-modal');
            
            // Mostrar modal de éxito
            this.showSuccessModal();
            
            // Resetear el estado de edición
            this.isEditing = false;
            
            // Recargar la interfaz con los nuevos datos
            this.loadProfileData();
            
            // Restaurar el botón a su estado original se hace automáticamente al recargar el perfil
        }
    }

    /**
     * Muestra un modal confirmando que el perfil se actualizó correctamente
     */
    showSuccessModal() {
        const modal = document.getElementById('profile-success-modal');
        if (modal) {
            modal.style.display = 'block';
            // Cerrar automáticamente después de 3 segundos
            setTimeout(() => {
                this.closeModal('profile-success-modal');
            }, 3000);
        }
    }
}

// Inicializar la interfaz del perfil cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si estamos en la página de perfil
    const profilePage = document.getElementById('profile-page');
    if (profilePage) {
        const profileUI = new ProfileUI();
    }
});

export { ProfileUI };