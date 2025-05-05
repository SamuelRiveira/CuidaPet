package dev.samu.cuidapet.model

import androidx.compose.ui.graphics.Color
import dev.samu.cuidapet.R
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

// Modelo de datos para la mascota
data class Pet(
    val id: String = "",
    val name: String = "",
    val type: String = "", // "Perro" o "Gato"
    val breed: String = "",
    val age: Int = 0,
    val weight: Double = 0.0,
    val owner: String = "",
    val lastVisit: String = "",
    val nextAppointment: String = "",
    val allergies: List<String> = emptyList(),
    val notes: String = "",
    val imageId: Int = R.drawable.img_luna // Imagen por defecto
)