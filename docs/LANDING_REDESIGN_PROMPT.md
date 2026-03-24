# Prompt profesional para clonar el mockup de la landing Dymanic SAS

## Objetivo
Replicar de forma casi literal el mockup aprobado de Dymanic SAS en un sitio estatico propio, sin usar Tailwind CDN ni copiar el HTML original literal. La prioridad es fidelidad visual: mismo copy, misma jerarquia, misma disposicion de secciones, mismas ilustraciones principales y mismo footer.

## Contexto del proyecto
- El repositorio sigue siendo HTML, CSS y JS puros.
- `index.html` y `principal.html` deben permanecer identicos.
- La landing debe conservar los anchors `#inicio`, `#modulos`, `#seguridad` y `#equipo`.
- `#equipo` puede resolverse con un ancla discreta cerca del footer si el mockup no muestra una seccion visible de equipo.

## Direccion visual y de contenido
- Copiar el mockup como referencia principal, no reinterpretarlo.
- Mantener:
  - barra superior compacta,
  - hero en dos columnas,
  - tres metricas,
  - grilla bento de modulos,
  - seccion oscura Sentinel,
  - footer minimo.
- Usar el copy literal del mockup, incluido `DIAN COMPLIANT 2024`, el texto de soberania/arquitectura de grado militar y el footer `© 2024`.
- Evitar agregar secciones, tarjetas o CTA que no aparezcan en la captura.

## Restricciones tecnicas
- No usar Tailwind CDN.
- No usar bloques `<style>` o `<script>` inline.
- No usar atributos `style=""`.
- No introducir framework, bundler ni dependencias npm.
- Mantener CSS y JS propios.
- Para iconos, preferir SVG inline local o HTML/CSS equivalente en lugar de dependencias extras.

## Assets permitidos
- Se aceptan los assets remotos exactos del mockup para el panel del hero y la ilustracion Sentinel.
- Limitar `img-src` a `self`, `data:` y `https://lh3.googleusercontent.com`.
- No abrir `script-src` a terceros.

## Seguridad y consistencia
- Mantener `script-src 'self'`.
- Alinear la misma CSP entre HTML, Nginx y Vercel.
- Conservar `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`, `object-src 'none'` y el resto de headers defensivos.
- Todos los enlaces externos con nueva pestaña deben usar `rel="noopener noreferrer"`.

## Accesibilidad y responsive
- HTML semantico.
- `skip link` visible al foco.
- Menu movil accesible con `aria-expanded` y `aria-controls`.
- El desktop debe coincidir visualmente con la captura.
- En movil se permite adaptacion responsive sin exigir identidad pixel-perfect.

## Criterios de aceptacion
- La landing coincide visualmente con el mockup en copy, jerarquia, numero de bloques y tono general.
- No hay inline scripts, inline styles ni Tailwind CDN.
- La unica apertura nueva de CSP es `img-src` para `lh3.googleusercontent.com`.
- `index.html` y `principal.html` son identicos al finalizar.
