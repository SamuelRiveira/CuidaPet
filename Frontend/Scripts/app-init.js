/**
 * Script de inicialización de la aplicación CuidaPet
*/
import { RoleUIManager } from "./RoleUIManager.js";
import { UserAuthManager } from "./UserAuthManager.js";

// Inicializar el sistema de roles cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del gestor de UI basado en roles
    const roleManager = new RoleUIManager();
});
