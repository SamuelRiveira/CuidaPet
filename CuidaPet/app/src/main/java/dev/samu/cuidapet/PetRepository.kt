package dev.samu.cuidapet

import dev.samu.cuidapet.model.Pet
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

// Repositorio de datos para mascotas
class PetRepository {
    // En el futuro, esto se conectará a una API
    // Por ahora, devolvemos datos estáticos

    private val _pets = MutableStateFlow<List<Pet>>(createDummyPets())
    val pets: StateFlow<List<Pet>> = _pets

    fun getPetById(id: String): Pet? {
        return _pets.value.find { it.id == id }
    }

    private fun createDummyPets(): List<Pet> {
        return listOf(
            Pet(
                id = "1",
                name = "Simba",
                type = "Perro",
                breed = "Golden Retriever",
                age = 3,
                weight = 28.5,
                owner = "María García",
                lastVisit = "10/04/2025",
                nextAppointment = "10/06/2025",
                allergies = listOf("Negros"),
                notes = "Luna es muy juguetona y sociable. Tiene preferencia por premios de hígado.",
                imageId = R.drawable.img_simba
            ),
            Pet(
                id = "2",
                name = "Luna",
                type = "Gato",
                breed = "Gato Persa",
                age = 5,
                weight = 4.2,
                owner = "Juan Rodríguez",
                lastVisit = "22/03/2025",
                nextAppointment = "22/06/2025",
                allergies = listOf("Cacahuetes"),
                notes = "Simba es tranquilo pero puede estresarse en la clínica. Preferir manejo suave.",
                imageId = R.drawable.img_luna
            ),
            Pet(
                id = "3",
                name = "Rocky",
                type = "Perro",
                breed = "Bulldog Francés",
                age = 2,
                weight = 12.3,
                owner = "Ana López",
                lastVisit = "15/04/2025",
                nextAppointment = "Sin próxima cita",
                allergies = listOf("Kiwi", "Gatos"),
                notes = "Rocky necesita vigilancia en días calurosos por su predisposición a problemas respiratorios.",
                imageId = R.drawable.img_rocky
            )
        )
    }
}