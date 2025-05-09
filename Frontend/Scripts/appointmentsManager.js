/**
 * Clase de servicio para manejar las citas
 * Proporciona métodos para obtener, crear, actualizar y eliminar citas
 */
class AppointmentsService {
    /**
     * Obtiene la lista de citas del usuario
     * @returns {Promise<Array>} - Promise que resuelve con el array de citas
     */
    getAppointments() {
        // Por ahora devolvemos datos simulados
        return new Promise((resolve) => {
            // Simula un retraso de red de 500ms
            setTimeout(() => {
                // Puedes cambiar este valor a [] para simular que no hay citas
                const appointments = [
                    {
                        id: 1,
                        petId: 101,
                        petName: "Luna",
                        petImage: "/Frontend/imagenes/img_luna.jpg",
                        date: "2025-05-15",
                        time: "10:30",
                        type: "Vacunación",
                        veterinarian: "Dr. Martínez"
                    },
                    {
                        id: 2,
                        petId: 102,
                        petName: "Simba",
                        petImage: "/Frontend/imagenes/img_simba.jpg",
                        date: "2025-05-22",
                        time: "16:00",
                        type: "Revisión general",
                        veterinarian: "Dra. López"
                    },
                    {
                        id: 3,
                        petId: 103,
                        petName: "Rocky",
                        petImage: "/Frontend/imagenes/img_rocky.jpg",
                        date: "2025-06-03",
                        time: "12:15",
                        type: "Peluquería",
                        veterinarian: "Estilista Rodríguez"
                    }
                ];
                resolve(appointments);
            }, 500);
        });
    }
}

/**
 * Clase para manejar la UI de citas
 */
class AppointmentsManager {
    constructor() {
        this.appointmentsService = new AppointmentsService();
        this.appointmentsContainer = document.querySelector('.appointments-grid');
        this.initAppointments();
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
        
        cancelBtn.addEventListener('click', () => this.handleCancelAppointment(appointment.id));
        editBtn.addEventListener('click', () => this.handleEditAppointment(appointment.id));

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
     * Manejador para cancelar una cita
     * @param {number} appointmentId - ID de la cita a cancelar
     */
    handleCancelAppointment(appointmentId) {
        console.log(`Cancelar cita ID: ${appointmentId}`);
        // Aquí iría la lógica para cancelar la cita
    }

    /**
     * Manejador para editar una cita
     * @param {number} appointmentId - ID de la cita a editar
     */
    handleEditAppointment(appointmentId) {
        console.log(`Editar cita ID: ${appointmentId}`);
        // Aquí iría la lógica para editar la cita
    }
}

// Inicializar el gestor de citas cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializa si la página de citas está activa o cuando se navegue a ella
    const initAppointments = () => {
        if (document.getElementById('appointments-page').classList.contains('active-page')) {
            new AppointmentsManager();
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
    observer.observe(document.getElementById('appointments-page'), { attributes: true });
});
