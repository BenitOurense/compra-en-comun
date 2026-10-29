# Compra en Común — v0.33

Diseño móvil aprobado a partir de la referencia de cuatro pantallas. Todo el cambio está en `/pruebas/`; la aplicación estable de la raíz no cambia.

## Interfaz

- Cabecera compacta y navegación inferior permanente: Listas, Productos, Escanear y Ajustes. Se aprovecha la pantalla del móvil y sus áreas seguras. En pantallas grandes se conserva un ancho de aplicación móvil de hasta 480 px.
- Listas en cuadrícula de dos columnas, tarjetas cuadradas de colores suaves e iconos grandes. Los iconos se asignan por el nombre de la lista, sin añadir campos ni cambiar las reglas de Firestore. El número de participantes de las listas compartidas se obtiene de la consulta existente; si no puede obtenerse, se muestra «Compartida».
- Nueva lista, catálogo, ajustes, participantes y escáner ocupan vistas completas. Solo se conserva el cuadro de confirmación para comprar o quitar productos.
- Filas de producto de 78 px, con miniatura real cuando existe e icono genérico en los demás casos. Casillas visibles, fondo azul de selección y acceso a la ficha. Seleccionar no ordena, no agrupa, no cambia alturas ni elimina filas. La barra de compra tiene posición y espacio reservados. La retirada sigue requiriendo confirmación, como en v0.32.
- Búsqueda local con incorporación en un toque desde las sugerencias. Las fichas de productos exactos tienen un acceso independiente para inspeccionar alérgenos antes de añadirlos. La entrada por teclado permite escribir y pulsar Enter, limpia el campo y conserva el foco. La pantalla de altas permanece abierta para añadir varios seguidos.
- Recientes y habituales con miniaturas e incorporación directa. Búsqueda externa explícita, caché y datos de Open Food Facts conservados.
- Ajustes y atribución del catálogo trasladados a su propia pantalla. Sigue existiendo el máximo de dos supermercados por usuario y dispositivo.
- Historial de navegación de las vistas para volver con Atrás, vinculado a la cuenta para no restaurar pantallas de otra sesión. El escáner y los participantes usan diálogos accesibles que se presentan visualmente a pantalla completa; el lector y su detención siguen en `mobile.js`.
- Se mantiene la PWA de GitHub Pages; no es un APK nativo. Manifest y caché de archivos públicos actualizados a v0.33. La instalación y el teclado físico del móvil requieren prueba en Android.

## Compatibilidad y verificaciones

- El bloque de inicialización y API de Firebase de `index.html` es idéntico al de v0.32. No se han publicado ni modificado reglas de Firebase, roles o permisos.
- Se conservan las transacciones de productos, invitaciones, miembros, administradores y operaciones existentes.
- 15 pruebas automáticas del catálogo y de las mutaciones superadas; sintaxis de JavaScript comprobada.
- Pruebas de navegador sobre una copia local aislada, sin autenticación ni escritura en Firebase: crear lista desde la tarjeta, navegar, añadir por sugerencia y por Enter, conservar foco, volver mediante el historial, inspeccionar ficha y consultar por código desde el escáner.
- Medidas del navegador antes y después de seleccionar varios productos: misma coordenada vertical y misma altura (78 px) para todas las filas.
- Prueba de contexto de pantalla de 320 px mediante un iframe: lista y catálogo sin desbordamiento horizontal. Escáner medido a toda la altura disponible.
- Prueba de ajustes con una identidad ficticia local: dos supermercados aceptados, tercera opción rechazada, guardado local y cierre de sesión con ocultación de vistas privadas.
- Las páginas QA, sus identidades y sus listas no se publican.

## Pendiente de prueba manual

- El usuario confirmó que la cámara se abre en v0.32; aún no está verificada la lectura física de un código ni la apertura de cámara de v0.33 en Android.
- Instalación PWA y comportamiento del teclado y del botón Atrás del sistema en un dispositivo Android real.
- Edición simultánea con dos cuentas reales y contraste de las reglas activas de Firestore. La copia `firestore.rules` del repositorio sigue sin ser una fuente validada de las reglas activas para grupos.
