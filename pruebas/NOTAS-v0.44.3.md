# v0.44.3 · reglas de grupos e invitaciones

Estado: propuesta preparada; requiere publicar las reglas junto con la versión de la app. La aplicación activa permanece en v0.44.2 mientras no se coordine la activación. Las capturas de Firebase recibidas el 12/11/2026 muestran las reglas seleccionadas como publicadas el 29/10/2026 a las 13:00.

## Hallazgos en las reglas de las capturas

- La creación de membresía comprueba token y caducidad, pero no una expulsión previa. Borrar la membresía deja el token reutilizable hasta su expiración.
- Las invitaciones no se consumen ni se vinculan a una única cuenta al aceptar, pese a que la app anuncia una sola aceptación.
- La pertenencia se basa en que exista el documento del miembro. Si una lista eliminada deja metadatos y alguien crea otra con el mismo ID, esos documentos pueden otorgar pertenencia a la nueva lista.
- Los controles positivos existentes se conservan: cuenta verificada, listas privadas del titular, permisos de propietario/administrador, política de invitación y prohibición de enumerar invitaciones. No se ha observado una regla de lectura pública general en las capturas.

## Corrección coordinada

- Expulsar escribe `revocations/{uid}` con hora de servidor y elimina la membresía en la misma transacción. Las reglas exigen ambas operaciones. Una invitación nueva emitida después de esa hora permite volver a entrar; una antigua no.
- Las invitaciones incluyen `issuedAt` de servidor y se consumen mediante `usedBy`/`usedAt` en un lote atómico que crea la membresía. Las reglas impiden consumir sin unirse o unirse sin consumir. La misma cuenta ya miembro puede reintentar sin alterar su rol; una cuenta expulsada no puede recrear su membresía mediante un token consumido.
- Solo el propietario o los administradores autorizados pueden emitir enlaces, y la aceptación exige que el propietario de la invitación siga siendo el propietario de la lista.
- Las listas compartidas nuevas tienen `createdAt` de servidor, inmutable. Los miembros deben haberse incorporado después de su creación. Así se evita heredar documentos antiguos al reutilizar un ID. Las listas existentes sin este campo siguen funcionando.
- La promoción de una lista privada es reintentable: no sobrescribe un grupo propio ya creado ni su contenido, y no elimina la lista privada hasta completar membresía y acceso personal.
- Se reconstruye el archivo completo de reglas a partir de las capturas, con las correcciones. Ya no es el fichero histórico incompleto de listas privadas.

## Validación

23 pruebas con el emulador oficial de Firestore, proyecto `demo-marketsinc-rules`, cuentas ficticias y el SDK real. Incluyen accesos anónimo y no verificado, aislamiento privado, escalada de rol, política, expulsión, revocación no borrable, invitaciones nuevas/antiguas/caducadas/consumidas, dos aceptaciones concurrentes, promoción, salida, borrado y recreación del ID. Más 168 pruebas JavaScript de la app y 7 del generador del catálogo. No se han ejecutado ataques ni escrituras de prueba sobre Firebase real.

La configuración de prueba `firebase.rules-test.json` exige seleccionar explícitamente un proyecto demo. Las pruebas de reglas abortan si no existe FIRESTORE_EMULATOR_HOST. Las dependencias de prueba están separadas de los archivos de producción. El workflow añade la ejecución del emulador con Node y Java 21; no usa credenciales ni secretos.

## Activación y reversión

1. Preparar el contenido de `pruebas/firestore.rules` en el editor de Firebase, conservando la versión publicada anterior en su historial.
2. Coordinar la publicación de esas reglas con la publicación de v0.44.3. Las nuevas operaciones de crear grupos, consumir invitaciones y expulsar necesitan el nuevo esquema; no deben presentarse como corregidas en producción antes de activar ambas partes.
3. Recargar la app en los móviles y comprobar una lista desechable con dos cuentas. Los participantes pueden necesitar generar una invitación nueva si la anterior ya fue consumida.
4. Si hiciera falta revertir, restaurar ambas partes juntas desde el historial de Firebase y el commit anterior de la app. Eliminar solo la marca local o esconder botones no revoca acceso de servidor.

Pendientes independientes: revisar restricciones de API key, App Check y cuotas en la consola. Estas reglas controlan autorización y revocación, pero no son un limitador general de tráfico o gasto. Los objetos de productos continúan sujetos al tamaño máximo del documento de Firestore; no se añade una certificación de datos alimentarios.
