const responseFromServer = `{"name": "Luna","age": 10,"breed": "Havanese","location": {"city":"Seattle","state": "WA"}}`;

console.log(responseFromServer);

const parsedResponse = JSON.parse(responseFromServer);

// The whole object
console.log(parsedResponse);

// Just the name
console.log(parsedResponse.name);

// Just the city
console.log(parsedResponse.location.city);

const dog = {
  name: "Luna",
  age: 10,
  breed: "Havanese",
  location: {
    city: "Seattle",
    state: "WA",
  },
};

const objString = JSON.stringify(dog);

console.log(objString);

const el = document.getElementById("code-block");
el.innerText = JSON.stringify(dog, null, 2);
