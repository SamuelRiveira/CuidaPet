package dev.samu.cuidapet.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.google.firebase.firestore.FirebaseFirestore
import dev.samu.cuidapet.screens.LoginScreen
import dev.samu.cuidapet.screens.MainScreen
import dev.samu.cuidapet.screens.PetDetailScreen
import dev.samu.cuidapet.screens.PetListScreen
import dev.samu.cuidapet.screens.RegisterClienteScreen
import dev.samu.cuidapet.screens.RegisterScreen

@Composable
fun AppNavigation(modifier: Modifier, db: FirebaseFirestore){
    // estado de gestion de navegación
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = AppScreens.PetListScreen.route) {
        composable(route = AppScreens.LoginScreen.route) {
            LoginScreen(navController, db)
        }
        composable(route = AppScreens.MainScreen.route) {
            MainScreen(navController, db)
        }
        composable(route = AppScreens.RegisterScreen.route) {
            RegisterScreen(navController, db)
        }
        composable(route = AppScreens.RegisterClienteScreen.route) {
            RegisterClienteScreen(navController, db)
        }
        composable(route = AppScreens.PetListScreen.route) {
            PetListScreen(navController, db)
        }
        composable(
            route = AppScreens.PetDetailScreen.route,
            arguments = listOf(
                navArgument("petId") {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val petId = backStackEntry.arguments?.getString("petId")
            PetDetailScreen(navController, db, petId)
        }
    }
}
