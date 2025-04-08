package dev.samu.cuidapet.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dev.samu.cuidapet.api.LoginRequest
import dev.samu.cuidapet.api.RetrofitInstance
import dev.samu.cuidapet.api.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

class UsuarioViewModel : ViewModel() {
    private val _usuario = MutableStateFlow<User?>(null)
    val usuario: StateFlow<User?> = _usuario

    private val _mensajeError = MutableStateFlow<String?>(null)
    val mensajeError: StateFlow<String?> = _mensajeError

    fun login(usuario: String, password: String) {
        viewModelScope.launch {
            try {
                val response = RetrofitInstance.api.login(LoginRequest(usuario, password))
                if (response.isSuccessful) {
                    _usuario.value = response.body()
                    _mensajeError.value = null
                } else {
                    _mensajeError.value = "Error de autenticación: ${response.code()}"
                }
            } catch (e: IOException) {
                _mensajeError.value = "Error de conexión: No se pudo conectar al servidor"
                Log.i("Error", e.toString())
            } catch (e: HttpException) {
                _mensajeError.value = "Error en la respuesta del servidor"
            }
        }
    }
}
