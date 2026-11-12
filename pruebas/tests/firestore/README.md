# Pruebas de autorización de Firestore

Solo contra un emulador, sin credenciales. Desde la raíz del repositorio, con Node compatible y Java 21:

```bash
npm install --prefix pruebas/tests/firestore --ignore-scripts --no-audit --no-fund
NODE_PATH="$PWD/pruebas/tests/firestore/node_modules" pruebas/tests/firestore/node_modules/.bin/firebase emulators:exec --only firestore --project demo-marketsinc-rules --config firebase.rules-test.json 'node --test pruebas/tests/firestore/rules.test.cjs'
```

El proyecto `demo-` evita seleccionar producción. El test exige FIRESTORE_EMULATOR_HOST, que establece el comando del emulador. Los registros PERMISSION_DENIED son esperados para los casos que deben ser rechazados. No ejecutar firebase deploy con esta configuración: sirve para pruebas locales.
