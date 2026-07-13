const DOG_URL = "https://dog.ceo/api/breeds/image/random";
const doggos = document.getElementById("dog-target");

async function addNewDoggo() {
  const promise = await fetch(DOG_URL);
  const processedPromise = await promise.json();
  const img = document.createElement("img");
  img.src = processedPromise.message;
  img.alt = "Cute doggo";
  doggos.appendChild(img);
}

document.getElementById("dog-btn").addEventListener("click", addNewDoggo);
