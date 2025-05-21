import { PetManager } from "./PetManager.js";
import { showPage } from "./navigation.js";

// Instanciamos la clase PetManager
const petManager = new PetManager();

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
async function renderPetCards() {
    const petsGrid = document.getElementById('pets-grid');
    if (!petsGrid) {
        console.error('Elemento pets-grid no encontrado');
        return;
    }

    // Limpia la grid antes de añadir nuevas tarjetas
    petsGrid.innerHTML = '';

    // Obtiene los datos de las mascotas del PetManager
    const pets = await petManager.getPetsData();

    // Verifica si hay mascotas
    if (pets.length === 0) {
        // Cambia el estilo a flex para centrar el mensaje
        petsGrid.style.display = 'flex';
        petsGrid.style.justifyContent = 'center';

        // Si no hay mascotas, muestra un mensaje
        petsGrid.innerHTML = `
            <div class="no-pets-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11.25 16.25h1.5L12 17z"></path>
                    <path d="M16 14v.5"></path>
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path>
                    <path d="M8 14v.5"></path>
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
                </svg>
                <h3>No hay mascotas registradas</h3>
                <p>Haz clic en "Añadir mascota" para registrar tu primera mascota.</p>
            </div>
        `;
        return;
    }

    // Si hay mascotas, asegúrate de que la grid tenga el estilo correcto
    petsGrid.style.display = 'grid';
    petsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    petsGrid.style.gap = '2rem';

    // Genera y añade el HTML para cada mascota
    pets.forEach(pet => {
        petsGrid.insertAdjacentHTML('beforeend', createPetCardHTML(pet));
    });

    // Añade los event listeners a las nuevas tarjetas
    addPetCardEventListeners();
}

// Carga los detalles de una mascota específica
async function loadPetDetails(petId) {
    // Busca la mascota por su ID usando la clase PetManager
    const pets = await petManager.getPetsData();
    const pet = pets.find(p => p.id === petId);

    if (!pet) {
        console.error('Mascota no encontrada:', petId);
        return;
    }

    // Actualiza el título y la información básica
    const petNameElement = document.querySelector('#pet-detail-page h1');
    petNameElement.textContent = pet.name;
    petNameElement.id = 'pet-detail-name';
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
    
    let historialMedico = [];
    
    if (Array.isArray(pet.medicalHistory)) {
        historialMedico = pet.medicalHistory;
    } else if (typeof pet.medicalHistory === 'string') {
        historialMedico = pet.medicalHistory.split('\n').filter(item => item.trim());
    }
    
    if (historialMedico.length > 0) {
        historialMedico.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            medicalList.appendChild(li);
        });
    } else {
        const noHistory = document.createElement('p');
        noHistory.textContent = 'No hay historial médico registrado';
        medicalList.appendChild(noHistory);
    }

    // Actualiza las alergias
    const allergiesContainer = document.querySelector('#pet-detail-page .allergies');
    allergiesContainer.innerHTML = '<h3>Alergias</h3>';

    let alergias = [];
    
    // Handle different possible formats of allergies
    if (Array.isArray(pet.allergies)) {
        alergias = pet.allergies;
    } else if (typeof pet.allergies === 'string') {
        // If it's a string, split by commas and trim whitespace
        alergias = pet.allergies.split(',').map(a => a.trim()).filter(a => a);
    }
    
    if (alergias.length > 0) {
        alergias.forEach(allergy => {
            const allergyTag = document.createElement('p');
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

// Ejemplo de uso para eliminar una mascota
function handleDeletePet(petId) {
    if (confirm(`¿Estás seguro de que deseas eliminar esta mascota?`)) {
        const success = petManager.deletePet(petId);
        if (success) {
            alert('Mascota eliminada correctamente');
            // Volvemos a la lista de mascotas y actualizamos la vista
            showPage('pets');
            renderPetCards();
        } else {
            alert('Error al eliminar la mascota');
        }
    }
}

// Ejemplo de uso para crear una nueva mascota
function handleCreatePet(petData) {
    const success = petManager.createPet(petData);
    if (success) {
        alert(`${petData.name} ha sido añadido correctamente`);
        // Actualizamos la vista de mascotas
        renderPetCards();
        return true;
    } else {
        alert('Error al añadir la mascota');
        return false;
    }
}

export { handleDeletePet, handleCreatePet, renderPetCards, addPetCardEventListeners };