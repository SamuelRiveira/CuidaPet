
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)


@file:kotlinx.serialization.UseSerializers(
  
    com.google.firebase.dataconnect.serializers.UUIDSerializer::class,
  
)


package connectors.default


import kotlinx.coroutines.flow.filterNotNull as _flow_filterNotNull
import kotlinx.coroutines.flow.map as _flow_map


public interface GetEmployeeAppointmentsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      GetEmployeeAppointmentsQuery.Data,
      GetEmployeeAppointmentsQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val employeeId:
    java.util.UUID
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val employee:
    Employee?
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Employee(
  
    val id:
    java.util.UUID,
    val user:
    User,
    val fullName:
    String?,
    val specialty:
    String?,
    val appointments:
    List<AppointmentsItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class User(
  
    val name:
    String?,
    val email:
    String?
  ) {
    
    
  }
      
        @kotlinx.serialization.Serializable
  public data class AppointmentsItem(
  
    val id:
    java.util.UUID,
    val date:
    com.google.firebase.dataconnect.LocalDate?,
    val time:
    String?,
    val status:
    String?,
    val reason:
    String?,
    val pet:
    Pet
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Pet(
  
    val id:
    java.util.UUID,
    val name:
    String?,
    val species:
    String?,
    val breed:
    String?,
    val age:
    Int?
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetEmployeeAppointments"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetEmployeeAppointmentsQuery.ref(
  
    employeeId: java.util.UUID,
  
  
): com.google.firebase.dataconnect.QueryRef<
    GetEmployeeAppointmentsQuery.Data,
    GetEmployeeAppointmentsQuery.Variables
  > =
  ref(
    
      GetEmployeeAppointmentsQuery.Variables(
        employeeId=employeeId,
  
      )
    
  )

public suspend fun GetEmployeeAppointmentsQuery.execute(
  
    employeeId: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetEmployeeAppointmentsQuery.Data,
    GetEmployeeAppointmentsQuery.Variables
  > =
  ref(
    
      employeeId=employeeId,
  
    
  ).execute()


  public fun GetEmployeeAppointmentsQuery.flow(
    
      employeeId: java.util.UUID,
  
    
    ): kotlinx.coroutines.flow.Flow<GetEmployeeAppointmentsQuery.Data> =
    ref(
        
          employeeId=employeeId,
  
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }


// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR default
