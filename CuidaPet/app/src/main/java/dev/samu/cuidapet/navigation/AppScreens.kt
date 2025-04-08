package dev.saries.aprendizaje.navigation

sealed class AppScreens(val route: String) {
    // Pantallas
    object LoginScreen: AppScreens("login_screen")
    object MainScreen: AppScreens("main_screen")
    object RegisterScreen: AppScreens("register_screen")
    object RegisterClienteScreen: AppScreens("register_cliente_screen")
}