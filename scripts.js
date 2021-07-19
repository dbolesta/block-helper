// ▩▢▢▢▢▢▩▩
// ▩▩▩▩▢▢▢▢

// states
////////////////////
let down = false; // keep track if mouse is down (so we can drag grid entries)
let paintState = "block"; // which object is select and should be painted on grid


// cache references
////////////////////
let gridContainer = document.querySelector(".grid-container");
let boxes = document.querySelectorAll(".grid-container > span");
let objectSelectors = document.querySelectorAll(".object-selector");
let getCodeBtn = document.querySelector(".get-code");
let clearSelectedBtn = document.querySelector(".clear-selected");

let codeBoxEl = document.querySelector(".code-text-area");
let codeNameEl = document.querySelector(".code-name");

// event listeners
////////////////////
boxes.forEach(box => {
   box.addEventListener("mousedown", toggleSelected);
   box.addEventListener("mouseenter", toggleSelectedIfDown);
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
   console.log(e);
   let parent = e.currentTarget.parentElement;
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
   gridContainer.dataset.paintState = paintState;

}



function clearSelected() {
   boxes.forEach(box => {
      box.classList.remove("selected");
      box.removeAttribute("data-paint-state");
   }); // end boxes loop
} // end clearSelected


// fills or unfills actual block on the grid
function toggleSelected(e) {
   let el = e.target; // this cell

   // cancel if bigblock clicked
   if (el.classList.contains("bigblock-ongrid")) return;

   
   if (el.classList.contains("selected")) {
      // if already selected, unselect
      el.classList.remove("selected");
      el.removeAttribute("data-paint-state");

   } 
   else {
      // for some (usually 2x2, we append an img instead of filling the cell)
      if (paintState == "bigblock" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<img src="imgs/bigblock.png" class="bigblock-ongrid" onclick="removeImgItem(event)"/>`;
      }
      else if (paintState == "door" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<img src="imgs/door.png" class="doorkey-ongrid" onclick="removeImgItem(event)"/>`;
      }
      else if (paintState == "key" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<img src="imgs/key.png" class="doorkey-ongrid" onclick="removeImgItem(event)"/>`;
      }
      else if (paintState == "brickblock" && !el.classList.contains("selected")) {
         e.currentTarget.innerHTML = `<img src="imgs/brickblock.png" class="brickblock-ongrid" onclick="removeImgItem(event)"/>`;
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
   let smallBlocksArray = [];
   let foodArray = [];
   let bigBlocksArray = [];
   let doorsArray = [];
   let keysArray = [];
   let brickBlockArray = [];
   let brickBlockSmallArray = [];


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


   // first row is y-0
   let currentRow = boxes[0].dataset.y;

   // loop through every cell
   boxes.forEach((box, i) => {
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
            smallBlocksArray.push(`"${boxX},${boxY}"`);
            comment += `⬛`;
         }
         else if (box.dataset.paintState == "food") {
            foodArray.push(`"${boxX},${boxY}"`);
            comment += `🍜`;
         }
         else if (box.dataset.paintState == "bigblock") {
            bigBlocksArray.push(`"${boxX},${boxY}"`);
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY); // send coords, which will then later place emoji in x+1, y+1, and x+1 y+1 to make 2x2
         }
         else if (box.dataset.paintState == "door") {
            doorsArray.push(`"${boxX},${boxY}"`);
            comment += `🚪`;
         }
         else if (box.dataset.paintState == "key") {
            keysArray.push(`"${boxX},${boxY}"`);
            comment += `🔑`;
         }
         else if (box.dataset.paintState == "brickblock") {
            brickBlockArray.push(`"${boxX},${boxY}"`);
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY); // same here
         }
         else if (box.dataset.paintState == "brickblocksmall") {
            brickBlockSmallArray.push(`"${boxX},${boxY}"`);
            comment += `🧱`;
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




   // CONSTRUCT THE ACTUAL C# CODE
   // add blocks dictionary
   code += `{ "smallBlocks", new List<string> {`;
   for (let i = 0; i < smallBlocksArray.length; i++) {
      code += smallBlocksArray[i];

      // no comma on last one
      if (i != smallBlocksArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up


   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add food dictionary
   code += `{ "food", new List<string> {`;
   for (let i = 0; i < foodArray.length; i++) {
      code += foodArray[i];

      // no comma on last one
      if (i != foodArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up

   //

   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add bigblock dictionary
   code += `{ "bigBlocks", new List<string> {`;
   for (let i = 0; i < bigBlocksArray.length; i++) {
      code += bigBlocksArray[i];

      // no comma on last one
      if (i != bigBlocksArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up

   //

   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add doors dictionary
   code += `{ "doors", new List<string> {`;
   for (let i = 0; i < doorsArray.length; i++) {
      code += doorsArray[i];

      // no comma on last one
      if (i != doorsArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up

   //

   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add keys dictionary
   code += `{ "keys", new List<string> {`;
   for (let i = 0; i < keysArray.length; i++) {
      code += keysArray[i];

      // no comma on last one
      if (i != keysArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up


   //

   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add brickblock dictionary
   code += `{ "brickblock", new List<string> {`;
   for (let i = 0; i < brickBlockArray.length; i++) {
      code += brickBlockArray[i];

      // no comma on last one
      if (i != brickBlockArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up


   //

   code += `\n\t\t\t`; // neatly space between inner dictionaries


   // add brickblock dictionary
   code += `{ "brickblocksmall", new List<string> {`;
   for (let i = 0; i < brickBlockSmallArray.length; i++) {
      code += brickBlockSmallArray[i];

      // no comma on last one
      if (i != brickBlockSmallArray.length - 1) {
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up

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