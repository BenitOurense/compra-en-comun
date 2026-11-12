const {test}=require('node:test'),assert=require('node:assert/strict');
const {scanText}=require('../tools/security-check.cjs');
test('detecta credenciales privadas sin devolver su valor',()=>{const value='sk-proj-'+ 'x'.repeat(40),findings=scanText('const key="'+value+'";');assert.equal(findings[0].kind,'openai-secret');assert.doesNotMatch(JSON.stringify(findings),new RegExp(value));assert.equal(scanText('-----BEGIN PRIVATE KEY-----')[0].kind,'private-key');});
test('no trata la configuración Firebase o un campo password como contraseña privada',()=>{assert.equal(scanText('apiKey: "AIzaSy'+'x'.repeat(33)+'"; input.type="password"; password: input.value').length,0);assert.equal(scanText('password="'+'x'.repeat(12)+'"')[0].kind,'literal-password');});
