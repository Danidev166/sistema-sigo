const express = require('express');
const { getPool } = require('./config/db');
const model = require('./models/conductaModel');

const app = express();
app.use(express.json());

// Endpoint de debug
app.get('/debug-conducta/:id', async (req, res) => {
    try {
        console.log('🔍 Debug endpoint - ID recibido:', req.params.id);
        console.log('🔍 Tipo de ID:', typeof req.params.id);
        
        // Probar pool directamente
        const pool = await getPool();
        const query = `
            SELECT c.*, e.nombre, e.apellido, e.rut
            FROM conducta c
            LEFT JOIN estudiantes e ON c.id_estudiante = e.id
            WHERE c.id_estudiante = $1
            ORDER BY c.fecha DESC, c.id DESC
        `;
        
        console.log('🔍 Ejecutando consulta directa...');
        const directResult = await pool.raw.query(query, [req.params.id]);
        console.log('🔍 Resultado directo:', directResult.rows.length);
        
        // Probar modelo
        console.log('🔍 Ejecutando modelo...');
        const modelResult = await model.obtenerPorEstudiante(req.params.id);
        console.log('🔍 Resultado modelo:', modelResult.length);
        
        res.json({
            id: req.params.id,
            tipoId: typeof req.params.id,
            directResult: directResult.rows.length,
            modelResult: modelResult.length,
            directData: directResult.rows,
            modelData: modelResult
        });
        
    } catch (error) {
        console.error('❌ Error en debug endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`🔧 Servidor de debug corriendo en puerto ${PORT}`);
    console.log(`🔧 Prueba: http://localhost:${PORT}/debug-conducta/8`);
});
