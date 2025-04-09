package dev.samu.cuidapet.api

import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Response

data class LoginRequest(val nombre: String, val password: String)
data class User(val idusuario: Int, val nombre: String, val rol: String)

interface ApiService {
    @POST("login")
    suspend fun login(@Body request: LoginRequest): Response<User>
}