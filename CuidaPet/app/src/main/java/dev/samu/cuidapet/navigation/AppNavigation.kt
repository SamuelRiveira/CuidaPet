package dev.saries.aprendizaje.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import dev.samu.cuidapet.screens.LoginScreen
import dev.samu.cuidapet.screens.MainScreen
import dev.samu.cuidapet.screens.RegisterClienteScreen
import dev.samu.cuidapet.screens.RegisterScreen

@Composable
fun AppNavigation(modifier: androidx.compose.ui.Modifier){
    // estado de gestion de navegación
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = AppScreens.MainScreen.route) {
        composable(route = AppScreens.LoginScreen.route) {
            LoginScreen(navController)
        }
        composable(route = AppScreens.MainScreen.route) {
            MainScreen(navController)
        }
        composable(route = AppScreens.RegisterScreen.route) {
            RegisterScreen(navController)
        }
        composable(route = AppScreens.RegisterClienteScreen.route) {
            RegisterClienteScreen(navController)
        }
//        composable(route = AppScreens.SecondScreen.route + "/{text}",
//            arguments = listOf(navArgument(name = "text"){
//                type = NavType.StringType
//            }
//            )) {
//            SecondScreen(navController, it.arguments?.getString("text"))
//        }
    }
}
