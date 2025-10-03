#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const testCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const testArgs = ['test', '--', '--watchAll=false', '--coverage'];

console.log('🧪 Ejecutando tests con cobertura...\n');

const testProcess = spawn(testCommand, testArgs, {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Todos los tests pasaron exitosamente!');
    console.log('📊 Revisa el reporte de cobertura en coverage/lcov-report/index.html');
  } else {
    console.log('\n❌ Algunos tests fallaron. Revisa los errores arriba.');
    process.exit(code);
  }
});

testProcess.on('error', (error) => {
  console.error('❌ Error ejecutando tests:', error);
  process.exit(1);
});
