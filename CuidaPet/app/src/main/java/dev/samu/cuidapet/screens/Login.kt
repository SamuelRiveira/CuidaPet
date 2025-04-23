package dev.samu.cuidapet.screens

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.firebase.firestore.FirebaseFirestore
import dev.saries.aprendizaje.navigation.AppScreens

@Composable
fun LoginScreen(navController: NavController, db: FirebaseFirestore) {
    // Estados para manejar los inputs del usuario
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF8ab3cf)),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ElevatedCard(
            elevation = CardDefaults.cardElevation(
                defaultElevation = 16.dp
            )
        ) {
            Column(
                modifier = Modifier.padding(36.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Iniciar Sesión",
                    modifier = Modifier.padding(bottom = 24.dp),
                    fontSize = 36.sp
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                Text(
                    text = "¿No tienes una cuenta? Regístrate",
                    modifier = Modifier
                        .padding(bottom = 24.dp)
                        .clickable {
                            navController.navigate(route = AppScreens.RegisterScreen.route)
                        },
                    style = TextStyle(textDecoration = TextDecoration.Underline),
                    color = Color.Blue
                )

                errorMessage?.let {
                    Text(
                        text = it,
                        color = Color.Red,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                Button(
                    onClick = {
                        if (email.isEmpty() || password.isEmpty()) {
                            errorMessage = "Por favor completa todos los campos"
                        } else {
                            isLoading = true
                            errorMessage = null
                            loginUser(email, password, db, navController) { error ->
                                isLoading = false
                                if (error != null) {
                                    errorMessage = error
                                }
                            }
                        }
                    },
                    enabled = !isLoading
                ) {
                    Text(
                        text = if (isLoading) "Iniciando sesión..." else "Iniciar sesión",
                        color = Color.White
                    )
                }
            }
        }
    }
}

private fun loginUser(
    email: String,
    password: String,
    db: FirebaseFirestore,
    navController: NavController,
    callback: (String?) -> Unit
) {
    // Buscar usuario por email en la colección "users"
    db.collection("users")
        .whereEqualTo("email", email)
        .get()
        .addOnSuccessListener { documents ->
            if (documents.isEmpty) {
                callback("Usuario no encontrado")
                return@addOnSuccessListener
            }

            val userDoc = documents.documents[0]
            val storedPassword = userDoc.getString("password")

            if (storedPassword == password) {
                // Login exitoso
                val userId = userDoc.id
                val userRole = userDoc.getString("role") ?: "client"

                // Navegamos a la pantalla correspondiente según el rol
                when (userRole) {
                    "client" -> navController.navigate(AppScreens.MainScreen.route)
                    "employee" -> navController.navigate(AppScreens.MainScreen.route)
                    "programmer" -> navController.navigate(AppScreens.MainScreen.route)
                    else -> navController.navigate(AppScreens.MainScreen.route)
                }
            } else {
                callback("Contraseña incorrecta")
            }
        }
        .addOnFailureListener { exception ->
            callback("Error al iniciar sesión: ${exception.message}")
        }
}