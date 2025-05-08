// Función para generar el HTML de una tarjeta de mascota
function createPetCardHTML(pet) {
    return `
        <div class="pet-card" data-pet-id="${pet.id}">
            <div style="position: relative;">
                <img src="${pet.photoUrl}" alt="Foto de ${pet.name}">
                <span class="pet-age">${pet.age} ${pet.ageUnit}</span>
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
                    ${pet.type}</span>
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-breed">${pet.breed}</p>
                <div class="pet-appointment">
                    <strong>Próxima cita:</strong> ${pet.appointment}
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar todas las tarjetas de mascotas
function renderPetCards() {
    const petsGrid = document.querySelector('.pets-grid');

    // Limpia el contenedor antes de añadir nuevas tarjetas
    petsGrid.innerHTML = '';

    // Obtiene los datos de las mascotas
    const pets = getPetsData();

    // Genera y añade el HTML para cada mascota
    pets.forEach(pet => {
        petsGrid.insertAdjacentHTML('beforeend', createPetCardHTML(pet));
    });

    // Añade los event listeners a las nuevas tarjetas
    addPetCardEventListeners();
}

// NUEVA FUNCIÓN: Carga los detalles de una mascota específica
function loadPetDetails(petId) {
    // Busca la mascota por su ID
    const pets = getPetsData();
    const pet = pets.find(p => p.id === petId);

    if (!pet) {
        console.error('Mascota no encontrada:', petId);
        return;
    }

    // Actualiza el título y la información básica
    document.querySelector('#pet-detail-page h1').textContent = pet.name;
    document.querySelector('#pet-detail-page .pet-tag').nextSibling.textContent = ` ${pet.breed}`;
    document.querySelector('#pet-detail-page .pet-type').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11.25 16.25h1.5L12 17z"></path>
            <path d="M16 14v.5"></path>
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
            <path d="M8 14v.5"></path>
            <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
        </svg>
        ${pet.type}
    `;

    // Actualiza la próxima cita
    document.querySelector('#pet-detail-page .container-right h2').textContent = pet.appointment;

    // Actualiza la foto
    document.querySelector('#pet-detail-page .pet-photo img').src = pet.photoUrl;
    document.querySelector('#pet-detail-page .pet-photo img').alt = `Foto de ${pet.name}`;

    // Actualiza la información básica
    const infoItems = document.querySelectorAll('#pet-detail-page .info-grid .info-item');
    infoItems[0].querySelector('.info-value').textContent = `${pet.age} ${pet.ageUnit}`;
    infoItems[1].querySelector('.info-value').textContent = pet.weight;
    infoItems[2].querySelector('.info-value').textContent = pet.owner;

    // Actualiza el historial médico
    const medicalList = document.querySelector('#pet-detail-page .medical-list');
    medicalList.innerHTML = '';
    pet.medicalHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        medicalList.appendChild(li);
    });

    // Actualiza las alergias
    const allergiesContainer = document.querySelector('#pet-detail-page .allergies');
    allergiesContainer.innerHTML = '<h3>Alergias</h3>';

    if (pet.allergies && pet.allergies.length > 0) {
        pet.allergies.forEach(allergy => {
            const allergyTag = document.createElement('span');
            allergyTag.className = 'allergy-tag';
            allergyTag.textContent = allergy;
            allergiesContainer.appendChild(allergyTag);
        });
    } else {
        const noAllergies = document.createElement('p');
        noAllergies.textContent = 'No se han registrado alergias';
        allergiesContainer.appendChild(noAllergies);
    }

    // Actualiza las notas especiales
    document.querySelector('#pet-detail-page .special-notes p').textContent = pet.notes || 'Sin notas específicas.';
}

// Función para añadir event listeners a las tarjetas de mascotas
function addPetCardEventListeners() {
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            const petId = this.getAttribute('data-pet-id');
            // Carga los detalles de la mascota antes de mostrar la página
            loadPetDetails(petId);
            showPage('pet-detail');
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });

    document.getElementById(pageId + '-page').classList.add('active-page');
}

// Navigation between pages
document.addEventListener('DOMContentLoaded', function() {
    // Renderiza las tarjetas de mascotas al cargar la página
    renderPetCards();

    // Page navigation
    const navLinks = document.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));

            this.classList.add('active');

            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });

    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === targetPage);
            });
        });
    });

    const flexButton = document.querySelector('.btn.btn-primary[data-page="appointments"]');

    if (flexButton) {
        flexButton.addEventListener('click', function(e) {
            e.preventDefault();

            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === targetPage);
            });
        });
    }

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Formulario enviado correctamente!');
            form.reset();
        });
    });

    const addPetBtn = document.getElementById('add-pet-btn');
    const modal = document.getElementById('add-pet-modal');
    const closeModal = document.querySelector('.close-modal');
    const addPetForm = document.getElementById('add-pet-form');

    // Abrir el modal al hacer clic en el botón
    addPetBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Cerrar el modal al hacer clic en la X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    addPetForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener valores del formulario
        const petName = document.getElementById('pet-name').value;
        const petType = document.getElementById('pet-type').value;
        const petBreed = document.getElementById('pet-breed').value;
        const petAge = document.getElementById('pet-age').value;
        const petAgeUnit = document.getElementById('pet-age-unit').value;
        const petAppointment = document.getElementById('pet-appointment').value;

        // Generar un ID basado en el nombre
        const petId = petName.toLowerCase().replace(/\s+/g, '-');

        // Formatea la fecha de la cita si existe
        let appointmentText = 'No programada';
        if (petAppointment) {
            const dateParts = petAppointment.split('-');
            if (dateParts.length === 3) {
                appointmentText = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
        }

        // Crear el objeto de la nueva mascota
        const newPet = {
            id: petId,
            name: petName,
            type: petType,
            breed: petBreed,
            age: petAge,
            ageUnit: petAgeUnit,
            appointment: appointmentText,
            photoUrl: "/api/placeholder/400/320" // Imagen placeholder
        };

        // Añadir la nueva tarjeta a la cuadrícula
        const petsGrid = document.querySelector('.pets-grid');
        petsGrid.insertAdjacentHTML('afterbegin', createPetCardHTML(newPet));

        // Añadir event listener a la nueva tarjeta
        addPetCardEventListeners();

        // Cerrar el modal y resetear el formulario
        modal.style.display = 'none';
        addPetForm.reset();

        // Mostrar confirmación
        alert(`¡${petName} ha sido añadido con éxito!`);
    });

    // Si hay un archivo de imagen seleccionado, manejarlo
    const petPhotoInput = document.getElementById('pet-photo');
    petPhotoInput.addEventListener('change', function(e) {
        // Aquí iría el código para manejar la carga de imágenes
        // Por ejemplo, mostrar una vista previa
        // Este código es solo para referencia y no funcionará realmente sin un backend

        const file = e.target.files[0];
        if (file) {
            // Aquí podrías mostrar una vista previa o indicar que la imagen está lista
            console.log('Archivo seleccionado:', file.name);
        }
    });
});

//Container Login and Register
const contenedor = document.querySelector('.contenedor');

function activar() {
    contenedor.classList.add("active");
}

function desactivar() {
    contenedor.classList.remove("active");
}

function abrir() {
    contenedor.classList.add("active-popup");
}

function cerrar() {
    contenedor.classList.remove("active-popup");
    setTimeout(function () {
        contenedor.classList.remove("active");
    }, 500);
}