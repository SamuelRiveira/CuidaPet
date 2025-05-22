/**
 * Servicio de notificaciones para mostrar mensajes al usuario
 */
class NotificationService {
    constructor() {
        // Asegurarse de que los estilos estén en el documento
        this.ensureStyles();
    }

    /**
     * Muestra una notificación de éxito
     * @param {string} message - Mensaje a mostrar
     * @param {number} [duration=4000] - Duración en milisegundos que se mostrará la notificación
     */
    showSuccess(message, duration = 4000) {
        this.showNotification(message, 'success', duration);
    }

    /**
     * Muestra una notificación de error
     * @param {string} message - Mensaje a mostrar
     * @param {number} [duration=4000] - Duración en milisegundos que se mostrará la notificación
     */
    showError(message, duration = 4000) {
        this.showNotification(message, 'error', duration);
    }

    /**
     * Muestra una notificación de advertencia
     * @param {string} message - Mensaje a mostrar
     * @param {number} [duration=4000] - Duración en milisegundos que se mostrará la notificación
     */
    showWarning(message, duration = 4000) {
        this.showNotification(message, 'warning', duration);
    }

    /**
     * Muestra una notificación de información
     * @param {string} message - Mensaje a mostrar
     * @param {number} [duration=4000] - Duración en milisegundos que se mostrará la notificación
     */
    showInfo(message, duration = 4000) {
        this.showNotification(message, 'info', duration);
    }

    /**
     * Muestra una notificación personalizada
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, warning, info)
     * @param {number} duration - Duración en milisegundos
     * @private
     */
    showNotification(message, type = 'info', duration = 4000) {
        const colors = {
            success: { bg: '#d4edda', text: '#155724', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3' },
            error: { bg: '#f8d7da', text: '#721c24', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
            warning: { bg: '#fff3cd', text: '#856404', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            info: { bg: '#d1ecf1', text: '#0c5460', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        };

        const { bg, text, icon } = colors[type] || colors.info;
        
        // Crear elemento para el mensaje
        const messageContainer = document.createElement('div');
        messageContainer.className = `notification-message notification-${type}`;
        messageContainer.style.position = 'fixed';
        messageContainer.style.bottom = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.backgroundColor = bg;
        messageContainer.style.color = text;
        messageContainer.style.padding = '15px 20px';
        messageContainer.style.borderRadius = '4px';
        messageContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        messageContainer.style.zIndex = '1000';
        messageContainer.style.transition = 'all 0.3s ease';
        messageContainer.style.animation = 'notificationSlideIn 0.3s forwards';
        messageContainer.style.display = 'flex';
        messageContainer.style.alignItems = 'center';
        messageContainer.style.maxWidth = '350px';
        messageContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; flex-shrink: 0;">
                <path d="${icon}"></path>
            </svg>
            <span>${message}</span>
        `;
        
        // Agregar el mensaje al DOM
        document.body.appendChild(messageContainer);
        
        // Eliminar el mensaje después de la duración especificada
        setTimeout(() => {
            messageContainer.style.animation = 'notificationFadeOut 0.3s forwards';
            setTimeout(() => {
                messageContainer.remove();
            }, 300);
        }, duration);
    }

    /**
     * Asegura que los estilos necesarios estén en el documento
     * @private
     */
    ensureStyles() {
        if (!document.getElementById('notification-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'notification-styles';
            styleEl.textContent = `
                @keyframes notificationSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes notificationFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                /* Estilos para notificaciones apiladas */
                .notification-message {
                    margin-bottom: 10px;
                }
                
                .notification-message:last-child {
                    margin-bottom: 0;
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
}

// Exportar una instancia global
const notificationService = new NotificationService();

export { NotificationService, notificationService };
