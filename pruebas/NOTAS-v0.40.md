# Compra en Común v0.40

- Marcos de alérgenos dibujados por encima de los botones mediante un pseudo-elemento sin eventos de puntero. El fondo blanco de Favoritos, Recientes o Sugerencias ya no oculta los lados del marco. No añade tamaño ni cambia la selección.
- Altas sin duplicados en la interfaz y en la transacción de Firestore. Productos concretos por GTIN/EAN (normalizando UPC-A/EAN con cero inicial); genéricos por nombre sin distinguir mayúsculas, acentos o espacios repetidos. Un genérico y un producto concreto siguen siendo entradas distintas; también los EAN diferentes.
- El alta repetida no cambia la selección ni crea otra fila: muestra que el producto ya está. Favoritos toma el resultado real de la acción; no anuncia Añadido cuando se ha evitado un duplicado.
- Al abrir una lista, unifica duplicados existentes conservando la posición y el ID de la primera fila, la selección si cualquiera estaba marcada y los metadatos más recientes disponibles. La operación de limpieza lee el estado actual en una transacción y conserva los productos distintos añadidos por otros miembros.
- Nombre e icono de instalación no cambian: manifiesto Compra en Común · Pruebas, nombre corto Compra pruebas; título de inicio iOS Compra en Común. Icono de carrito blanco sobre fondo verde.

## Verificado

77 pruebas JavaScript superadas, incluidas 7 nuevas sobre duplicados, altas repetidas con IDs distintos, normalización de nombres y GTIN, conservación de estado y metadatos, y listas de 500 productos.

Navegador aislado sin Firebase con la ficha real Schär EAN 8008698024188: tres copias se convierten en una, manteniendo la selección; pulsar dos veces el favorito conserva una fila y avisa. Alta manual de Agua mineral con mayúsculas/espacios tampoco crea una segunda fila. Marco completo revisado visualmente y estilos calculados del borde sobre los botones.

No se ha repetido la prueba con dos cuentas Firebase reales ni instalado físicamente en los móviles. La protección transaccional se comprueba automáticamente y usa la ruta de transacción existente. Solo cambia /pruebas/, sin reglas ni aplicación estable. No se publican páginas QA ni datos personales de pruebas.
