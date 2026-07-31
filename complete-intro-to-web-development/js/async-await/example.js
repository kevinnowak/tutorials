async function getName() {
  return "Kevin";
}

console.log(getName());

async function call() {
  const name = await getName();
  console.log(name);
  return name;
}

call();

//
// getName().then(function (name) {
//   console.log(name);
// });
