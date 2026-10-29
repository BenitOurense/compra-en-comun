# Compra en Común — v0.35

## Cambios solicitados

- Si hay listas disponibles siempre se asigna una favorita. La estrella activa no permite desmarcarla; elegir otra la sustituye. Si la favorita desaparece, se asigna otra cuando termina la carga. La carga inicial de listas compartidas no sustituye una favorita guardada antes de saber si sigue disponible.
- Estrellas dibujadas con curvas y vértices redondeados, con relleno dorado para el estado favorito.
- Casilla de selección de productos oculta visualmente, conservando el control nativo accesible. Se selecciona tocando la fila y se mantiene el fondo azul; alturas y posiciones estables.
- Selector real de 16 iconos en Cambiar icono, guardado por cuenta y móvil y aplicado tanto a la tarjeta como a la cabecera. No requiere nuevos campos o reglas en Firebase.
- Alérgenos visibles en filas, sugerencias, favoritos y recientes. La ficha conserva el detalle y las trazas. Se traducen identificadores conocidos de la fuente; para nombres genéricos o información ausente se indica expresamente «sin información». No se deduce que un producto sea sin gluten.

## Búsqueda

- Buscar en internet solicita una consulta nueva, sin reutilizar silenciosamente una respuesta vacía guardada durante 24 horas.
- La caché recuerda que un nombre comercial apareció al buscar un término genérico: buscar «galletas» puede recuperar Príncipe aunque esa palabra no figure en el nombre comercial.
- Ante fallo de la consulta externa, se muestran resultados anteriores con un aviso explícito. No se presenta una caché como conexión online correcta.
- `catalogo-off-es.json` contiene seis fichas reales recuperadas de la consulta de Open Food Facts realizada el 29/10/2026 a las 14:17:10 UTC. Conserva nombre, marca, EAN, URL de miniatura, alérgenos, trazas y tiendas de la fuente. El fichero incluye fuente, fecha y licencias. Se carga una vez, junto al vocabulario local, sin consultas externas por cada letra.
- Con caché vacía, esta muestra permite encontrar Príncipe buscando «galletas». Es una muestra pequeña, no un catálogo masivo ni una ficha inventada. Una ficha más reciente no se sobrescribe al cargar esta muestra.
- Recursos versionados para reducir la mezcla de scripts de despliegues distintos. Service worker actualizado con el nuevo fichero de catálogo.

## Verificación y límites

- 35 pruebas automáticas superadas: catálogo, caché, actualización explícita, respuestas vacías, recuperación ante error, alérgenos, muestra real con caché vacía, favorita obligatoria, iconos por cuenta, historial, transacciones y finalización de las suscripciones compartidas.
- Navegador local aislado: selector de iconos y persistencia tras recargar; Príncipe en la búsqueda local y dentro de la lista con alérgenos; selección por toque sin casilla visible ni desplazamiento de filas.
- La petición online durante esta sesión falló desde el entorno de prueba y se comprobó la recuperación desde caché con aviso. El otro servicio documentado por OFF también falló en una comprobación aislada. No se afirma que la búsqueda online nueva y continua esté resuelta.
- Se mantiene la estructura de Firebase y no se han cambiado ni desplegado permisos o reglas. El seguimiento de carga de las suscripciones ahora distingue respuestas parciales de carga completada. No se han probado dos cuentas reales con esta entrega.
- Favoritos, iconos e historial siguen siendo locales por cuenta y móvil. La lectura física del código y la instalación PWA en Android continúan pendientes de prueba.
- Solo se publican cambios dentro de `/pruebas/`, sin páginas QA ni datos privados de pruebas. La aplicación estable no cambia.

## Próximos pasos propuestos

1. Probar lectura física de códigos, instalación y comportamiento del teclado en Android.
2. Contrastar reglas activas de Firestore y probar permisos y sincronización con dos cuentas reales.
3. Sincronizar preferencias, iconos e historial con una estructura protegida en Firebase; decidir si el historial será personal o compartido por lista.
4. Preparar un catálogo español amplio con actualización periódica y consultas rápidas, separando esa importación de la escritura en el móvil. No se presupone acceso a la Raspberry Pi.
5. Añadir cantidades/unidades, recuperar compras anteriores y una opción para deshacer retiradas; después completar transferencia/eliminación de listas compartidas y pruebas de recuperación.
