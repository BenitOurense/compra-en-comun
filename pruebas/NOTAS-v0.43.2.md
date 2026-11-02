# Market Sinc v0.43.2 · borrado, invitaciones y códigos

## Correcciones

- Borrar una lista compartida ya no intenta eliminar la ficha del propietario. Las capturas de las reglas publicadas el 29 de octubre prohíben esa operación, incluso junto al borrado del grupo. Se eliminan juntos el contenido del grupo, los miembros consultados salvo el propietario y el acceso personal del propietario, manteniendo la comprobación de propiedad dentro de la transacción.
- Aceptar otra vez una invitación conserva joinedAt, inviteId y role; únicamente actualiza el alias si cambia. Los accesos personales existentes se reutilizan, porque las reglas mostradas permiten crearlos y borrarlos, pero no actualizarlos. También permite reintentar un alta cuya segunda escritura falló.
- La aceptación admite la denegación de lectura inicial que recibe un usuario nuevo antes de ser miembro. No interpreta un fallo de conexión como ausencia de membresía. Comprueba que el grupo sigue existiendo antes de crear el acceso personal.
- La consulta de un EAN distingue una respuesta explícita de producto inexistente (incluyendo HTTP 404 con status 0) de una respuesta mal formada o un fallo de servicio. Conserva el aviso con el código leído incorporado en v0.43.1.
- Editar mientras termina una búsqueda descarta el resultado anterior y vuelve a habilitar el botón de consulta.
- Cabecera y Ajustes muestran la versión completa, incluido el número de parche. Se renuevan los identificadores de recursos y del shell sin conexión.

## Validación

117 pruebas JavaScript superadas. Incluyen un adaptador que rechaza el borrado de la ficha del propietario, las modificaciones de campos protegidos de membresía y las actualizaciones de accesos personales, según las capturas. Verifican invitación nueva, repetida, alta parcial, error de red y lista eliminada; consulta de código ausente, respuesta inválida, descarte de consultas antiguas y selección sin foco automático. Las pruebas existentes cubren compras, duplicados, alérgenos, carga compartida y lectura de códigos.

Estas pruebas de permisos son simulaciones, no una ejecución contra las reglas de Firebase ni contra dos cuentas reales. No se han realizado operaciones de borrado sobre las listas del usuario. Falta confirmar con dos cuentas y con la cámara de su móvil.

## Límites

La ficha de membresía del propietario queda como metadato residual bajo el grupo eliminado; no contiene los productos de la lista. Los accesos personales de otros miembros también pueden permanecer, y la suscripción los oculta al no existir el grupo. Firestore no realiza borrado recursivo desde este cliente. Los permisos reales siguen siendo la autoridad.

El archivo histórico firestore.rules no representa las reglas completas de las capturas y no debe desplegarse. Esta versión no cambia reglas, cuentas ni datos existentes. Los cambios se publican únicamente en /pruebas/.
