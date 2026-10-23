# Diseño – Webcams del Mundo

## 1. Fuentes de cámaras (comprobado el 22-10-2026)

| Fuente | API / embed | Gratis | Restricciones clave |
|---|---|---|---|
| **YouTube Live** | Reproductor embebido (iframe) + YouTube Data API v3 para buscar directos (`eventType=live`) | Sí | Cuota por defecto 10.000 unidades/día; `search.list` limitado (100/día por defecto según la doc). Se debe usar el reproductor oficial; el autor puede desactivar la inserción. Fuente: developers.google.com/youtube/v3/getting-started |
| **Windy Webcams API v3** | API REST (clave en cabecera `x-windy-api-key`) con imágenes, timelapses y player embebible | Plan gratuito + Professional de pago | Gratis: URLs de imagen caducan en ~10–15 min (hay que pedir de nuevo), tamaño de imagen limitado, offset máx. 1000, player con anuncios. Pro: 24 h, sin anuncios. Fuente: api.windy.com/webcams y /webcams/docs |
| **SkylineWebcams** | Sin API pública. Solo ver en su web y compartir vía sus enlaces | Ver gratis | Sus T&C (16-04-2020) prohíben descargar, capturar frames o redistribuir sin permiso escrito (info@visioray.com). Usar solo enlaces/embeds que ellos ofrezcan. Fuente: skylinewebcams.com/en/terms-of-use.html |
| **EarthCam** | Sin API abierta verificada; emite directos en su canal oficial de YouTube (usados aquí) | Ver gratis | Embeds/licencias propias en su web: **no verificado**; usar su canal de YouTube o pedir licencia |
| **DGT (España)** | Punto de Acceso Nacional nap.dgt.es (Directiva 2010/40/UE): conjuntos de datos DATEX II de tráfico, también Servei Català de Trànsit y Gobierno Vasco | Sí | Licencia y existencia de un feed de **imágenes** de cámaras reutilizable: **no verificado**; revisar la ficha de cada dataset antes de usar |
| **TfL JamCams (Londres)** | API Unified `api.tfl.gov.uk/Place/Type/JamCam`: JSON con lat/lon, `imageUrl` (.jpg) y `videoUrl` (.mp4 corto) | Sí (clave opcional, recomendada) | Open Government Licence con atribución «Powered by TfL Open Data» (condiciones según portal TfL, no releídas hoy). Respuesta verificada hoy |
| **Caltrans CWWP2 / 511 (EE. UU.)** | Feeds públicos de cámaras por distrito / APIs 511 (algunas con clave) | Sí | Condiciones por estado: **no verificadas** en esta sesión |

**Regla de la app:** solo reproductores oficiales (iframe) o instantáneas con licencia abierta mostradas desde su URL original. Nada de grabar, recortar ni reemitir.

## 2. Arquitectura

- **Plataforma:** web responsive + PWA (un solo código para móvil y escritorio; instalable; luego empaquetable con Capacitor si se quiere APK).
- **Datos:** fase 1 `cameras.json` estático (id, nombre, país, continente, categoría, lat/lon, tipo, videoId/imagen, fuente, url). Fase 2: base de datos (PostgreSQL/PostGIS o SQLite) + tarea programada (cron cada 1–6 h) que (a) consulta Windy/TfL/DGT y (b) valida los directos de YouTube con oEmbed o `videos.list` (1 unidad) y marca los caídos. El frontend lee un JSON generado/cacheado (CDN), nunca llama a las APIs con la clave desde el navegador.
- **Mapa:** Leaflet + teselas OSM con atribución (para mucho tráfico, usar un proveedor de teselas propio o de pago; la política de tiles.openstreetmap.org no permite uso intensivo). Agrupación de marcadores (Leaflet.markercluster) cuando haya miles.
- **Cuadrícula:** tarjetas con miniatura y carga diferida (el iframe solo se crea al pulsar ▶) para no abrir 15 vídeos a la vez.
- **Streaming:** **iframes oficiales**, no proxy. Un proxy de vídeo que descargue y reemita el flujo normalmente viola los ToS (YouTube prohíbe acceder al contenido salvo por su reproductor; SkylineWebcams prohíbe copiar/transmitir), elimina anuncios/atribución del autor, y además cuesta mucho ancho de banda. Las imágenes abiertas (TfL) se cargan directamente desde su URL con refresco periódico.
- **Seguridad:** claves de API solo en el backend; CSP que permita `youtube-nocookie.com`, `tile.openstreetmap.org` y los dominios de imágenes.
