# DAW Practice Lab

Aplicacion local para practicar HTML, CSS y JavaScript con ejercicios declarados en JSON.

## Ejecutar en local

```bash
npm install
npm run dev
```

Vite abrira la app en `http://127.0.0.1:5173`.

## Donde van los ejercicios

Los ejercicios viven en `public/exercises`.

Cada archivo JSON define una pregunta. Para que aparezca en la app, anade su nombre a:

```txt
public/exercises/manifest.json
```

La app soporta estos tipos:

- `build`: ejercicio por enunciado, sin objetivo visual obligatorio.
- `visual-match`: ejercicio con preview de tu codigo y preview objetivo lado a lado.

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
