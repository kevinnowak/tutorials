const button = document.querySelector(".event-button");
button.addEventListener("click", function () {
  alert("Hey!");
});

const input = document.querySelector(".input-to-copy");
const paragraph = document.querySelector(".p-to-copy-to");
input.addEventListener("keyup", function () {
  paragraph.innerText = input.value;
});
