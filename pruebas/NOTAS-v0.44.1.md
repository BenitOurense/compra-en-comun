# Market Sinc v0.44.1 · cámara e instalación compartida

El escáner muestra una ventana compacta con botón azul en relieve «Permisos» y aspa de cierre cuando getUserMedia devuelve NotAllowedError o PermissionDeniedError. No se atribuyen a permisos los errores de cámara ocupada, ausente, decodificación o navegador sin acceso a cámara. El recuadro admite clic y teclado para reintentar cuando está detenido. Se conserva la entrada manual.

«Permisos» reintenta la solicitud del navegador cuando está disponible y muestra instrucciones de recuperación según plataforma. La web/PWA no tiene una API universal para abrir los ajustes de permisos del sistema o del navegador: no se incluyen enlaces falsos a ajustes ni se afirma que se han concedido permisos. Después de cambiar los permisos, el usuario vuelve y toca la cámara. No se ha añadido un puente Android: el repositorio no contiene el proyecto nativo ni el APK instalado por el amigo del usuario.

Cuando no existe soporte para solicitar enfoque al tocar, se conservan las instrucciones del lector en lugar de repetir el aviso. Esto no añade capacidades de enfoque que el navegador no expone.

En Ajustes, «Compartir app por WhatsApp» abre el selector de destinatario de WhatsApp con texto y el enlace público a instalar.html. El usuario confirma el envío. No incorpora identificadores de cuenta, invitaciones ni acceso a listas. La página pública comparte el mismo manifiesto (id y start_url) y service worker que la app. Ofrece instalación cuando el navegador proporciona beforeinstallprompt, alternativas Android/iPhone y acceso a la app web. No instala silenciosamente ni distribuye APK.

El aviso de APK para una versión antigua de Android requerirá inspeccionar y actualizar su compilación. Los avisos de instalación externa/Play Protect no se suprimen con JavaScript ni se recomienda desactivar protecciones. El nuevo enlace utiliza instalación web desde el navegador.

Validación: 155 pruebas JavaScript, incluidos rechazos y respuestas tardías de cámara, recuperación, cámara ocupada, enfoque no disponible, enlaces sin tokens y aceptación/cancelación de instalación. Comprobación visual de la ventana y su ayuda con datos aislados, y de la página de instalación. No equivale a probar cámara física, una instalación real en Android o las comprobaciones pendientes de iPhone. Sin cambios en Firebase ni en comparación de precios o funciones IA.
