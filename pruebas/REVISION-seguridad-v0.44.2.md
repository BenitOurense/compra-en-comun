# Revisión de seguridad · Market Sinc v0.44.2

Fecha: 12/11/2026. Base revisada: b6d06de7a36ebe7872fdcc16d9878c08df0db413.

Origen: reel de goyo.dev DfiFYtvozej. Su descripción recomienda comprobar claves expuestas en el frontend, limitar peticiones y revisar el código antes de publicar. Se ha podido acceder a la página, a la reproducción y a esa descripción; no se ha obtenido una transcripción completa del audio. La revisión del código se realiza sobre esos tres puntos, sin atribuir al vídeo detalles no transcritos.

## Resultado y cambios

1. No se han encontrado patrones conocidos de credenciales privadas en los archivos de producción examinados. El campo apiKey del SDK cliente Firebase identifica el proyecto y no equivale a una clave de OpenAI, cuenta de servicio o contraseña. No se ha rotado ni ocultado esa configuración pública. El resultado del detector no garantiza ausencia de todos los formatos posibles de secretos ni revisa todo el histórico Git.
2. Login, registro y Google admitían peticiones concurrentes al pulsar repetidamente. Ahora comparten una exclusión de solicitudes y una pausa mínima de dos segundos. Un error auth/too-many-requests impone un minuto de espera local, conservado en almacenamiento cuando está disponible. Las contraseñas se limpian de los campos tras el intento y al cerrar sesión; no se añaden a persistencia ni logs.
3. La comprobación de verificación podía solaparse al usar un intervalo de tres segundos. Ahora espera la respuesta y programa la siguiente a los quince segundos, con control de generación y cuenta para descartar respuestas después de cerrar o cambiar sesión.
4. El catálogo ya tenía caché, un bloqueo de concurrencia y pausas por tipo de consulta. Se añade límite en memoria para que un error de almacenamiento no elimine la pausa, y espera ante HTTP 429 según Retry-After (segundos o fecha; sesenta segundos si no llega una indicación válida). Se conserva la consulta local y la caché. No hay reintentos automáticos en bucle.
5. Se aplica no-referrer a la página de la app, que puede recibir tokens de invitación. El token sigue retirándose de la URL al aceptar o descartar. Los nombres y datos de productos revisados se insertan con textContent; el innerHTML identificado en la interfaz corresponde a SVG y texto estático, no a nombres de usuario.
6. Se añade un detector limitado de patrones de credenciales y una definición de workflow para ejecutar comprobación y pruebas sin secretos, con permisos de solo lectura y checkout fijado a un commit. No es una revisión independiente por otra persona o modelo. Tampoco constituye un bloqueo de despliegue: Pages conserva su flujo existente y no se han cambiado reglas de protección de rama.

## Límites y pasos de servidor necesarios

Los límites del navegador reducen solicitudes accidentales; un atacante puede modificarlos o llamar directamente a Firebase. No sustituyen límites o controles de servidor, autorización, cuotas, App Check ni alertas de consumo. No se han activado servicios de pago.

El archivo firestore.rules del repositorio es histórico y solo contiene listas privadas. Se marca explícitamente NO DESPLEGAR para evitar sustituir por accidente las reglas actuales de grupos. Las pruebas existentes simulan restricciones conocidas: no verifican las reglas activas.

Antes de certificar aislamiento y protección contra abuso en producción, un administrador debe:

- Exportar y revisar las reglas activas: lectura y escritura entre cuentas, acceso solo para miembros, roles, invitaciones caducadas, expulsión y ausencia de lectura pública de colecciones privadas. Probarlas con Firebase Emulator y contextos autenticados y no autenticados.
- Comprobar que la clave pública se restringe a las APIs Firebase necesarias y no autoriza servicios Google de pago ajenos a la app; revisar dominios de autenticación autorizados.
- Revisar las cuotas y la protección contra enumeración de correos en Authentication. El mensaje genérico del cliente no configura esa protección de servidor.
- Configurar y observar App Check antes de exigirlo, comprobando Android/PWA/iPhone; no habilitar enforcement sin registrar primero los clientes legítimos.
- Revisar métricas y avisos de consumo. Un aviso presupuestario no es un tope de gasto.

No se han usado cuentas reales, pruebas de carga ni intentos de acceso a datos ajenos. La cámara pendiente del otro móvil, la comparación de supermercados y las ideas IA no forman parte de esta corrección.

## Comprobación reproducible

```
node pruebas/tools/security-check.cjs
node --test pruebas/tests/*.test.cjs
python3 -m unittest discover -s pruebas/tools -p 'test_*.py'
```

168 pruebas JavaScript y 7 del generador del catálogo superadas, más comprobación de sintaxis. Incluyen bloqueo de concurrencia, almacenamiento no disponible, espera de Firebase, limpieza de contraseña, respuesta tardía de verificación, HTTP 429, fechas Retry-After, caché y detector sin exposición del valor encontrado.

Referencias oficiales:

- https://firebase.google.com/docs/projects/api-keys
- https://firebase.google.com/support/guides/security-checklist
- https://firebase.google.com/docs/app-check
- https://firebase.google.com/docs/auth/limits
- https://openfoodfacts.github.io/openfoodfacts-server/api/
