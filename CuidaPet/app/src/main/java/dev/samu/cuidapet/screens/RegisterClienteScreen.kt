package dev.samu.cuidapet.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.firebase.firestore.FirebaseFirestore
import dev.saries.aprendizaje.navigation.AppScreens
import java.util.UUID

@Composable
fun RegisterClienteScreen(
    navController: NavController,
    db: FirebaseFirestore,
    userId: String? = null
) {
    var address by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
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
                    text = "Detalles de Contacto",
                    modifier = Modifier.padding(bottom = 24.dp),
                    fontSize = 28.sp,
                    color = Color(0xFF388E3C)
                )

                OutlinedTextField(
                    value = address,
                    onValueChange = { address = it },
                    label = { Text("Dirección") },
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Teléfono") },
                    modifier = Modifier.padding(bottom = 24.dp)
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
                        if (validateClientDetails(address, phone)) {
                            isLoading = true
                            errorMessage = null

                            if (userId == null) {
                                errorMessage = "ID de usuario no válido"
                                isLoading = false
                                return@Button
                            }

                            // Crear el registro de cliente con los datos proporcionados
                            registerClientDetails(
                                userId,
                                address,
                                phone,
                                db
                            ) { success, error ->
                                isLoading = false
                                if (success) {
                                    // Navegamos al dashboard de cliente
                                    navController.navigate(AppScreens.MainScreen.route) {
                                        // Limpiamos el backstack para que no pueda volver a las pantallas de registro
                                        popUpTo(AppScreens.LoginScreen.route) {
                                            inclusive = true
                                        }
                                    }
                                } else {
                                    errorMessage = error
                                }
                            }
                        } else {
                            errorMessage = "Por favor completa todos los campos correctamente"
                        }
                    },
                    enabled = !isLoading
                ) {
                    Text(
                        text = if (isLoading) "Registrando..." else "Finalizar Registro",
                        color = Color.White
                    )
                }
            }
        }
    }
}

private fun validateClientDetails(address: String, phone: String): Boolean {
    return address.isNotBlank() && phone.isNotBlank() && phone.length >= 8
}

private fun registerClientDetails(
    userId: String,
    address: String,
    phone: String,
    db: FirebaseFirestore,
    callback: (Boolean, String?) -> Unit
) {
    val clientId = UUID.randomUUID().toString()

    val client = hashMapOf(
        "id" to clientId,
        "user" to db.document("users/$userId"),
        "address" to address,
        "phone" to phone
    )

    db.collection("clients")
        .document(clientId)
        .set(client)
        .addOnSuccessListener {
            callback(true, null)
        }
        .addOnFailureListener { exception ->
            callback(false, "Error al registrar cliente: ${exception.message}")
        }
}