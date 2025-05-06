package dev.samu.cuidapet.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.filled.Add
import androidx.compose.ui.Alignment
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import dev.samu.cuidapet.util.CuidaPetAppBar
import dev.samu.cuidapet.util.CuidaPetDrawer
import dev.samu.cuidapet.repository.PetRepository
import dev.samu.cuidapet.model.Pet
import dev.samu.cuidapet.ui.theme.LightGrayColor
import dev.samu.cuidapet.ui.theme.PrimaryColor
import dev.samu.cuidapet.ui.theme.SecondaryColor
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetListScreen(navController: NavController) {
    // Instancia del repositorio
    val petRepository = remember { PetRepository() }
    val pets = petRepository.pets.collectAsState().value
    val scope = rememberCoroutineScope()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

    CuidaPetDrawer(
        drawerState = drawerState,
        content = {
            Scaffold(
                topBar = {
                    CuidaPetAppBar(
                        title = "Mis Mascotas",
                        onMenuClick = {
                            scope.launch {
                                drawerState.open()
                            }
                        }
                    )
                },
                floatingActionButton = {
                    FloatingActionButton(
                        onClick = { navController.navigate("add_pet_screen") },
                        containerColor = PrimaryColor,
                        contentColor = Color.White
                    ) {
                        Icon(Icons.Filled.Add, "Añadir mascota")
                    }
                }
            ) { paddingValues ->
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                        .background(Color.White),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(pets) { pet ->
                        PetCard(
                            pet = pet,
                            onClick = {
                                // Navegar a la pantalla de detalles
                                navController.navigate("pet_detail_screen/${pet.id}")
                            }
                        )
                    }
                }
            }
        },
        navController = navController,
        currentScreen = "Mascotas"
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetCard(pet: Pet, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp),
        shape = RoundedCornerShape(8.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        onClick = onClick
    ) {
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // Imagen de la mascota
            Box(
                modifier = Modifier
                    .width(120.dp)
                    .fillMaxHeight()
            ) {
                Image(
                    painter = painterResource(id = pet.imageId),
                    contentDescription = "Foto de ${pet.name}",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }

            // Información de la mascota
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = pet.name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )

                        Text(
                            text = "${pet.age} años",
                            color = SecondaryColor,
                            fontSize = 14.sp
                        )
                    }

                    Text(
                        text = "${pet.type} • ${pet.breed}",
                        color = SecondaryColor,
                        fontSize = 14.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                // Próxima cita
                if (pet.nextAppointment.isNotEmpty()) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = LightGrayColor
                        ) {
                            Text(
                                text = "Cita: ${pet.nextAppointment}",
                                color = SecondaryColor,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }
    }
}