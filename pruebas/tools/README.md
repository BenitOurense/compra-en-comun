# Catálogo español local

`python3 pruebas/tools/build_catalog.py` descarga por streaming la exportación TSV gzip oficial de Open Food Facts. No utiliza la API de búsqueda. Selecciona hasta 50.000 productos con GTIN válido y país de venta España, priorizados por popularidad y actualización. No inventa datos ni certificaciones.

La ejecución del 29/10/2026 examinó 4.881.991 filas y encontró 323.567 productos españoles válidos. La selección publicada contiene 50.000 fichas, 48.912 con URL de imagen y 16.336 con alérgenos declarados. Es una selección, no todo el catálogo español. Los JSON ocupan 13.047.776 bytes; las fotografías se descargan aparte al mostrarlas.

La aplicación consulta el manifiesto y ofrece descargar este catálogo desde Ajustes. Guarda las fichas en IndexedDB, verifica los fragmentos y sustituye la copia anterior solo al terminar correctamente. Las sugerencias usan un índice local desde la primera letra. La consulta online explícita sigue disponible con sus límites propios. La lectura EAN utiliza primero la copia local.

El importador conserva la salida anterior si falla o el recuento cae de forma sospechosa. Se prueba con `python3 -m unittest discover -s pruebas/tools -p 'test_*.py'`. `--input` permite usar un TSV o TSV.gz local. No es necesario acceder a la Raspberry Pi.

`pruebas/automation/catalogue-workflow.yml` es un borrador INACTIVO para actualización semanal en GitHub Actions. Activarlo requiere autorización para colocarlo en `.github/workflows/`, fuera del alcance permitido. No se ha ejecutado en Actions.

Datos Open Food Facts: ODbL. Imágenes de sus colaboradores: CC BY-SA. La ausencia de alérgenos no significa que el producto sea apto para una alergia. Verificar siempre el envase.
