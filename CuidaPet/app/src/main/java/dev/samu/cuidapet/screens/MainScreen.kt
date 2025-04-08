package dev.samu.cuidapet.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
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

@Composable
fun MainScreen(navController: NavHostController) {
    LazyColumn {
        item {
            Introduccion()
        }
        item{
            SobreNosotros()
        }
        item{

        }
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