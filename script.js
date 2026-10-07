const functionInput = document.getElementById("functionInput");
const xInput = document.getElementById("xInput");
const calculateButton = document.getElementById("calculateButton");

const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");
const originalFunction = document.getElementById("originalFunction");
const derivativeFunction = document.getElementById("derivativeFunction");
const slope = document.getElementById("slope");
const stepsList = document.getElementById("stepsList");

function parseTerm(term) {
  const cleanTerm = term.replace(/\s+/g, "");
  if (!cleanTerm) return null;

  if (/^[+-]?\d+(\.\d+)?$/.test(cleanTerm)) {
    return { coefficient: Number(cleanTerm), exponent: 0 };
  }

  const power = cleanTerm.match(/^([+-]?\d*\.?\d*)x(?:\^(\d+))?$/i);
  if (!power) throw new Error("No pude reconocer el término: " + term);

  let coefficientText = power[1];
  if (coefficientText === "" || coefficientText === "+") coefficientText = "1";
  else if (coefficientText === "-") coefficientText = "-1";

  return {
    coefficient: Number(coefficientText),
    exponent: power[2] === undefined ? 1 : Number(power[2])
  };
}

function parseFunction(expression) {
  let clean = expression.replace(/\s+/g, "");
  if (!clean) throw new Error("Escribe una función.");

  // Rechaza operadores repetidos o incompletos, por ejemplo: x++2, x--2 o x+-2.
  if (/\+\+|--|\+-|-\+/.test(clean)) {
    throw new Error("La expresión está incompleta. Revisa los signos + y -.");
  }

  if (clean.startsWith("+")) {
    throw new Error("La expresión está incompleta. No puede comenzar con +.");
  }

  clean = clean.replace(/-/g, "+-");
  if (clean.startsWith("+-")) clean = clean.slice(1);

  const parts = clean.split("+");
  if (parts.some(part => !part)) {
    throw new Error("La expresión está incompleta. Revisa los signos + y -.");
  }

  return parts.map(parseTerm);
}

// Regla general: d/dx(ax^n) = a*n*x^(n-1)
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
      `${formatTerm(term)} → ${formatNumber(newCoefficient)}x^${newExponent} usando la regla de la potencia`
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

  if (exponent === 0) return sign + formatNumber(absolute);

  let coefficientPart = absolute === 1 ? "" : formatNumber(absolute);

  if (exponent === 1) return sign + coefficientPart + "x";
  return sign + coefficientPart + "x^" + exponent;
}

function formatPolynomial(terms) {
  const visibleTerms = terms.filter(term => term.coefficient !== 0);
  if (visibleTerms.length === 0) return "0";

  return visibleTerms.map((term, index) => {
    const text = formatTerm(term);
    if (index === 0) return text;
    return text.startsWith("-") ? " - " + text.slice(1) : " + " + text;
  }).join("");
}

function evaluatePolynomial(terms, value) {
  return terms.reduce(
    (total, term) => total + term.coefficient * Math.pow(value, term.exponent),
    0
  );
}

function calculateDerivative() {
  try {
    errorMessage.textContent = "";

    const terms = parseFunction(functionInput.value);

    // No usar 0 automáticamente cuando x está vacío.
    if (xInput.value.trim() === "") {
      throw new Error("Introduce un valor para x.");
    }

    const valueX = Number(xInput.value);

    if (!Number.isFinite(valueX)) {
      throw new Error("Introduce un valor numérico para x.");
    }

    const derivativeTerms = terms.map(deriveTerm);
    const derivative = derivativeTerms.filter(term => term.coefficient !== 0);

    originalFunction.textContent = "f(x) = " + formatPolynomial(terms);
    derivativeFunction.textContent = "f'(x) = " + formatPolynomial(derivative);

    const derivativeValue = evaluatePolynomial(derivative, valueX);
    slope.textContent = formatNumber(derivativeValue);

    stepsList.innerHTML = derivativeTerms
      .map(term => "<div class=\"step\">" + term.explanation + "</div>")
      .join("");

    result.classList.remove("hidden");
  } catch (error) {
    result.classList.add("hidden");
    errorMessage.textContent = error.message;
  }
}

calculateButton.addEventListener("click", calculateDerivative);

// Permite calcular presionando Enter desde cualquiera de los campos.
function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateDerivative();
  }
}

functionInput.addEventListener("keydown", handleEnter);
xInput.addEventListener("keydown", handleEnter);

