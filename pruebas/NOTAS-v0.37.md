# Compra en Común v0.37

## Escáner y teclado

- Al abrir el diálogo, el foco va al botón de cierre, no al campo EAN. Se retira el foco de la búsqueda antes de abrirlo.
- Tocar o enfocar el campo del código detiene la captura, oculta el vídeo y permite escribir. Volver a la cámara conserva el código escrito y retira el foco del campo.
- Los streams que llegan tarde después de cambiar a entrada manual se apagan. Las detecciones pendientes no generan consultas si ya se pasó a escritura manual.
- Al detectar o enviar un código no se abre automáticamente el teclado de búsqueda. El cierre tampoco fuerza el foco a ese campo.

## Producto concreto o genérico

- La ficha ofrece Añadir este producto o Añadir [nombre] · genérico. El nombre genérico es editable; para la ficha de agua Bezoya se propone Agua.
- Los nombres se proponen desde el nombre del producto, vocabulario genérico y categorías españolas explícitas del catálogo. Si no hay correspondencia clara, se pide escribir el nombre. La propuesta es una ayuda editable, no una ficha certificada.
- El genérico guarda solo el nombre, sin heredar marca, EAN, fotografía, alérgenos o trazas. No se deduce ausencia de alérgenos ni certificación sin gluten.
- Las dos altas conservan la pantalla y no enfocan el teclado oculto.

## Comprobaciones

- 50 pruebas JavaScript superadas: 42 existentes y 8 nuevas sobre genéricos y ciclo de captura/manual, incluidos cambios durante el arranque de cámara y detecciones pendientes.
- Sintaxis comprobada de scripts modificados y script principal inline.
- Navegador aislado sin cuentas Firebase: apertura con foco en cierre, transición voluntaria al campo, consulta local del EAN real 8410128160074 y alta de ambas opciones. Agua queda genérica y Bezoya conserva marca/código por separado.
- El navegador de comprobación no ofrece lectura física de cámara: se prueba el ciclo de captura con streams/detecciones simulados y el flujo real de interfaz con código manual. Queda por comprobar el teclado y cámara físicos en Android.
- Solo se modifica /pruebas/. Firebase y sus reglas no cambian. No se activa la actualización semanal ni se contrata ningún servicio.
