/**
 * Configuración del Sistema de Gestión de Bebidas
 * Variables de configuración y constantes del sistema
 */

const CONFIG = {
    // Configuración del servidor
    API: {
        BASE_URL: 'http://localhost:3000/api',
        TIMEOUT: 10000, // 10 segundos
        RETRY_ATTEMPTS: 3
    },

    // Configuración de SharePoint
    SHAREPOINT: {
        ENABLED: true,
        SIMULATION_MODE: true, // true para modo de prueba, false para conexión real
        SITE_URL: 'https://datamartin.sharepoint.com/sites/WARNES',
        LIST_NAME: 'Articulos'
    },

    // Configuración de autenticación
    AUTH: {
        TOKEN_KEY: 'authToken',
        USER_KEY: 'currentUser',
        SESSION_TIMEOUT: 3600000, // 1 hora en milisegundos
        LOGIN_REDIRECT: 'dashboard.html',
        LOGOUT_REDIRECT: 'index.html'
    },

    // Configuración de stock
    STOCK: {
        MIN_STOCK_DEFAULT: 20,
        CRITICAL_STOCK_LEVEL: 5,
        ALERT_COLORS: {
            HIGH: '#10b981',    // Verde
            MEDIUM: '#f59e0b',  // Amarillo
            LOW: '#ef4444',     // Rojo
            CRITICAL: '#7f1d1d' // Rojo oscuro
        }
    },

    // Configuración de precios
    PRICING: {
        TAX_RATES: {
            IVA: 21,
            IMPUESTO_INTERNO_BEBIDAS: 8.5,
            IMPUESTO_INTERNO_ALCOHOL: 17
        },
        DEFAULT_MARGIN: 30
    },

    // Configuración de reportes
    REPORTS: {
        DEFAULT_PERIOD: 'month',
        CHART_COLORS: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        EXPORT_FORMATS: ['csv', 'pdf', 'xlsx']
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        DURATION: 3000, // 3 segundos
        POSITION: 'top-right',
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    // Configuración de animaciones
    ANIMATIONS: {
        DURATION: 300,
        EASING: 'easeOutQuad',
        STAGGER_DELAY: 100
    },

    // Configuración de validación
    VALIDATION: {
        MIN_PRICE: 0.01,
        MAX_PRICE: 10000,
        MIN_STOCK: 0,
        MAX_STOCK: 10000,
        MIN_QUANTITY: 0.01,
        MAX_QUANTITY: 1000
    },

    // Mensajes del sistema
    MESSAGES: {
        // Autenticación
        LOGIN_SUCCESS: 'Sesión iniciada exitosamente',
        LOGIN_ERROR: 'Usuario o contraseña incorrectos',
        LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
        SESSION_EXPIRED: 'Su sesión ha expirado',

        // Artículos
        ARTICLE_CREATED: 'Artículo creado exitosamente',
        ARTICLE_UPDATED: 'Artículo actualizado exitosamente',
        ARTICLE_DELETED: 'Artículo eliminado exitosamente',
        ARTICLE_NOT_FOUND: 'Artículo no encontrado',
        ARTICLE_CODE_EXISTS: 'El código del artículo ya existe',

        // Proveedores
        PROVIDER_CREATED: 'Proveedor creado exitosamente',
        PROVIDER_UPDATED: 'Proveedor actualizado exitosamente',
        PROVIDER_DELETED: 'Proveedor eliminado exitosamente',
        PROVIDER_NOT_FOUND: 'Proveedor no encontrado',

        // Ventas
        SALE_CREATED: 'Venta registrada exitosamente',
        SALE_DELETED: 'Venta eliminada exitosamente',
        SALE_NOT_FOUND: 'Venta no encontrada',
        INSUFFICIENT_STOCK: 'Stock insuficiente para esta venta',

        // Stock
        MOVEMENT_CREATED: 'Movimiento registrado exitosamente',
        STOCK_UPDATED: 'Stock actualizado exitosamente',
        STOCK_NOT_FOUND: 'Artículo no encontrado en stock',

        // Errores generales
        CONNECTION_ERROR: 'Error de conexión con el servidor',
        VALIDATION_ERROR: 'Datos inválidos',
        UNAUTHORIZED: 'No autorizado',
        FORBIDDEN: 'Acceso denegado',
        NOT_FOUND: 'Recurso no encontrado',
        INTERNAL_ERROR: 'Error interno del servidor',
        UNKNOWN_ERROR: 'Error desconocido'
    },

    // Rutas de navegación
    ROUTES: {
        LOGIN: 'index.html',
        DASHBOARD: 'dashboard.html',
        ARTICLES: 'articulos.html',
        COSTING: 'costeo.html',
        SALES: 'ventas.html',
        PROVIDERS: 'proveedores.html',
        STOCK: 'stock.html',
        REPORTS: 'reportes.html'
    },

    // Funciones auxiliares
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString('es-AR');
    },

    formatDateTime: (date) => {
        return new Date(date).toLocaleString('es-AR');
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone: (phone) => {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
};

// Funciones de utilidad global
window.SystemConfig = CONFIG;

// Función para obtener configuración
function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], CONFIG);
}

// Función para formatear moneda
function formatCurrency(amount) {
    return CONFIG.formatCurrency(amount);
}

// Función para formatear fecha
function formatDate(date) {
    return CONFIG.formatDate(date);
}

// Función para generar ID único
function generateId() {
    return CONFIG.generateId();
}

// Función para validar email
function validateEmail(email) {
    return CONFIG.validateEmail(email);
}

// Función para validar teléfono
function validatePhone(phone) {
    return CONFIG.validatePhone(phone);
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}