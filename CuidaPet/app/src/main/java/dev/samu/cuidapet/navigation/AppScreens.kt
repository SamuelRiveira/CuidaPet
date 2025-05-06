package dev.samu.cuidapet.navigation

sealed class AppScreens(val route: String) {
    // Pantallas existentes
    object LoginScreen: AppScreens("login_screen")
    object MainScreen: AppScreens("main_screen")
    object RegisterScreen: AppScreens("register_screen")
    object RegisterClienteScreen: AppScreens("register_cliente_screen")

    // Nuevas pantallas
    object PetListScreen: AppScreens("pet_list_screen")
    object PetDetailScreen: AppScreens("pet_detail_screen/{petId}") {
        fun createRoute(petId: String) = "pet_detail_screen/$petId"
    }
    object CitasMascotasScreen: AppScreens("citas_mascotas_screen")

}