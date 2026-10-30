# Market Sinc v0.41 · Pruebas

- Identidad azul y naranja aprobada: dos carros enlazados, nombre Market Sinc y subtítulo «Listas de la compra compartidas».
- Cabecera adaptable en Inicio y acceso. Texto HTML accesible, tipografía Nunito en cursiva alojada con la app y licencia adjunta. Las pantallas de productos conservan el título de la lista y su cabecera compacta.
- Nombre Market Sinc en manifiesto, Apple, acceso, ajustes e invitaciones. Inicio pasa de Home a Inicio. Iconos PNG de 192, 512 y 180 píxeles en /pruebas/brand/.
- Se conserva el id, scope y start_url del manifiesto, todas las claves de almacenamiento y la configuración Firebase. Sin migración de cuentas ni listas. No cambia la lógica de permisos, transacciones o escaneo.
- Caché del shell v041 incluye iconos y tipografía para uso posterior sin conexión; se mantiene la exclusión de peticiones Firebase y APIs de productos.

## Verificado antes de publicar

77 pruebas JavaScript superadas; sintaxis de inline, app-ui.js y sw.js comprobada. Todos los recursos del shell existen y tamaños PNG coinciden con el manifiesto. SHA Git de la fuente original contrastado con google/fonts.

Navegador Chromium, copias locales aisladas sin Firebase: Inicio a 320 y 390 píxeles, acceso a 390; nombre, subtítulo y versión visibles, icono cargado, sin desbordamiento horizontal a 320. Navegación Inicio → Casa → selección → Inicio; cabeceras de 96/62 píxeles y filas de 78 píxeles que conservan coordenadas al seleccionar. Sin errores de la aplicación en consola.

Pendiente de prueba física: instalación y presentación del icono en Android/iPhone, actualización de accesos instalados anteriormente y nueva comprobación con dos cuentas Firebase reales. No se atribuye como comprobado. Solo se publica /pruebas/; páginas QA, datos de prueba y fuente de trabajo original quedan fuera.

## Instalación y compartir

Abrir https://benitourense.github.io/compra-en-comun/pruebas/ en Chrome (Android) o Safari (iPhone). Android: menú → Añadir a pantalla de inicio → Instalar. iPhone: Compartir → Añadir a pantalla de inicio; activar Abrir como app web si aparece. Nombre Market Sinc, icono de dos carros azul/naranja. No requiere APK.

Para presentar la app, enviar el enlace anterior. Para compartir una lista concreta, menú ⋮ de la tarjeta → Compartir invitación → WhatsApp, correo o copiar enlace. Cada persona usa su propia cuenta y acepta la invitación; esta caduca en 7 días. Si los datos de una instalación antigua tardan en cambiar, no borrar datos ni desinstalar sin revisar primero los ajustes locales que solo están en ese dispositivo.
