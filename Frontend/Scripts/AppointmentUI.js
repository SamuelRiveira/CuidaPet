

/**
 * Clase para manejar la UI de citas
 */
class AppointmentUI {
    constructor() {
        this.appointmentsService = new AppointmentManager();
        this.appointmentsContainer = document.querySelector('.appointments-grid');
        this.initAppointments();
        this.setupFormListeners();
    }

    /**
     * Inicializa el listado de citas
     */
    async initAppointments() {
        try {
            const appointments = await this.appointmentsService.getAppointments();
            this.renderAppointments(appointments);
        } catch (error) {
            console.error('Error al cargar las citas:', error);
            this.showErrorMessage();
        }
    }

    /**
     * Renderiza las citas en el DOM
     * @param {Array} appointments - Array de objetos de citas
     */
    renderAppointments(appointments) {
        // Limpia el contenedor antes de agregar nuevas citas
        this.appointmentsContainer.innerHTML = '';

        // Restablecer estilos de cuadrícula
        this.appointmentsContainer.style.display = 'grid';
        this.appointmentsContainer.style.justifyContent = '';
        this.appointmentsContainer.style.alignItems = '';

        // Si no hay citas, muestra un mensaje
        if (!appointments || appointments.length === 0) {
            this.showNoAppointmentsMessage();
            return;
        }

        // Renderiza cada cita
        appointments.forEach(appointment => {
            this.appointmentsContainer.appendChild(this.createAppointmentCard(appointment));
        });
    }

    /**
     * Crea el elemento de tarjeta para una cita
     * @param {Object} appointment - Objeto con la información de la cita
     * @returns {HTMLElement} - Elemento DOM de la tarjeta de cita
     */
    createAppointmentCard(appointment) {
        // Extraer la fecha para formatearla
        const date = new Date(appointment.date);
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const month = monthNames[date.getMonth()];

        // Crear el elemento de la tarjeta
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="appointment-time">
                    <span class="time-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="18" height="18" viewBox="0 0 148.000000 148.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,148.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
                            <path d="M635 1471 c-295 -47 -526 -252 -606 -536 -32 -112 -32 -278 0 -390 71 -253 263 -445 516 -516 112 -32 278 -32 390 0 253 71 445 263 516 516 29 103 31 277 5 375 -42 153 -82 202 -135 162 -33 -24 -32 -52 4 -150 157 -436 -250 -893 -710 -797 -232 48 -432 248 -480 480 -29 141 -11 268 57 405 101 200 324 339 545 340 115 0 264 -48 361 -117 54 -38 74 -41 102 -13 47 47 11 96 -120 164 -124 65 -313 98 -445 77z"/>
                            <path d="M696 1208 c-13 -19 -16 -61 -16 -255 0 -220 1 -234 20 -253 18 -18 33 -20 195 -20 162 0 177 2 195 20 11 11 20 29 20 40 0 11 -9 29 -20 40 -18 18 -33 20 -155 20 l-135 0 0 193 c0 215 -6 237 -60 237 -18 0 -34 -8 -44 -22z"/>
                            </g>
                        </svg>
                    </span>
                    <span class="time">${appointment.time} ${parseInt(appointment.time) >= 12 ? 'PM' : 'AM'}</span>
                </div>
            </div>
            <div class="appointment-content">
                <div class="pet-info-brief">
                    <img src="${appointment.petImage}" alt="${appointment.petName}" class="pet-thumbnail">
                    <div class="pet-details">
                        <h3 class="pet-name">${appointment.petName}</h3>
                        <p class="appointment-type">${appointment.type}</p>
                        <p class="appointment-vet">${appointment.veterinarian}</p>
                    </div>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-cancel" data-id="${appointment.id}">Cancelar cita</button>
                    <button class="btn btn-primary" data-id="${appointment.id}">Modificar</button>
                </div>
            </div>
        `;

        // Agregar eventos a los botones
        const cancelBtn = card.querySelector('.btn-cancel');
        const editBtn = card.querySelector('.btn-primary');
        
        cancelBtn.addEventListener('click', () => this.showCancelConfirmation(appointment.id));
        editBtn.addEventListener('click', () => this.appointmentsService.handleEditAppointment(appointment.id));

        return card;
    }

    /**
     * Muestra un mensaje cuando no hay citas
     */
    showNoAppointmentsMessage() {
        // Añadir clases de flex para centrar el contenido
        this.appointmentsContainer.style.display = 'flex';
        this.appointmentsContainer.style.justifyContent = 'center';
        this.appointmentsContainer.style.alignItems = 'center';

        const messageElement = document.createElement('div');
        messageElement.className = 'no-appointments-message';
        messageElement.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <h3>No hay ninguna cita</h3>
                <p>Programa una nueva cita para tus mascotas usando el formulario de abajo.</p>
            </div>
        `;
        this.appointmentsContainer.appendChild(messageElement);
    }

    /**
     * Muestra un mensaje de error si hay problemas al cargar las citas
     */
    showErrorMessage() {
        const messageElement = document.createElement('div');
        messageElement.className = 'error-message';
        messageElement.innerHTML = `
            <div class="empty-state error">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Error al cargar las citas</h3>
                <p>Ha ocurrido un problema al cargar tus citas. Por favor, intenta de nuevo más tarde.</p>
            </div>
        `;
        this.appointmentsContainer.appendChild(messageElement);
    }

    /**
     * Popula los select de mascotas y servicios con datos del formulario
     */
    async populateFormData() {
        try {
            const formData = await this.appointmentsService.getAppointmentFormData();
            
            // Obtener referencias a los select
            const petSelect = document.getElementById('pet-select');
            const serviceSelect = document.getElementById('service-select');
            const dateInput = document.getElementById('appointment-date');
            const timeInput = document.getElementById('appointment-time');

            // Limpiar opciones existentes (excepto la primera)
            while (petSelect.options.length > 1) {
                petSelect.remove(1);
            }
            while (serviceSelect.options.length > 1) {
                serviceSelect.remove(1);
            }

            // Añadir opciones de mascotas
            formData.pets.forEach(pet => {
                const option = document.createElement('option');
                option.value = pet.value;
                option.textContent = pet.label;
                petSelect.appendChild(option);
            });

            // Añadir opciones de servicios
            formData.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.value;
                option.textContent = service.label;
                serviceSelect.appendChild(option);
            });

            // Configurar validación de tiempo ocupado considerando la fecha
            this.setupTimeValidation(formData.occupiedTimeSlots, dateInput, timeInput);
        } catch (error) {
            console.error('Error al cargar los datos del formulario:', error);
        }
    }

    /**
     * Configura la validación de tiempo ocupado
     * @param {Array} occupiedSlots - Lista de intervalos de tiempo ocupados
     * @param {HTMLInputElement} dateInput - Input de fecha
     * @param {HTMLInputElement} timeInput - Input de tiempo
     */
    setupTimeValidation(occupiedSlots, dateInput, timeInput) {
        // Eliminar cualquier validador previo
        if (timeInput.validateTime) {
            timeInput.removeEventListener('change', timeInput.validateTime);
        }
        if (dateInput.validateDate) {
            dateInput.removeEventListener('change', dateInput.validateDate);
        }

        // Función para validar la combinación de fecha y hora
        const validateDateTime = () => {
            const selectedDate = dateInput.value;
            const selectedTime = timeInput.value;
            
            // Si no hay fecha o tiempo seleccionado, no validamos
            if (!selectedDate || !selectedTime) return;
            
            const occupiedSlot = this.findOccupiedSlot(selectedDate, selectedTime, occupiedSlots);

            // Eliminar advertencias previas
            const existingWarning = document.getElementById('time-warning');
            if (existingWarning) {
                existingWarning.remove();
            }

            // Si el tiempo está ocupado, mostrar advertencia
            if (occupiedSlot) {
                const warningElement = document.createElement('div');
                warningElement.id = 'time-warning';
                warningElement.className = 'warning-message';
                warningElement.textContent = `Advertencia: Este horario (${selectedTime}) está ocupado entre ${occupiedSlot.start} y ${occupiedSlot.end} el día ${this.formatDate(occupiedSlot.date)}`;
                warningElement.style.color = 'orange';
                warningElement.style.marginTop = '10px';

                // Insertar la advertencia después del input de tiempo
                timeInput.parentNode.insertBefore(warningElement, timeInput.nextSibling);
            }
        };

        // Crear nuevos validadores
        timeInput.validateTime = () => validateDateTime();
        dateInput.validateDate = () => validateDateTime();

        // Añadir los eventos de validación
        timeInput.addEventListener('change', timeInput.validateTime);
        dateInput.addEventListener('change', dateInput.validateDate);
    }
    
    /**
     * Formatea una fecha en formato legible
     * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
     * @returns {string} - Fecha formateada
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} de ${month} de ${year}`;
    }

    /**
     * Encuentra el intervalo ocupado para una fecha y tiempo dados
     * @param {string} date - Fecha a verificar en formato YYYY-MM-DD
     * @param {string} time - Hora a verificar en formato HH:mm
     * @param {Array} occupiedSlots - Lista de intervalos de tiempo ocupados
     * @returns {Object|null} Intervalo ocupado o null si no está ocupado
     */
    findOccupiedSlot(date, time, occupiedSlots) {
        return occupiedSlots.find(slot => {
            const startTime = slot.start;
            const endTime = slot.end;
            // Solo verificamos si el tiempo está ocupado para la fecha seleccionada
            return slot.date === date && time >= startTime && time < endTime;
        }) || null;
    }
    
    /**
     * Configura los listeners para el formulario de citas
     */
    setupFormListeners() {
        // Buscar el formulario de citas
        const appointmentForm = document.querySelector('.appointment-form');
        
        if (appointmentForm) {
            // Agregar listener al evento submit del formulario
            appointmentForm.addEventListener('submit', this.submitAppointmentForm.bind(this));
        }
    }
    
    /**
     * Maneja el envío del formulario de citas
     * @param {Event} event - Evento de submit
     */
    submitAppointmentForm(event) {
        // Prevenir comportamiento por defecto del formulario
        event.preventDefault();
        
        // Eliminar mensajes de error previos (excepto time-warning que se genera en otro lugar)
        this.removeFormWarnings();
        
        // Obtener los valores del formulario
        const petId = document.getElementById('pet-select').value;
        const serviceId = document.getElementById('service-select').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        
        // Verificar si existe un mensaje de advertencia de horario ocupado
        const timeWarning = document.getElementById('time-warning');
        if (timeWarning) {
            // Crear y mostrar mensaje de error bloqueante
            const form = document.querySelector('.appointment-form');
            const errorElement = document.createElement('div');
            errorElement.id = 'form-error';
            errorElement.className = 'error-message';
            errorElement.textContent = 'No es posible programar la cita en un horario ocupado. Por favor, selecciona otro horario.';
            errorElement.style.color = '#d9534f'; // color rojo para errores
            errorElement.style.marginTop = '10px';
            errorElement.style.marginBottom = '10px';
            errorElement.style.padding = '8px';
            errorElement.style.borderRadius = '4px';
            errorElement.style.backgroundColor = '#f8d7da';
            errorElement.style.borderLeft = '3px solid #d9534f';
            
            // Insertar mensaje de error antes del botón submit
            const submitButton = form.querySelector('.submit-btn');
            form.insertBefore(errorElement, submitButton);
            return;
        }
        
        // Validar que todos los campos estén completos
        if (!petId || !serviceId || !date || !time) {
            // Crear y mostrar mensaje de error
            const form = document.querySelector('.appointment-form');
            const warningElement = document.createElement('div');
            warningElement.id = 'form-warning';
            warningElement.className = 'warning-message';
            warningElement.textContent = 'Por favor, completa todos los campos del formulario';
            warningElement.style.color = '#d9534f'; // color rojo para errores
            warningElement.style.marginTop = '10px';
            warningElement.style.marginBottom = '10px';
            warningElement.style.padding = '8px';
            warningElement.style.borderRadius = '4px';
            warningElement.style.backgroundColor = '#f8d7da';
            warningElement.style.borderLeft = '3px solid #d9534f';
            
            // Insertar mensaje de error antes del botón submit
            const submitButton = form.querySelector('.submit-btn');
            form.insertBefore(warningElement, submitButton);
            return;
        }
        
        // Llamar al método handleCreateAppointment del servicio
        const result = this.appointmentsService.handleCreateAppointment(petId, serviceId, date, time);
        
        if (result) {
            // Si la operación fue exitosa, mostrar mensaje de éxito
            const form = document.querySelector('.appointment-form');
            const successElement = document.createElement('div');
            successElement.id = 'form-success';
            successElement.className = 'success-message';
            successElement.textContent = '¡Cita programada con éxito!';
            successElement.style.color = '#28a745'; // color verde para éxito
            successElement.style.marginTop = '10px';
            successElement.style.marginBottom = '10px';
            successElement.style.padding = '8px';
            successElement.style.borderRadius = '4px';
            successElement.style.backgroundColor = '#d4edda';
            successElement.style.borderLeft = '3px solid #28a745';
            
            // Insertar mensaje de éxito antes del botón submit
            const submitButton = form.querySelector('.submit-btn');
            form.insertBefore(successElement, submitButton);
            
            // Actualizar la lista de citas
            this.initAppointments(); // Recargar las citas
            
            // Limpiar el formulario después de un breve retraso
            setTimeout(() => {
                document.getElementById('pet-select').value = '';
                document.getElementById('service-select').value = '';
                document.getElementById('appointment-date').value = '';
                document.getElementById('appointment-time').value = '';
                // Eliminar mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    const successMsg = document.getElementById('form-success');
                    if (successMsg) successMsg.remove();
                }, 3000);
            }, 500);
        } else {
            // Mostrar mensaje de error
            const form = document.querySelector('.appointment-form');
            const errorElement = document.createElement('div');
            errorElement.id = 'form-error';
            errorElement.className = 'error-message';
            errorElement.textContent = 'Ha ocurrido un error al programar la cita. Por favor, intenta de nuevo.';
            errorElement.style.color = '#d9534f'; // color rojo para errores
            errorElement.style.marginTop = '10px';
            errorElement.style.marginBottom = '10px';
            errorElement.style.padding = '8px';
            errorElement.style.borderRadius = '4px';
            errorElement.style.backgroundColor = '#f8d7da';
            errorElement.style.borderLeft = '3px solid #d9534f';
            
            // Insertar mensaje de error antes del botón submit
            const submitButton = form.querySelector('.submit-btn');
            form.insertBefore(errorElement, submitButton);
        }
    }
    
    /**
     * Elimina todos los mensajes de advertencia del formulario
     */
    removeFormWarnings() {
        const warnings = [
            document.getElementById('form-warning'),
            document.getElementById('form-error'),
            document.getElementById('form-success')
        ];
        
        warnings.forEach(warning => {
            if (warning) warning.remove();
        });
    }
    
    /**
     * Muestra el modal de confirmación para cancelar una cita
     * @param {number} appointmentId - ID de la cita a cancelar
     */
    showCancelConfirmation(appointmentId) {
        // Obtener referencias al modal y sus elementos
        const modal = document.getElementById('cancel-appointment-modal');
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancel-modal-btn');
        const confirmBtn = document.getElementById('confirm-cancel-btn');
        
        // Guardar referencia al ID de la cita actual
        this.currentAppointmentId = appointmentId;
        
        // Mostrar el modal
        modal.style.display = 'block';
        
        // Configurar eventos
        const closeModal = () => {
            modal.style.display = 'none';
        };
        
        // Evento para cerrar el modal
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        
        // Evento para confirmar la cancelación
        confirmBtn.onclick = () => {
            // Llamar al método para eliminar la cita
            const result = this.appointmentsService.handleDeleteAppointment(this.currentAppointmentId);
            
            if (result) {
                // Cerrar el modal
                closeModal();
                
                // Mostrar mensaje de éxito
                this.showCancellationSuccessMessage();
                
                // Actualizar la lista de citas
                this.initAppointments();
            }
        };
        
        // Cerrar el modal si se hace clic fuera de él
        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };
    }
    
    /**
     * Muestra un mensaje de éxito al cancelar una cita
     */
    showCancellationSuccessMessage() {
        // Crear elemento para el mensaje
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.style.position = 'fixed';
        messageContainer.style.bottom = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.backgroundColor = '#d4edda';
        messageContainer.style.color = '#28a745';
        messageContainer.style.padding = '15px 20px';
        messageContainer.style.borderRadius = '4px';
        messageContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        messageContainer.style.zIndex = '1000';
        messageContainer.style.transition = 'all 0.3s ease';
        messageContainer.style.animation = 'slideIn 0.3s forwards';
        messageContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>La cita ha sido cancelada con éxito</span>
            </div>
        `;
        
        // Agregar estilos de animación al documento si no existen
        if (!document.getElementById('notification-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'notification-styles';
            styleEl.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Agregar el mensaje al DOM
        document.body.appendChild(messageContainer);
        
        // Eliminar el mensaje después de 4 segundos
        setTimeout(() => {
            messageContainer.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                messageContainer.remove();
            }, 300);
        }, 4000);
    }
}

// Inicializar el gestor de citas cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializa si la página de citas está activa o cuando se navegue a ella
    const initAppointments = () => {
        const appointmentsPage = document.getElementById('appointments-page');
        if (appointmentsPage && appointmentsPage.classList.contains('active-page')) {
            const appointmentUI = new AppointmentUI();
            appointmentUI.populateFormData();
            appointmentUI.setupFormListeners(); // Asegurar que los listeners estén configurados
        }
    };

    // Inicializar en la carga de la página
    initAppointments();

    // Agregar un observador para cuando cambie la página activa
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                initAppointments();
            }
        });
    });

    // Observar cambios en la clase de la página de citas para detectar cuando se active
    const appointmentsPage = document.getElementById('appointments-page');
    if (appointmentsPage) {
        observer.observe(appointmentsPage, { attributes: true });
    }
});
