package dev.samu.cuidapet.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class RegistroViewModel : ViewModel() {
    private val _usuarioRegistrado = MutableStateFlow<Map<String, String>?>(null)
    val usuarioRegistrado: StateFlow<Map<String, String>?> = _usuarioRegistrado

    private val _mensajeError = MutableStateFlow<String?>(null)
    val mensajeError: StateFlow<String?> = _mensajeError

    fun setUsuarioRegistrado(usuario: Map<String, String>) {
        viewModelScope.launch {
            _usuarioRegistrado.value = usuario
        }
    }

    fun setMensajeError(mensaje: String?) {
        viewModelScope.launch {
            _mensajeError.value = mensaje
        }
    }

    fun limpiarDatos() {
        viewModelScope.launch {
            _usuarioRegistrado.value = null
            _mensajeError.value = null
        }
    }
}