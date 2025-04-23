
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


public interface GetClientPetsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      GetClientPetsQuery.Data,
      GetClientPetsQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val clientId:
    java.util.UUID
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val client:
    Client?
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Client(
  
    val id:
    java.util.UUID,
    val user:
    User,
    val pets:
    List<PetsItem>
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
  public data class PetsItem(
  
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
  

  public companion object {
    public val operationName: String = "GetClientPets"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetClientPetsQuery.ref(
  
    clientId: java.util.UUID,
  
  
): com.google.firebase.dataconnect.QueryRef<
    GetClientPetsQuery.Data,
    GetClientPetsQuery.Variables
  > =
  ref(
    
      GetClientPetsQuery.Variables(
        clientId=clientId,
  
      )
    
  )

public suspend fun GetClientPetsQuery.execute(
  
    clientId: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetClientPetsQuery.Data,
    GetClientPetsQuery.Variables
  > =
  ref(
    
      clientId=clientId,
  
    
  ).execute()


  public fun GetClientPetsQuery.flow(
    
      clientId: java.util.UUID,
  
    
    ): kotlinx.coroutines.flow.Flow<GetClientPetsQuery.Data> =
    ref(
        
          clientId=clientId,
  
        
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
