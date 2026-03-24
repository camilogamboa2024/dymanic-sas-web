# Security Production Checklist (landing clon del mockup)

## 1) Baseline obligatoria

- [ ] HTTPS only, HSTS habilitado.
- [ ] CSP estricta sin `unsafe-inline` ni `unsafe-eval`.
- [ ] `script-src 'self'` se mantiene intacto.
- [ ] `img-src` solo permite `self`, `data:` y `https://lh3.googleusercontent.com`.
- [ ] `X-Frame-Options: DENY` o `frame-ancestors 'none'`.
- [ ] `X-Content-Type-Options: nosniff`.
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] `Permissions-Policy` minimizada.

## 2) Nginx (ejemplo exacto)

Archivo recomendado: `infra/nginx/security-headers.conf`.

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' https://lh3.googleusercontent.com data:; font-src https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
```

## 3) Vercel

- [ ] Confirmar que la cabecera CSP coincide con HTML y Nginx.
- [ ] Confirmar que no se abrió ningún origen extra para scripts o estilos.

## 4) QA de seguridad

### Comandos
```bash
# Integridad básica de HTML
python3 - <<'PY'
from html.parser import HTMLParser
for p in ('index.html', 'principal.html'):
    d = open(p, encoding='utf-8').read()
    h = HTMLParser(); h.feed(d); h.close()
print('ok')
PY

# Verificar ausencia de inline scripts, estilos inline y handlers inline
rg --pcre2 -n "<script(?![^>]*src=)|<style|<[^>]+\\s(?:style|on[a-z]+)=" index.html principal.html

# Verificar ausencia de Tailwind CDN y Material Symbols
rg -n "tailwindcss|material-symbols" index.html principal.html assets/css/main.css assets/js/main.js

# Verificar que las únicas imágenes remotas provengan del dominio aprobado
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path

allowed = ('https://lh3.googleusercontent.com/',)

class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.bad = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img':
            src = attrs.get('src', '')
            if src.startswith(('http://', 'https://')) and not src.startswith(allowed):
                self.bad.append(src)

for path in ('index.html', 'principal.html'):
    parser = Audit()
    parser.feed(Path(path).read_text(encoding='utf-8'))
    print(path, parser.bad)
PY

# Verificar que index y principal sigan idénticos
cmp -s index.html principal.html

# Verificar coherencia de CSP entre HTML, Nginx y Vercel
python3 - <<'PY'
import json
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8").split(
    'Content-Security-Policy" content="', 1
)[1].split('"', 1)[0]
nginx = Path("infra/nginx/security-headers.conf").read_text(encoding="utf-8").split(
    'Content-Security-Policy "', 1
)[1].split('" always;', 1)[0]
vercel = json.loads(Path("vercel.json").read_text(encoding="utf-8"))["headers"][0]["headers"][0]["value"]
print("match" if html == nginx == vercel else "mismatch")
PY
```

### Criterio de aprobación
- [ ] No hay `<script>` inline.
- [ ] No hay `<style>` inline.
- [ ] No hay atributos `style=""` ni eventos inline.
- [ ] No hay Tailwind CDN ni Material Symbols.
- [ ] Las únicas imágenes remotas permitidas provienen de `lh3.googleusercontent.com`.
- [ ] `index.html` y `principal.html` siguen sincronizados.
- [ ] La misma CSP aplica en HTML, Nginx y Vercel.
- [ ] Revisión visual manual en desktop contra el mockup.
- [ ] Revisión responsive básica en móvil.
