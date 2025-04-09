package dev.samu.cuidapet.data

import androidx.compose.runtime.Composable

data class MenuItem(
    val title: String,
    val icon: @Composable () -> Unit,
    val route: String
)