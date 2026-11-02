
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");
const historyList = document.getElementById("historyList");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldReset = false;
let history = [];

function updateDisplay() {
    currentDisplay.textContent = currentValue;

    previousDisplay.textContent = operator
        ? previousValue + " " + operator
        : "";
}

function appendNumber(number) {

    if (currentValue === "Error") clearAll();

    if (shouldReset) {
        currentValue = number === "." ? "0." : number;
        shouldReset = false;
        updateDisplay();
        return;
    }

    if (number === "." && currentValue.includes(".")) return;

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else if (currentValue.length < 15) {
        currentValue += number;
    }

    updateDisplay();
}

function chooseOperator(op) {

    if (currentValue === "Error") return;

    if (operator && !shouldReset) {
        calculate();
    }

    previousValue = currentValue;
    operator = op;
    shouldReset = true;

    updateDisplay();
}

function calculate() {

    if (!operator || previousValue === "") return;

    let a = parseFloat(previousValue);
    let b = parseFloat(currentValue);
    let result;

    switch (operator) {

        case "+":
            result = a + b;
            break;

        case "-":
            result = a - b;
            break;

        case "*":
            result = a * b;
            break;

        case "/":
            if (b === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;
                shouldReset = true;
                updateDisplay();
                return;
            }

            result = a / b;
            break;
    }

    if (!Number.isFinite(result)) {
        currentValue = "Error";
    } else {

        result = Number(result.toPrecision(12));

        let expression = `${a} ${operator} ${b}`;

        currentValue = String(result);

        addHistory(expression, result);
    }

    previousValue = "";
    operator = null;
    shouldReset = true;

    updateDisplay();
}

function clearAll() {

    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldReset = false;

    updateDisplay();
}

function deleteLast() {

    if (shouldReset || currentValue === "Error") {
        currentValue = "0";
        shouldReset = false;
    } else {
        currentValue = currentValue.slice(0, -1) || "0";
    }

    updateDisplay();
}

function percentage() {

    if (currentValue === "Error") return;

    currentValue = String(
        Number(parseFloat(currentValue) / 100)
    );

    updateDisplay();
}

function toggleSign() {

    if (currentValue === "Error") return;

    if (parseFloat(currentValue) !== 0) {
        currentValue = String(-parseFloat(currentValue));
    }

    updateDisplay();
}

function addHistory(expression, result) {

    history.unshift(`${expression} = ${result}`);

    if (history.length > 10) {
        history.pop();
    }

    renderHistory();
}

function renderHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.textContent = "No calculations yet";
        return;
    }

    history.forEach(item => {

        const div = document.createElement("div");

        div.className = "history-item";
        div.textContent = item;

        historyList.appendChild(div);

    });
}

function clearHistory() {

    history = [];

    renderHistory();
}

// Keyboard Support

document.addEventListener("keydown", function(e) {

    if (e.key >= "0" && e.key <= "9") {
        appendNumber(e.key);
    }

    else if (e.key === ".") {
        appendNumber(".");
    }

    else if (["+", "-", "*", "/"].includes(e.key)) {
        chooseOperator(e.key);
    }

    else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculate();
    }

    else if (e.key === "Backspace") {
        deleteLast();
    }

    else if (e.key === "Escape") {
        clearAll();
    }

    else if (e.key === "%") {
        percentage();
    }

});

updateDisplay();
