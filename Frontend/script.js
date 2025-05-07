// Navigation between pages
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const navLinks = document.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase 'active' de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));

            // Añadir clase 'active' al enlace actual
            this.classList.add('active');

            // Mostrar la página correspondiente
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });

    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Obtener página de destino
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);

            // Actualizar estado visual del menú de navegación
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === targetPage);
            });
        });
    });

    const flexButton = document.querySelector('.btn.btn-primary[data-page="appointments"]');

    flexButton.addEventListener('click', function(e) {
        e.preventDefault();

        // Obtener página de destino
        const targetPage = this.getAttribute('data-page');
        showPage(targetPage);

        // Actualizar estado visual del menú de navegación
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === targetPage);
        });
    });


    // Pet cards navigation
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            const petId = this.getAttribute('data-pet-id');
            showPage('pet-detail');
            // In a real app, we would use the petId to load specific pet data
            document.querySelector('#pet-detail-page h1').textContent = petId.charAt(0).toUpperCase() + petId.slice(1);
        });
    });

    function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active-page');
        });
        
        // Show target page
        document.getElementById(pageId + '-page').classList.add('active-page');
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
});