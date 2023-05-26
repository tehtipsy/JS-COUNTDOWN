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

    document.getElementById("start-game").remove(); // remove start-game button

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
      if (!isDrawing) 
        return;

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

    // add dragable numbers

    const drawnNumbers = drawNumbers(null);
    
    let selectedNumberIndex = null; // Index of the selected/dragged number

    function drawNumbers(positions) {
      const numberCount = chosenNumbers.length;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const startX = canvasWidth * 0.1; // Starting X position for numbers
      const startY = canvasHeight * 0.5; // Starting Y position for numbers
      const padding = 20; // Padding between numbers
      const numberWidth = 20; // Width of each number box
      const numberHeight = 30; // Height of each number box
    
      ctx.font = "20px Arial";
      ctx.fillStyle = "blue";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    
      const numbers = []; // Array to store the drawn number elements
    
      for (let i = 0; i < numberCount; i++) {
        const number = chosenNumbers[i];

        let position;
        if (positions && positions[i]) {
          position = positions[i];
        } else {
          const numberX = startX + (numberWidth + padding) * i;
          const numberY = startY;
          position = { x: numberX, y: numberY };
        }
    
        const numberX = position.x;
        const numberY = position.y;
    
        ctx.fillText(number.toString(), numberX + numberWidth / 2, numberY + numberHeight / 2);
    
        // Create a number element object with its position
        const numberElement = {
          number: number,
          x: numberX,
          y: numberY,
          width: numberWidth,
          height: numberHeight,
        };
    
        numbers.push(numberElement);
      }
    
      return numbers; // Return the array of drawn number elements
    }
    
    // const numberPositions = drawnNumbers.map((numberElement) => {
    let numberPositions = drawnNumbers.map((numberElement) => {
        return { x: numberElement.x, y: numberElement.y };
    });
    
    // Event listeners for each number
    for (let i = 0; i < drawnNumbers.length; i++) {
      const numberElement = drawnNumbers[i];
      const numberIndex = i;
    
      canvas.addEventListener("pointerdown", function(event) {
        const rect = canvas.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
    
        if (
          pointerX >= numberElement.x &&
          pointerX <= numberElement.x + numberElement.width &&
          pointerY >= numberElement.y &&
          pointerY <= numberElement.y + numberElement.height
        ) {
          selectedNumberIndex = numberIndex;
        }
      });

    
      canvas.addEventListener("pointermove", function(event) {
        if (selectedNumberIndex !== null) {
          const rect = canvas.getBoundingClientRect();
          const pointerX = event.clientX - rect.left;
          const pointerY = event.clientY - rect.top;
    
          const numberElement = drawnNumbers[selectedNumberIndex];
          numberElement.x = pointerX - numberElement.width / 2;
          numberElement.y = pointerY - numberElement.height / 2;
    
          // Update the positions array
          numberPositions[selectedNumberIndex] = {
            x: numberElement.x,
            y: numberElement.y,
          };
    
          // Clear the canvas and redraw the numbers with updated positions
          ctx.clearRect(0, 0, canvas.width, canvas.height); // fix draw function
          drawNumbers(numberPositions);
        }
      });
        
      canvas.addEventListener("pointerup", function() {
        if (selectedNumberIndex !== null) {
          selectedNumberIndex = null;
    
          // Redraw the numbers after updating their positions
          ctx.clearRect(0, 0, canvas.width, canvas.height); // fix draw fucntion
          
          // Update the numberPositions array with the new positions
          drawNumbers(numberPositions);
        }
      });
    }

    canvas.addEventListener("pointerdown", startPosition);
    canvas.addEventListener("pointerup", endPosition);
    canvas.addEventListener("pointermove", draw);
    //
    
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
        alert("Congratulations! Your solution is correct."); // += 10 POINTS
        document.getElementById("score-result").textContent = "Your solution is correct!";
      } else { 
        alert("Oops! Your solution is incorrect."); // delta < 5 += 7 POINTS ETC.
        document.getElementById("score-result").textContent = "Your solution is incorrect.";
      }

      // save canvas to url for OCR
      const dataURL = canvas.toDataURL("image/png");

      // Create a link element
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png"; // Specify the filename for the downloaded image
      link.textContent = "Download Image"; // Text to display for the download link

      document.body.appendChild(link); // DEMO
    });
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
  