package dev.samu.cuidapet.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.firebase.firestore.FirebaseFirestore
import dev.samu.cuidapet.R
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.filled.Create
import dev.samu.cuidapet.CuidaPetAppBar
import dev.samu.cuidapet.CuidaPetDrawer
import dev.samu.cuidapet.PetRepository
import dev.samu.cuidapet.model.Pet
import dev.samu.cuidapet.ui.theme.BackgroundColor
import dev.samu.cuidapet.ui.theme.LightGrayColor
import dev.samu.cuidapet.ui.theme.PrimaryColor
import dev.samu.cuidapet.ui.theme.SecondaryColor
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetDetailScreen(navController: NavController, db: FirebaseFirestore, petId: String? = null) {
    // Instancia del repositorio
    val petRepository = remember { PetRepository() }
    val scope = rememberCoroutineScope()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

    // En un caso real, cargaríamos los datos de la mascota desde la API
    // Por ahora, los obtenemos del repositorio local
    val pet = remember(petId) {
        petId?.let { petRepository.getPetById(it) } ?: petRepository.getPetById("1")
    } ?: Pet()

    CuidaPetDrawer(
        content = {
            Scaffold(
                topBar = {
                    CuidaPetAppBar(
                        title = pet.name,
                        onMenuClick = {
                            scope.launch {
                                drawerState.open()
                            }
                        },
                        actions = {
                            // Acción para editar mascota (ejemplo)
                            IconButton(onClick = { /* Implementar edición */ }) {
                                Icon(Icons.Default.Create, contentDescription = "Edit")
                            }
                        }
                    )
                }
            ) { paddingValues ->
                Column(
                    modifier = Modifier
                        .padding(paddingValues)
                        .fillMaxSize()
                        .background(BackgroundColor)
                        .verticalScroll(rememberScrollState())
                ) {
                    // Imagen de la mascota y etiqueta "Perro/Gato"
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(240.dp)
                    ) {
                        // Imagen (en un caso real usaríamos Coil para cargar desde URL)
                        Image(
                            painter = painterResource(id = pet.imageId),
                            contentDescription = "Foto de ${pet.name}",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        // Etiqueta "Perro" o "Gato"
                        Surface(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(16.dp),
                            shape = RoundedCornerShape(16.dp),
                            color = PrimaryColor
                        ) {
                            Text(
                                text = pet.type,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                fontSize = 14.sp
                            )
                        }
                    }

                    // Información de la mascota
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        // Nombre y edad
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = pet.name,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${pet.age} años",
                                fontSize = 16.sp,
                                color = SecondaryColor
                            )
                        }

                        // Raza
                        Text(
                            text = pet.breed,
                            fontSize = 16.sp,
                            color = SecondaryColor,
                            modifier = Modifier.padding(top = 4.dp)
                        )

                        Divider(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 16.dp),
                            color = Color.LightGray
                        )

                        // Sección Dueño
                        Text(
                            text = "Dueño",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )
                        Text(
                            text = pet.owner,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Última visita
                        Text(
                            text = "Última visita",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )
                        Text(
                            text = pet.lastVisit,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Próxima cita
                        Text(
                            text = "Próxima cita",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )
                        Text(
                            text = pet.nextAppointment,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Peso
                        Text(
                            text = "Peso",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )
                        Text(
                            text = "${pet.weight} kg",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Historial médico (desplegable)
                        var expandedHistory by remember { mutableStateOf(false) }

                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { expandedHistory = !expandedHistory },
                            shape = RoundedCornerShape(8.dp),
                            color = LightGrayColor
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Historial médico",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Icon(
                                    imageVector = if (expandedHistory) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                    contentDescription = if (expandedHistory) "Contraer historial" else "Expandir historial"
                                )
                            }
                        }

                        if (expandedHistory) {
                            // Aquí iría el contenido del historial médico
                            // En una implementación real, tendríamos datos de historial desde la API
                            Text(
                                text = "No hay registros de historial médico disponibles.",
                                fontSize = 14.sp,
                                color = SecondaryColor,
                                modifier = Modifier.padding(top = 8.dp, start = 16.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Alergias
                        Text(
                            text = "Alergias",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )

                        if (pet.allergies.isNotEmpty()) {
                            Row(
                                modifier = Modifier.padding(top = 8.dp)
                            ) {
                                pet.allergies.forEach { allergy ->
                                    Surface(
                                        shape = RoundedCornerShape(16.dp),
                                        color = Color(0xFFFFE6E6)
                                    ) {
                                        Text(
                                            text = allergy,
                                            color = Color(0xFFFF6666),
                                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                            fontSize = 14.sp
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                }
                            }
                        } else {
                            Text(
                                text = "No se han registrado alergias",
                                fontSize = 14.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Sección Notas especiales
                        Text(
                            text = "Notas especiales",
                            fontSize = 16.sp,
                            color = SecondaryColor
                        )
                        Text(
                            text = pet.notes.ifEmpty { "No hay notas especiales" },
                            fontSize = 16.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        },
        navController = navController,
        currentScreen = "Mascotas",
        drawerState = drawerState
    )
}