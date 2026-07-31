const DOG_URL = "https://dog.ceo/api/breeds/image/random";
const doggos = document.getElementById("dog-target");

function addNewDoggo() {
  const promise = fetch(DOG_URL);

  promise
    .then((response) => response.json())
    .then((processedResponse) => {
      // const dogObject = JSON.parse(processedResponse);
      const img = document.createElement("img");
      img.src = processedResponse.message;
      img.alt = "Cute Doggo";
      doggos.appendChild(img);
    });
}

document.getElementById("dog-btn").addEventListener("click", addNewDoggo);
