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
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import dev.samu.cuidapet.viewmodel.UsuarioViewModel
import dev.saries.aprendizaje.navigation.AppScreens

@Composable
fun RegisterScreen(navController: NavController) {

    var userName by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

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
                    text = "Tienes una cuenta? Inicia sesión",
                    modifier = Modifier.padding(bottom = 24.dp).clickable{
                        navController.popBackStack()
                    },
                    style = TextStyle(textDecoration = TextDecoration.Underline),
                    color = Color.Blue
                )

                Button(
                    onClick = {navController.navigate(route = AppScreens.RegisterClienteScreen.route)}
                ){
                    Text(
                        text = "Registrarte",
                        color = Color.White
                    )
                }
            }
        }
    }
}