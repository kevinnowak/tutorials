// Strings
const myName1 = "Kevin\'s car";
const myName2 = 'Kevin\'s "car"';
const myName3 = `Kevin\'s car`;

console.log(myName1);
console.log(myName2);
console.log(myName3);

const firstName = "Kevin";
const secondName = "Nowak";
const sentence = "Hello " + firstName + " " + secondName + "!";
const sentenceWithTemplate = `Hello ${firstName} ${secondName}!`;
console.log(sentence);
console.log(sentence);

// Booleans
let isKevinCool = true;
let isTheSkyGreen = false;
console.log(isKevinCool);
console.log(isKevinCool === isTheSkyGreen);

// Comparison
let a = 10;
let b = "10";
console.log(a == b); // true
console.log(a === b); // false