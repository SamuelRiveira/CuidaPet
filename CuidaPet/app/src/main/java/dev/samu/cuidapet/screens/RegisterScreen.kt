package dev.samu.cuidapet.screens

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
import java.util.UUID

@Composable
fun RegisterScreen(navController: NavController, db: FirebaseFirestore) {
    // Estados para manejar los inputs del usuario
    var name by remember { mutableStateOf("") }
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
                    text = "Regístrate",
                    modifier = Modifier.padding(bottom = 24.dp),
                    fontSize = 36.sp
                )

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nombre") },
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                Text(
                    text = "¿Ya tienes una cuenta? Inicia sesión",
                    modifier = Modifier
                        .padding(bottom = 24.dp)
                        .clickable {
                            navController.popBackStack()
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
                        if (validateInputs(name, email, password)) {
                            isLoading = true
                            errorMessage = null
                            // Primero verificamos si el email ya existe
                            checkEmailExists(email, db) { exists ->
                                if (exists) {
                                    isLoading = false
                                    errorMessage = "Este email ya está registrado"
                                } else {
                                    // Si no existe, creamos el usuario básico
                                    createUser(name, email, password, db) { userId, error ->
                                        isLoading = false
                                        if (error != null) {
                                            errorMessage = error
                                        } else {
                                            // Al crear exitosamente, pasamos a la pantalla de detalles del cliente
                                            navController.navigate(
                                                "${AppScreens.RegisterClienteScreen.route}/$userId"
                                            )
                                        }
                                    }
                                }
                            }
                        } else {
                            errorMessage = "Por favor completa todos los campos correctamente"
                        }
                    },
                    enabled = !isLoading
                ) {
                    Text(
                        text = if (isLoading) "Creando cuenta..." else "Continuar",
                        color = Color.White
                    )
                }
            }
        }
    }
}

private fun validateInputs(name: String, email: String, password: String): Boolean {
    return name.isNotBlank() &&
            email.isNotBlank() &&
            email.contains("@") &&
            password.isNotBlank()
}

private fun checkEmailExists(
    email: String,
    db: FirebaseFirestore,
    callback: (Boolean) -> Unit
) {
    db.collection("users")
        .whereEqualTo("email", email)
        .get()
        .addOnSuccessListener { documents ->
            callback(documents.size() > 0)
        }
        .addOnFailureListener {
            // En caso de error, asumimos que no existe para continuar
            callback(false)
        }
}

private fun createUser(
    name: String,
    email: String,
    password: String,
    db: FirebaseFirestore,
    callback: (String?, String?) -> Unit
) {
    val userId = UUID.randomUUID().toString()

    val user = hashMapOf(
        "id" to userId,
        "name" to name,
        "email" to email,
        "password" to password,
        "role" to "client"
    )

    db.collection("users")
        .document(userId)
        .set(user)
        .addOnSuccessListener {
            callback(userId, null)
        }
        .addOnFailureListener { exception ->
            callback(null, "Error al crear usuario: ${exception.message}")
        }
}