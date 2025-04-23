
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


public interface LoginQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      LoginQuery.Data,
      LoginQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val email:
    String,
    val password:
    String
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val users:
    List<UsersItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class UsersItem(
  
    val id:
    java.util.UUID,
    val name:
    String?,
    val email:
    String?,
    val role:
    String?
  ) {
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "Login"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun LoginQuery.ref(
  
    email: String,password: String,
  
  
): com.google.firebase.dataconnect.QueryRef<
    LoginQuery.Data,
    LoginQuery.Variables
  > =
  ref(
    
      LoginQuery.Variables(
        email=email,password=password,
  
      )
    
  )

public suspend fun LoginQuery.execute(
  
    email: String,password: String,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    LoginQuery.Data,
    LoginQuery.Variables
  > =
  ref(
    
      email=email,password=password,
  
    
  ).execute()


  public fun LoginQuery.flow(
    
      email: String,password: String,
  
    
    ): kotlinx.coroutines.flow.Flow<LoginQuery.Data> =
    ref(
        
          email=email,password=password,
  
        
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
