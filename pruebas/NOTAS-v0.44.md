# Market Sinc v0.44 · escáner y primera comparación de precios

## Escáner

La consulta de un código se realiza dentro del lector, sin cerrar su pantalla ni navegar a Buscar. Tanto un producto ausente como un fallo de consulta permiten registrar nombre y marca junto al EAN/UPC. La ficha manual se conserva por cuenta y dispositivo; al añadirla a una lista, sus datos viajan en el producto compartido mediante el guardado habitual de la lista. No se incorporan a la caché global entre cuentas ni se atribuyen alérgenos o certificaciones a lo escrito por el usuario.

Si el catálogo ofrece una ficha para el mismo código, el lector presenta ambas versiones y permite elegir. La eliminación de la ficha manual exige confirmación y no elimina los artículos que ya estén en listas. Elegir una ficha de un EAN ya presente ofrece sustituir expresamente sus datos, conservando su ID y selección y sin sobrescribir productos concurrentes.

Tocar la vista de cámara solicita enfoque puntual cuando la cámara lo anuncia, enfoque single-shot o continuo según las capacidades disponibles. El lector informa cuando el navegador no ofrece este control. No se atribuye soporte de enfoque a un punto cuando solo existe enfoque automático.

## Voy al súper

Botón nuevo dentro de cada lista y pantalla propia. Permite elegir supermercados, indicar número de envases, vincular un producto con un precio de catálogo, anotar precios propios, importar catálogos JSON y exportar la comparación como CSV compatible con Excel.

La comparación automática exige un EAN válido coincidente; los productos sin EAN o equivalencias se vinculan de forma explícita. Se muestra la cobertura de cada supermercado, y no se recomienda una cesta más barata a partir de subtotales incompletos. Tampoco se recomienda si los formatos elegidos difieren. Los cálculos usan céntimos y cantidades enteras. Se excluyen referencias de más de siete días. Las fuentes HTTPS y fechas son visibles. El CSV protege textos interpretables como fórmulas.

price-catalogue.json contiene una muestra inicial muy pequeña de referencias públicas indexadas de Gadisline, Carrefour y DIA consultadas el 02/11/2026, con formato y enlace de origen, sin tienda/código postal confirmado. No se presenta como inventario completo, precio del establecimiento del usuario ni consulta en tiempo real. Las referencias no disponen de EAN confirmado y requieren vinculación explícita; no se inventan códigos. No se han conectado cuentas de fidelización ni cupones personalizados.

## Validación y límites

140 pruebas JavaScript superadas antes de publicar, incluyendo registro manual, aislamiento por cuenta, coexistencia manual/catálogo, eliminación, sustitución sin duplicado, fallo de guardado, respuestas tardías, capacidades de enfoque, precios incompletos/antiguos, cantidades, formatos, importación atómica y exportación. Sintaxis de todos los módulos comprobada.

tests/ui-preview.html ejecuta la interfaz real con datos desechables y sin inicializar Firebase. Es una prueba de presentación, no una prueba de autorización ni de cámara física.

La integración automática y amplia con precios de Gadis+/Carrefour aún no está implementada. La muestra estática y el importador son una primera base funcional. Hace falta confirmar un catálogo o mecanismo de actualización utilizable y el ámbito de tienda del usuario. No se despliegan reglas de Firestore ni servicios de pago. Las comprobaciones del iPhone siguen pendientes.
