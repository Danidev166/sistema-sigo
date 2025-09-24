const SeguimientoAcademicoModel = require('./models/seguimientoAcademicoModel');
const SeguimientoModel = require('./models/seguimientoModel');
const SeguimientoCronologicoModel = require('./models/seguimientoCronologicoModel');

async function testModels() {
  console.log('🧪 Probando modelos de seguimiento...\n');
  
  try {
    console.log('1. Probando SeguimientoAcademicoModel.obtenerTodos()...');
    const academico = await SeguimientoAcademicoModel.obtenerTodos();
    console.log('✅ SeguimientoAcademicoModel funciona');
    console.log(`   📊 Registros: ${academico.length}`);
  } catch (error) {
    console.log('❌ Error en SeguimientoAcademicoModel:', error.message);
    console.log('   📚 Stack:', error.stack);
  }
  
  try {
    console.log('\n2. Probando SeguimientoModel.listar()...');
    const general = await SeguimientoModel.listar();
    console.log('✅ SeguimientoModel funciona');
    console.log(`   📊 Registros: ${general.length}`);
  } catch (error) {
    console.log('❌ Error en SeguimientoModel:', error.message);
    console.log('   📚 Stack:', error.stack);
  }
  
  try {
    console.log('\n3. Probando SeguimientoCronologicoModel.obtenerTodos()...');
    const cronologico = await SeguimientoCronologicoModel.obtenerTodos();
    console.log('✅ SeguimientoCronologicoModel funciona');
    console.log(`   📊 Registros: ${cronologico.length}`);
  } catch (error) {
    console.log('❌ Error en SeguimientoCronologicoModel:', error.message);
    console.log('   📚 Stack:', error.stack);
  }
}

testModels().catch(console.error);
