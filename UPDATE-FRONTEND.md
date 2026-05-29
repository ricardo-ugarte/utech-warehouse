# Actualización del Frontend para Conectar con el Backend

## Instrucciones para conectar el frontend con el servidor backend

### 1. Actualizar el archivo `js/api-client.js`

Ya he creado el archivo `js/api-client.js` con todas las funciones necesarias para comunicarse con el backend. Este archivo debe ser incluido en todos los HTML.

### 2. Actualizar los archivos HTML

Para cada archivo HTML, agregar la siguiente línea en la sección `<head>`:

```html
<script src="js/config.js"></script>
<script src="js/api-client.js"></script>
```

### 3. Ejemplo de actualización para `articulos.html`

Reemplazar la lógica de carga de artículos simulada con llamadas reales al API:

```javascript
// Reemplazar la función loadArticles() con:
async function loadArticles() {
    try {
        showLoading();
        const response = await apiClient.getArticles();
        articles = response.data;
        renderArticles();
        hideLoading();
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}

// Reemplazar la función createArticle() con:
async function createArticle(articleData) {
    try {
        showLoading();
        const response = await apiClient.createArticle(articleData);
        showNotification(response.message, 'success');
        await loadArticles();
        hideLoading();
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}

// Reemplazar la función updateArticle() con:
async function updateArticle(id, articleData) {
    try {
        showLoading();
        const response = await apiClient.updateArticle(id, articleData);
        showNotification(response.message, 'success');
        await loadArticles();
        hideLoading();
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}

// Reemplazar la función deleteArticle() con:
async function deleteArticle(id) {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
        try {
            showLoading();
            const response = await apiClient.deleteArticle(id);
            showNotification(response.message, 'success');
            await loadArticles();
            hideLoading();
        } catch (error) {
            handleApiError(error);
            hideLoading();
        }
    }
}
```

### 4. Actualizar el login en `index.html`

```javascript
// Reemplazar la lógica de login con:
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        showLoading();
        const response = await apiClient.login(username, password);
        
        if (response.success) {
            showNotification('Login exitoso', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showNotification(response.message || 'Login fallido', 'error');
        }
        hideLoading();
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}
```

### 5. Actualizar el dashboard

```javascript
// Reemplazar la función loadStats() con:
async function loadStats() {
    try {
        const response = await apiClient.getDashboardStats();
        const stats = response.data;
        
        document.getElementById('totalArticulos').textContent = stats.totalArticles;
        document.getElementById('ventasHoy').textContent = formatCurrency(stats.todaySales);
        document.getElementById('totalProveedores').textContent = stats.totalProviders;
        document.getElementById('stockBajo').textContent = stats.lowStockItems;
    } catch (error) {
        handleApiError(error);
    }
}
```

### 6. Actualizar proveedores

```javascript
// Funciones similares para proveedores:
async function loadProviders() {
    try {
        const response = await apiClient.getProviders();
        providers = response.data;
        renderProviders();
    } catch (error) {
        handleApiError(error);
    }
}

async function createProvider(providerData) {
    try {
        const response = await apiClient.createProvider(providerData);
        showNotification(response.message, 'success');
        await loadProviders();
    } catch (error) {
        handleApiError(error);
    }
}

async function updateProvider(id, providerData) {
    try {
        const response = await apiClient.updateProvider(id, providerData);
        showNotification(response.message, 'success');
        await loadProviders();
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteProvider(id) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
        try {
            const response = await apiClient.deleteProvider(id);
            showNotification(response.message, 'success');
            await loadProviders();
        } catch (error) {
            handleApiError(error);
        }
    }
}
```

### 7. Actualizar ventas

```javascript
// Funciones para ventas:
async function loadSales() {
    try {
        const response = await apiClient.getSales();
        sales = response.data;
        renderSales();
    } catch (error) {
        handleApiError(error);
    }
}

async function createSale(saleData) {
    try {
        const response = await apiClient.createSale(saleData);
        showNotification(response.message, 'success');
        await loadSales();
        updateStats();
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteSale(id) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
        try {
            const response = await apiClient.deleteSale(id);
            showNotification(response.message, 'success');
            await loadSales();
            updateStats();
        } catch (error) {
            handleApiError(error);
        }
    }
}
```

### 8. Actualizar stock

```javascript
// Funciones para stock:
async function loadStock() {
    try {
        const response = await apiClient.getStock();
        stockItems = response.data;
        renderStockTable();
        updateStats();
    } catch (error) {
        handleApiError(error);
    }
}

async function createStockMovement(movementData) {
    try {
        const response = await apiClient.createStockMovement(movementData);
        showNotification(response.message, 'success');
        await loadStock();
        hideMovementModal();
    } catch (error) {
        handleApiError(error);
    }
}
```

### 9. Actualizar reportes

```javascript
// Funciones para reportes:
async function generateReport() {
    const period = document.getElementById('periodFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    try {
        showLoading();
        const response = await apiClient.getSalesReport({
            startDate: dateFrom,
            endDate: dateTo,
            period: period
        });
        
        updateReportData(response.data);
        hideLoading();
        showNotification('Reporte generado exitosamente', 'success');
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}

async function exportReport() {
    try {
        const salesData = await apiClient.getSales();
        apiClient.exportToCSV(salesData.data, 'reporte_ventas.csv');
        showNotification('Reporte exportado exitosamente', 'success');
    } catch (error) {
        handleApiError(error);
    }
}
```

### 10. Actualizar SharePoint

```javascript
// Funciones para SharePoint:
async function connectToSharePoint() {
    try {
        showConnectionAlert('Conectando...', 'Estableciendo conexión con SharePoint', 'fa-spinner fa-spin', 'text-blue-500');
        
        const response = await apiClient.getSharePointArticles();
        
        if (response.success) {
            articles = response.data;
            renderArticles();
            showConnectionAlert('Conexión establecida', 'Conectado exitosamente a SharePoint', 'fa-check-circle', 'text-green-500');
        }
    } catch (error) {
        showConnectionAlert('Error de conexión', 'No se pudo conectar a SharePoint', 'fa-times-circle', 'text-red-500');
        console.error('Error conectando a SharePoint:', error);
    }
}

async function syncWithSharePoint() {
    try {
        showLoading();
        const response = await apiClient.getSharePointArticles();
        
        if (response.success) {
            articles = response.data;
            renderArticles();
            showNotification('Sincronización con SharePoint completada', 'success');
        }
        hideLoading();
    } catch (error) {
        handleApiError(error);
        hideLoading();
    }
}
```

## Instrucciones de Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor backend
```bash
npm start
# o para desarrollo:
npm run dev
```

### 3. Abrir el sistema
```
http://localhost:3000
```

### 4. Credenciales de acceso
- Username: `admin`
- Password: `admin123`

## Notas Importantes

1. **Base de Datos**: El servidor utiliza una base de datos en memoria (array) para simplificar la demostración. En producción, deberías conectarlo a una base de datos real como MongoDB, PostgreSQL o MySQL.

2. **SharePoint**: La conexión a SharePoint está simulada. Para conectar con SharePoint real, necesitarás:
   - Configurar autenticación OAuth2
   - Implementar llamadas a la API de Microsoft Graph
   - Manejar tokens de acceso

3. **Seguridad**: En producción, asegúrate de:
   - Usar HTTPS
   - Implementar autenticación JWT robusta
   - Validar y sanitizar todos los datos de entrada
   - Configurar CORS apropiadamente

4. **Performance**: Considera implementar:
   - Paginación para listas grandes
   - Caché de datos frecuentes
   - Compresión de respuestas
   - Optimización de consultas

## Solución de Problemas Comunes

### Error: "Cannot connect to server"
1. Verificar que el servidor esté ejecutándose: `npm start`
2. Verificar la URL del API en `js/config.js`
3. Verificar que no haya firewall bloqueando el puerto 3000

### Error: "CORS policy"
1. Verificar que el servidor tenga CORS habilitado
2. Verificar que la URL del frontend coincida con la configuración del servidor

### Error: "Data not loading"
1. Verificar la consola del navegador para errores
2. Verificar que el usuario esté autenticado
3. Verificar la conexión de red

### Error: "SharePoint connection failed"
1. Verificar que `SHAREPOINT.SIMULATION_MODE` esté en `true` para modo de prueba
2. Para conexión real, configurar autenticación OAuth2

## Próximos Pasos

1. **Conectar a base de datos real**: Implementar conexión a MongoDB, PostgreSQL o MySQL
2. **Implementar SharePoint real**: Configurar autenticación y llamadas a la API de Graph
3. **Agregar autenticación avanzada**: Implementar JWT, roles y permisos
4. **Optimizar performance**: Implementar caché, paginación y compresión
5. **Agregar tests**: Implementar pruebas unitarias y de integración
6. **Documentación API**: Generar documentación automática de la API
7. **Monitoreo**: Implementar logs, métricas y alertas

---

**Nota**: Esta actualización convierte el sistema de estático a dinámico con un backend completo que maneja todas las operaciones CRUD, autenticación, y conexión con SharePoint.