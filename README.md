# DAW Practice Lab

Aplicacion local para practicar HTML, CSS y JavaScript con ejercicios declarados en JSON.

## Ejemplo

![Ejemplo de DAW Practice Lab](docs/assets/daw-practice-lab-example.png)

## Ejecutar en local

```bash
npm install
npm run dev
```

Vite abrira la app en `http://127.0.0.1:5173`.

## Desplegar en Render

El repositorio incluye `render.yaml` para desplegar la app como Static Site.

Configuracion esperada en Render:

- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Variable de entorno: `VITE_BASE_PATH=/estudiar-daw/`

La app esta preparada para publicarse bajo `/estudiar-daw`, por ejemplo:

```txt
https://jaime-romero.com/estudiar-daw
```

Si se configura manualmente desde el dashboard de Render, anade tambien estas rewrites:

```txt
/estudiar-daw    -> /index.html
/estudiar-daw/*  -> /*
```

Para servirla desde `jaime-romero.com/estudiar-daw` manteniendo el dominio principal en Cloudflare, usa una regla/Worker en Cloudflare que envie ese path al dominio `.onrender.com` de Render.

## Donde van los ejercicios

Los ejercicios viven en `public/exercises`.

Cada archivo JSON define una pregunta. Para que aparezca en la app, anade su nombre a:

```txt
public/exercises/manifest.json
```

La app soporta estos tipos:

- `build`: ejercicio por enunciado, sin objetivo visual obligatorio.
- `visual-match`: ejercicio con preview de tu codigo y preview objetivo lado a lado.

Tambien se pueden subir ejercicios desde la interfaz con el boton `Subir`.
Esos ejercicios se guardan como documentos en IndexedDB, en una base local
del navegador llamada `daw-practice-lab`. No se comparten entre usuarios ni
dispositivos porque la app no tiene backend.

## Validaciones disponibles

- `contains`: comprueba que un archivo contiene cierto texto.
- `notContains`: comprueba que un archivo no contiene cierto texto.
- `regex`: comprueba un patron con expresion regular.
- `domSelector`: comprueba que el HTML contiene un selector.
- `consoleIncludes`: comprueba texto emitido por `console.log`.

## Crear ejercicios con IA desde tus apuntes

Abre un PDF de `apuntes/`, copia el fragmento que quieras practicar y pide:

```txt
Genera 3 ejercicios para DAW Practice Lab usando este esquema JSON.
Quiero uno de tipo build y dos visual-match. El tema debe ser html/css/javascript segun corresponda.
Incluye starterCode, targetCode solo cuando sea visual-match y reglas de validation declarativas.
No uses dependencias externas.

Esquema:
{
  "id": "tema-nombre-corto",
  "topic": "html | css | javascript",
  "type": "build | visual-match",
  "title": "Titulo breve",
  "difficulty": "base | media | reto",
  "estimatedMinutes": 15,
  "prompt": "Enunciado del ejercicio",
  "notes": ["Pista opcional"],
  "starterCode": {
    "html": "",
    "css": "",
    "javascript": ""
  },
  "targetCode": {
    "html": "",
    "css": "",
    "javascript": ""
  },
  "validation": {
    "mode": "all",
    "successMessage": "Mensaje al completar",
    "rules": []
  }
}

Fragmento de apuntes:
...
```

Despues guarda cada resultado en `public/exercises/*.json` y actualiza `manifest.json`.
