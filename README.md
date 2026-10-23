# Webcams del Mundo 🌍

Web responsive (preparada para PWA) que muestra cámaras públicas en directo en un mapa mundial (Leaflet + OpenStreetMap) y en una cuadrícula.

## Ejecutar
```bash
cd webcams-mundo
python3 -m http.server 8000
# abre http://localhost:8000
```
(Hace falta un servidor: abrir `index.html` con doble clic bloquea la carga de `cameras.json`.)

## Uso
- Filtros por categoría arriba (ciudades, playas, montañas, aeropuertos, tráfico, naturaleza).
- Clic en un marcador → se abre el visor grande con esa cámara.
- En la cuadrícula, pulsa ▶ para cargar cada directo (no se cargan todos a la vez para ahorrar datos y CPU).

## Añadir cámaras
Edita `cameras.json`. Dos tipos:
- `"tipo": "youtube"` con `videoId` (solo directos de canales que permiten incrustar).
- `"tipo": "imagen"` con `imagen` y `refrescoSeg` (solo instantáneas con licencia abierta, p. ej. TfL Open Data).

Comprueba que siguen vivas con `python3 verificar.py`. **Los ID de directos de YouTube cambian** cuando el canal reinicia la emisión: si una cámara falla, busca el nuevo ID en el canal.

Diseño y fuentes: ver `DISENO.md`.
