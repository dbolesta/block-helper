// ▩▢▢▢▢▢▩▩
// ▩▩▩▩▢▢▢▢

// states
////////////////////
let down = false; // keep track if mouse is down (so we can drag grid entries)



// cache references
////////////////////
let boxes = document.querySelectorAll(".grid-container > span");
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

// set if mouse is down or not
document.addEventListener('mousedown', () => down = true);
document.addEventListener('mouseup', () => down = false);


// functions
////////////////////
function clearSelected(){
   boxes.forEach(box=> {
      box.classList.remove("selected");
   }); // end boxes loop
} // end clearSelected


function toggleSelected(e){
   let el = e.target;
   el.classList.toggle("selected");
}

function toggleSelectedIfDown(e){
   if (down)
      e.target.classList.toggle("selected");
}


function getTheCode(){
   let comment = `//`;
   let name = codeNameEl.value;
   if (name == '') name = 'noName';
   let code = `private List<Vector2> ${name} = new List<Vector2> {`;

   let vectorArray = [];

   // first row
   let currentRow = boxes[0].dataset.y;

   boxes.forEach((box, i) => {
      let boxX = box.dataset.x;
      let boxY = box.dataset.y;


      if (currentRow != box.dataset.y){
         currentRow = box.dataset.y
         comment += `\n//`;
      }


      if (box.classList.contains("selected")){
         vectorArray.push(`new Vector2(${boxX}, ${boxY})`);
         comment += `⬛`;

      } else {
         comment += `⬜`;
      }
   }); // end boxes loop


   for (let i = 0; i < vectorArray.length; i++){
      code += vectorArray[i];

      if (i != vectorArray.length -1){
         code += ', ';
      }
   }

   code += `};`;

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
   let xMin = -7;
   let xMax = 6;
   let yMin = -3;
   let yMax = 6;

   let html = '';

   // important that we loop y first
   for (let y = yMax; y >= yMin; y--){
      for (let x = xMin; x <= xMax; x++){
            html += `<span data-x="${x}" data-y="${y}">${x},${y}</span>`;
      }
   }

   // return html;
   console.log(html);
}