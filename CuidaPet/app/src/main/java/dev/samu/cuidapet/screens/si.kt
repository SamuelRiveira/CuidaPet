//package dev.samu.cuidapet.screens
//
//import androidx.compose.foundation.Image
//import androidx.compose.foundation.background
//import androidx.compose.foundation.clickable
//import androidx.compose.foundation.layout.*
//import androidx.compose.foundation.shape.RoundedCornerShape
//import androidx.compose.material.icons.Icons
//import androidx.compose.material.icons.filled.KeyboardArrowUp
//import androidx.compose.material.icons.filled.KeyboardArrowDown
//import androidx.compose.material3.*
//import androidx.compose.runtime.*
//import androidx.compose.ui.Alignment
//import androidx.compose.ui.Modifier
//import androidx.compose.ui.graphics.Color
//import androidx.compose.ui.layout.ContentScale
//import androidx.compose.ui.res.painterResource
//import androidx.compose.ui.text.font.FontWeight
//import androidx.compose.ui.unit.dp
//import androidx.compose.ui.unit.sp
//import androidx.navigation.NavController
//import com.google.firebase.firestore.FirebaseFirestore
//import dev.samu.cuidapet.R
//import androidx.compose.foundation.lazy.LazyColumn
//import androidx.compose.foundation.lazy.items
//import androidx.compose.foundation.rememberScrollState
//import androidx.compose.foundation.verticalScroll
//import androidx.compose.material.icons.filled.Add
//import androidx.compose.ui.text.style.TextOverflow
//import kotlinx.coroutines.flow.MutableStateFlow
//import kotlinx.coroutines.flow.StateFlow
//
//// Modelo de datos para la mascota
//data class Pet(
//    val id: String = "",
//    val name: String = "",
//    val type: String = "", // "Perro" o "Gato"
//    val breed: String = "",
//    val age: Int = 0,
//    val weight: Double = 0.0,
//    val owner: String = "",
//    val lastVisit: String = "",
//    val nextAppointment: String = "",
//    val allergies: List<String> = emptyList(),
//    val notes: String = "",
//    val imageId: Int = R.drawable.img_luna // Imagen por defecto
//)
//
//// Colores de la aplicación
//val PrimaryColor = Color(0xFF0099CB)
//val SecondaryColor = Color(0xFF666666)
//val BackgroundColor = Color.White
//val LightGrayColor = Color(0xFFF5F5F5)
//
//// Repositorio de datos para mascotas
//class PetRepository {
//    // En el futuro, esto se conectará a una API
//    // Por ahora, devolvemos datos estáticos
//
//    private val _pets = MutableStateFlow<List<Pet>>(createDummyPets())
//    val pets: StateFlow<List<Pet>> = _pets
//
//    fun getPetById(id: String): Pet? {
//        return _pets.value.find { it.id == id }
//    }
//
//    private fun createDummyPets(): List<Pet> {
//        return listOf(
//            Pet(
//                id = "1",
//                name = "Simba",
//                type = "Perro",
//                breed = "Golden Retriever",
//                age = 3,
//                weight = 28.5,
//                owner = "María García",
//                lastVisit = "10/04/2025",
//                nextAppointment = "10/06/2025",
//                allergies = listOf("Negros"),
//                notes = "Luna es muy juguetona y sociable. Tiene preferencia por premios de hígado.",
//                imageId = R.drawable.img_simba
//            ),
//            Pet(
//                id = "2",
//                name = "Luna",
//                type = "Gato",
//                breed = "Gato Persa",
//                age = 5,
//                weight = 4.2,
//                owner = "Juan Rodríguez",
//                lastVisit = "22/03/2025",
//                nextAppointment = "22/06/2025",
//                allergies = listOf("Cacahuetes"),
//                notes = "Simba es tranquilo pero puede estresarse en la clínica. Preferir manejo suave.",
//                imageId = R.drawable.img_luna
//            ),
//            Pet(
//                id = "3",
//                name = "Rocky",
//                type = "Perro",
//                breed = "Bulldog Francés",
//                age = 2,
//                weight = 12.3,
//                owner = "Ana López",
//                lastVisit = "15/04/2025",
//                nextAppointment = "Sin próxima cita",
//                allergies = listOf("Kiwi", "Gatos"),
//                notes = "Rocky necesita vigilancia en días calurosos por su predisposición a problemas respiratorios.",
//                imageId = R.drawable.img_rocky
//            )
//        )
//    }
//}
//
//@Composable
//fun PetDetailScreen(navController: NavController, db: FirebaseFirestore, petId: String? = null) {
//    // Instancia del repositorio
//    val petRepository = remember { PetRepository() }
//
//    // En un caso real, cargaríamos los datos de la mascota desde la API
//    // Por ahora, los obtenemos del repositorio local
//    val pet = remember(petId) {
//        petId?.let { petRepository.getPetById(it) } ?: petRepository.getPetById("1")
//    } ?: Pet()
//
//    Scaffold(
//    ) { paddingValues ->
//        Column(
//            modifier = Modifier
//                .padding(paddingValues)
//                .fillMaxSize()
//                .background(BackgroundColor)
//                .verticalScroll(rememberScrollState())
//        ) {
//            // Imagen de la mascota y etiqueta "Perro/Gato"
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(240.dp)
//            ) {
//                // Imagen (en un caso real usaríamos Coil para cargar desde URL)
//                Image(
//                    painter = painterResource(id = pet.imageId),
//                    contentDescription = "Foto de ${pet.name}",
//                    modifier = Modifier.fillMaxSize(),
//                    contentScale = ContentScale.Crop
//                )
//
//                // Etiqueta "Perro" o "Gato"
//                Surface(
//                    modifier = Modifier
//                        .align(Alignment.TopEnd)
//                        .padding(16.dp),
//                    shape = RoundedCornerShape(16.dp),
//                    color = PrimaryColor
//                ) {
//                    Text(
//                        text = pet.type,
//                        color = Color.White,
//                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
//                        fontSize = 14.sp
//                    )
//                }
//            }
//
//            // Información de la mascota
//            Column(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .padding(16.dp)
//            ) {
//                // Nombre y edad
//                Row(
//                    modifier = Modifier.fillMaxWidth(),
//                    horizontalArrangement = Arrangement.SpaceBetween,
//                    verticalAlignment = Alignment.CenterVertically
//                ) {
//                    Text(
//                        text = pet.name,
//                        fontSize = 24.sp,
//                        fontWeight = FontWeight.Bold
//                    )
//                    Text(
//                        text = "${pet.age} años",
//                        fontSize = 16.sp,
//                        color = SecondaryColor
//                    )
//                }
//
//                // Raza
//                Text(
//                    text = pet.breed,
//                    fontSize = 16.sp,
//                    color = SecondaryColor,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//
//                Divider(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .padding(vertical = 16.dp),
//                    color = Color.LightGray
//                )
//
//                // Sección Dueño
//                Text(
//                    text = "Dueño",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//                Text(
//                    text = pet.owner,
//                    fontSize = 16.sp,
//                    fontWeight = FontWeight.Bold,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Última visita
//                Text(
//                    text = "Última visita",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//                Text(
//                    text = pet.lastVisit,
//                    fontSize = 16.sp,
//                    fontWeight = FontWeight.Bold,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Próxima cita
//                Text(
//                    text = "Próxima cita",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//                Text(
//                    text = pet.nextAppointment,
//                    fontSize = 16.sp,
//                    fontWeight = FontWeight.Bold,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Peso
//                Text(
//                    text = "Peso",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//                Text(
//                    text = "${pet.weight} kg",
//                    fontSize = 16.sp,
//                    fontWeight = FontWeight.Bold,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Historial médico (desplegable)
//                var expandedHistory by remember { mutableStateOf(false) }
//
//                Surface(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .clickable { expandedHistory = !expandedHistory },
//                    shape = RoundedCornerShape(8.dp),
//                    color = LightGrayColor
//                ) {
//                    Row(
//                        modifier = Modifier
//                            .fillMaxWidth()
//                            .padding(16.dp),
//                        horizontalArrangement = Arrangement.SpaceBetween,
//                        verticalAlignment = Alignment.CenterVertically
//                    ) {
//                        Text(
//                            text = "Historial médico",
//                            fontSize = 16.sp,
//                            fontWeight = FontWeight.Bold
//                        )
//                        Icon(
//                            imageVector = if (expandedHistory) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
//                            contentDescription = if (expandedHistory) "Contraer historial" else "Expandir historial"
//                        )
//                    }
//                }
//
//                if (expandedHistory) {
//                    // Aquí iría el contenido del historial médico
//                    // En una implementación real, tendríamos datos de historial desde la API
//                    Text(
//                        text = "No hay registros de historial médico disponibles.",
//                        fontSize = 14.sp,
//                        color = SecondaryColor,
//                        modifier = Modifier.padding(top = 8.dp, start = 16.dp)
//                    )
//                }
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Alergias
//                Text(
//                    text = "Alergias",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//
//                if (pet.allergies.isNotEmpty()) {
//                    Row(
//                        modifier = Modifier.padding(top = 8.dp)
//                    ) {
//                        pet.allergies.forEach { allergy ->
//                            Surface(
//                                shape = RoundedCornerShape(16.dp),
//                                color = Color(0xFFFFE6E6)
//                            ) {
//                                Text(
//                                    text = allergy,
//                                    color = Color(0xFFFF6666),
//                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
//                                    fontSize = 14.sp
//                                )
//                            }
//                            Spacer(modifier = Modifier.width(8.dp))
//                        }
//                    }
//                } else {
//                    Text(
//                        text = "No se han registrado alergias",
//                        fontSize = 14.sp,
//                        modifier = Modifier.padding(top = 4.dp)
//                    )
//                }
//
//                Spacer(modifier = Modifier.height(16.dp))
//
//                // Sección Notas especiales
//                Text(
//                    text = "Notas especiales",
//                    fontSize = 16.sp,
//                    color = SecondaryColor
//                )
//                Text(
//                    text = pet.notes.ifEmpty { "No hay notas especiales" },
//                    fontSize = 16.sp,
//                    modifier = Modifier.padding(top = 4.dp)
//                )
//            }
//        }
//    }
//}
//
//@OptIn(ExperimentalMaterial3Api::class)
//@Composable
//fun PetListScreen(navController: NavController, db: FirebaseFirestore) {
//    // Instancia del repositorio
//    val petRepository = remember { PetRepository() }
//    val pets = petRepository.pets.collectAsState().value
//
//    Scaffold(
//        floatingActionButton = {
//            FloatingActionButton(
//                onClick = { /* Añadir nueva mascota */ },
//                containerColor = PrimaryColor,
//                contentColor = Color.White
//            ) {
//                Icon(Icons.Filled.Add, "Añadir mascota")
//            }
//        }
//    ) { paddingValues ->
//        LazyColumn(
//            modifier = Modifier
//                .fillMaxSize()
//                .padding(paddingValues)
//                .background(Color.White),
//            contentPadding = PaddingValues(16.dp),
//            verticalArrangement = Arrangement.spacedBy(16.dp)
//        ) {
//            items(pets) { pet ->
//                PetCard(
//                    pet = pet,
//                    onClick = {
//                        // Navegar a la pantalla de detalles
//                        navController.navigate("pet_detail_screen/${pet.id}")
//                    }
//                )
//            }
//        }
//    }
//}
//
//@Composable
//fun PetCard(pet: Pet, onClick: () -> Unit) {
//    Card(
//        modifier = Modifier
//            .fillMaxWidth()
//            .height(120.dp),
//        shape = RoundedCornerShape(8.dp),
//        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
//        onClick = onClick
//    ) {
//        Row(
//            modifier = Modifier.fillMaxSize()
//        ) {
//            // Imagen de la mascota
//            Box(
//                modifier = Modifier
//                    .width(120.dp)
//                    .fillMaxHeight()
//            ) {
//                Image(
//                    painter = painterResource(id = pet.imageId),
//                    contentDescription = "Foto de ${pet.name}",
//                    modifier = Modifier.fillMaxSize(),
//                    contentScale = ContentScale.Crop
//                )
//            }
//
//            // Información de la mascota
//            Column(
//                modifier = Modifier
//                    .fillMaxSize()
//                    .padding(16.dp),
//                verticalArrangement = Arrangement.SpaceBetween
//            ) {
//                Column {
//                    Row(
//                        modifier = Modifier.fillMaxWidth(),
//                        horizontalArrangement = Arrangement.SpaceBetween
//                    ) {
//                        Text(
//                            text = pet.name,
//                            fontWeight = FontWeight.Bold,
//                            fontSize = 18.sp
//                        )
//
//                        Text(
//                            text = "${pet.age} años",
//                            color = SecondaryColor,
//                            fontSize = 14.sp
//                        )
//                    }
//
//                    Text(
//                        text = "${pet.type} • ${pet.breed}",
//                        color = SecondaryColor,
//                        fontSize = 14.sp,
//                        maxLines = 1,
//                        overflow = TextOverflow.Ellipsis
//                    )
//                }
//
//                // Próxima cita
//                if (pet.nextAppointment.isNotEmpty()) {
//                    Row(
//                        verticalAlignment = Alignment.CenterVertically
//                    ) {
//                        Surface(
//                            shape = RoundedCornerShape(16.dp),
//                            color = LightGrayColor
//                        ) {
//                            Text(
//                                text = "Cita: ${pet.nextAppointment}",
//                                color = SecondaryColor,
//                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
//                                fontSize = 12.sp
//                            )
//                        }
//                    }
//                }
//            }
//        }
//    }
//}