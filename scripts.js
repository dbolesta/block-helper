// ▩▢▢▢▢▢▩▩
// ▩▩▩▩▢▢▢▢

// states
////////////////////
let down = false; // keep track if mouse is down (so we can drag grid entries)
let paintState = "block"; // which object is select and should be painted on grid
let selectedCharacter = "snake"; // which grid is selected, and thusly which objects are available


// master key/position array reference for each attack
// will need to add all keys here as they are added
let snakeKeysAndPosArrays = {
   "smallBlocks": [],
   "food": [],
   "bigBlocks": [],
   "doors": [],
   "keys": []
};

let bomberKeysAndPosArrays = {
   "brickblock": [],
   "brickblocksmall": [],
   "flameHead": [],
   "bomber": [],
   "springBoard": [],
};





// cache references
////////////////////
let gridContainerSnake = document.querySelector(".grid-container.snake-grid");
gridContainerSnake.innerHTML = snakeGridHtml; // insert grid into DOM

let gridContainerBomber = document.querySelector(".grid-container.bomber-grid");
gridContainerBomber.innerHTML = bomberGridHtml; // insert grid into DOM

let boxes = document.querySelectorAll(".grid-container.snake-grid > span");
let boxesBomber = document.querySelectorAll(".grid-container.bomber-grid > span");

let characterSelectors = document.querySelectorAll(".character-selector");
let objectSelectors = document.querySelectorAll(".object-selector");
let objectSelectorContainers = document.querySelectorAll(".object-selectors");

let getCodeBtn = document.querySelector(".get-code");
let clearSelectedBtn = document.querySelector(".clear-selected");

let codeBoxEl = document.querySelector(".code-text-area");
let codeNameEl = document.querySelector(".code-name");

// event listeners
////////////////////
characterSelectors.forEach(cSelector => {
   cSelector.addEventListener("click", handleCharacterSelect);
});

boxes.forEach(box => {
   box.addEventListener("mousedown", fillEmptyCell);
   box.addEventListener("mouseenter", toggleSelectedIfDown);
   box.classList.add("cell"); // dynamically add cell class to all cells
});

boxesBomber.forEach(boxBomber => {
   boxBomber.addEventListener("mousedown", fillEmptyCell);
   boxBomber.addEventListener("mouseenter", toggleSelectedIfDown);
   boxBomber.classList.add("cell"); // dynamically add cell class to all cells
});

getCodeBtn.addEventListener('click', getTheCode);

clearSelectedBtn.addEventListener('click', clearSelected);

// object selectors
objectSelectors.forEach(obj => {
   obj.addEventListener("click", handleObjectSelect);
});

// set if mouse is down or not
document.addEventListener('mousedown', () => down = true);
document.addEventListener('mouseup', () => down = false);

// remove bigblock-ongrid img
// gridContainer.addEventListener('click',function(e){
//    console.log(e.target.classList);

//    if(e.target.classList.contains("bigblock-ongrid")){
//          console.log(e.target.parentElement);

//     }
// });



function removeImgItem(e) {
   // e.stopPropagation();
   // console.log("e", e);
   // console.log("e.target", e.target);
   // console.log("e.target.parentElement", e.target.parentElement);
   // console.log("e.target.parentElement.parentElement", e.target.parentElement.parentElement);
   // console.log("e.target.parentElement.classList", e.target.parentElement.classList);
   let parent = e.target.parentElement.parentElement;
   parent.classList.remove("selected");
   parent.removeAttribute("data-paint-state");
   let resetHTML = `${parent.dataset.x},${parent.dataset.y}`;
   parent.innerHTML = resetHTML;
}



// functions
////////////////////
// change paint brush
function handleObjectSelect(e) {
   let el = e.currentTarget;

   // update selection indicator (blow box)
   objectSelectors.forEach(obj => {
      obj.classList.remove("selected");
   });
   el.classList.add("selected");

   // update paintstate
   paintState = el.dataset.paintState;
   gridContainerSnake.dataset.paintState = paintState;
   gridContainerBomber.dataset.paintState = paintState;

}


// update character select
function handleCharacterSelect(e){
   selectedCharacter = e.currentTarget.dataset.character;

   characterSelectors.forEach(cSelector => {
      cSelector.classList.remove("selected");
   });
   e.currentTarget.classList.add("selected");


   updateActiveGrid();
   updateActiveObjectSelectorContainer();
}

function updateActiveObjectSelectorContainer() {
   objectSelectorContainers.forEach(obj => {
      obj.classList.remove("selected");
   });
   if (selectedCharacter == "snake")
      objectSelectorContainers[0].classList.add("selected");
   else if (selectedCharacter == "bomber")
      objectSelectorContainers[1].classList.add("selected");
} // end updateActiveObjectSelectorContainer

function updateActiveGrid(){
   console.log("selected character is");
   console.log(selectedCharacter);
   if (selectedCharacter == "snake"){
      gridContainerSnake.classList.add("active-grid");
      gridContainerBomber.classList.remove("active-grid");
   }
   else if (selectedCharacter == "bomber"){
      gridContainerSnake.classList.remove("active-grid");
      gridContainerBomber.classList.add("active-grid");
   }
}



function clearSelected() {
   boxes.forEach(box => {
      box.classList.remove("selected");
      box.removeAttribute("data-paint-state");
   }); // end boxes loop
   boxesBomber.forEach(boxBomber => {
      boxBomber.classList.remove("selected");
      boxBomber.removeAttribute("data-paint-state");
   }); // end boxes loop
} // end clearSelected


// fills empty cell on grid
function fillEmptyCell(e) {
   let el = e.target; // this cell

   // if this is not an empty cell, cancel function
   if (!el.classList.contains("cell")) return;

   console.log("el", el);
   console.log("e", e);

   // cancel if bigblock clicked
   // if (el.classList.contains("bigblock-ongrid")) return;

   
   if (el.classList.contains("selected")) {
      // if already selected, unselect
      el.classList.remove("selected");
      el.removeAttribute("data-paint-state");

   } 
   else {
      // for some (usually 2x2, we append an img instead of filling the cell)
      // extract this to a function, better html creation for them
      if (paintState == "bigblock" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/bigblock.png" class="grid-img bigblock-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "block" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/block.png" class="grid-img block-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "food" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/food.png" class="grid-img food-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "brickblocksmall" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/brickblocksmall.png" class="grid-img brickblocksmall-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "door" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/door.png" class="grid-img doorkey-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "key" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/key.png" class="grid-img doorkey-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "brickblock" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/brickblock.png" class="grid-img brickblock-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "flameHead" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/flamehead.png" class="grid-img flameHead-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "bomber" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/bomber.png" class="grid-img bomber-ongrid" onclick="removeImgItem(event)"/></div>`;
      }
      else if (paintState == "springBoard" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<div><img src="imgs/springBoard.png" class="grid-img springBoard-ongrid" onclick="removeImgItem(event)"/></div>`;
      }

      // img or not, select the grid and update paintstate
      el.classList.add("selected");
      el.setAttribute("data-paint-state", paintState);
   }

}

// can drag select on grid
function toggleSelectedIfDown(e) {
   if (down) {
      e.target.classList.add("selected");
      e.target.setAttribute("data-paint-state", paintState);
   }
}


// end painting stuff
/////////////////////////






// generate code
function getTheCode() {
   let name = codeNameEl.value; // name of key
   if (name == '') name = 'noKey'; // if no name, give it a placeholder name

   let comment = `//${name}\n//`; // starting the comment string
   let code = `{"${name}", new Dictionary<string, List<string>>\n\t\t\t{`; // start the code string

   // arrays to store string coords of each object (ex: "1,2")
   // no longer need, delete soon
   let smallBlocksArray = [];
   let foodArray = [];
   let bigBlocksArray = [];
   let doorsArray = [];
   let keysArray = [];
   let brickBlockArray = [];
   let brickBlockSmallArray = [];


   // clear out existing arrays
   for (const [key, value] of Object.entries(snakeKeysAndPosArrays)) {
      snakeKeysAndPosArrays[key] = [];
   }

   for (const [key, value] of Object.entries(bomberKeysAndPosArrays)) {
      bomberKeysAndPosArrays[key] = [];
   }


   /// util for managing bigBlock emoji placeent
   // need to keep tack of when 1 is added, its top left,
   // so need to add / remove from bigBlockArrowReserves
   const bigBlockCommentManager = {
      addToArrays: function (x, y) {
         let intX = parseInt(x);
         let intY = parseInt(y);

         bigBlockArrowReserves.topRight.push(`${intX + 1},${intY}`);
         bigBlockArrowReserves.bottomLeft.push(`${intX},${intY + 1}`);
         bigBlockArrowReserves.bottomRight.push(`${intX + 1},${intY + 1}`);

      },

      checkIfAddCommentEmoji: function (x, y) {
         let stringToCheck = `${x},${y}`;

         if (bigBlockArrowReserves.topRight[0] == stringToCheck) {
            bigBlockArrowReserves.topRight.shift();
            // return '↗️';
            return '🕤';
         } else if (bigBlockArrowReserves.bottomLeft[0] == stringToCheck) {
            bigBlockArrowReserves.bottomLeft.shift();
            // return '↙️';
            return '🕒';
         } else if (bigBlockArrowReserves.bottomRight[0] == stringToCheck) {
            bigBlockArrowReserves.bottomRight.shift();
            // return '↘️';
            return '🕘';
         } else {
            return false;
         }

      },
   };

   // where we store all the 2x2 emoji positions
   let bigBlockArrowReserves = {
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
   }



   // determin current box
   let currentBoxes;

   if (selectedCharacter == "snake"){
      currentBoxes = boxes;
   }
   else if (selectedCharacter == "bomber"){
      currentBoxes = boxesBomber;
   }




   // first row is y-0
   let currentRow = currentBoxes[0].dataset.y;

   // loop through every cell
   currentBoxes.forEach((box, i) => {
      let boxX = box.dataset.x;
      let boxY = box.dataset.y;

      // if y has changed, we are on a new row. set it and start new line in comment
      if (currentRow != box.dataset.y) {
         currentRow = box.dataset.y
         comment += `\n//`;
      }

      // check if box is selected with something. if so,
      // this block with both:
      // 1. add the string representation of the coordinate to its respective array
      // 2. add an emoji to the comment code
      // (special case for 2x2 imgs, using commentManager to place emojis in 2x2)
      if (box.classList.contains("selected")) {
         if (box.dataset.paintState == "block") {
            snakeKeysAndPosArrays.smallBlocks.push(`"${boxX},${boxY}"`);
            comment += `⬛`;
         }
         else if (box.dataset.paintState == "food") {
            snakeKeysAndPosArrays.food.push(`"${boxX},${boxY}"`);
            comment += `🍜`;
         }
         else if (box.dataset.paintState == "bigblock") {
            snakeKeysAndPosArrays.bigBlocks.push(`"${boxX},${boxY}"`);
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY); // send coords, which will then later place emoji in x+1, y+1, and x+1 y+1 to make 2x2
         }
         else if (box.dataset.paintState == "door") {
            snakeKeysAndPosArrays.doors.push(`"${boxX},${boxY}"`);
            comment += `🚪`;
         }
         else if (box.dataset.paintState == "key") {
            snakeKeysAndPosArrays.keys.push(`"${boxX},${boxY}"`);
            comment += `🔑`;
         }
         else if (box.dataset.paintState == "brickblock") {
            bomberKeysAndPosArrays.brickblock.push(`"${boxX},${boxY}"`);
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY); // same here
         }
         else if (box.dataset.paintState == "brickblocksmall") {
            bomberKeysAndPosArrays.brickblocksmall.push(`"${boxX},${boxY}"`);
            comment += `🧱`;
         }
         else if (box.dataset.paintState == "flameHead") {
            bomberKeysAndPosArrays.flameHead.push(`"${boxX},${boxY}"`);
            comment += `🔥`;
         }
         else if (box.dataset.paintState == "bomber") {
            bomberKeysAndPosArrays.bomber.push(`"${boxX},${boxY}"`);
            comment += `💣`;
         }
         else if (box.dataset.paintState == "springBoard") {
            bomberKeysAndPosArrays.springBoard.push(`"${boxX},${boxY}"`);
            comment += `➰`;
         }

      } else {
         // here is where we check if there should be an emoji placed in the 2x2
         let commentEmoji = bigBlockCommentManager.checkIfAddCommentEmoji(boxX, boxY);

         if (commentEmoji == false) {
            comment += `⬜`; // if not, regular empty block
         } else {
            comment += commentEmoji;
         }

      }
   }); // end boxes loop


   // loop through each master key/array reference and add to code if needed
   for (const [key, value] of Object.entries(snakeKeysAndPosArrays)) {
      code += `{ "${key}", new List<string> {`;
      for (let i = 0; i < snakeKeysAndPosArrays[key].length; i++) {
         code += snakeKeysAndPosArrays[key][i];

         // no comma on last one
         if (i != snakeKeysAndPosArrays[key].length - 1) {
            code += ', ';
         }
      }
      code += `}\n\t\t\t},`; // close it up

      code += `\n\t\t\t`; // neatly space between inner dictionaries
   } // end loop

   for (const [key, value] of Object.entries(bomberKeysAndPosArrays)) {
      code += `{ "${key}", new List<string> {`;
      for (let i = 0; i < bomberKeysAndPosArrays[key].length; i++) {
         code += bomberKeysAndPosArrays[key][i];

         // no comma on last one
         if (i != bomberKeysAndPosArrays[key].length - 1) {
            code += ', ';
         }
      }
      code += `}\n\t\t\t},`; // close it up

      code += `\n\t\t\t`; // neatly space between inner dictionaries
   } // end loop


   

   // // this should be the end


   code += `}\n\t\t},`; // close out entire dictionary


   console.log(comment);
   codeBoxEl.value = `${comment}\n\n${code}`;
}






// util
////////////////////
function generateSpans() {
   // 27 , 12
   // old 8x8 was xmax 20, ymax 9

   let xMin = 0;
   let xMax = 27;
   let yMin = 0;
   let yMax = 12;

   let html = '';

   // important that we loop y first
   for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
         html += `<span data-x="${x}" data-y="${y}">${x},${y}</span>`;
      }
   }

   console.log(html);

   // ${str.repeat(27)}
   // return html;
   // .slice(0, -1)
   // class="snake-enter"
   let dot = '. ';
   let gridArea = `'` + dot.repeat(xMax + 1).slice(0, -1) + `'\n`;

   console.log(
      `grid-template-columns: repeat(${xMax + 1}, 1fr);
grid-template-rows: repeat(${yMax + 1}, 1fr);
grid-template-areas: 
${gridArea.repeat(yMax + 1)};`);
}


function generateSpansBomber() {
   // 42 , 20

   let xMin = 0;
   let xMax = 41;
   let yMin = 0;
   let yMax = 19;

   let html = '';

   // important that we loop y first
   for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
         html += `<span data-x="${x}" data-y="${y}">${x},${y}</span>`;
      }
   }

   console.log(html);

   let dot = '. ';
   let gridArea = `'` + dot.repeat(xMax + 1).slice(0, -1) + `'\n`;

   console.log(
      `grid-template-columns: repeat(${xMax + 1}, 1fr);
grid-template-rows: repeat(${yMax + 1}, 1fr);
grid-template-areas: 
${gridArea.repeat(yMax + 1)};`);
}