import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavHostController
import dev.samu.cuidapet.R
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

// Modelo de datos para las citas
data class Mascota(
    val id: String,
    val nombre: String,
    val tipo: String,
    val raza: String,
    val imagenResId: Int // ID del recurso de imagen
)

data class Cita(
    val id: String,
    val mascota: Mascota,
    val fecha: LocalDateTime,
    val motivo: String,
    val estado: EstadoCita = EstadoCita.PROGRAMADA,
    val notas: String = "" // Notas adicionales sobre la cita
)

enum class EstadoCita {
    PROGRAMADA, COMPLETADA, CANCELADA
}

// Formatters para fechas y horas
@RequiresApi(Build.VERSION_CODES.O)
val dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
@RequiresApi(Build.VERSION_CODES.O)
val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")
@RequiresApi(Build.VERSION_CODES.O)
val dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CitasMascotasScreen(navController: NavHostController) {
    // Estado para la interfaz
    var mostrarDialogoNuevaCita by remember { mutableStateOf(false) }
    var mostrarDetalleCita by remember { mutableStateOf(false) }
    var citaSeleccionada by remember { mutableStateOf<Cita?>(null) }
    var fechaSeleccionada by remember { mutableStateOf(LocalDate.now()) }
    var horaSeleccionada by remember { mutableStateOf(LocalTime.of(9, 0)) }
    var mascotaSeleccionada by remember { mutableStateOf<Mascota?>(null) }
    var motivoCita by remember { mutableStateOf("") }
    var notasCita by remember { mutableStateOf("") }

    // Lista de mascotas (simulada, en el futuro vendrá de la API)
    val mascotas = remember {
        listOf(
            Mascota(
                "1",
                "Luna",
                "Gato",
                "Gato Persa",
                R.drawable.img_luna
            ),
            Mascota(
                "2",
                "Simba",
                "Perro",
                "Golden Retriever",
                R.drawable.img_simba
            ),
            Mascota(
                "3",
                "Rocky",
                "Perro",
                "Bulldog Francés",
                R.drawable.img_rocky
            )
        )
    }

    // Lista de citas (simulada, en el futuro vendrá de la API)
    val citas = remember {
        mutableStateListOf(
            Cita(
                "1",
                mascotas[0],
                LocalDateTime.now().plusDays(2).withHour(10).withMinute(30),
                "Vacunación anual",
                EstadoCita.PROGRAMADA,
                "Vacuna antirrábica anual + desparasitación"
            ),
            Cita(
                "2",
                mascotas[1],
                LocalDateTime.now().plusDays(1).withHour(16).withMinute(0),
                "Revisión general",
                EstadoCita.PROGRAMADA,
                "Control de peso y revisión de oídos"
            ),
            Cita(
                "3",
                mascotas[2],
                LocalDateTime.now().plusHours(5).withMinute(0),
                "Problemas digestivos",
                EstadoCita.PROGRAMADA,
                "Ha tenido vómitos durante los últimos dos días"
            )
        )
    }

    // Horas disponibles (simuladas, en el futuro vendrán de la API)
    val horasDisponibles = remember {
        listOf(
            LocalTime.of(9, 0),
            LocalTime.of(9, 30),
            LocalTime.of(10, 0),
            LocalTime.of(10, 30),
            LocalTime.of(11, 0),
            LocalTime.of(11, 30),
            LocalTime.of(16, 0),
            LocalTime.of(16, 30),
            LocalTime.of(17, 0),
            LocalTime.of(17, 30)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Citas para Mascotas") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                ),
                actions = {
                    IconButton(onClick = { mostrarDialogoNuevaCita = true }) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Añadir cita",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text(
                text = "Próximas Citas",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            if (citas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = null,
                            modifier = Modifier.size(56.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No hay citas programadas",
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(onClick = { mostrarDialogoNuevaCita = true }) {
                            Text("Añadir nueva cita")
                        }
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(citas.sortedBy { it.fecha }) { cita ->
                        TarjetaCita(
                            cita = cita,
                            onCitaClick = {
                                citaSeleccionada = cita
                                mostrarDetalleCita = true
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { mostrarDialogoNuevaCita = true },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    modifier = Modifier.size(ButtonDefaults.IconSize)
                )
                Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                Text("Añadir Nueva Cita")
            }
        }

        // Diálogo para añadir nueva cita
        if (mostrarDialogoNuevaCita) {
            Dialog(onDismissRequest = { mostrarDialogoNuevaCita = false }) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "Nueva Cita",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )

                        // Selector de mascota
                        Text(
                            text = "Selecciona mascota",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            items(mascotas) { mascota ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { mascotaSeleccionada = mascota }
                                        .background(
                                            if (mascotaSeleccionada?.id == mascota.id)
                                                MaterialTheme.colorScheme.primaryContainer
                                            else
                                                Color.Transparent
                                        )
                                        .padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = when(mascota.tipo) {
                                            "Perro" -> Icons.Default.Favorite
                                            "Gato" -> Icons.Default.Favorite
                                            else -> Icons.Default.Favorite
                                        },
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary
                                    )

                                    Spacer(modifier = Modifier.width(12.dp))

                                    Column {
                                        Text(
                                            text = mascota.nombre,
                                            style = MaterialTheme.typography.bodyLarge,
                                            fontWeight = FontWeight.Medium
                                        )
                                        Text(
                                            text = "${mascota.tipo} - ${mascota.raza}",
                                            style = MaterialTheme.typography.bodySmall
                                        )
                                    }
                                }
                            }
                        }

                        // Selector de fecha
                        Text(
                            text = "Selecciona fecha",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            val fechasDisponibles = List(7) { LocalDate.now().plusDays(it.toLong()) }

                            fechasDisponibles.forEach { fecha ->
                                val esFechaSeleccionada = fechaSeleccionada == fecha

                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(
                                            if (esFechaSeleccionada)
                                                MaterialTheme.colorScheme.primary
                                            else
                                                MaterialTheme.colorScheme.surfaceVariant
                                        )
                                        .clickable { fechaSeleccionada = fecha }
                                        .padding(12.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(
                                            text = fecha.format(DateTimeFormatter.ofPattern("dd")),
                                            style = MaterialTheme.typography.bodyLarge,
                                            color = if (esFechaSeleccionada)
                                                MaterialTheme.colorScheme.onPrimary
                                            else
                                                MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            text = fecha.format(DateTimeFormatter.ofPattern("EEE")),
                                            style = MaterialTheme.typography.bodySmall,
                                            color = if (esFechaSeleccionada)
                                                MaterialTheme.colorScheme.onPrimary
                                            else
                                                MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        }

                        // Selector de hora
                        Text(
                            text = "Selecciona hora",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(140.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant),
                            verticalArrangement = Arrangement.spacedBy(1.dp)
                        ) {
                            items(horasDisponibles) { hora ->
                                val isSelected = horaSeleccionada == hora

                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(
                                            if (isSelected)
                                                MaterialTheme.colorScheme.primary
                                            else
                                                MaterialTheme.colorScheme.surface
                                        )
                                        .clickable { horaSeleccionada = hora }
                                        .padding(12.dp)
                                ) {
                                    Text(
                                        text = hora.format(timeFormatter),
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (isSelected)
                                            MaterialTheme.colorScheme.onPrimary
                                        else
                                            MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }

                        // Campo de motivo
                        OutlinedTextField(
                            value = motivoCita,
                            onValueChange = { motivoCita = it },
                            label = { Text("Motivo de la cita") },
                            modifier = Modifier.fillMaxWidth(),
                            maxLines = 2
                        )

                        // Campo de notas
                        OutlinedTextField(
                            value = notasCita,
                            onValueChange = { notasCita = it },
                            label = { Text("Notas adicionales (opcional)") },
                            modifier = Modifier.fillMaxWidth(),
                            maxLines = 3
                        )

                        // Botones
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End
                        ) {
                            TextButton(
                                onClick = { mostrarDialogoNuevaCita = false }
                            ) {
                                Text("Cancelar")
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            Button(
                                onClick = {
                                    // Añadir nueva cita (simulado, en el futuro se enviará a la API)
                                    mascotaSeleccionada?.let { mascota ->
                                        val nuevaCita = Cita(
                                            id = (citas.size + 1).toString(),
                                            mascota = mascota,
                                            fecha = LocalDateTime.of(fechaSeleccionada, horaSeleccionada),
                                            motivo = motivoCita,
                                            notas = notasCita
                                        )
                                        citas.add(nuevaCita)

                                        // Resetear valores
                                        mascotaSeleccionada = null
                                        motivoCita = ""
                                        notasCita = ""
                                        mostrarDialogoNuevaCita = false
                                    }
                                },
                                enabled = mascotaSeleccionada != null && motivoCita.isNotBlank()
                            ) {
                                Text("Agendar Cita")
                            }
                        }
                    }
                }
            }
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun TarjetaCita(
    cita: Cita,
    onCitaClick: () -> Unit
) {
    val ahora = LocalDateTime.now()
    val esCitaHoy = cita.fecha.toLocalDate() == ahora.toLocalDate()
    val esCitaCercana = cita.fecha.isBefore(ahora.plusHours(24)) && cita.fecha.isAfter(ahora)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onCitaClick),
        colors = CardDefaults.cardColors(
            containerColor = when {
                esCitaHoy -> MaterialTheme.colorScheme.primaryContainer
                esCitaCercana -> MaterialTheme.colorScheme.secondaryContainer
                else -> MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Imagen de la mascota en círculo - SIMPLIFICADO
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .border(2.dp, MaterialTheme.colorScheme.primary, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                // Usar simplemente Image sin intentar cargar recursos específicos
                Image(
                    painter = painterResource(id = R.drawable.img_luna),
                    contentDescription = "Foto de mascota",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {
                // Información de la mascota
                Text(
                    text = cita.mascota.nombre,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "${cita.mascota.tipo} - ${cita.mascota.raza}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Información de la cita
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    Text(
                        text = cita.motivo,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                // Fecha y hora
                Text(
                    text = if (esCitaHoy) "Hoy" else cita.fecha.format(dateFormatter),
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )

                Text(
                    text = cita.fecha.format(timeFormatter),
                    style = MaterialTheme.typography.bodyMedium
                )

                // Indicador de estado
                val colorEstado = when(cita.estado) {
                    EstadoCita.PROGRAMADA -> MaterialTheme.colorScheme.tertiary
                    EstadoCita.COMPLETADA -> MaterialTheme.colorScheme.secondary
                    EstadoCita.CANCELADA -> MaterialTheme.colorScheme.error
                }

                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(colorEstado.copy(alpha = 0.2f))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = cita.estado.name.lowercase().capitalize(),
                        style = MaterialTheme.typography.labelSmall,
                        color = colorEstado
                    )
                }
            }
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun DetalleCitaDialog(
    cita: Cita,
    onDismiss: () -> Unit,
    onCancelar: (Cita) -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Cabecera con foto e información de la mascota
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Foto de la mascota - SIMPLIFICADO
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .border(3.dp, MaterialTheme.colorScheme.primary, CircleShape)
                    ) {
                        // Usar simplemente Image sin intentar cargar recursos específicos
                        Image(
                            painter = painterResource(id = R.drawable.img_luna),
                            contentDescription = "Foto de mascota",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column {
                        Text(
                            text = cita.mascota.nombre,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )

                        Text(
                            text = "${cita.mascota.tipo} - ${cita.mascota.raza}",
                            style = MaterialTheme.typography.bodyLarge
                        )

                        // Indicador de estado con color
                        Spacer(modifier = Modifier.height(8.dp))

                        val colorEstado = when(cita.estado) {
                            EstadoCita.PROGRAMADA -> MaterialTheme.colorScheme.tertiary
                            EstadoCita.COMPLETADA -> MaterialTheme.colorScheme.secondary
                            EstadoCita.CANCELADA -> MaterialTheme.colorScheme.error
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(colorEstado.copy(alpha = 0.2f))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = cita.estado.name.lowercase().capitalize(),
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = colorEstado
                            )
                        }
                    }
                }

                Divider(
                    color = MaterialTheme.colorScheme.outlineVariant,
                    thickness = 1.dp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                // Información de la cita
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.DateRange,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Fecha: ${cita.fecha.format(dateFormatter)}",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.Favorite,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Hora: ${cita.fecha.format(timeFormatter)}",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }

                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        imageVector = Icons.Outlined.Info,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Motivo:",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Medium
                        )
                        // Usar texto plano para la información detallada
                        Text(
                            text = cita.motivo,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                if (cita.notas.isNotBlank()) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(
                            imageVector = Icons.Outlined.Create,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Notas adicionales:",
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Medium
                            )
                            // Usar texto plano para la información detallada
                            Text(
                                text = cita.notas,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                }

                Divider(
                    color = MaterialTheme.colorScheme.outlineVariant,
                    thickness = 1.dp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                // Botones de acción
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.secondary
                        )
                    ) {
                        Text("Cerrar")
                    }

                    if (cita.estado == EstadoCita.PROGRAMADA) {
                        Button(
                            onClick = { onCancelar(cita) },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Text("Cancelar Cita")
                        }
                    }
                }
            }
        }
    }
}

// Extensión para capitalizar
fun String.capitalize(): String {
    return this.lowercase().replaceFirstChar { it.uppercase() }
}