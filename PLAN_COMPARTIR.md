# Compartir listas — diseño de implementación

Estado: diseño, NO desplegado. Las reglas actuales de Firestore solo permiten listas privadas por propietario.

## Experiencia
- «Compartir» dentro de cada lista, enlace copiable y compartible por WhatsApp.
- El destinatario inicia sesión con su propia cuenta verificada y acepta.
- Se sincronizan productos en tiempo real.
- El propietario puede revocar miembros e invalidar invitaciones.

## Seguridad
- Nunca dar acceso público de lectura/escritura a una lista solo por conocer su ID.
- Token de invitación aleatorio criptográficamente seguro, no adivinable, con caducidad.
- Una invitación aceptada debe vincularse al UID autenticado, con validación en reglas de Firestore.
- El usuario invitado solo puede editar productos; no administrar miembros ni borrar la lista.
- Revocar permisos debe surtir efecto en las reglas, no solo ocultar botones.
- No almacenar secretos en la URL después de aceptar la invitación.
- Evitar una regla global «allow read, write: if request.auth != null».
- Preferir un modelo de listas compartidas de primer nivel y membresías verificables; migrar listas privadas sin perder datos.
- Antes de habilitar en producción, probar propietario, invitado, no miembro, usuario no verificado y revocación con emulador de reglas.

## Pasos
1. Definir colecciones y reglas de membresía.
2. Implementar migración de listas privadas y listeners en tiempo real.
3. Implementar creación/aceptación de invitaciones y enlaces de WhatsApp.
4. Pruebas de permisos y publicación controlada.

No modificar las reglas publicadas hasta que el código y las pruebas estén listos.
