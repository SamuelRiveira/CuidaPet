// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;
    
    console.log('Elements found:', {
        toggle: !!mobileNavToggle,
        nav: !!nav,
        overlay: !!overlay
    });
    
    // Función para alternar el menú
    function toggleMenu(show) {
        const isOpen = nav.classList.contains('active');
        
        // Si no se especifica show, alternamos el estado actual
        if (show === undefined) {
            show = !isOpen;
        }
        
        console.log('Toggle menu:', { show, isOpen });
        
        if (show) {
            // Abrir menú
            body.style.overflow = 'hidden';
            nav.classList.add('active');
            overlay.classList.add('active');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            
            // Agregar evento de clic en el documento para cerrar al hacer clic fuera
            setTimeout(() => {
                document.addEventListener('click', closeMenuOnClickOutside);
            }, 10);
        } else {
            // Cerrar menú
            nav.classList.remove('active');
            overlay.classList.remove('active');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            
            // Remover el evento de clic del documento
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }
    
    // Función para cerrar el menú al hacer clic fuera
    function closeMenuOnClickOutside(e) {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = mobileNavToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle) {
            toggleMenu(false);
        }
    }
    
    // Evento para el botón de menú
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Toggle button clicked');
            toggleMenu();
        });
    }
    
    // Evento para el overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            console.log('Overlay clicked');
            toggleMenu(false);
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                console.log('Nav link clicked on mobile');
                toggleMenu(false);
            }
        });
    });
    
    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            console.log('Escape key pressed');
            toggleMenu(false);
        }
    });
    
    // Cerrar menú al redimensionar la pantalla
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 767) {
                console.log('Window resized to desktop');
                toggleMenu(false);
            }
        }, 250);
    });
    
    // Inicializar estado del menú
    toggleMenu(false);
});