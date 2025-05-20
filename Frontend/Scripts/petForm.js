document.addEventListener('DOMContentLoaded', function() {
    const addPetBtn = document.getElementById('add-pet-btn');
    const modal = document.getElementById('add-pet-modal');
    const closeModal = document.querySelector('.close-modal');
    const addPetForm = document.getElementById('add-pet-form');

    // Abrir el modal al hacer clic en el botón
    addPetBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // Cerrar el modal al hacer clic en la X
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    addPetForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const petName = document.getElementById('pet-name').value;
        const petType = document.getElementById('pet-type').value;
        const petBreed = document.getElementById('pet-breed').value;
        const petWeight = parseFloat(document.getElementById('pet-weight').value);
        const petAge = document.getElementById('pet-age').value;
        const petAgeUnit = document.getElementById('pet-age-unit').value;
        const petNotes = document.getElementById('pet-notes').value;

        const petId = petName.toLowerCase().replace(/\s+/g, '-');

        const newPet = {
            id: petId,
            name: petName,
            type: petType,
            breed: petBreed,
            weight: petWeight,
            age: petAge,
            ageUnit: petAgeUnit,
            notes: petNotes || null,
            // TODO: Tener en cuenta la imagen
            photoUrl: "/api/placeholder/400/320"
        };

        // Añadir la mascota a través de la instancia de PetManager
        petManager.createPet(newPet);

        // Opcional: volver a renderizar tarjetas si corresponde
        renderPetCards();

        modal.style.display = 'none';
        addPetForm.reset();

        alert(`¡${petName} ha sido añadida con éxito!`);
    });
});