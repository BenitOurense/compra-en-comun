# Compra en Común v0.36

- Navegación móvil: Home, Productos, Buscar, Favoritos y Escanear; Ajustes en la cabecera. Favoritos tiene pantalla propia y acceso desde la lista, orden alfabético y alta repetida sin abrir el teclado.
- Autocompletado desde la primera letra, sin peticiones externas al escribir. Índice local de hasta 50.000 fichas, aparte de la caché de consultas recientes. EAN local antes de consulta remota.
- Catálogo real publicado en `catalogue/`, extraído de la exportación oficial OFF (ver tools/README.md). Descarga inicial desde Ajustes, persistencia IndexedDB, validación y actualización atómica. Los datos ausentes se indican, no se deducen certificaciones.
- Iconos genéricos diferenciados: botella de agua, vaso de zumo, cartón de leche, aceite, café, limpieza y papel; fotografías reales tienen prioridad.
- Recursos v0.36 y renovación del caché de la PWA. Se conserva Firebase y la estructura existente de permisos y listas. No se despliegan reglas.

## Verificación

42 pruebas JavaScript y 6 del importador Python superadas. Incluyen descarga validada, conservación ante corrupción, bloqueo de fragmentos externos, 50.000 fichas sin recorte a la caché de recientes, búsqueda de Príncipe por galletas, iconos y regresiones de favoritos/transacciones.

Navegador aislado: cinco destinos, favoritos por orden alfabético, alta manteniendo la pantalla y sin foco en el campo oculto, resultados desde una letra, descarga y persistencia del catálogo local. La selección mantiene el orden y la altura de las filas existentes.

Pendiente: lector físico y teclado en Android, instalación real PWA, prueba de dos cuentas Firebase y sincronización de preferencias/favoritos/historial (siguen locales por cuenta y dispositivo). La actualización semanal está preparada pero inactiva: requiere permiso para crear `.github/workflows/catalogue.yml`, fuera de `/pruebas/`.

Solo cambia `/pruebas/`. La aplicación estable permanece intacta. No se publican páginas QA ni datos personales de pruebas.
