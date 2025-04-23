
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


public interface GetPetMedicalHistoryQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      GetPetMedicalHistoryQuery.Data,
      GetPetMedicalHistoryQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val petId:
    java.util.UUID
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val pet:
    Pet?
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
    Int?,
    val client:
    Client,
    val medicalRecords:
    List<MedicalRecordsItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Client(
  
    val user:
    User
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class User(
  
    val name:
    String?,
    val email:
    String?
  ) {
    
    
  }
      
    
    
  }
      
        @kotlinx.serialization.Serializable
  public data class MedicalRecordsItem(
  
    val id:
    java.util.UUID,
    val date:
    com.google.firebase.dataconnect.LocalDate?,
    val diagnosis:
    String?,
    val treatment:
    String?,
    val observations:
    String?,
    val employee:
    Employee
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Employee(
  
    val id:
    java.util.UUID,
    val fullName:
    String?,
    val specialty:
    String?
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetPetMedicalHistory"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetPetMedicalHistoryQuery.ref(
  
    petId: java.util.UUID,
  
  
): com.google.firebase.dataconnect.QueryRef<
    GetPetMedicalHistoryQuery.Data,
    GetPetMedicalHistoryQuery.Variables
  > =
  ref(
    
      GetPetMedicalHistoryQuery.Variables(
        petId=petId,
  
      )
    
  )

public suspend fun GetPetMedicalHistoryQuery.execute(
  
    petId: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetPetMedicalHistoryQuery.Data,
    GetPetMedicalHistoryQuery.Variables
  > =
  ref(
    
      petId=petId,
  
    
  ).execute()


  public fun GetPetMedicalHistoryQuery.flow(
    
      petId: java.util.UUID,
  
    
    ): kotlinx.coroutines.flow.Flow<GetPetMedicalHistoryQuery.Data> =
    ref(
        
          petId=petId,
  
        
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
