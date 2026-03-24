# Security Production Checklist (Nginx + Cloudflare + Vercel)

## 1) Baseline obligatoria (aplica a cualquier plataforma)

- [ ] HTTPS only, HSTS habilitado.
- [ ] CSP estricta sin `unsafe-inline` ni `unsafe-eval`.
- [ ] `X-Frame-Options: DENY` o `frame-ancestors 'none'` en CSP.
- [ ] `X-Content-Type-Options: nosniff`.
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] `Permissions-Policy` minimizada.
- [ ] Cookies (si existen) con `Secure; HttpOnly; SameSite=Lax|Strict`.
- [ ] Deshabilitar métodos HTTP no usados (TRACE, etc.).
- [ ] Logs + alertas + revisión semanal de eventos 4xx/5xx.

## 2) Nginx (ejemplo exacto)

Archivo recomendado: `infra/nginx/security-headers.conf`.

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' https://images.pexels.com https://github.com data:; font-src https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
```

Checklist Nginx:
- [ ] `server_tokens off;`
- [ ] Solo `GET/HEAD` en estático si aplica.
- [ ] Redirección 80 -> 443 permanente.

## 3) Cloudflare (recomendado)

### Reglas
- [ ] Always Use HTTPS: ON.
- [ ] Automatic HTTPS Rewrites: ON.
- [ ] WAF Managed Rules: ON (paranoia media al inicio).
- [ ] Bot Fight Mode: ON.
- [ ] Browser Integrity Check: ON.
- [ ] Rate limiting para rutas sensibles (si existen forms/API).

### Transform / Response headers
Configurar headers idénticos al bloque de Nginx para garantizar consistencia edge.

## 4) Vercel (exacto para este repo)

Archivo: `vercel.json` (incluido).

- [ ] Revisar que la cabecera CSP coincida con recursos usados reales.
- [ ] Confirmar que no existan scripts inline antes de desplegar.

## 5) QA de seguridad (pipeline mínimo)

### Comandos
```bash
# Integridad básica de HTML
python - <<'PY'
from html.parser import HTMLParser
for p in ('index.html', 'principal.html'):
    d=open(p, encoding='utf-8').read()
    h=HTMLParser(); h.feed(d); h.close()
print('ok')
PY

# Verificar ausencia de inline scripts
rg "<script(?![^>]*src=)" index.html principal.html

# Verificar ausencia de style inline
rg "<style" index.html principal.html
```

### Criterio de aprobación
- [ ] No hay `<script>` inline.
- [ ] No hay `<style>` inline.
- [ ] Todos los enlaces externos con `rel="noopener noreferrer"`.
- [ ] Pasa revisión manual en móvil y desktop.

## 6) Operación continua

- [ ] Revisar CSP violations semanalmente (report-uri/report-to si se activa endpoint).
- [ ] Rotar y auditar servicios externos permitidos en CSP cada release.
- [ ] Mantener dependencias y runtime de despliegue al día.
