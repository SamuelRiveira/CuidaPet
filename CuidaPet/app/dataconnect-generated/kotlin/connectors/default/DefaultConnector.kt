
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

import com.google.firebase.dataconnect.getInstance as _fdcGetInstance

public interface DefaultConnector : com.google.firebase.dataconnect.generated.GeneratedConnector<DefaultConnector> {
  override val dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect

  
    public val appointmentInsert: AppointmentInsertMutation
  
    public val clientInsert: ClientInsertMutation
  
    public val employeeInsert: EmployeeInsertMutation
  
    public val getClient: GetClientQuery
  
    public val getClientPets: GetClientPetsQuery
  
    public val getEmployee: GetEmployeeQuery
  
    public val getEmployeeAppointments: GetEmployeeAppointmentsQuery
  
    public val getPetAppointments: GetPetAppointmentsQuery
  
    public val getPetMedicalHistory: GetPetMedicalHistoryQuery
  
    public val getUser: GetUserQuery
  
    public val login: LoginQuery
  
    public val medicalRecordInsert: MedicalRecordInsertMutation
  
    public val petInsert: PetInsertMutation
  
    public val programmerInsert: ProgrammerInsertMutation
  
    public val userInsert: UserInsertMutation
  

  public companion object {
    @Suppress("MemberVisibilityCanBePrivate")
    public val config: com.google.firebase.dataconnect.ConnectorConfig = com.google.firebase.dataconnect.ConnectorConfig(
      connector = "default",
      location = "europe-southwest1",
      serviceId = "cuidapet-11dc8-service",
    )

    public fun getInstance(
      dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect
    ):DefaultConnector = synchronized(instances) {
      instances.getOrPut(dataConnect) {
        DefaultConnectorImpl(dataConnect)
      }
    }

    private val instances = java.util.WeakHashMap<com.google.firebase.dataconnect.FirebaseDataConnect, DefaultConnectorImpl>()
  }
}

public val DefaultConnector.Companion.instance:DefaultConnector
  get() = getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(config))

public fun DefaultConnector.Companion.getInstance(
  settings: com.google.firebase.dataconnect.DataConnectSettings = com.google.firebase.dataconnect.DataConnectSettings()
):DefaultConnector =
  getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(config, settings))

public fun DefaultConnector.Companion.getInstance(
  app: com.google.firebase.FirebaseApp,
  settings: com.google.firebase.dataconnect.DataConnectSettings = com.google.firebase.dataconnect.DataConnectSettings()
):DefaultConnector =
  getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(app, config, settings))

private class DefaultConnectorImpl(
  override val dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect
) : DefaultConnector {
  
    override val appointmentInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      AppointmentInsertMutationImpl(this)
    }
  
    override val clientInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      ClientInsertMutationImpl(this)
    }
  
    override val employeeInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      EmployeeInsertMutationImpl(this)
    }
  
    override val getClient by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetClientQueryImpl(this)
    }
  
    override val getClientPets by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetClientPetsQueryImpl(this)
    }
  
    override val getEmployee by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetEmployeeQueryImpl(this)
    }
  
    override val getEmployeeAppointments by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetEmployeeAppointmentsQueryImpl(this)
    }
  
    override val getPetAppointments by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetPetAppointmentsQueryImpl(this)
    }
  
    override val getPetMedicalHistory by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetPetMedicalHistoryQueryImpl(this)
    }
  
    override val getUser by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetUserQueryImpl(this)
    }
  
    override val login by lazy(LazyThreadSafetyMode.PUBLICATION) {
      LoginQueryImpl(this)
    }
  
    override val medicalRecordInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      MedicalRecordInsertMutationImpl(this)
    }
  
    override val petInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      PetInsertMutationImpl(this)
    }
  
    override val programmerInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      ProgrammerInsertMutationImpl(this)
    }
  
    override val userInsert by lazy(LazyThreadSafetyMode.PUBLICATION) {
      UserInsertMutationImpl(this)
    }
  

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun operations(): List<com.google.firebase.dataconnect.generated.GeneratedOperation<DefaultConnector, *, *>> =
    queries() + mutations()

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun mutations(): List<com.google.firebase.dataconnect.generated.GeneratedMutation<DefaultConnector, *, *>> =
    listOf(
      appointmentInsert,
        clientInsert,
        employeeInsert,
        medicalRecordInsert,
        petInsert,
        programmerInsert,
        userInsert,
        
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun queries(): List<com.google.firebase.dataconnect.generated.GeneratedQuery<DefaultConnector, *, *>> =
    listOf(
      getClient,
        getClientPets,
        getEmployee,
        getEmployeeAppointments,
        getPetAppointments,
        getPetMedicalHistory,
        getUser,
        login,
        
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect) =
    DefaultConnectorImpl(dataConnect)

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorImpl &&
    other.dataConnect == dataConnect

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorImpl",
      dataConnect,
    )

  override fun toString(): String =
    "DefaultConnectorImpl(dataConnect=$dataConnect)"
}



private open class DefaultConnectorGeneratedQueryImpl<Data, Variables>(
  override val connector: DefaultConnector,
  override val operationName: String,
  override val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
  override val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
) : com.google.firebase.dataconnect.generated.GeneratedQuery<DefaultConnector, Data, Variables> {

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(
    connector: DefaultConnector,
    operationName: String,
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
    variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewVariables> withVariablesSerializer(
    variablesSerializer: kotlinx.serialization.SerializationStrategy<NewVariables>
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewData> withDataDeserializer(
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<NewData>
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorGeneratedQueryImpl<*,*> &&
    other.connector == connector &&
    other.operationName == operationName &&
    other.dataDeserializer == dataDeserializer &&
    other.variablesSerializer == variablesSerializer

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorGeneratedQueryImpl",
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun toString(): String =
    "DefaultConnectorGeneratedQueryImpl(" +
    "operationName=$operationName, " +
    "dataDeserializer=$dataDeserializer, " +
    "variablesSerializer=$variablesSerializer, " +
    "connector=$connector)"
}

private open class DefaultConnectorGeneratedMutationImpl<Data, Variables>(
  override val connector: DefaultConnector,
  override val operationName: String,
  override val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
  override val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
) : com.google.firebase.dataconnect.generated.GeneratedMutation<DefaultConnector, Data, Variables> {

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(
    connector: DefaultConnector,
    operationName: String,
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
    variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewVariables> withVariablesSerializer(
    variablesSerializer: kotlinx.serialization.SerializationStrategy<NewVariables>
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewData> withDataDeserializer(
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<NewData>
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorGeneratedMutationImpl<*,*> &&
    other.connector == connector &&
    other.operationName == operationName &&
    other.dataDeserializer == dataDeserializer &&
    other.variablesSerializer == variablesSerializer

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorGeneratedMutationImpl",
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun toString(): String =
    "DefaultConnectorGeneratedMutationImpl(" +
    "operationName=$operationName, " +
    "dataDeserializer=$dataDeserializer, " +
    "variablesSerializer=$variablesSerializer, " +
    "connector=$connector)"
}



private class AppointmentInsertMutationImpl(
  connector: DefaultConnector
):
  AppointmentInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      AppointmentInsertMutation.Data,
      Unit
  >(
    connector,
    AppointmentInsertMutation.Companion.operationName,
    AppointmentInsertMutation.Companion.dataDeserializer,
    AppointmentInsertMutation.Companion.variablesSerializer,
  )


private class ClientInsertMutationImpl(
  connector: DefaultConnector
):
  ClientInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      ClientInsertMutation.Data,
      Unit
  >(
    connector,
    ClientInsertMutation.Companion.operationName,
    ClientInsertMutation.Companion.dataDeserializer,
    ClientInsertMutation.Companion.variablesSerializer,
  )


private class EmployeeInsertMutationImpl(
  connector: DefaultConnector
):
  EmployeeInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      EmployeeInsertMutation.Data,
      Unit
  >(
    connector,
    EmployeeInsertMutation.Companion.operationName,
    EmployeeInsertMutation.Companion.dataDeserializer,
    EmployeeInsertMutation.Companion.variablesSerializer,
  )


private class GetClientQueryImpl(
  connector: DefaultConnector
):
  GetClientQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetClientQuery.Data,
      GetClientQuery.Variables
  >(
    connector,
    GetClientQuery.Companion.operationName,
    GetClientQuery.Companion.dataDeserializer,
    GetClientQuery.Companion.variablesSerializer,
  )


private class GetClientPetsQueryImpl(
  connector: DefaultConnector
):
  GetClientPetsQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetClientPetsQuery.Data,
      GetClientPetsQuery.Variables
  >(
    connector,
    GetClientPetsQuery.Companion.operationName,
    GetClientPetsQuery.Companion.dataDeserializer,
    GetClientPetsQuery.Companion.variablesSerializer,
  )


private class GetEmployeeQueryImpl(
  connector: DefaultConnector
):
  GetEmployeeQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetEmployeeQuery.Data,
      GetEmployeeQuery.Variables
  >(
    connector,
    GetEmployeeQuery.Companion.operationName,
    GetEmployeeQuery.Companion.dataDeserializer,
    GetEmployeeQuery.Companion.variablesSerializer,
  )


private class GetEmployeeAppointmentsQueryImpl(
  connector: DefaultConnector
):
  GetEmployeeAppointmentsQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetEmployeeAppointmentsQuery.Data,
      GetEmployeeAppointmentsQuery.Variables
  >(
    connector,
    GetEmployeeAppointmentsQuery.Companion.operationName,
    GetEmployeeAppointmentsQuery.Companion.dataDeserializer,
    GetEmployeeAppointmentsQuery.Companion.variablesSerializer,
  )


private class GetPetAppointmentsQueryImpl(
  connector: DefaultConnector
):
  GetPetAppointmentsQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetPetAppointmentsQuery.Data,
      GetPetAppointmentsQuery.Variables
  >(
    connector,
    GetPetAppointmentsQuery.Companion.operationName,
    GetPetAppointmentsQuery.Companion.dataDeserializer,
    GetPetAppointmentsQuery.Companion.variablesSerializer,
  )


private class GetPetMedicalHistoryQueryImpl(
  connector: DefaultConnector
):
  GetPetMedicalHistoryQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetPetMedicalHistoryQuery.Data,
      GetPetMedicalHistoryQuery.Variables
  >(
    connector,
    GetPetMedicalHistoryQuery.Companion.operationName,
    GetPetMedicalHistoryQuery.Companion.dataDeserializer,
    GetPetMedicalHistoryQuery.Companion.variablesSerializer,
  )


private class GetUserQueryImpl(
  connector: DefaultConnector
):
  GetUserQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetUserQuery.Data,
      GetUserQuery.Variables
  >(
    connector,
    GetUserQuery.Companion.operationName,
    GetUserQuery.Companion.dataDeserializer,
    GetUserQuery.Companion.variablesSerializer,
  )


private class LoginQueryImpl(
  connector: DefaultConnector
):
  LoginQuery,
  DefaultConnectorGeneratedQueryImpl<
      LoginQuery.Data,
      LoginQuery.Variables
  >(
    connector,
    LoginQuery.Companion.operationName,
    LoginQuery.Companion.dataDeserializer,
    LoginQuery.Companion.variablesSerializer,
  )


private class MedicalRecordInsertMutationImpl(
  connector: DefaultConnector
):
  MedicalRecordInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      MedicalRecordInsertMutation.Data,
      Unit
  >(
    connector,
    MedicalRecordInsertMutation.Companion.operationName,
    MedicalRecordInsertMutation.Companion.dataDeserializer,
    MedicalRecordInsertMutation.Companion.variablesSerializer,
  )


private class PetInsertMutationImpl(
  connector: DefaultConnector
):
  PetInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      PetInsertMutation.Data,
      Unit
  >(
    connector,
    PetInsertMutation.Companion.operationName,
    PetInsertMutation.Companion.dataDeserializer,
    PetInsertMutation.Companion.variablesSerializer,
  )


private class ProgrammerInsertMutationImpl(
  connector: DefaultConnector
):
  ProgrammerInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      ProgrammerInsertMutation.Data,
      Unit
  >(
    connector,
    ProgrammerInsertMutation.Companion.operationName,
    ProgrammerInsertMutation.Companion.dataDeserializer,
    ProgrammerInsertMutation.Companion.variablesSerializer,
  )


private class UserInsertMutationImpl(
  connector: DefaultConnector
):
  UserInsertMutation,
  DefaultConnectorGeneratedMutationImpl<
      UserInsertMutation.Data,
      Unit
  >(
    connector,
    UserInsertMutation.Companion.operationName,
    UserInsertMutation.Companion.dataDeserializer,
    UserInsertMutation.Companion.variablesSerializer,
  )



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR default
