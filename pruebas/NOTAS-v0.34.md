# Compra en Común — v0.34

Entrega limitada a `/pruebas/`. La aplicación estable no cambia.

## Lista favorita

- Cada cuenta puede marcar una única lista favorita con la estrella situada en la esquina superior izquierda de la tarjeta. Marcar otra sustituye a la anterior; se puede desmarcar.
- Los accesos inferiores Productos y Escanear utilizan siempre esa lista, aunque se estuviera consultando otra. Si no hay favorita disponible se pide marcar una; no se selecciona otra silenciosamente.
- Abrir una lista directamente y sus accesos interiores sigue permitiendo trabajar en esa lista. Los títulos de alta y de escaneo muestran el destino.
- Si una lista favorita deja de estar disponible, sus accesos no permiten seguir operando sobre ella. El identificador no se borra durante la carga provisional de las suscripciones.

## Productos favoritos

- Estrellas independientes de las casillas de selección en los productos, sugerencias y recientes.
- Sección Favoritos encima de recientes, con incorporación en un toque. Se conserva el producto exacto y sus datos cuando existen; no se confunde con un nombre genérico.
- Las estrellas no cambian la geometría de las filas ni el estado de selección para comprar.

## Comprar y Eliminar

- Comprar en verde y Eliminar en rojo, deshabilitados mientras no hay selección. Se conserva la confirmación antes de retirar productos.
- Comprar prepara un registro personal con lista, fecha y productos; solo lo marca confirmado si se confirma el guardado de la retirada. Se muestra en Historial de compras, accesible desde el menú de cada lista o desde Ajustes.
- Eliminar retira la selección sin crear una entrada en el historial.
- Si no se puede preparar el registro local, Comprar se detiene antes de enviar la retirada. Si falla el guardado, los productos no se retiran de forma optimista y se cancela el registro pendiente. Si la aplicación se cierra durante el proceso, el registro puede quedar señalado como pendiente, sin presentarlo como compra confirmada.
- Confirmación protegida frente a pulsaciones repetidas mientras hay un guardado en curso. Las retiradas siguen usando transacciones por identificador.

## Almacenamiento y alcance

Favoritos de listas, favoritos de productos e historial son personales por cuenta y se guardan en este navegador/móvil. No se comparten con el grupo ni se sincronizan entre móviles. Borrar los datos del navegador puede perder esta información. Las listas y los productos compartidos siguen usando Firebase. No se han cambiado ni publicado reglas o permisos de Firestore; la sincronización de estas nuevas preferencias requerirá revisar las reglas activas.

## Comprobaciones

- 23 pruebas automáticas superadas: las 15 anteriores más 8 de lista favorita única, aislamiento de cuentas, productos genéricos/exactos, registro pendiente/confirmado, reintentos y fallo de almacenamiento.
- Sintaxis de todos los scripts modificados validada.
- Navegador con copia local aislada: marcar Casa como favorita, abrir otra lista y comprobar que Productos vuelve a Casa; sustituir la favorita y comprobar que Escanear usa el nuevo destino; una sola estrella de lista activa.
- Producto marcado como favorito visible en su sección e incorporado de nuevo en un toque.
- Compra confirmada registrada con fecha y productos; eliminación posterior sin aumentar el número de entradas del historial.
- Posiciones y alturas de las filas comparadas antes y después de seleccionar: sin desplazamiento.
- No se han publicado páginas de prueba, identidades ficticias ni datos de las pruebas.

Pendiente: lectura física de códigos en Android; sincronización con dos cuentas reales. El usuario ya confirmó la apertura de cámara, no todavía la lectura del código.
