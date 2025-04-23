
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



public interface ProgrammerInsertMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      ProgrammerInsertMutation.Data,
      Unit
    >
{
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  @kotlinx.serialization.SerialName("programmer_insert")
    val key:
    ProgrammerKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "ProgrammerInsert"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Unit> =
      kotlinx.serialization.serializer()
  }
}

public fun ProgrammerInsertMutation.ref(
  
): com.google.firebase.dataconnect.MutationRef<
    ProgrammerInsertMutation.Data,
    Unit
  > =
  ref(
    
      Unit
    
  )

public suspend fun ProgrammerInsertMutation.execute(
  
  ): com.google.firebase.dataconnect.MutationResult<
    ProgrammerInsertMutation.Data,
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
