# Fuentes de precios · investigación 02/11/2026

- Gadisline permite navegar sin registrarse según sus condiciones. Sus páginas de producto y categorías muestran formato e importe. Algunas respuestas recuperadas solo incluyen la estructura de la página, por lo que la carga dinámica requiere comprobar un mecanismo estable de descarga. No se ha confirmado una API pública documentada para terceros.
- Carrefour dispone de supermercado online y solicita código postal para determinar disponibilidad. Sus categorías muestran referencias e importes. No se ha confirmado una API pública documentada para terceros.
- Las promociones de los folletos de Gadis no son necesariamente válidas en Gadisline. No deben mezclarse como si fueran el mismo precio.
- Se ha encontrado una muestra pequeña utilizable de precios por formato en Gadisline, Carrefour y DIA. Se mantiene la referencia al canal online y no se presuponen precios de Ourense ni descuentos personales de las aplicaciones.

## Fuentes oficiales consultadas

- https://www.gadisline.com/pag/proceso-de-compra/condiciones-de-compra
- https://www.gadisline.com/leche-desnatada-pascual-brik-1-l
- https://www.gadisline.com/gl/lacteos/leite-e-bebidas-vexetais
- https://www.gadisline.com/refresco-coca-cola-normal-botella-2-l
- https://www.gadis.es/?idioma=es
- https://www.carrefour.es/supermercado
- https://www.carrefour.es/supermercado/la-despensa-pascual/F-13ji8Z11cy/c
- https://www.dia.es/huevos-leche-y-mantequilla/leche/pascual/c/13uoF19jb

## Siguiente paso de adquisición

Confirmar el ámbito de tienda/código postal y examinar en el acceso oficial qué catálogo o exportación está disponible. Una cuenta en la app no implica que Market Sinc pueda leer sus datos. La futura descarga debe guardar precio, formato, fecha, tienda/canal y EAN comprobado, y producir el JSON que ya acepta la aplicación. Las coincidencias sin EAN requieren confirmación de producto y formato. La actualización deberá realizarse fuera del cliente si la fuente no permite peticiones desde otro origen; no se ha añadido un proxy ni programado una extracción sin validar la fuente.

No se solicitan ni guardan contraseñas de supermercados en Market Sinc.
