# Lector local ZXing

Se distribuye `@zxing/browser` 0.2.1, UMD minificado oficial obtenido del paquete publicado en npm (`https://registry.npmjs.org/@zxing/browser/0.2.1`). Su tarball se verificó contra `dist.integrity` del registro antes de extraerlo. El bundle incluye el motor de lectura; no se descarga código de un CDN al usar la aplicación.

SHA-256 del archivo `zxing-browser-0.2.1.min.js`:
`066bc34edfcdd4a33f0964aeec967752a0dea1ccaf36e58e319ac9fcb5070f6a`

Proyecto: https://github.com/zxing-js/browser

Licencia de la capa de navegador: MIT, conservada en `ZXING-BROWSER-LICENSE.txt`. Motor `@zxing/library` (serie 0.23): Apache-2.0, conservada en `ZXING-CORE-LICENSE`. Las licencias originales forman parte de esta distribución. No se envían imágenes ni credenciales a ZXing.

Solo se inicializa al abrir el escáner cuando no hay detector nativo de EAN/UPC. Se limita a EAN-13, EAN-8 y UPC-A; el resultado también debe superar la validación de checksum del catálogo. La PWA guarda el archivo público en su caché. La carga del archivo no sustituye una prueba física en Safari/iPhone.
