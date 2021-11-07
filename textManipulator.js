const css = `
#popover-actions {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: none;
  background-color: transparent;
}

#popover-actions > .actions-list {
  display: flex;
  background-color: transparent;
  box-shadow: 0 4px 2px -2px gray;
}

#popover-actions > .actions-list > .action {
  background-color: #e5dfdf;
  color: black;
  font-weight: bold;
  padding: 4px 8px;
}

#popover-actions > .actions-list > .action > .left {
 border-top-left-radius: 4px; 
 border-bottom-left-radius: 4px; 
}

#popover-actions > .actions-list > .action > .right {
  border-top-right-radius: 4px; 
  border-bottom-right-radius: 4px; 
}

.btnEntrance {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  animation-name: btnEntrance;
}

@keyframes btnEntrance { 
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  100% {
    opacity: 1;
  }    
}
`;
const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');

head.appendChild(style);
style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}


const body = document.getElementsByTagName('BODY')[0]; 

const popoverActionsElement = document.createElement('div');
popoverActionsElement.id = 'popover-actions';

const popoverActionsListElement = document.createElement('div');
popoverActionsListElement.classList.add('actions-list');

const makeBoldActionElement = document.createElement('div');
makeBoldActionElement.id = 'popover-actions-bold';
makeBoldActionElement.innerHTML = 'B';
makeBoldActionElement.classList.add('action');
makeBoldActionElement.classList.add('right');

const reverseActionElement = document.createElement('div');
reverseActionElement.id = 'popover-actions-reverse'
reverseActionElement.innerHTML = 'R';
reverseActionElement.classList.add('action');
reverseActionElement.classList.add('left');

popoverActionsListElement.appendChild(makeBoldActionElement);
popoverActionsListElement.appendChild(reverseActionElement);
popoverActionsElement.appendChild(popoverActionsListElement);
body.appendChild(popoverActionsElement);

const selectableTextArea = document.querySelectorAll('[contenteditable=true]');
const popoverActions = document.querySelector("#popover-actions");
const reverseBtn = document.querySelector("#popover-actions-reverse");
const boldBtn = document.querySelector("#popover-actions-bold");

let shiftLeft = 0;
let shiftRight = 0;

selectableTextArea.forEach(elem => {
  elem.addEventListener("mouseup", selectableTextAreaMouseUp);
  elem.addEventListener("keydown", selectableTextAreaKeyDown);
});

document.addEventListener("mousedown", documentMouseDown);

function clearSelection() {
  popoverActions.style.display = "none";
  popoverActions.classList.remove("btnEntrance");
  window.getSelection().empty();
}

function selectableTextAreaMouseUp(event) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim();
  
  if (selectedText.length) { 
    const x = event.pageX;
    const y = event.pageY;
    const popoverActionsStyle = getComputedStyle(popoverActions)
    const popoverActionsWidth = Number(popoverActionsStyle.width.slice(0,-2));
    const popoverActionsHeight = Number(popoverActionsStyle.height.slice(0,-2));
    
    if (document.activeElement !== popoverActions) {
      popoverActions.style.left = `${x - popoverActionsWidth * 0.5}px`;
      popoverActions.style.top = `${y - popoverActionsHeight * 1.25}px`;
      popoverActions.style.display = "block";
      popoverActions.classList.add("btnEntrance");
    }
    else {
      popoverActions.style.left = `${x - popoverActionsWidth * 0.5}px`;
      popoverActions.style.top = `${y - popoverActionsHeight * 0.5}px`;
    }
  }
}

function documentMouseDown(event) {
  if (event.target.id === "popover-actions-bold") {
    makeSelectionBold()
    return clearSelection();
  }
  
  if (event.target.id === "popover-actions-reverse") {
    reverseSelection()
    return clearSelection();
  }

  if(event.target.id !== "popover-actions") {
    clearSelection()
  }
}

function selectableTextAreaKeyDown(event) {
  const key = event.key + event.location;

  if (key === "Shift1") {
    shiftLeft = 1;
    shiftRight = 0;
  } else if (key === "Shift2") {
    shiftRight = 1;
    shiftLeft = 0;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    selectableTextAreaMouseUp(event)
  }
}

function makeSelectionBold() {
  const range = window.getSelection().getRangeAt(0);
  const html = `<span style="font-weight:bold;"> ${range.toString()}</span>`
  insertNewFragment(range, html);
}

function reverseSelection() {
  const range = window.getSelection().getRangeAt(0);
  const html = `<span> ${range.toString().split("").reverse().join("")}</span>`
  insertNewFragment(range, html);
}

function insertNewFragment(range, html) {
  range.deleteContents();
  
  const el = document.createElement("div");
  el.innerHTML = html;
  
  const fragment = document.createDocumentFragment();
  const node = el.firstChild;
  const lastNode = fragment.appendChild(node);
  range.insertNode(fragment);
}
