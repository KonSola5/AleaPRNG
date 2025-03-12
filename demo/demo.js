import { AleaPRNG } from "../src/alea.js";

window.AleaPRNG = AleaPRNG;

const random = new AleaPRNG("randomseed");

const log = document.getElementById("log");
const newNumberButton = document.getElementById("new-number")
const resetButton = document.getElementById("reset-gen");

function addToLog(message) {
  if (log.children.length > 10) log.removeChild(log.firstChild);
  let span = document.createElement("span")
  span.textContent = message;
  log.append(span)
}

newNumberButton.addEventListener("click", () => {
  addToLog(`The random number is ${random.nextUint32()}`);
})

resetButton.addEventListener("click", () => {
  random.reset();
  addToLog(`Random generator reset.`);
})