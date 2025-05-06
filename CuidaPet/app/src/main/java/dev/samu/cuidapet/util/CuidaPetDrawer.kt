package dev.samu.cuidapet.util

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavController
import dev.samu.cuidapet.data.MenuItem
import dev.samu.cuidapet.screens.DrawerContent
import dev.samu.cuidapet.screens.MediumBlue
import kotlinx.coroutines.launch

// Componente reutilizable del Drawer
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CuidaPetDrawer(
    content: @Composable () -> Unit,
    navController: NavController,
    currentScreen: String = "Inicio",
    drawerState: DrawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
) {
    // Eliminamos la redeclaración de drawerState que causaba el problema
    val scope = rememberCoroutineScope()
    val selectedItem = remember { mutableStateOf(currentScreen) }

    val menuItems = listOf(
        MenuItem(
            title = "Inicio",
            icon = { Icon(Icons.Default.Home, contentDescription = "Inicio") },
            route = "home"
        ),
        MenuItem(
            title = "Citas",
            icon = { Icon(Icons.Default.DateRange, contentDescription = "Citas") },
            route = "appointments"
        ),
        MenuItem(
            title = "Historial médico",
            icon = { Icon(Icons.Default.Info, contentDescription = "Historial médico") },
            route = "historial_medico"
        ),
        MenuItem(
            title = "Mascotas",
            icon = { Icon(Icons.Default.Favorite, contentDescription = "Mascotas") },
            route = "pet_list_screen"
        ),
        MenuItem(
            title = "Perfil",
            icon = { Icon(Icons.Default.AccountCircle, contentDescription = "Perfil") },
            route = "perfil"
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
                    navController.navigate(item.route)
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
        content()
    }
}

// Componente reutilizable para el AppBar
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CuidaPetAppBar(
    title: String = "CuidaPet",
    onMenuClick: () -> Unit,
    actions: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = { Text(title, color = Color.White, fontWeight = FontWeight.Bold) },
        navigationIcon = {
            IconButton(onClick = onMenuClick) {
                Icon(Icons.Default.Menu, contentDescription = "Menú", tint = Color.White)
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MediumBlue
        ),
        actions = actions
    )
}