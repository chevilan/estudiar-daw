# Formato de ejercicios

Ejemplo minimo:

```json
{
  "id": "html-lista-semantica",
  "topic": "html",
  "type": "build",
  "title": "Lista semantica",
  "difficulty": "base",
  "estimatedMinutes": 8,
  "prompt": "Crea una lista de recursos con nav, ul, li y enlaces.",
  "notes": ["Usa enlaces reales o # si estas practicando."],
  "starterCode": {
    "html": "<main></main>",
    "css": "",
    "javascript": ""
  },
  "validation": {
    "mode": "all",
    "successMessage": "Lista creada.",
    "rules": [
      {
        "type": "domSelector",
        "selector": "nav ul li a[href]",
        "minCount": 3,
        "message": "Incluye al menos tres enlaces dentro de una lista en nav."
      }
    ]
  }
}
```

Para ejercicios `visual-match`, anade `targetCode`:

```json
{
  "targetCode": {
    "html": "<article class=\"card\">Objetivo</article>",
    "css": ".card { padding: 24px; background: white; }",
    "javascript": ""
  }
}
```

## Reglas de validacion

```json
{ "type": "contains", "field": "css", "value": "display: grid", "message": "Usa display grid." }
```

```json
{ "type": "regex", "field": "javascript", "pattern": "addEventListener\\(", "message": "Usa addEventListener." }
```

```json
{ "type": "domSelector", "selector": "form label[for]", "minCount": 3, "message": "Asocia labels a campos." }
```

```json
{ "type": "consoleIncludes", "value": "FizzBuzz", "message": "La consola debe incluir FizzBuzz." }
```
