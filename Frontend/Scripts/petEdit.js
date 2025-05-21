// Funcionalidad de edición de mascotas
import { PetManager } from './PetManager.js';

// Crear una instancia de PetManager
const petManager = new PetManager();

class PetEdit {
    constructor() {
        this.editableElements = [
            { selector: 'h1[data-component-name="<h1 />"]', type: 'text', label: 'Nombre' },
            { selector: 'h1#pet-detail-name', type: 'text', label: 'Nombre' },
            { selector: 'h1', type: 'text', label: 'Nombre' },
            { selector: 'div.allergies', type: 'allergies', label: 'Alergias' },
            { selector: 'p[data-component-name="<p />"]', type: 'text', label: 'Descripción' },
            { selector: 'div.special-notes p', type: 'text', label: 'Notas especiales' },
            { selector: 'div.info-item .info-value', type: 'text', label: 'Información' },
            { selector: 'div.medical-history > ul', type: 'html', label: 'Historial médico' },
            { selector: 'div[data-component-name="<div />"] > ul', type: 'html', label: 'Historial médico' }
        ];
        this.originalValues = new Map();
        this.photoEditMode = false;
    }

    initEditButton() {
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        
        const containerTop = document.querySelector('.container-top .container-left');
        if (containerTop) {
            containerTop.appendChild(editButton);
        }

        editButton.addEventListener('click', () => this.toggleEditMode());
    }

    toggleEditMode() {
        const confirmButton = document.querySelector('.confirm-edit-button');
        const cancelButton = document.querySelector('.cancel-edit-button');

        if (!confirmButton) {
            this.enableEditMode();
        } else {
            this.disableEditMode(false);
        }
    }

    enableEditMode() {
        // Almacenar valores originales
        this.originalValues.clear();

        this.editableElements.forEach(elem => {
            const elements = document.querySelectorAll(elem.selector);
            elements.forEach(element => {
                // Almacenar valor original
                if (elem.type === 'html') {
                    this.originalValues.set(element, element.innerHTML);
                } else if (elem.type === 'allergies') {
                    // Guardar las alergias actuales como array
                    const allergies = [];
                    element.querySelectorAll('p').forEach(p => {
                        if (p.textContent && p.textContent.trim() !== 'No se han registrado alergias') {
                            allergies.push(p.textContent.trim());
                        }
                    });
                    this.originalValues.set(element, allergies);
                } else {
                    this.originalValues.set(element, element.textContent);
                }

                if (elem.type === 'allergies') {
                    // Guardar el título de alergias
                    const title = element.querySelector('h3')?.outerHTML || '<h3>Alergias</h3>';
                    
                    // Crear contenedor para el modo edición
                    const editContainer = document.createElement('div');
                    
                    // Crear textarea para editar alergias
                    const currentAllergies = this.originalValues.get(element) || [];
                    const textarea = document.createElement('textarea');
                    textarea.value = currentAllergies.join('\n');
                    textarea.style.width = '100%';
                    textarea.style.minHeight = '60px';
                    textarea.style.padding = '5px';
                    textarea.style.border = '1px dashed #3498db';
                    textarea.style.borderRadius = '4px';
                    textarea.style.fontFamily = 'inherit';
                    textarea.style.fontSize = 'inherit';
                    textarea.style.lineHeight = 'inherit';
                    textarea.style.boxSizing = 'border-box';
                    textarea.placeholder = 'Escribe una alergia por línea';
                    textarea.style.resize = 'none';
                    textarea.style.overflow = 'hidden';
                    
                    // Ajustar altura automáticamente al contenido
                    const adjustHeight = () => {
                        textarea.style.height = 'auto';
                        textarea.style.height = textarea.scrollHeight + 'px';
                    };
                    textarea.addEventListener('input', adjustHeight);
                    
                    // Forzar un ajuste inicial
                    setTimeout(adjustHeight, 0);
                    
                    // Actualizar el contenido del elemento
                    element.innerHTML = title;
                    editContainer.appendChild(textarea);
                    element.appendChild(editContainer);
                    element.classList.add('editing');
                } else {
                    // Hacer el elemento editable
                    element.setAttribute('contenteditable', 'true');
                    element.classList.add('editing');
                    
                    // Añadir un borde o indicador visual para elementos editables
                    element.style.border = '1px dashed #3498db';
                    element.style.padding = '5px';
                    element.title = 'Editable - Haz clic para modificar';
                }
            });
        });
        
        // Asegurarse específicamente de que el h1 sea editable
        const mainTitle = document.querySelector('h1');
        if (mainTitle && !mainTitle.hasAttribute('contenteditable')) {
            this.originalValues.set(mainTitle, mainTitle.textContent);
            mainTitle.setAttribute('contenteditable', 'true');
            mainTitle.classList.add('editing');
            mainTitle.style.border = '1px dashed #3498db';
            mainTitle.style.padding = '5px';
            mainTitle.title = 'Editable - Haz clic para modificar';
        }

        // Agregar funcionalidad de edición de foto
        const petPhoto = document.querySelector('.pet-photo img');
        if (petPhoto) {
            this.originalPhotoSrc = petPhoto.src;
            const photoEditOverlay = document.createElement('div');
            photoEditOverlay.classList.add('photo-edit-overlay');
            photoEditOverlay.innerHTML = `
                <input type="file" id="pet-photo-input" accept="image/*" class="photo-input">
                <label for="pet-photo-input" class="photo-edit-label">
                    <span>Editar Foto</span>
                </label>
            `;
            petPhoto.parentElement.appendChild(photoEditOverlay);

            const photoInput = document.getElementById('pet-photo-input');
            photoInput.addEventListener('change', (e) => this.handlePhotoChange(e));
        }

        // Reemplazar el botón de edición con botones de confirmar/cancelar
        const editButton = document.querySelector('.edit-button');
        if (editButton) {
            editButton.remove();
        }

        const buttonContainer = document.querySelector('.container-top .container-left');
        if (buttonContainer) {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirmar';
            confirmButton.classList.add('confirm-edit-button');

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar';
            cancelButton.classList.add('cancel-edit-button');

            confirmButton.addEventListener('click', () => this.confirmEdit());
            cancelButton.addEventListener('click', () => this.disableEditMode(true));

            buttonContainer.appendChild(confirmButton);
            buttonContainer.appendChild(cancelButton);
        }
    }

    handlePhotoChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const petPhoto = document.querySelector('.pet-photo img');
                if (petPhoto) {
                    petPhoto.src = e.target.result;
                    this.photoEditMode = true;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    disableEditMode(isCancelled) {
        this.editableElements.forEach(elem => {
            const elements = document.querySelectorAll(elem.selector);
            elements.forEach(element => {
                if (elem.type === 'allergies' && !isCancelled) {
                    // Guardar las alergias editadas
                    const textarea = element.querySelector('textarea');
                    if (textarea) {
                        const allergies = textarea.value
                            .split('\n')
                            .map(a => a.trim())
                            .filter(a => a);
                        
                        // Actualizar la visualización de alergias
                        element.innerHTML = '<h3>Alergias</h3>';
                        if (allergies.length > 0) {
                            allergies.forEach(allergy => {
                                const p = document.createElement('p');
                                p.textContent = allergy;
                                element.appendChild(p);
                            });
                        } else {
                            const noAllergies = document.createElement('p');
                            noAllergies.textContent = 'No se han registrado alergias';
                            element.appendChild(noAllergies);
                        }
                    }
                } else if (isCancelled && this.originalValues.has(element)) {
                    // Restaurar valores originales si se cancela
                    if (elem.type === 'html') {
                        element.innerHTML = this.originalValues.get(element);
                    } else if (elem.type === 'allergies') {
                        const allergies = this.originalValues.get(element);
                        element.innerHTML = '<h3>Alergias</h3>';
                        if (allergies && allergies.length > 0) {
                            allergies.forEach(allergy => {
                                const p = document.createElement('p');
                                p.textContent = allergy;
                                element.appendChild(p);
                            });
                        } else {
                            const noAllergies = document.createElement('p');
                            noAllergies.textContent = 'No se han registrado alergias';
                            element.appendChild(noAllergies);
                        }
                    } else {
                        element.textContent = this.originalValues.get(element);
                    }
                }
                
                // Quitar atributos de edición
                element.removeAttribute('contenteditable');
                element.classList.remove('editing');
                element.style.border = '';
                element.style.padding = '';
                element.title = '';
            });
        });
        
        // Asegurarse de que el h1 principal también vuelva a su estado normal
        const mainTitle = document.querySelector('h1');
        if (mainTitle) {
            if (isCancelled && this.originalValues.has(mainTitle)) {
                mainTitle.textContent = this.originalValues.get(mainTitle);
            }
            mainTitle.removeAttribute('contenteditable');
            mainTitle.classList.remove('editing');
            mainTitle.style.border = '';
            mainTitle.style.padding = '';
            mainTitle.removeAttribute('title');
        }

        // Restaurar foto si se cancela
        const petPhoto = document.querySelector('.pet-photo img');
        const photoEditOverlay = document.querySelector('.photo-edit-overlay');
        if (petPhoto && photoEditOverlay) {
            if (isCancelled && this.originalPhotoSrc) {
                petPhoto.src = this.originalPhotoSrc;
            }
            photoEditOverlay.remove();
            this.photoEditMode = false;
        }

        // Eliminar botones de confirmar/cancelar y restaurar botón de edición
        const confirmButton = document.querySelector('.confirm-edit-button');
        const cancelButton = document.querySelector('.cancel-edit-button');
        
        if (confirmButton) confirmButton.remove();
        if (cancelButton) cancelButton.remove();

        this.initEditButton();
    }

    confirmEdit() {
        const editedData = {};

        this.editableElements.forEach(elem => {
            const elements = document.querySelectorAll(elem.selector);
            elements.forEach(element => {
                const normalizedKey = elem.label.toLowerCase().replace(/\s+/g, '_');
                if (elem.type === 'html') {
                    editedData[normalizedKey] = element.innerHTML.trim();
                } else {
                    editedData[normalizedKey] = element.textContent.trim();
                }
            });
        });
        
        // Asegurarse de capturar el valor del h1 principal
        const mainTitle = document.querySelector('h1');
        if (mainTitle && mainTitle.hasAttribute('contenteditable')) {
            editedData['nombre'] = mainTitle.textContent.trim();
        }

        // Agregar datos de la foto si se editó
        if (this.photoEditMode) {
            const petPhoto = document.querySelector('.pet-photo img');
            if (petPhoto) {
                editedData['foto'] = petPhoto.src;
            }
        }

        // Validar datos antes de enviar
        const validationErrors = this.validateEditedData(editedData);
        if (validationErrors.length > 0) {
            this.showValidationErrors(validationErrors);
            return;
        }

        // Llamar a la función vacía en petManager para manejar los datos
        petManager.handlePetEdit(editedData);

        // Deshabilitar el modo de edición
        this.disableEditMode(false);
    }

    validateEditedData(data) {
        const errors = [];

        // Agregar reglas de validación
        if (!data.nombre || data.nombre.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (data.alergias && data.alergias.length > 50) {
            errors.push('Las alergias no pueden superar 50 caracteres');
        }

        if (data.descripcion && data.descripcion.length > 200) {
            errors.push('La descripción no puede superar 200 caracteres');
        }

        return errors;
    }

    showValidationErrors(errors) {
        // Crear un modal o alerta para mostrar los errores de validación
        const errorModal = document.createElement('div');
        errorModal.classList.add('validation-error-modal');
        errorModal.innerHTML = `
            <div class="error-content">
                <h3>Errores de validación</h3>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <button class="close-error-modal">Cerrar</button>
            </div>
        `;

        document.body.appendChild(errorModal);

        const closeButton = errorModal.querySelector('.close-error-modal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(errorModal);
        });
    }
}

// Inicializar la funcionalidad de edición cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const petEdit = new PetEdit();
    petEdit.initEditButton();
});
