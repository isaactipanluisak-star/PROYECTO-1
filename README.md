# PROYECTO-1

## Laboratorio de Derivadas

Aplicación interactiva desarrollada con **HTML, CSS y JavaScript**.

### ¿Qué hace?

El usuario escribe una función polinómica y un valor de **x**. La aplicación identifica los términos de la función, aplica reglas básicas de derivación y calcula la pendiente de la función en el punto indicado.

### Reglas de derivación utilizadas

- Constante: la derivada es 0.
- x: la derivada es 1.
- Potencia: si el término es axⁿ, se aplica an·xⁿ⁻¹.
- Sumas y restas: se deriva cada término por separado.

### Ejemplo

Para:

f(x) = 3x² + 2x - 5

la aplicación obtiene:

f'(x) = 6x + 2

y para x = 2:

f'(2) = 14

### Estructura

- `index.html`: estructura de la página.
- `style.css`: diseño visual.
- `script.js`: lectura de la función, reglas de derivación y cálculo de la pendiente.

El proyecto no utiliza bases de datos, backend, APIs externas ni frameworks.
