# Compra en Común v0.39 — Android e iPhone

## Cambios

- Lector alternativo local ZXing para navegadores sin `BarcodeDetector` o sin formatos EAN/UPC disponibles. Conserva el detector nativo cuando existe y limita el alternativo a EAN-13, EAN-8 y UPC-A con checksum válido.
- Bundle oficial `@zxing/browser` 0.2.1 verificado contra npm, con licencias MIT y Apache-2.0. No requiere servicio de pago ni envía imágenes a servidores. Carga diferida y copia en la caché pública de la PWA.
- Pausa y cierre detienen controles del lector alternativo y cámara, también si el lector termina de arrancar después de haberlo cerrado. Una detección solo genera una consulta. El teclado sigue siendo voluntario.
- Instrucciones de instalación para Android/Chrome e iPhone/Safari en Ajustes. Icono de inicio y metadatos de aplicación web para iOS. La instalación inicial recomendada para ambos sistemas es PWA; no se ha creado una APK ni una aplicación nativa iOS.
- Solo /pruebas/. No se cambian listas, autenticación, reglas Firebase, catálogo ni aplicación estable. El comparador de precios continúa como boceto.

## Verificación y límites

70 pruebas JavaScript superadas: 63 existentes y 7 adicionales. Las nuevas incluyen el cargador local y su reintento, lectura real del bundle sobre una imagen EAN-13 limpia generada para pruebas, rechazo de una imagen vacía, selección del lector alternativo, cierre y pausa durante su arranque, y ausencia de consultas duplicadas.

En navegador Chrome aislado se cargó el bundle local y se leyó el mismo EAN desde un vídeo generado con canvas, deteniendo la captura tras reconocerlo. No se usa una cámara física ni Firebase en esa página QA, que no se publica.

La imagen de prueba codifica el EAN real 8410128160074; es una prueba de decodificación, no de cámara física. No se ha probado Safari real ni un iPhone desde este entorno. Tampoco se afirma que la instalación o autenticación en modo instalado estén verificadas en los teléfonos del usuario.

## Prueba manual que falta antes de cerrar la 1.0

1. Abrir /pruebas/ en Chrome Android y Safari iPhone, con las respectivas cuentas. Instalar desde cada navegador y volver a iniciar sesión si lo solicita.
2. En cada móvil, abrir el lector, comprobar que no se muestra teclado, leer un código y añadir producto exacto o genérico. Tocar el campo numérico debe detener la cámara; Volver a la cámara debe reanudarla.
3. Con dos cuentas distintas unidas a la misma lista, añadir desde un móvil, comprobar recepción en el otro y marcar un producto sin desplazar filas. Confirmar permisos esperados y acceso tras cerrar/reabrir.
4. Verificar alergias seleccionadas y catálogo en cada dispositivo: estos ajustes siguen siendo locales por cuenta y móvil.

Detener el desarrollo cuando sea necesaria esta prueba física y esperar el resultado. Actualización semanal del catálogo continúa inactiva.
