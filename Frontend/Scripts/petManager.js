
import { API } from "./APIS.js";

class PetManager {

    async getPetsData() {
        try {
            // Obtener el perfil del usuario para el nombre del propietario
            const { success: perfilSuccess, data: perfil, error: perfilError } = await API.obtenerPerfilUsuario();
            
            if (!perfilSuccess) {
                console.error('Error al obtener perfil del usuario:', perfilError);
                return [];
            }
            
            // Crear el nombre completo del propietario
            const nombrePropietario = [
                perfil?.nombre || '',
                perfil?.apellidos || ''
            ].filter(Boolean).join(' ').trim() || 'Sin propietario';
            
            // Obtener las mascotas del usuario desde la API
            const { success, data: mascotas, error } = await API.obtenerMascotasUsuario();
            
            if (!success) {
                console.error('Error al obtener mascotas:', error);
                return [];
            }
            
            if (!mascotas || mascotas.length === 0) {
                return [];
            }
            
            // Mapear los datos de la API al formato esperado por la aplicación
            return mascotas.map(mascota => ({
                id: mascota.id_mascota?.toString() || '',
                name: mascota.nombre || 'Sin nombre',
                type: mascota.especie || 'Sin especificar',
                breed: mascota.raza || 'Sin raza específica',
                age: mascota.edad?.toString() || '0',
                ageUnit: 'años',
                appointment: mascota.proxima_cita || 'No programada',
                photoUrl: mascota.url_imagen || '/Frontend/imagenes/default-pet.png',
                weight: mascota.peso ? `${mascota.peso} kg` : 'No especificado',
                owner: nombrePropietario,
                medicalHistory: mascota.historial_medico || [],
                allergies: mascota.alergia || [],
                notes: mascota.notas_especiales || ''
            }));
            
        } catch (error) {
            console.error('Error en getPetsData:', error);
            return [];
        }
    }

    createPet(petData) {
        // Método vacío para implementar en el futuro
        // TODO: Implementar llamada a API
        return true;
    }

    deletePet(petId) {
        // Método vacío para implementar en el futuro
        // TODO: Implementar llamada a API
        return true;
    }

    /**
     * Maneja la edición de una mascota
     * @param {Object} editedData - Datos editados de la mascota
     * @returns {Promise<boolean>} - True si la operación fue exitosa, false en caso contrario
     */
    async handlePetEdit(editedData) {
        try {
            // Obtener el ID de la mascota de los datos editados
            const petId = editedData.id;
            console.log('Datos recibidos para actualización:', editedData);

            if (!petId) {
                console.error('No se encontró el ID de la mascota en los datos editados');
                return false;
            }


            // Mapear los campos editados al formato esperado por la API
            const datosActualizados = {};
            
            // Mapear campos básicos
            const fieldMappings = {
                'nombre': 'nombre',
                'edad': 'edad',
                'peso': 'peso',
                'historial_medico': 'historial_medico',
                'notas_especiales': 'notas_especiales'
            };

            // Mapear campos directos
            Object.entries(fieldMappings).forEach(([source, target]) => {
                if (editedData[source] !== undefined) {
                    datosActualizados[target] = editedData[source];
                }
            });
            
            // Mapear alergias (si existen)
            if (editedData.alergias) {
                // Convertir el string de alergias en un array si es necesario
                const alergiasArray = typeof editedData.alergias === 'string' 
                    ? editedData.alergias.split(',').map(a => a.trim()).filter(a => a)
                    : Array.isArray(editedData.alergias) 
                        ? editedData.alergias 
                        : [editedData.alergias];
                
                if (alergiasArray.length > 0) {
                    datosActualizados.alergia = alergiasArray;
                }
            }

            // Si hay una nueva foto, agregarla a los datos
            if (editedData.foto && (editedData.foto.startsWith('data:image') || editedData.foto.startsWith('http'))) {
                // Si es una URL, ya está en el servidor, solo guardar la ruta
                if (editedData.foto.startsWith('http')) {
                    datosActualizados.foto = editedData.foto;
                } else {
                    // Si es una imagen en base64, convertirla a archivo
                    const response = await fetch(editedData.foto);
                    const blob = await response.blob();
                    const file = new File([blob], 'pet_photo.jpg', { type: 'image/jpeg' });
                    datosActualizados.imagen = file;
                }
            }

            // Asegurarse de que el ID sea un número
            const petIdNum = Number(petId);
            if (isNaN(petIdNum)) {
                throw new Error('ID de mascota no válido');
            }
            
            console.log('Datos a enviar a la API:', datosActualizados);
            
            console.log('Actualizando mascota con ID:', petIdNum, 'Tipo:', typeof petIdNum);
            
            // Llamar a la API para actualizar la mascota
            const { success, data, error } = await API.editarMascota(petIdNum, datosActualizados);
            
            if (!success) {
                throw new Error(error || 'Error al actualizar la mascota');
            }
            
            console.log('Mascota actualizada correctamente:', data);
            return true;
            
        } catch (error) {
            console.error('Error en handlePetEdit:', error);
            // Mostrar mensaje de error al usuario
            alert(`Error al guardar los cambios: ${error.message}`);
            return false;
        }
    }
}

export { PetManager };