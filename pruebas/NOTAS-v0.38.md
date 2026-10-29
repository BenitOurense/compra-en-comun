# Compra en Común v0.38 — alertas antes de la 1.0

## Implementado

- Ajustes con selección múltiple de los 14 grupos principales de alérgenos, incluido gluten para celiaquía. Preferencias personales por cuenta en este dispositivo, no enviadas a grupos ni a Firestore.
- Marco rojo si hay presencia o posibles trazas de uno o más seleccionados; detalla las coincidencias. Rojo tiene prioridad ante datos contradictorios.
- Marco verde exclusivamente si la fuente declara ausencia de todos los seleccionados. No se infiere ausencia de campos vacíos, nombres genéricos, una lista parcial de alérgenos, veganismo o etiquetas sin lactosa. El verde es una declaración de la fuente, no una certificación ni garantía de seguridad. Revisar siempre el envase.
- Sin marco si faltan datos o se trata de un genérico. Además del color se muestra texto y símbolo. Los marcos son sombras interiores: no alteran tamaño ni orden de las filas.
- Alertas también en sugerencias, recientes, favoritos y ficha. Una ficha local más reciente puede actualizar el aviso de un producto ya guardado sin reescribir datos compartidos.
- Se conservan etiquetas OFF en caché, fichas guardadas y nuevas consultas por código. Catálogo de 50.000 fichas regenerado desde la exportación oficial completa; etiquetas en 27.858 fichas. Tamaño 14.998.556 bytes. Descarga disponible en Ajustes; datos vacíos siguen siendo desconocidos.
- Supermercados favoritos sin el límite de dos. No se implementa aún una consulta de precios.
- `propuesta-v1.html`: boceto público con tres pantallas. El comparador y la exportación son propuestas, con precios simulados expresamente marcados.

## Comprobaciones

63 pruebas JavaScript y 7 Python superadas. Incluyen los 14 grupos, múltiples coincidencias, trazas, contradicciones, ausencia parcial, falta de datos, genéricos, sin lactosa frente a leche, aislamiento por cuenta y conservación de etiquetas. Checksums y recuento verificados para los 50 fragmentos del nuevo catálogo.

Navegador aislado sin Firebase: persistencia de dos alertas tras recarga, guardado sin salir de Ajustes, selección de tres supermercados, marcos rojo/verde/neutro con fichas reales y un genérico, y geometría idéntica antes/después de seleccionar una fila (78 px por fila, posiciones constantes). Los archivos QA y datos de prueba no se publican.

Pendiente: pruebas físicas Android y dos cuentas reales; sincronizar estas preferencias entre dispositivos requiere diseño y autorización específicos. Actualización semanal continúa inactiva. No se contratan servicios, no se cambian reglas de Firebase ni la aplicación estable.

## Propuesta posterior: Voy al súper

Comparador dentro de la app con Excel como exportación. Elegir zona/código postal, tiendas y cantidades; separar producto exacto de equivalentes genéricos. Comparar por kg/l/unidad y mostrar fuente, tienda y fecha. Cesta en una sola tienda frente a reparto entre varias, incluyendo desplazamiento. Excluir alternativas con alertas y mantener visible la incertidumbre. Open Prices ofrece datos abiertos y exportaciones, pero hay que medir cobertura y actualidad para las tiendas deseadas antes de prometer un comparador completo.
