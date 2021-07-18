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


function toggleSelected(e) {
   let el = e.target;

   // cancel if bigblock clicked
   if (el.classList.contains("bigblock-ongrid")) return;

   if (el.classList.contains("selected")) {
      el.classList.remove("selected");
      el.removeAttribute("data-paint-state");

   } else {
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
      el.classList.add("selected");
      el.setAttribute("data-paint-state", paintState);
   }

}

function toggleSelectedIfDown(e) {
   if (down) {
      e.target.classList.add("selected");
      e.target.setAttribute("data-paint-state", paintState);
   }
}


// end painting stuff








function getTheCode() {
   let name = codeNameEl.value;
   let comment = `//${name}\n//`;
   if (name == '') name = 'noKey';
   let code = `{"${name}", new Dictionary<string, List<string>>\n\t\t\t{`;

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


   let bigBlockArrowReserves = {
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
   }


   // first row
   let currentRow = boxes[0].dataset.y;


   boxes.forEach((box, i) => {
      let boxX = box.dataset.x;
      let boxY = box.dataset.y;

      // new row
      if (currentRow != box.dataset.y) {
         currentRow = box.dataset.y
         comment += `\n//`;
      }

      // ↗️ ↙️ ↘️ ↖️
      // check if box is selected with something
      if (box.classList.contains("selected")) {
         // find dataset, and add to associated array
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
            // comment += `↖️`;
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY);
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
            // comment += `↖️`;
            comment += `🕞`;
            bigBlockCommentManager.addToArrays(boxX, boxY);
         }
         else if (box.dataset.paintState == "brickblocksmall") {
            keysArray.push(`"${boxX},${boxY}"`);
            comment += `🧱`;
         }

      } else {

         let commentEmoji = bigBlockCommentManager.checkIfAddCommentEmoji(boxX, boxY);

         if (commentEmoji == false) {
            comment += `⬜`;
         } else {
            comment += commentEmoji;
         }

      }
   }); // end boxes loop





   // construct the code
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


// example:
// private List<Vector2> fixedBlocksPos = new List<Vector2> {
//    new Vector2(-2, -3), new Vector2(-2, -2), new Vector2(-2, -1), new Vector2(-2, 0), new Vector2(-2, 1), new Vector2(-2, 2),
//    new Vector2(4, 2), new Vector2(4, 3), new Vector2(4, 4), new Vector2(4, 5), new Vector2(4, 6), new Vector2(4, 7)
// };





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