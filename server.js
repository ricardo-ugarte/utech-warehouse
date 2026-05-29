// ===============================
//  Servidor API - Sistema Bebidas
//  Azure SQL + APIs
// ===============================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// middlewares
// -------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// servir archivos estáticos (tus .html)
app.use(express.static(__dirname));

// -------------------------
// debug de env
// -------------------------
console.log('DEBUG ENV:', {
  host: process.env.AZURE_SQL_HOST,
  db: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  port: process.env.AZURE_SQL_PORT
});

// -------------------------
// config azure sql
// -------------------------
const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_HOST,
  port: parseInt(process.env.AZURE_SQL_PORT || '1433', 10),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// conexión global (pool)
const poolPromise = sql
  .connect(sqlConfig)
  .then((pool) => {
    console.log('✅ Conectado a Azure SQL');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Error conectando a SQL:', err);
  });

// helper
async function queryDB(query, setParams) {
  const pool = await poolPromise;
  const request = pool.request();
  if (typeof setParams === 'function') setParams(request);
  return request.query(query);
}

// ========================================
// RUTA DE PRUEBA
// ========================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ARTÍCULOS - lee DIM_Articulo
// ---------------------------------
app.get('/api/articles', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ArticuloKey,
        idArticulos,
        descripcionArticulos,
        UM,
        impuestoInterno,
        undxCaja,
        ml,
        Categoria,
        Subcategoria,
        TipoProducto
      FROM dbo.DIM_Articulo
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error al obtener artículos:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos',
      detail: err.message
    });
  }
});

// crear artículo
app.post('/api/articles', async (req, res) => {
  let { codigo, descripcion, um, impuesto } = req.body;

  if (!codigo || !descripcion) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos de artículo'
    });
  }

  // normalizamos
  um = um || 'UN';

  // si viene string vacía, null, etc -> 0
  let impuestoNumber = Number(impuesto);
  if (!Number.isFinite(impuestoNumber)) {
    impuestoNumber = 0;
  }

  // lo recortamos a 2 decimales y a un rango chico por si tu columna es numeric(5,2)
  impuestoNumber = Math.min(Math.max(impuestoNumber, 0), 999.99);

  try {
    await queryDB(
      `
      INSERT INTO dbo.DIM_Articulo
        (idArticulos,
         descripcionArticulos,
         UM,
         impuestoInterno,
         Categoria,
         Subcategoria,
         TipoProducto,
         undxCaja,
         ml)
      VALUES
        (@idArticulos,
         @descripcionArticulos,
         @UM,
         @impuestoInterno,
         'BEBIDAS',
         'SIN_SUBCATEGORIA',
         'PRODUCTO',
         0,
         0)
      `,
      (r) => {
        r.input('idArticulos', sql.NVarChar(50), codigo);
        r.input('descripcionArticulos', sql.NVarChar(255), descripcion);
        r.input('UM', sql.NVarChar(10), um);
        // acá uso un decimal más “corto” que casi seguro entra
        r.input('impuestoInterno', sql.Decimal(5, 2), impuestoNumber);
      }
    );

    res.json({ success: true, message: 'Artículo guardado en Azure' });
  } catch (err) {
    console.error('Error al crear artículo:', err);
    res.status(500).json({
      success: false,
      message: 'Error al crear artículo',
      detail: err.message
    });
  }
});

// 🔹 eliminar artículo (DIM_Articulo) por clave
app.delete('/api/articles/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await queryDB(
      'DELETE FROM dbo.DIM_Articulo WHERE ArticuloKey = @id',
      (r) => r.input('id', sql.Int, id)   // ArticuloKey es int por lo que viste
    );
    res.json({ success: true, message: 'Artículo eliminado' });
  } catch (err) {
    console.error('Error al eliminar artículo:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar artículo' });
  }
});


// ========================================
// PROVEEDORES  (dbo.DIM_Proveedor)
// ========================================
app.get('/api/providers', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ProveedorKey,
        idProveedor,
        nombreProveedor,
        CategoriaProveedor
      FROM dbo.DIM_Proveedor
      ORDER BY nombreProveedor ASC
    `);

    console.log(`✅ /api/providers → ${result.recordset.length} registros`);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ Error al obtener proveedores:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores desde Azure SQL',
      detail: err.message
    });
  }
});


// ========================================
// PROVEEDORES  (dbo.DIM_Proveedor)
// ========================================
app.get('/api/providers', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ProveedorKey,
        idProveedor,
        nombreProveedor,
        CategoriaProveedor
      FROM dbo.DIM_Proveedor
      ORDER BY nombreProveedor
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Error al obtener proveedores:', err);
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener proveedores' });
  }
});

// ========================================
// COSTEO / COMPRAS  (dbo.Fact_Compras)
// ========================================

// listar compras (con joins)
app.get('/api/costeo', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT TOP 200
        fc.ComprasKey,
        fc.FechaKey,
        fc.TiempoKey,
        fc.ArticuloKey,
        da.idArticulos,
        da.descripcionArticulos,
        fc.ProveedorKey,
        dp.nombreProveedor,
        fc.SociedadKey,
        ds.denominacionSociedad,
        fc.cantidad,
        fc.importeNeto,
        fc.gastosEnvio,
        fc.impuestosInternos,
        fc.percepcionIVA,
        fc.percepcionIIBB,
        fc.netoImpuesto,
        fc.subTotal,
        fc.costoTotal,
        fc.PU,
        fc.factura
      FROM dbo.Fact_Compras fc
      LEFT JOIN dbo.DIM_Articulo  da ON fc.ArticuloKey   = da.ArticuloKey
      LEFT JOIN dbo.DIM_Proveedor dp ON fc.ProveedorKey  = dp.ProveedorKey
      LEFT JOIN dbo.DIM_Sociedad  ds ON fc.SociedadKey   = ds.SociedadKey
      ORDER BY fc.ComprasKey DESC
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error al obtener compras:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener compras',
      detail: err.message
    });
  }
});

// obtener una compra
app.get('/api/costeo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await queryDB(
      `
      SELECT 
        fc.*
      FROM dbo.Fact_Compras fc
      WHERE fc.ComprasKey = @id
      `,
      (r) => r.input('id', sql.Int, id)
    );

    if (!result.recordset.length) {
      return res
        .status(404)
        .json({ success: false, message: 'Compra no encontrada' });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('Error al obtener compra:', err);
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener compra' });
  }
});

/// crear compra
app.post('/api/costeo', async (req, res) => {
  const body = req.body;

  try {
    // 1. traer fecha y tiempo
    const [fechaRs, tiempoRs] = await Promise.all([
      queryDB('SELECT TOP 1 FechaKey FROM dbo.DIM_Fecha ORDER BY FechaKey'),
      queryDB('SELECT TOP 1 TiempoKey FROM dbo.DIM_Tiempo ORDER BY TiempoKey')
    ]);

    if (!fechaRs.recordset.length) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo guardar porque dbo.DIM_Fecha no tiene registros.'
      });
    }
    if (!tiempoRs.recordset.length) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo guardar porque dbo.DIM_Tiempo no tiene registros.'
      });
    }

    const fechaKey  = fechaRs.recordset[0].FechaKey;
    const tiempoKey = tiempoRs.recordset[0].TiempoKey;

    // 2. asegurarnos de que haya al menos 1 sociedad
    let sociedadRs = await queryDB(
      'SELECT TOP 1 SociedadKey FROM dbo.DIM_Sociedad ORDER BY SociedadKey'
    );

    // si no hay, la creamos acá mismo
    if (!sociedadRs.recordset.length) {
      await queryDB(
        `
        INSERT INTO dbo.DIM_Sociedad (idSociedades, denominacionSociedad, TipoSociedad)
        VALUES ('SOC-001', 'Sociedad Principal', 'LOCAL');
        `
      );
      // y la volvemos a pedir
      sociedadRs = await queryDB(
        'SELECT TOP 1 SociedadKey FROM dbo.DIM_Sociedad ORDER BY SociedadKey'
      );
    }

    const sociedadKey = sociedadRs.recordset[0].SociedadKey;

    // 3. validar lo que vino del front
    if (!body.ArticuloKey) {
      return res.status(400).json({ success: false, message: 'Falta ArticuloKey' });
    }
    if (!body.ProveedorKey) {
      return res.status(400).json({ success: false, message: 'Falta ProveedorKey' });
    }

    // 4. insertar la compra
    await queryDB(
      `
      INSERT INTO dbo.Fact_Compras
      (
        FechaKey,
        TiempoKey,
        ArticuloKey,
        ProveedorKey,
        SociedadKey,
        cantidad,
        importeNeto,
        gastosEnvio,
        impuestosInternos,
        percepcionIVA,
        percepcionIIBB,
        netoImpuesto,
        subTotal,
        costoTotal,
        PU,
        factura
      )
      VALUES
      (
        @FechaKey,
        @TiempoKey,
        @ArticuloKey,
        @ProveedorKey,
        @SociedadKey,
        @cantidad,
        @importeNeto,
        @gastosEnvio,
        @impuestosInternos,
        @percepcionIVA,
        @percepcionIIBB,
        @netoImpuesto,
        @subTotal,
        @costoTotal,
        @PU,
        @factura
      )
      `,
      (r) => {
        r.input('FechaKey',         sql.Int, fechaKey);
        r.input('TiempoKey',        sql.Int, tiempoKey);
        r.input('ArticuloKey',      sql.Int, body.ArticuloKey);
        r.input('ProveedorKey',     sql.Int, body.ProveedorKey);
        r.input('SociedadKey',      sql.Int, sociedadKey);
        r.input('cantidad',         sql.Decimal(18, 2), body.cantidad ?? 0);
        r.input('importeNeto',      sql.Decimal(18, 2), body.importeNeto ?? 0);
        r.input('gastosEnvio',      sql.Decimal(18, 2), body.gastosEnvio ?? 0);
        r.input('impuestosInternos',sql.Decimal(18, 2), body.impuestosInternos ?? 0);
        r.input('percepcionIVA',    sql.Decimal(18, 2), body.percepcionIVA ?? 0);
        r.input('percepcionIIBB',   sql.Decimal(18, 2), body.percepcionIIBB ?? 0);
        r.input('netoImpuesto',     sql.Decimal(18, 2), body.netoImpuesto ?? 0);
        r.input('subTotal',         sql.Decimal(18, 2), body.subTotal ?? 0);
        r.input('costoTotal',       sql.Decimal(18, 2), body.costoTotal ?? 0);
        r.input('PU',               sql.Decimal(18, 4), body.PU ?? 0);
        r.input('factura',          sql.NVarChar(100), body.factura ?? '');
      }
    );

    res.json({ success: true, message: 'Compra insertada' });
  } catch (err) {
    console.error('Error insertando compra', err);
    res.status(500).json({
      success: false,
      message: 'Error insertando compra',
      detail: err.message
    });
  }
});

// eliminar compra
app.delete('/api/costeo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await queryDB(
      'DELETE FROM dbo.Fact_Compras WHERE ComprasKey = @id',
      (r) => r.input('id', sql.Int, id)
    );
    res.json({ success: true, message: 'Compra eliminada' });
  } catch (err) {
    console.error('Error eliminando compra', err);
    res
      .status(500)
      .json({ success: false, message: 'Error eliminando compra' });
  }
});

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
