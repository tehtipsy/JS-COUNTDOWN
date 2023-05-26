class CountdownNumbersGame {
    constructor(targetNumber, numbers) {
      this.targetNumber = targetNumber;
      this.numbers = numbers;
      this.solution = this.findSolution(this.numbers, []);
    }
  
    findSolution(numbers, steps) {
      if (numbers.length === 1 && numbers[0] === this.targetNumber) {
        return steps;
      }
  
      for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (i !== j) {
            const a = numbers[i];
            const b = numbers[j];
  
            const newNumbers = numbers.filter((_, index) => index !== i && index !== j);
  
            const results = this.compute(a, b);
            for (const result of results) {
              const newSteps = [...steps, `${a} + ${b} = ${result}`];
              const solution = this.findSolution([...newNumbers, result], newSteps);
  
              if (solution !== null) {
                return solution;
              }
            }
          }
        }
      }
  
      return null;
    }
  
    compute(a, b) {
      const operations = [
        { operator: '+', fn: (x, y) => x + y },
        { operator: '-', fn: (x, y) => x - y },
        { operator: '*', fn: (x, y) => x * y },
        { operator: '/', fn: (x, y) => (y !== 0 && x % y === 0 ? x / y : null) },
      ];
  
      const results = [];
  
      for (const op of operations) {
        const result = op.fn(a, b);
        if (result !== null && result > 0 && !Number.isInteger(result)) {
          results.push(result);
        }
      }
  
      return results.length > 0 ? results : [];
    }
  }
  
  document.getElementById("start-game").addEventListener("click", function() {
    const numLargeNumbers = parseInt(document.getElementById("large-numbers").value);
    
    if (numLargeNumbers === 0) {
      alert("Please choose at least one large number.");
      return;
    }
    
    if (numLargeNumbers > 4) {
      alert("You can only choose up to 4 large numbers.");
      return;
    }
    
    const numSmallNumbers = 6 - numLargeNumbers;
    const chosenNumbers = generateNumbers(numLargeNumbers, numSmallNumbers);
        
    const targetNumber = generateTargetNumber();
    
    displaySelectedNumbersAndTargetNumber(chosenNumbers, targetNumber);
    
    const game = new CountdownNumbersGame(targetNumber, chosenNumbers);
    
    alert("Game started! Target number: " + targetNumber);
    
    document.getElementById("score-button").addEventListener("click", function() {
      const solution = document.getElementById("solution-input").value;
      
      if (solution === "") {
        alert("Please enter a solution.");
        return;
      }
      
      if (solution === null) {
        alert("The game hasn't been solved yet. Keep trying!");
        return;
      }

      if (parseInt(solution) === game.targetNumber) {
        alert("Congratulations! Your solution is correct.");
        document.getElementById("score-result").textContent = "Your solution is correct!";
        // += 10 POINTS
      } else { // delta < 5 += 7 POINTS ETC.
        alert("Oops! Your solution is incorrect.");
        document.getElementById("score-result").textContent = "Your solution is incorrect.";
      }
    });

    // add canvas on game start click
    const canvasContainer = document.getElementById("canvas-container");
    
    const canvasText = document.createElement("h2");
    canvasText.textContent = "Solution Canvas";
    canvasContainer.appendChild(canvasText);

    const canvas = document.createElement("canvas");
    canvasContainer.appendChild(canvas);

    // canvas logic
    const ctx = canvas.getContext("2d");

    let isDrawing = false;

    function startPosition(e) {
      isDrawing = true;
      draw(e);
    }

    function endPosition() {
      isDrawing = false;
      ctx.beginPath();
    }

    function draw(e) {
      if (!isDrawing) return;

      // find client position on canvas 
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // line styling
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "blue";

      // draw logic
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    // event listners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);
    //
  });
  
  function generateNumbers(numLargeNumbers, numSmallNumbers) {
    const largeNumbers = [25, 50, 75, 100];
    const smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const chosenNumbers = [];
    
    for (let i = 0; i < numLargeNumbers; i++) {
      const randomIndex = Math.floor(Math.random() * largeNumbers.length);
      chosenNumbers.push(largeNumbers[randomIndex]);
      largeNumbers.splice(randomIndex, 1);
    }
    
    for (let i = 0; i < numSmallNumbers; i++) {
      const randomIndex = Math.floor(Math.random() * smallNumbers.length);
      chosenNumbers.push(smallNumbers[randomIndex]);
      smallNumbers.splice(randomIndex, 1);
    }
    
    return chosenNumbers;
  }
  
  function displaySelectedNumbers(numbers) {
    const numbersContainer = document.getElementById("numbers-container");
    numbersContainer.innerHTML = "";
    
    const numbersTitle = document.createElement("h2");
    numbersTitle.textContent = "Selected Numbers";
    numbersContainer.appendChild(numbersTitle);
    
    const numbersList = document.createElement("ul");
    
    for (const number of numbers) {
      const numberItem = document.createElement("li");
      numberItem.textContent = number;
      numbersList.appendChild(numberItem);
    }
    
    numbersContainer.appendChild(numbersList);
  }

  function displaySelectedNumbersAndTargetNumber(numbers, targetNumber) {
    const numbersContainer = document.getElementById("numbers-container");
    numbersContainer.innerHTML = "";
    
    const numbersTitle = document.createElement("h2");
    numbersTitle.textContent = "Selected Numbers";
    numbersContainer.appendChild(numbersTitle);
    
    const numbersList = document.createElement("ul");
    
    for (const number of numbers) {
      const numberItem = document.createElement("li");
      numberItem.textContent = number;
      numbersList.appendChild(numberItem);
    }
    
    numbersContainer.appendChild(numbersList);

    const targetNumberTitle = document.createElement("h2");
    targetNumberTitle.textContent = "Target Number";
    numbersContainer.appendChild(targetNumberTitle);

    const targetNumberDisplay = document.createElement("h2");
    targetNumberDisplay.textContent = targetNumber;
    numbersContainer.appendChild(targetNumberDisplay);
  }
  
  function generateTargetNumber() {
    return Math.floor(Math.random() * 900) + 101;
  }
  