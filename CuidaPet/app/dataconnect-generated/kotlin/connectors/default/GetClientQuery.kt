
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


public interface GetClientQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      GetClientQuery.Data,
      GetClientQuery.Variables
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
    val address:
    String?,
    val phone:
    String?
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
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetClient"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetClientQuery.ref(
  
    clientId: java.util.UUID,
  
  
): com.google.firebase.dataconnect.QueryRef<
    GetClientQuery.Data,
    GetClientQuery.Variables
  > =
  ref(
    
      GetClientQuery.Variables(
        clientId=clientId,
  
      )
    
  )

public suspend fun GetClientQuery.execute(
  
    clientId: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetClientQuery.Data,
    GetClientQuery.Variables
  > =
  ref(
    
      clientId=clientId,
  
    
  ).execute()


  public fun GetClientQuery.flow(
    
      clientId: java.util.UUID,
  
    
    ): kotlinx.coroutines.flow.Flow<GetClientQuery.Data> =
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
