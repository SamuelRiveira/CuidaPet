class PetManager {

    getPetsData() {
        // *IMPORTANTE* Cuando no hayan mascotas hay que retornar []

        return [
            {
                id: "luna",
                name: "Luna",
                type: "Gato",
                breed: "Gato Azul Ruso",
                age: "3",
                ageUnit: "años",
                appointment: "10/06/2025",
                photoUrl: "/Frontend/imagenes/img_luna.jpg",
                weight: "4.5 kg",
                owner: "Samuel Riveira Escudero",
                medicalHistory: [
                    "Vacunación completa (01/01/2024)",
                    "Chequeo dental (15/03/2025)",
                    "Desparasitación interna (01/05/2025)"
                ],
                allergies: ["Polen"],
                notes: "Disfruta observar por la ventana y cazar insectos pequeños."
            },
            {
                id: "simba",
                name: "Simba",
                type: "Perro",
                breed: "Labrador Retriever",
                age: "5",
                ageUnit: "años",
                appointment: "22/06/2025",
                photoUrl: "/Frontend/imagenes/img_simba.jpg",
                weight: "28.5 kg",
                owner: "Samuel Riveira Escudero",
                medicalHistory: [
                    "Vacunación completa (12/01/2024)",
                    "Tratamiento contra ácaros (20/02/2025)",
                    "Control de peso (10/04/2025)"
                ],
                allergies: ["Pollo"],
                notes: "Muy activo y obediente. Le encanta nadar."
            },
            {
                id: "rocky",
                name: "Rocky",
                type: "Perro",
                breed: "Bulldog Francés",
                age: "2",
                ageUnit: "años",
                appointment: "No programada",
                photoUrl: "/Frontend/imagenes/img_rocky.jpg",
                weight: "12.3 kg",
                owner: "Samuel Riveira Escudero",
                medicalHistory: [
                    "Revisión respiratoria (05/02/2025)",
                    "Vacunación parcial",
                    "Limpieza de oídos (20/03/2025)"
                ],
                allergies: ["Lácteos"],
                notes: "Sensible al calor. Necesita paseos cortos y frecuentes."
            },
            {
                id: "mia",
                name: "Mia",
                type: "Perro",
                breed: "Caniche Toy",
                age: "8",
                ageUnit: "meses",
                appointment: "02/08/2025",
                photoUrl: "/Frontend/imagenes/img_mia.jpg",
                weight: "3.1 kg",
                owner: "Samuel Riveira Escudero",
                medicalHistory: [
                    "Primera vacunación (03/03/2025)",
                    "Desparasitación externa (10/04/2025)",
                    "Revisión oftalmológica (01/05/2025)"
                ],
                allergies: ["Cereal"],
                notes: "Muy inteligente y fácil de entrenar. Le gusta estar cerca de la gente."
            },
            {
                id: "max",
                name: "Max",
                type: "Perro",
                breed: "Beagle",
                age: "6",
                ageUnit: "años",
                appointment: "27/09/2025",
                photoUrl: "/Frontend/imagenes/img_max.jpg",
                weight: "18.9 kg",
                owner: "Samuel Riveira Escudero",
                medicalHistory: [
                    "Control de peso (01/01/2025)",
                    "Chequeo auditivo (11/03/2025)",
                    "Vacunación completa (22/04/2025)"
                ],
                allergies: ["Soja"],
                notes: "Le encanta olfatear durante los paseos. Muy sociable con otros perros."
            }
        ];
    }

    createPet(petData) {
        // Método vacío para implementar en el futuro
        // Aquí se añadiría la lógica para crear una nueva mascota
        return true;
    }

    deletePet(petId) {
        // Método vacío para implementar en el futuro
        // Aquí se añadiría la lógica para eliminar una mascota
        return true;
    }
}