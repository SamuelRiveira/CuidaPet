import { PetManager } from './PetManager.js';

// Create a global instance of PetManager
const petManager = new PetManager();

document.addEventListener('DOMContentLoaded', function() {
    const addPetBtn = document.getElementById('add-pet-btn');
    const modal = document.getElementById('add-pet-modal');
    const closeModal = document.querySelector('.close-modal');
    const addPetForm = document.getElementById('add-pet-form');

    // Abrir el modal al hacer clic en el botón
    addPetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'block';
    });

    // Cerrar el modal al hacer clic en la X
    closeModal.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Variable para controlar el estado del envío
    let isSubmitting = false;

    // Función para manejar el envío del formulario
    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        // Si ya se está procesando un envío, no hacer nada
        if (isSubmitting) return;
        
        const submitBtn = addPetForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        try {
            // Marcar como enviando
            isSubmitting = true;
            
            // Deshabilitar el botón para evitar múltiples envíos
            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';

            const petName = document.getElementById('pet-name').value;
            const petType = document.getElementById('pet-type').value;
            const petBreed = document.getElementById('pet-breed').value;
            const petWeight = parseFloat(document.getElementById('pet-weight').value) || null;
            const petAge = document.getElementById('pet-age').value || null;
            const petAgeUnit = document.getElementById('pet-age-unit').value;
            const petNotes = document.getElementById('pet-notes').value;
            const petImage = document.getElementById('pet-photo').files[0] || null;

            const newPet = {
                name: petName,
                type: petType,
                breed: petBreed,
                weight: petWeight,
                age: petAge,
                ageUnit: petAgeUnit,
                notas_especiales: petNotes || null,
                imagen: petImage
            };

            console.log('Creando mascota con datos:', newPet);

            // Añadir la mascota a través de la instancia de PetManager
            const result = await petManager.createPet(newPet);
            
            if (result && result.success) {
                console.log('Mascota creada exitosamente:', result.data);
                // Cerrar el modal y resetear el formulario solo si la operación fue exitosa
                modal.style.display = 'none';
                addPetForm.reset();
                
                // Mostrar un solo mensaje de éxito
                if (!window.petCreationAlertShown) {
                    window.petCreationAlertShown = true;
                    alert(`¡${petName} ha sido añadida con éxito!`);
                    
                    // Recargar la lista de mascotas después de un breve retraso
                    setTimeout(() => {
                        if (window.location.pathname.endsWith('mascotas.html')) {
                            window.location.reload();
                        }
                        window.petCreationAlertShown = false;
                    }, 100);
                }
            } else {
                throw new Error(result?.error || 'Error desconocido al crear la mascota');
            }
        } catch (error) {
            console.error('Error al crear la mascota:', error);
            if (!window.errorAlertShown) {
                window.errorAlertShown = true;
                alert(`Error al crear la mascota: ${error.message}`);
                setTimeout(() => { window.errorAlertShown = false; }, 1000);
            }
        } finally {
            // Restaurar el estado del formulario
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    // Manejar el envío del formulario
    addPetForm.addEventListener('submit', handleSubmit, { once: false });
});