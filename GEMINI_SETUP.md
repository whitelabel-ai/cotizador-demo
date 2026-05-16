# Configuración de Gemini AI

Este proyecto usa **Google Gemini API** para el asistente comercial conversacional.

## Pasos para configurar

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la API Key generada

### 2. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Edita `.env.local` y agrega tu API Key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...tu-api-key-aqui
```

### 3. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## Productos

El sistema incluye **10 productos reales de IZC Mayorista**:

### Impresoras POS
- BIXOLON SRP-F312II
- SAT 15T US
- SAT Q23T UBW (portátil con Bluetooth/WiFi)

### Lectores de Código de Barras
- ZEBRA DS2208 (1D/2D)
- Honeywell HH490 (1D/2D)
- Datalogic QuickScan QD2430 (1D/2D)
- SAT LD101R Plus (1D)
- SAT LI102N+ (1D)

### Consumibles
- Cinta Ribbon Cera SAT 110mm × 74m
- Rollos de Papel Térmico 80×50mm

## Funcionalidades del Chat con Gemini

El asistente puede:

1. **Buscar productos** por SKU, nombre, marca o categoría
2. **Mostrar alternativas** para comparar productos similares
3. **Sugerir complementarios** (ej: ribbon para impresoras)
4. **Gestionar descuentos** y revisiones comerciales
5. **Precios por volumen** según cantidad
6. **Contexto conversacional** - recuerda el historial

## Ejemplos de uso

### Buscar producto por SKU
```
Usuario: "Necesito cotizar la impresora SRP-F312II"
```

### Buscar por categoría
```
Usuario: "Muéstrame lectores de código de barras 2D"
```

### Pedir alternativas
```
Usuario: "¿Qué alternativas tiene la ZEBRA DS2208?"
```

### Productos complementarios
```
Usuario: "¿Qué consumibles necesito para la impresora?"
```

### Solicitud de descuento
```
Usuario: "¿Me puedes hacer mejor precio por 10 unidades?"
```

## Troubleshooting

### Error: "GEMINI_API_KEY no configurada"
- Verifica que `.env.local` existe en la raíz del proyecto
- Asegúrate de que la variable se llama `NEXT_PUBLIC_GEMINI_API_KEY`
- Reinicia el servidor después de cambiar el .env

### Error: "Respuesta vacía de Gemini API"
- Verifica que tu API Key es válida
- Revisa la consola del navegador para más detalles
- El sistema tiene fallback a mensaje genérico si falla

### Rate limiting
- Gemini tiene límites de requests por minuto
- Si excedes el límite, espera unos segundos y reintenta

## Modelo utilizado

- **Modelo**: Gemini 2.0 Flash
- **Temperatura**: 0.7 (balance entre creatividad y precisión)
- **Max tokens**: 1024
- **Formato**: JSON forzado para parsing confiable

## Costos

Gemini 2.0 Flash tiene un costo aproximado de:
- $0.075 USD por 1M de tokens de entrada
- $0.30 USD por 1M de tokens de salida

Para uso en demo/prototipo, el costo es mínimo (< $1 USD por hora de uso intensivo).
