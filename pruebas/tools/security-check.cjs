/* A small regression check, not a complete secret scanner or a backend audit. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const patterns=[
 ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
 ['openai-secret',/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/g],
 ['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/g],
 ['stripe-secret',/\b(?:sk|rk)_live_[A-Za-z0-9]{20,}/g],
 ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
 ['service-account',/"type"\s*:\s*"service_account"/g],
 ['literal-password',/\b(?:password|client_secret|access_token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/gi]
];
function scanText(text){const findings=[];for(const [kind,pattern] of patterns){pattern.lastIndex=0;for(const hit of text.matchAll(pattern))findings.push({kind,line:text.slice(0,hit.index).split('\n').length});}return findings;}
function scanDirectory(directory){const found=[];for(const e of fs.readdirSync(directory,{withFileTypes:true})){if(['vendor','tests','catalogue','brand','.git','node_modules'].includes(e.name))continue;const p=path.join(directory,e.name);if(e.isDirectory())found.push(...scanDirectory(p));else if(/\.(?:html|js|json|rules|webmanifest|ya?ml)$/.test(e.name))for(const f of scanText(fs.readFileSync(p,'utf8')))found.push({file:p,...f});}return found;}
if(require.main===module){const root=path.resolve(__dirname,'..'),findings=scanDirectory(root);for(const f of findings)console.error(`${path.relative(root,f.file)}:${f.line}: ${f.kind}`);if(findings.length)process.exitCode=1;else console.log('Sin patrones conocidos de credenciales privadas en los archivos examinados. La configuración pública de Firebase no se considera un secreto.');}
module.exports={scanText,scanDirectory};
