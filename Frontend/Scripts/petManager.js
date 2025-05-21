
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
            
            // Obtener las alergias para cada mascota
            const mascotasConAlergias = await Promise.all(
                mascotas.map(async (mascota) => {
                    const { success, data: alergias } = await API.obtenerAlergiasMascota(mascota.id_mascota);
                    
                    // Mapear los datos de la API al formato esperado por la aplicación
                    return {
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
                        allergies: success ? alergias.map(a => a.nombre) : [],
                        notes: mascota.notas_especiales || ''
                    };
                })
            );
            
            return mascotasConAlergias;
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

    handlePetEdit(editedData) {
        // Método vacío para implementar en el futuro
        // TODO: Implementar llamada a API
        return true;
    }
}

export { PetManager };