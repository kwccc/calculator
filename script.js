const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: null,
  operator: null
}

const inputNumber = number => {
  const { displayValue, waitingForSecondOperand } = calculator

  if (waitingForSecondOperand) {
    calculator.displayValue = number
    calculator.waitingForSecondOperand = false
  } else {
    // calculator.displayValue = displayValue === '0' ? number : displayValue + number

    if (displayValue === '0') {
      calculator.displayValue = number
    } else {
      if (calculator.displayValue.length < 9) {
        calculator.displayValue = displayValue + number
      }
    }
  }
}

const inputDecimal = dot => {
  if (calculator.waitingForSecondOperand) {
    calculator.displayValue = '0.'
    calculator.waitingForSecondOperand = false
    return
  }

  if (!calculator.displayValue.includes(dot) && calculator.displayValue.length < 9) {
    calculator.displayValue += dot
  }
}

const handleOperator = nextOperator => {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue)

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator
    return
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator)

    if (result === 'Error') {
      calculator.displayValue = result
      calculator.firstOperand = null
    } else {
      calculator.displayValue = `${parseFloat(String(result).slice(0,9))}`
      calculator.firstOperand = result
    }
  }

  calculator.waitingForSecondOperand = true
  calculator.operator = nextOperator
}

const calculate = (firstOperand, secondOperand, operator) => {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand
      break;
    case '-':
      return firstOperand - secondOperand
      break
    case '*':
      return firstOperand * secondOperand
      break
    case '/':
      return secondOperand === 0 ? 'Error' : firstOperand / secondOperand
      break
    default:
      return secondOperand
      break;
  }
}

const resetCalculator = () => {
  calculator.displayValue = '0'
  calculator.firstOperand = null
  calculator.waitingForSecondOperand = false
  calculator.operator = null
}

const addSign = () => {
  if (calculator.displayValue === '0') return
  
  if (calculator.displayValue.includes('-')) {
    calculator.displayValue = calculator.displayValue.slice(1)
  } else {
    calculator.displayValue = '-' + calculator.displayValue
  }

  if (calculator.operator === '=' && calculator.waitingForSecondOperand) {
    calculator.firstOperand = parseFloat(calculator.displayValue)
  }
  updateDisplay()
}

const handlePercent = () => {
  calculator.displayValue = calculator.displayValue / 100
}

const updateDisplay = () => {
  const display = document.querySelector('.display')
  display.textContent = calculator.displayValue
}

updateDisplay()

const inputKey = key => {
  const { value } = key

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value)
      break
    case '.':
      inputDecimal(value)
      break
    case 'Escape':
      resetCalculator()
      break
    case 'sign':
      addSign()
      break
    case 'percent':
      handlePercent()
      break
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputNumber(value)
      }
      break;
  }

  updateDisplay()
}

const keys = document.querySelector('.calculator-keys')
keys.addEventListener('click', e => {
  const { target } = e
  if (!target.matches('button')) return
  inputKey(target)
})

window.addEventListener('keydown', e => {
  if (e.key === 'Backspace') {
    if (calculator.displayValue === '0') {
      return
    } else if (calculator.displayValue.length === 1){
      calculator.displayValue = '0'
    } else {
      calculator.displayValue = calculator.displayValue.slice(0, -1)
    }
    updateDisplay()
  }

  const key = e.key === 'Enter' ? document.querySelector(`button[value='=']`) : document.querySelector(`button[value='${e.key}']`)
  if (!key) return
  inputKey(key)
})

const logCalc = () => { console.log(calculator) }