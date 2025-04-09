package dev.samu.cuidapet.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import dev.samu.cuidapet.R
import dev.samu.cuidapet.data.MenuItem
import kotlinx.coroutines.launch

val LightGray = Color(0xFFF2F2F2)
val LightBlue = Color(0xFFACD1D9)
val MediumBlue = Color(0xFF5891A5)
val DarkBlue = Color(0xFF3B5473)
val PaleBlue = Color(0xFFDDF1F8)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(navController: NavHostController) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val selectedItem = remember { mutableStateOf("Inicio") }

    val menuItems = listOf(
        MenuItem(
            title = "Inicio",
            icon = { Icon(Icons.Default.Home, contentDescription = "Inicio") },
            route = "home"
        ),
        MenuItem(
            title = "Servicios",
            icon = { Icon(Icons.Default.Info, contentDescription = "Servicios") },
            route = "services"
        ),
        MenuItem(
            title = "Citas",
            icon = { Icon(Icons.Default.DateRange, contentDescription = "Citas") },
            route = "appointments"
        ),
        MenuItem(
            title = "Salud",
            icon = { Icon(Icons.Default.Favorite, contentDescription = "Salud") },
            route = "health"
        ),
        MenuItem(
            title = "Contacto",
            icon = { Icon(Icons.Default.Info, contentDescription = "Contacto") },
            route = "contact"
        )
    )

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            DrawerContent(
                menuItems = menuItems,
                selectedItem = selectedItem.value,
                onMenuItemClick = { item ->
                    selectedItem.value = item.title
                    scope.launch {
                        drawerState.close()
                    }
                },
                onLogoutClick = {
                    // Implementar lógica de cierre de sesión
                    scope.launch {
                        drawerState.close()
                    }
                }
            )
        }
    ) {
        Scaffold(
            topBar = {
                AppBar(
                    onMenuClick = {
                        scope.launch {
                            drawerState.open()
                        }
                    }
                )
            },
            content = { paddingValues ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                ) {
                    LazyColumn {
                        item {
                            Introduccion()
                        }
                        item {
                            SobreNosotros()
                        }
                        item {

                        }
                    }
                }
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppBar(onMenuClick: () -> Unit) {
    TopAppBar(
        title = { Text("CuidaPet", color = Color.White, fontWeight = FontWeight.Bold) },
        navigationIcon = {
            IconButton(onClick = onMenuClick) {
                Icon(Icons.Default.Menu, contentDescription = "Menú", tint = Color.White)
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MediumBlue
        )
    )
}

@Composable
fun DrawerContent(
    menuItems: List<MenuItem>,
    selectedItem: String,
    onMenuItemClick: (MenuItem) -> Unit,
    onLogoutClick: () -> Unit
) {
    ModalDrawerSheet(
        drawerContainerColor = PaleBlue,
        drawerContentColor = DarkBlue,
        modifier = Modifier.width(300.dp)
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        Box(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.AccountCircle,
                    contentDescription = "Usuario",
                    modifier = Modifier.height(80.dp),
                    tint = DarkBlue
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "CuidaPet",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = DarkBlue
                )
                Text(
                    text = "Tu clínica veterinaria",
                    fontSize = 14.sp,
                    color = MediumBlue
                )
            }
        }

        HorizontalDivider(
            thickness = 1.dp,
            color = MediumBlue,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        menuItems.forEach { item ->
            DrawerMenuItem(
                item = item,
                isSelected = selectedItem == item.title,
                onClick = { onMenuItemClick(item) }
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        HorizontalDivider(
            thickness = 1.dp,
            color = MediumBlue,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onLogoutClick() }
                .padding(16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.ExitToApp,
                contentDescription = "Cerrar Sesión",
                tint = DarkBlue
            )
            Spacer(modifier = Modifier.width(32.dp))
            Text(
                text = "Cerrar Sesión",
                fontSize = 16.sp,
                color = DarkBlue
            )
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun DrawerMenuItem(
    item: MenuItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (isSelected) LightBlue else Color.Transparent

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .background(
                color = backgroundColor,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() }
            .padding(16.dp)
    ) {
        CompositionLocalProvider(LocalContentColor provides DarkBlue) {
            item.icon()
        }
        Spacer(modifier = Modifier.width(32.dp))
        Text(
            text = item.title,
            fontSize = 16.sp,
            color = DarkBlue
        )
    }
}

@Composable
fun SobreNosotros(){
    Box(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFD3D3D3))
    ){
        Column(
            modifier = Modifier.padding(24.dp).fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "SOBRE NOSOTROS",
                color = Color(0xFF5891A5),
                fontWeight = FontWeight.Light,
                fontSize = 15.sp,
                modifier = Modifier.padding(bottom = 14.dp)
            )
            Text(
                text = "Bienvenidos",
                color = Color(0xFF3B5473),
                fontWeight = FontWeight.Bold,
                fontSize = 32.sp,
                modifier = Modifier.padding(bottom = 14.dp)
            )
            HorizontalDivider(
                thickness = 2.dp,
                color = Color(0xFF5891A5),
                modifier = Modifier.width(120.dp).padding(bottom = 18.dp)
            )
            Text(
                text = "Bienvenido a CuidaPet en Playa Honda, tu clínica veterinaria de confianza. Ofrecemos navegación sencilla en nuestro sitio web, un equipo cualificado y experimentado, y un enfoque inspirador para el cuidado de tu mascota. En CuidaPet, tu mejor amigo está en buenas manos.",
                fontSize = 14.sp,
                color = Color(0xFF3B5473),
                style = TextStyle(letterSpacing = (0).sp),
                fontWeight = FontWeight.Light,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 18.dp)
            )
            Image(
                painter = painterResource(R.drawable.perrito_veterinario),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .width(350.dp)
                    .clip(RoundedCornerShape(5.dp))
            )
        }
    }
}

@Composable
fun Introduccion(){
    Box{
        Image(
            painter = painterResource(R.drawable.cuida_pet_fondo),
            contentDescription = null,
            contentScale = ContentScale.Crop,
        )
        Column(
            modifier = Modifier.fillMaxSize().height(295.dp).padding(30.dp, 0.dp, 30.dp, 0.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.Start,

            ) {
            Text(
                text = "Servicio único para tus mascotas",
                color = Color(0xFF3B5473),
                fontWeight = FontWeight.Bold,
                fontSize = 22.sp,
                modifier = Modifier.padding(bottom = 25.dp)
            )
            Text(
                text = "Cuidamos de tu mascota todo el año con atención integral, bienestar personalizado y un equipo dedicado a su salud y felicidad. ¡Confía en nosotros!",
                color = Color(0xFF3B5473),
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp,
                modifier = Modifier.padding(bottom = 25.dp),
                style = TextStyle(letterSpacing = (0).sp)
            )
            Box(
                modifier = Modifier
                    .height(32.dp)
                    .background(Color(0xFF5891A5)))
            {
                TextButton(
                    onClick = {},
                ) {
                    Text(
                        text = "OBTÉN MÁS INFORMACIÓN",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}