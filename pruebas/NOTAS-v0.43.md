# Market Sinc v0.43 · móvil y listas compartidas

## Cambios

- Sin foco automático en campos al abrir Buscar, Nueva lista, elegir sugerencias o terminar un alta. No se reabre el teclado al añadir desde recientes/favoritos. Se conserva la edición que el usuario ya haya iniciado tocando el campo.
- Cambiar nombre usa un diálogo propio con Cancelar como foco inicial, evitando el teclado forzado del prompt nativo. La validación de formularios informa sin reenfocar automáticamente un campo inválido.
- El resaltado azul se dibuja dentro del campo y se aumenta la separación respecto a la franja fija de estado: no queda una parte del contorno bajo la franja. Sin cambio de tamaño al enfocar.
- Participantes: nombre y rol destacados, acciones ocultas al inicio y reveladas al deslizar hacia la izquierda. Botón de opciones y Escape como alternativas accesibles. Solo se generan las acciones que corresponden al rol actual; un gesto vertical no abre opciones.
- Crear una lista abre directamente Compartir después del guardado correcto. Si falla la preparación de la invitación, ofrece reintentar. No se envían mensajes automáticamente.
- Ajustes y menús con formas redondeadas y azul del logotipo; Sinc pasa al naranja #ef821c. Se incorpora el icono de flecha al botón Volver.
- Borrado compartido y expulsión: ya no intentan borrar userShares de otros usuarios. La configuración anterior recuperada del contexto establece que esos accesos personales solo los puede borrar su titular. El propietario elimina el grupo, las membresías consultadas y su propio acceso. Expulsar revoca la membresía. Se mantienen las comprobaciones de propietario/administrador y la autorización de Firebase.

## Verificado

107 pruebas JavaScript superadas. Nuevas pruebas de foco, carga del módulo de participantes, gestos vertical/horizontal, despliegue de acciones, roles y operaciones con denegación simulada de accesos privados ajenos. Sintaxis del código y existencia de recursos del shell comprobadas.

Navegador Chromium con backend aislado y datos desechables, a 320/390 píxeles: abrir Buscar y Nueva lista deja los campos sin foco; añadir un reciente no los enfoca; crear conduce a Compartir; renombrar abre con foco en Cancelar y guarda correctamente. Campo de búsqueda a y=94 y final de franja de estado a y=82; contorno azul interior completo, sin desbordamiento horizontal. Arrastre horizontal y botón alternativo revelan tres acciones que caben a 320 píxeles; cambio de rol y expulsión comprobados. Borrado compartido comprobado con adaptador que rechaza accesos privados de otros usuarios.

## Pendiente y límites

- Las pruebas de backend son simulaciones, no una lectura de las reglas desplegadas. Es necesario repetir el borrado con una lista desechable compartida y observar el resultado en las dos cuentas.
- No se ha probado un teclado físico de Android/iPhone ni un gesto táctil real en esos dispositivos; se ha comprobado foco y navegación en Chromium, y gesto de puntero horizontal. El comportamiento del teclado móvil requiere esa comprobación.
- No se han cambiado reglas de Firebase, credenciales, configuración del proyecto ni la aplicación estable. El archivo histórico pruebas/firestore.rules sigue sin representar las reglas completas de grupos; no debe desplegarse como sustituto de las actuales.
- Los accesos privados de los demás participantes pueden quedar como referencias residuales. La lista y los permisos de membresía desaparecen; la suscripción existente oculta documentos ausentes o no accesibles. No se accede a esos espacios privados para purgarlos ni se atribuye una limpieza recursiva de servidor.
- Los límites existentes de borrado de grupos grandes y de preferencias guardadas solo en este dispositivo permanecen. No se ha activado ningún servicio de pago.
