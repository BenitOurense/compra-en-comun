# Compra en Común — v0.32 (29/10/2026)

Todo el desarrollo de esta entrega está limitado a `/pruebas/`. El `index.html` de la raíz se conserva.

## Cambios

- 337 nombres genéricos de alimentación, hogar, higiene y mascotas. Se eliminan ejemplos comerciales escritos manualmente. No son fichas verificadas ni certificaciones.
- Autocompletado local por palabras, marca o código, tolerante a tildes y diéresis. Se conserva el foco tras añadir para facilitar la entrada consecutiva.
- Botón explícito de búsqueda en Open Food Facts: texto filtrado por España, o consulta EAN/UPC con validación del dígito de control. Ninguna consulta externa al escribir cada letra.
- Caché persistente de hasta 1500 productos y 40 consultas. Consultas reutilizables durante 24 horas; fichas por código durante 7 días. Limitación entre peticiones y tiempo de espera de 15 segundos. Los errores permiten continuar con nombres manuales.
- Conservación de nombre, marca, código, imagen, alérgenos y trazas cuando los proporciona la fuente. Fichas enlazadas a Open Food Facts y atribución ODbL/CC BY-SA. No se deduce que un producto sea sin gluten por carecer de datos.
- Preferencias existentes de dos supermercados por usuario y dispositivo utilizadas para priorizar sugerencias cuando consta la tienda en la fuente. No hay sincronización de estas preferencias entre dispositivos.
- Escaneo EAN-13, EAN-8 y UPC-A mediante BarcodeDetector y cámara trasera cuando el navegador lo permite. Se detiene la cámara al cerrar, cambiar de página, ocultar la aplicación o salir de la cuenta. Entrada manual alternativa.
- Manifest, iconos y service worker exclusivo de `/pruebas/`. El worker solo cachea archivos públicos de la aplicación; no intercepta Firebase, imágenes o consultas al catálogo. No se promete acceso a listas sin conexión. La instalación depende de HTTPS y del navegador Android.
- Altas, selección, retirada y cambio de nombre mediante transacciones sobre la versión actual de la lista, evitando sobrescribir productos de otros miembros con una copia antigua. Operaciones idempotentes y límite de 500 productos. Indicador de guardado.
- Limpieza de vistas y diálogos al salir de sesión, protección frente a callbacks de otra cuenta y eliminación de una emisión vacía provisional que podía cerrar una lista compartida al actualizar sus suscripciones.

## Comprobaciones realizadas

- `node --test pruebas/tests/*.test.cjs`: 15 pruebas superadas; búsqueda, caché persistente, errores, códigos, filtro España y cambios concurrentes simulados.
- Sintaxis de JavaScript validada con `node --check`.
- Navegador, mediante una copia local aislada que sustituye exclusivamente el acceso a Firebase por almacenamiento de prueba: crear lista, sugerencia «platano» → «Plátanos», altas consecutivas, selección, confirmación y retirada, conservación de fichas y rechazo de código incorrecto.
- Consulta real por EAN `3017624010701` (ejemplo de la documentación oficial de OFF); recuperación posterior desde caché. Consulta real «galletas»: 24 resultados. Ninguna ficha recuperada en estas pruebas se incorpora al catálogo distribuido.
- La copia local de pruebas y sus listas ficticias no se publican.

## Pendiente de acceso o prueba manual

- Cámara física, lector e instalación PWA en un Android real; la previsualización disponible aquí usa HTTP y no permite probar esas funciones que requieren contexto seguro.
- Dos cuentas reales de Firebase editando una misma lista: las pruebas de transacciones son de lógica, no de integración con Firestore.
- Contrastar las reglas activas de Firebase. `pruebas/firestore.rules` del repositorio solo contiene listas privadas, mientras que la aplicación ya utiliza grupos, miembros e invitaciones. No se ha desplegado ni modificado esa copia ni se afirma que las reglas activas estén auditadas.
- Catálogo masivo de productos españoles y actualización periódica: esta entrega combina vocabulario local y consultas explícitas con caché; no descarga la base de datos completa. No se accede a la Raspberry Pi.

Fuentes técnicas consultadas: documentación oficial de Open Food Facts, https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/ y https://openfoodfacts.github.io/documentation/docs/Product-Opener/v2/search/get-search/ .
