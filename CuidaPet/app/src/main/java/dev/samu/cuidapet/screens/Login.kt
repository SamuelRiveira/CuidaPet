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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.google.firebase.firestore.FirebaseFirestore
import dev.samu.cuidapet.api.RetrofitInstance
import dev.samu.cuidapet.viewmodel.UsuarioViewModel
import dev.samu.cuidapet.navigation.AppScreens
import kotlinx.coroutines.launch


@Composable
fun LoginScreen(navController: NavController, db: FirebaseFirestore, viewModel: UsuarioViewModel = viewModel()) {

    var userName by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val usuario by viewModel.usuario.collectAsState()
    val mensajeError by viewModel.mensajeError.collectAsState()

    LaunchedEffect(usuario) {
        usuario?.let {
            navController.navigate(route = AppScreens.MainScreen.route)
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF8ab3cf)),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ElevatedCard(elevation = CardDefaults.cardElevation(
            defaultElevation = 16.dp
        )) {
            Column(
                modifier = Modifier.padding(36.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "CuidaPet",
                    modifier = Modifier.padding(bottom = 24.dp),
                    fontSize = 36.sp
                )
                OutlinedTextField(
                    value = userName,
                    onValueChange = { userName = it },
                    label = { Text("Usuario") },
                    modifier = Modifier.padding(bottom = 24.dp)
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña")},
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                Text(
                    text = "No tienes una cuenta? Regístrate",
                    modifier = Modifier.padding(bottom = 24.dp).clickable{
                        navController.navigate(route = AppScreens.RegisterScreen.route)
                    },
                    style = TextStyle(textDecoration = TextDecoration.Underline),
                    color = Color.Blue
                )

                mensajeError?.let {
                    Text(text = it, color = Color.Red, modifier = Modifier.padding(bottom = 8.dp))
                }

                Button(
                    onClick = {viewModel.login(userName, password)}
                ){
                    Text(
                        text = "Iniciar sesión",
                        color = Color.White
                    )
                }
            }
        }
    }
}