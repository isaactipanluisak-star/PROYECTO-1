const functionInput = document.getElementById("functionInput");
const xInput = document.getElementById("xInput");
const calculateButton = document.getElementById("calculateButton");

const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");
const originalFunction = document.getElementById("originalFunction");
const derivativeFunction = document.getElementById("derivativeFunction");
const slope = document.getElementById("slope");
const stepsList = document.getElementById("stepsList");

// Convierte x, x^n y ax^n en una estructura fácil de usar.
function parseTerm(term) {
  const cleanTerm = term.replace(/\s+/g, "");

  if (!cleanTerm) {
    return null;
  }

  // Constante: por ejemplo, 7 o -7
  if (/^[+-]?\d+(\.\d+)?$/.test(cleanTerm)) {
    return {
      coefficient: Number(cleanTerm),
      exponent: 0
    };
  }

  // x o -x
  const simpleX = cleanTerm.match(/^([+-]?)(x)$/i);
  if (simpleX) {
    return {
      coefficient: simpleX[1] === "-" ? -1 : 1,
      exponent: 1
    };
  }

  // ax^n, ax o x^n
  const power = cleanTerm.match(/^([+-]?\d*\.?\d*)x(?:\^(\d+))?$/i);

  if (!power) {
    throw new Error("No pude reconocer el término: " + term);
  }

  let coefficientText = power[1];

  if (coefficientText === "" || coefficientText === "+") {
    coefficientText = "1";
  } else if (coefficientText === "-") {
    coefficientText = "-1";
  }

  return {
    coefficient: Number(coefficientText),
    exponent: power[2] === undefined ? 1 : Number(power[2])
  };
}

// Separa una función en términos.
// Ejemplo: 3x^2 + 2x - 5 -> 3x^2, +2x, -5
function parseFunction(expression) {
  let clean = expression.replace(/\s+/g, "");

  if (!clean) {
    throw new Error("Escribe una función.");
  }

  clean = clean.replace(/-/g, "+-");
  if (clean.startsWith("+-")) {
    clean = clean.slice(1);
  }

  const parts = clean.split("+").filter(Boolean);

  return parts.map(parseTerm);
}

// Aplica la regla de la potencia término por término.
function deriveTerm(term) {
  if (term.exponent === 0) {
    return {
      coefficient: 0,
      exponent: 0,
      explanation: `${formatNumber(term.coefficient)} es una constante → 0`
    };
  }

  const newCoefficient = term.coefficient * term.exponent;
  const newExponent = term.exponent - 1;

  return {
    coefficient: newCoefficient,
    exponent: newExponent,
    explanation:
      `${formatTerm(term)} → ${formatNumber(newCoefficient)}x^${newExponent} `
      + ` usando an xⁿ⁻¹`
  };
}

function formatNumber(number) {
  return Number(number.toFixed(10)).toString();
}

function formatTerm(term) {
  const coefficient = term.coefficient;
  const exponent = term.exponent;

  if (coefficient === 0) return "0";

  const sign = coefficient < 0 ? "-" : "";
  const absolute = Math.abs(coefficient);

  if (exponent === 0) {
    return sign + formatNumber(absolute);
  }

  let coefficientPart = "";
  if (absolute !== 1) {
    coefficientPart = formatNumber(absolute);
  }

  if (exponent === 1) {
    return sign + coefficientPart + "x";
  }

  return sign + coefficientPart + "x^" + exponent;
}

function formatPolynomial(terms) {
  const visibleTerms = terms.filter(term => term.coefficient !== 0);

  if (visibleTerms.length === 0) {
    return "0";
  }

  let output = "";

  visibleTerms.forEach((term, index) => {
    const text = formatTerm(term);

    if (index === 0) {
      output += text;
      return;
    }

    if (text.startsWith("-")) {
      output += " - " + text.slice(1);
    } else {
      output += " + " + text;
    }
  });

  return output;
}

function evaluatePolynomial(terms, x) {
  return terms.reduce((total, term) => {
    return total + term.coefficient * Math.pow(x, term.exponent);
  }, 0);
}

calculateButton.addEventListener("click", () => {
  try {
    errorMessage.textContent = "";

    const expression = functionInput.value;
    const x = Number(xInput.value);

    if (!Number.isFinite(x)) {
      throw new Error("Introduce un valor numérico para x.");
    }

    const terms = parseFunction(expression);
    const derivativeTerms = terms.map(deriveTerm);

    const derivative = derivativeTerms.filter(term => term.coefficient !== 0);

    originalFunction.textContent = "f(x) = " + formatPolynomial(terms);
    derivativeFunction.textContent = "f'(x) = " + formatPolynomial(derivative);

    const derivativeValue = evaluatePolynomial(derivative, x);
    slope.textContent = derivativeValue.toFixed(4).replace(/\.0000$/, "");

    stepsList.innerHTML = derivativeTerms
      .map(term => `<div class="step">${term.explanation}</div>`)
      .join("");

    result.classList.remove("hidden");
  } catch (error) {
    result.classList.add("hidden");
    errorMessage.textContent = error.message;
  }
});

// Calcula el ejemplo al abrir la página.
calculateButton.click();