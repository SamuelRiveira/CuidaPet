package dev.samu.cuidapet.data

data class Usuario(
    val idUsuario: Int,
    val nombre: String,
    val contraseña: String,
    val rol: String
)