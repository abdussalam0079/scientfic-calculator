let display = document.getElementById('display');

// Insert value into display
function insert(value) {
  if (display.innerText === '0') {
    display.innerText = '';
  }
  // Handle scientific function insertion
  if (value === '^') {
    display.innerText += '**';
  } else {
    display.innerText += value;
  }
}

// Clear entire display
function clearDisplay() {
  display.innerText = '0';
}

// Delete last character
function deleteLast() {
  if (display.innerText.length === 1) {
    display.innerText = '0';
  } else {
    display.innerText = display.innerText.slice(0, -1);
  }
}

// Evaluate expression safely
function calculate() {
  let expr = display.innerText.trim();

  if (!expr || expr === '0') {
    display.innerText = '0';
    return;
  }

  // Replace user-friendly symbols with JS equivalents
  expr = expr
    .replace(/π/g, 'Math.PI')
    .replace(/\^/g, '**')
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/exp\(/g, 'Math.exp(');

  // Auto-close unclosed parentheses
  let openParens = (expr.match(/\(/g) || []).length;
  let closeParens = (expr.match(/\)/g) || []).length;
  let missing = openParens - closeParens;
  if (missing > 0) {
    expr += ')'.repeat(missing);
  }

  try {
    // Safely evaluate
    let result = Function('"use strict"; return (' + expr + ')')();
    
    // Handle floating point precision
    if (typeof result === 'number' && !isNaN(result)) {
      // Round to avoid 0.9999999999999999
      if (Math.abs(result) < 1e-10) result = 0;
      else result = parseFloat(result.toPrecision(12));
    }

    display.innerText = String(result);
  } catch (error) {
    display.innerText = 'Error';
    setTimeout(() => {
      display.innerText = '0';
    }, 1500);
  }
}