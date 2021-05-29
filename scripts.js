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


// functions
////////////////////
function handleObjectSelect(e){
   let el = e.currentTarget;
   objectSelectors.forEach(obj => {
      obj.classList.remove("selected");
   });
   el.classList.add("selected");

   paintState = el.dataset.paintState;
   gridContainer.dataset.paintState = paintState;

}



function clearSelected(){
   boxes.forEach(box=> {
      box.classList.remove("selected");
      box.removeAttribute("data-paint-state");
   }); // end boxes loop
} // end clearSelected


function toggleSelected(e){
   let el = e.target;
   if (el.classList.contains("selected")){
      el.classList.remove("selected");
      el.removeAttribute("data-paint-state");
   } else {
      el.classList.add("selected");
      el.setAttribute("data-paint-state", paintState);
   }

}

function toggleSelectedIfDown(e){
   if (down){
      e.target.classList.add("selected");
      e.target.setAttribute("data-paint-state", paintState);
   }
}


// {"test", new Dictionary<string, List<string>>
//             {{ "blocks", new List<string> {"7,0", "12,0", "7,1", "12,1", "7,2", "10,2", "12,2", "14,2", "15,2", "7,3", "12,3", "7,4", "8,4", "9,4", "10,4", "11,4", "12,4", "9,8", "10,8", "11,8", "9,9", "11,9"}
//             },
//             { "food", new List<string> { "8,0", "11,3", "5,5" }
//             }}
//         },


function getTheCode(){
   let comment = `//`;
   let name = codeNameEl.value;
   if (name == '') name = 'noKey';
   let code = `{"${name}", new Dictionary<string, List<string>>\n\t\t\t{`;

   let blockArray = [];
   let foodArray = [];

   // first row
   let currentRow = boxes[0].dataset.y;

   boxes.forEach((box, i) => {
      let boxX = box.dataset.x;
      let boxY = box.dataset.y;

      // new row
      if (currentRow != box.dataset.y){
         currentRow = box.dataset.y
         comment += `\n//`;
      }


      // check if box is selected with something
      if (box.classList.contains("selected")){
         // find dataset, and add to associated array
         if (box.dataset.paintState == "block"){
            blockArray.push(`"${boxX},${boxY}"`);
            comment += `⬛`;
         } 
         else if (box.dataset.paintState == "food"){
            foodArray.push(`"${boxX},${boxY}"`);
            comment += `🍜`;
         }
         
      } else {
         comment += `⬜`;
      }
   }); // end boxes loop



   // construct the code
   // add blocks dictionary
   code += `{ "blocks", new List<string> {`;
   for (let i = 0; i < blockArray.length; i++){
      code += blockArray[i];

      // no comma on last one
      if (i != blockArray.length -1){
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up


   code +=`\n\t\t\t`; // neatly space between inner dictionaries


   // add food dictionary
   code += `{ "food", new List<string> {`;
   for (let i = 0; i < foodArray.length; i++){
      code += foodArray[i];

      // no comma on last one
      if (i != foodArray.length -1){
         code += ', ';
      }
   }
   code += `}\n\t\t\t},`; // close it up


   code += `}\n\t\t}`; // close out entire dictionary


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
function generateSpans(){
   // 27 , 12
   // old 8x8 was xmax 20, ymax 9

   let xMin = 0;
   let xMax = 27;
   let yMin = 0;
   let yMax = 12;

   let html = '';

   // important that we loop y first
   for (let y = yMin; y <= yMax; y++){
      for (let x = xMin; x <= xMax; x++){
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