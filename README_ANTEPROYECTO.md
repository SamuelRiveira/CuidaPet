## **1\. Roles y Funcionalidades**

### **a. Programador**

* **Acceso y Permisos:**  
  * Control total del sistema (CRUD completo sobre entidades críticas).  
  * Configuración y mantenimiento general de la aplicación.  
  * Implementación de actualizaciones y cambios estructurales.  
* **Funcionalidades Clave:**  
  * Administrar permisos y roles.  
  * Editar funciones específicas y módulos del sistema.  
  * Monitorear logs y auditorías.

### **b. Empleado (Veterinario)**

* **Acceso y Permisos:**  
  * Gestión de la información de clientes y sus mascotas.  
  * Programar, modificar y cancelar citas.  
  * Actualizar y revisar fichas médicas o historiales de atención.  
* **Funcionalidades Clave:**  
  * Consultar y actualizar datos clínicos y tratamientos.  
  * Generar reportes sobre el progreso y evolución de las mascotas.  
  * Notificar a clientes sobre recordatorios de citas o seguimiento.

### **c. Cliente**

* **Acceso y Permisos:**  
  * Acceso a su propia cuenta y a la información de sus mascotas.  
  * Solicitar y gestionar citas (p. ej., reprogramar o cancelar).  
  * Visualizar el historial clínico y progreso de sus mascotas.  
* **Funcionalidades Clave:**  
  * Registro y actualización de sus datos personales.  
  * Agenda de citas y notificaciones automáticas.  
  * Consulta de resultados y recomendaciones del veterinario.

---

## **2\. Requisitos Funcionales y No Funcionales**

### **Requisitos Funcionales**

* **Autenticación y Autorización:**  
  * Implementar un sistema robusto de login que distinga roles (programador, empleado y cliente).  
  * Control de acceso basado en roles (RBAC) para restringir funcionalidades según el perfil.  
* **Gestión de Clientes y Mascotas:**  
  * CRUD para clientes: crear, editar, consultar y eliminar clientes.  
  * CRUD para mascotas: cada mascota estará asociada a un cliente.  
* **Gestión de Citas y Fichas Médicas:**  
  * Agenda de citas: creación, modificación, cancelación y notificación.  
  * Registro de historiales o fichas médicas vinculadas a cada mascota.  
* **Panel de Administración:**  
  * Herramientas para el programador y el empleado para ver estadísticas, reportes y logs del sistema.

### **Requisitos No Funcionales**

* **Seguridad:**  
  * Cifrado de datos sensibles.  
  * Respaldo periódico de la base de datos.  
* **Usabilidad:**  
  * Interfaz amigable y adaptable (responsive).  
  * Notificaciones y mensajes de confirmación ante acciones importantes.  
* **Escalabilidad y Mantenibilidad:**  
  * Arquitectura modular que permita la incorporación de nuevas funcionalidades.  
  * Documentación clara de roles, funcionalidades y flujo de datos.

---

## **3\. Diseño de la Base de Datos: Diagrama Entidad-Relación (ER)**

### **Entidades Principales y Relaciones**

1. **Usuario**

   * **Atributos:**  
     * id\_usuario (PK)  
     * nombre  
     * email  
     * contraseña  
     * rol (enum: 'programador', 'empleado', 'cliente')  
   * **Comentarios:**  
     * Es la entidad base para la autenticación y autorización.  
2. **Cliente**

   * **Atributos:**  
     * id\_cliente (PK)  
     * id\_usuario (FK: Usuario.id\_usuario)  
     * dirección  
     * teléfono  
     * otros datos personales  
   * **Relación:**  
     * Un usuario con rol "cliente" se relaciona con uno (o varios) registros en Cliente.  
3. **Mascota**

   * **Atributos:**  
     * id\_mascota (PK)  
     * nombre  
     * especie  
     * raza  
     * edad  
     * id\_cliente (FK: Cliente.id\_cliente)  
   * **Relación:**  
     * Un cliente puede tener varias mascotas (relación 1 a N).  
4. **Cita**

   * **Atributos:**  
     * id\_cita (PK)  
     * id\_mascota (FK: Mascota.id\_mascota)  
     * id\_empleado (FK: Usuario.id\_usuario, filtrando por rol empleado)  
     * fecha  
     * hora  
     * estado (p.ej., pendiente, confirmada, cancelada)  
     * motivo o descripción  
   * **Relación:**  
     * Cada cita se asocia a una mascota y a un empleado (veterinario).  
5. **Ficha Médica / Historial Clínico**

   * **Atributos:**  
     * id\_ficha (PK)  
     * id\_mascota (FK: Mascota.id\_mascota)  
     * fecha  
     * diagnóstico  
     * tratamiento  
     * observaciones  
   * **Relación:**  
     * Una mascota puede tener varios registros de fichas médicas (relación 1 a N).

### **Representación del Diagrama ER (Resumen)**



## **4\. Desarrollo de la Idea en Profundidad**

### **Flujo de Uso**

* **Registro e Inicio de Sesión:**  
  * Los usuarios se registran en el sistema. Al registrarse, se asigna un rol según su perfil.  
* **Interacción del Cliente:**  
  * El cliente, luego de iniciar sesión, puede ver sus mascotas, solicitar nuevas citas y consultar el historial de atención.  
* **Interacción del Empleado (Veterinario):**  
  * El veterinario puede acceder a los datos de todos los clientes y mascotas que le han asignado, gestionar citas y actualizar fichas médicas.  
* **Mantenimiento y Configuración:**  
  * El programador puede acceder a módulos restringidos donde se configuran parámetros del sistema, se realizan cambios en el esquema de la base de datos o se administran permisos.

### **Consideraciones Técnicas**

* **Integración de Módulos:**  
  * Se recomienda utilizar un framework que permita implementar de forma modular el sistema (por ejemplo, MVC o una arquitectura basada en microservicios).  
* **Interfaces y API:**  
  * Definir API RESTful para la comunicación entre el frontend y el backend, asegurando que cada endpoint valide el rol del usuario que lo invoca.  
* **Validación y Seguridad:**  
  * Implementar mecanismos de validación tanto en el cliente (frontend) como en el servidor (backend).  
  * Utilizar tokens JWT o sesiones seguras para el manejo de la autenticación.
