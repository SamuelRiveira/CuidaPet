
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



package connectors.default



public interface UserInsertMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      UserInsertMutation.Data,
      Unit
    >
{
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  @kotlinx.serialization.SerialName("user_insert")
    val key:
    UserKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "UserInsert"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Unit> =
      kotlinx.serialization.serializer()
  }
}

public fun UserInsertMutation.ref(
  
): com.google.firebase.dataconnect.MutationRef<
    UserInsertMutation.Data,
    Unit
  > =
  ref(
    
      Unit
    
  )

public suspend fun UserInsertMutation.execute(
  
  ): com.google.firebase.dataconnect.MutationResult<
    UserInsertMutation.Data,
    Unit
  > =
  ref(
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR default
