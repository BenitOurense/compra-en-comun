# Revisión funcional · Market Sinc v0.42

30 de octubre de 2026. Ámbito exclusivo: /pruebas/. Sin cambios en Firebase, sus reglas publicadas, la app estable o los datos del usuario.

## Correcciones

1. Eliminar lista compartida deja de ser un aviso de función pendiente. Confirmación propia con nombre y advertencia «para todos». La transacción vuelve a leer el propietario actual y borra el documento de lista y las membresías/accesos de los participantes consultados. Si Firebase rechaza una operación, la transacción no aplica un borrado parcial. Máximo conservador de 200 participantes por operación; por encima se rechaza antes de escribir.
2. El borrado privado y compartido solo retira la tarjeta después de confirmarse. Cancelación, error visible, bloqueo de doble pulsación y revisión de la confirmación si cambia nombre o tipo de lista mientras está abierta. Se recalcula la favorita con las listas restantes.
3. Salir de una lista retira membresía y acceso propios en una transacción. El propietario ve Eliminar; los demás, Salir. El propietario puede transferir desde Participantes antes de salir.
4. Transferir propiedad comprueba dentro de la transacción que el solicitante sigue siendo propietario y que el destinatario sigue siendo participante.
5. Crear y renombrar listas esperan el resultado de guardado. Un fallo no crea una tarjeta ficticia ni deja un nombre anunciado como guardado. La creación bloquea dobles pulsaciones y vuelve a Inicio al terminar correctamente.
6. Marcar productos revierte la selección si falla la petición vigente, sin aplicar una respuesta antigua sobre una selección posterior. Las filas mantienen su posición.
7. Entrada rápida: se limpia el campo para seguir escribiendo, pero solo se anuncia Añadido tras guardar. Si falla se retira únicamente la fila pendiente de esa petición. Favoritos espera el resultado real. Se mantiene la protección contra duplicados incluso durante el guardado.
8. Aceptar una invitación usa merge para conservar roles existentes en reintentos. Se mantiene el orden de escritura de membresía y acceso compatible con las reglas existentes; no se presupone poder leer el grupo privado antes de entrar.
9. Compartir comprueba la sesión tras las esperas, conserva el propietario al convertir una lista privada y no abre una pantalla vacía al denegar permisos. Copiar enlace muestra una alternativa si falla el portapapeles. No se atribuyen todos los fallos a reglas sin haberlo comprobado.
10. Se descartan respuestas antiguas de participantes al cerrar/cambiar cuenta o abrir otra lista. Cerrar sesión cierra también la confirmación de listas.

## Comprobaciones realizadas

95 pruebas JavaScript superadas. Incluyen transacciones y EAN, catálogo y caché, lectura del motor de códigos, ciclo de cámara simulado, alergias, preferencias por cuenta, carga compartida y 18 nuevas sobre acciones de grupos/guardados fallidos. Los tests de grupos usan un adaptador Firestore simulado; no son una prueba de las reglas desplegadas.

| Función | Comprobación de esta revisión |
|---|---|
| Crear lista | Navegador con backend aislado y guardados correctos; fallo de persistencia en prueba automática |
| Cambiar nombre e icono | Navegador aislado, cambio visible |
| Favorita única | Navegador y pruebas automáticas; reasignación tras borrar la favorita |
| Eliminar compartida | Navegador aislado: cancelar, denegar, reintentar y retirar tarjeta; transacción simulada para propietario/no propietario y fallo atómico |
| Eliminar privada | Navegador aislado y persistencia local automática |
| Salir de compartida | Navegador aislado y transacción simulada; conserva el documento para otros miembros |
| Participantes, roles e invitaciones | Navegador aislado: rol y política; transferencia y controles posteriores; tests de invitación caducada y reintento |
| Alta consecutiva y duplicados | Navegador y pruebas; mismo genérico con mayúsculas/espacios; dos altas pendientes con fallo de una |
| Favoritos de producto | Navegador: marcar, abrir y añadir duplicado; batería de preferencias por cuenta |
| Comprar e historial | Navegador aislado: confirmación, retirada del producto y registro confirmado visible |
| Eliminar productos | Lógica de retirada y confirmación revisada; test transaccional por IDs sin borrar productos concurrentes |
| Supermercados | Navegador: tres selecciones y guardado |
| Multialergia y marcos | Navegador: guardar gluten y leche; batería roja/verde/desconocido; conserva neutral en genéricos |
| Búsqueda local y online | Autocompletado/caché/catálogo y errores en pruebas; ruta de búsqueda revisada; no se ha descargado de nuevo todo el catálogo ni auditado su cobertura comercial |
| Escáner | Pruebas de código válido y motor real con imagen sintética; ciclo de cámara simulado; sin teléfono físico |
| Registro, Google y verificación de correo | Revisión del código; no se crean cuentas reales ni se envían correos |
| Enviar WhatsApp/correo | Construcción de enlace revisada; no se envía ningún mensaje |
| PWA e instalación | Recursos y shell revisados; instalación física pendiente |
| Sincronización con dos cuentas | Pruebas de transacciones/callbacks; pendiente repetición con cuentas y reglas reales |

## Límites que requieren acceso o prueba manual

- El archivo pruebas/firestore.rules del repositorio solo contiene reglas para listas privadas y no representa necesariamente las reglas actuales: las compartidas funcionan según las pruebas previas del usuario. No se ha reemplazado ni desplegado ese archivo.
- El borrado compartido, las salidas y la transferencia deben comprobarse contra las reglas efectivamente publicadas, con una lista desechable y dos cuentas verificadas. Si Firebase devuelve permission-denied, se necesita revisar esas reglas; el cliente no elude permisos ni finge éxito.
- La enumeración de participantes y la transacción son pasos distintos: un alta concurrente podría dejar una referencia residual. Las invitaciones existentes no se consultan ni se borran globalmente; su validez debe depender de la existencia y permisos del grupo en las reglas reales. Una limpieza recursiva garantizada requeriría una operación de servidor y su autorización; no se ha activado ningún servicio de pago.
- Favoritos, iconos elegidos, alergias e historial siguen guardados por cuenta en este móvil. No se anuncia sincronización de esas preferencias.
- La comparación de precios continúa siendo un boceto, no una función disponible. La actualización semanal del catálogo continúa como borrador sin activar fuera de /pruebas/.

## Primera prueba manual

En v0.42, crear una lista llamada «Prueba de borrado», compartirla con la otra cuenta y añadir un genérico. Como propietario: ⋮ → Eliminar lista → confirmar. Comprobar que desaparece también en el otro móvil. No usar una lista con compras que se quieran conservar. Si aparece un error, conservar su texto o captura para revisar la regla concreta.
