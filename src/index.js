const dogiInfo = document.getElementById("dog-info");
const goodDogFilter = document.getElementById("good-dog-filter");
const dogBar = document.getElementById("dog-bar");
let allDogs = [];
let isGoodValue = false;
let baseUrl = "http://localhost:3000/pups";

// Function to fetch data and render initial content
async function fetchDataAndRender() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    allDogs = await response.json();
    renderDogBar(allDogs);
    renderDogs(allDogs);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to render the dog bar (side bar with names)
function renderDogBar(dogs) {
  dogBar.innerHTML = ""; //Clear the previous content
  const filteredDogs = filterDogs(dogs);
  filteredDogs.forEach((dog) => {
    const span = document.createElement("span");
    span.innerText = dog.name;
    span.addEventListener("click", () => renderDogs([dog])); //Render Single dog
    dogBar.appendChild(span);
  });
}

// Filter Function (useful for reusability and readability)
function filterDogs(dogs) {
  if (!isGoodValue) return dogs;

  return dogs.filter((dog) => dog.isGoodDog);
}

// Function to render the dog information
function renderDogs(dogs) {
  dogiInfo.innerHTML = "";
  dogs.forEach((dog) => {
    dogiInfo.innerHTML += `
      <div class="dog-card" data-id="${dog.id}">
        <img src="${dog.image}" alt="${dog.name}" />
        <h2>${dog.name}</h2>
        <button class="change-dog-status">${
          dog.isGoodDog ? "Bad Dog!" : "Good Dog!"
        }</button>
      </div>
    `;
  });
}

// Function to handle filter good dogs
function toggleFilter() {
  isGoodValue = !isGoodValue;
  goodDogFilter.innerText = isGoodValue
    ? "Filter good dogs: ON"
    : "Filter good dogs: OFF";

  const dogsToRender = filterDogs(allDogs);
  renderDogBar(dogsToRender);
  renderDogs(dogsToRender);
}

// Function to handle toggling a dog's status
async function toggleDogStatus(dogId) {
  try {
    const dog = allDogs.find((d) => d.id === dogId);
    const newStatus = !dog.isGoodDog;

    const response = await fetch(`${baseUrl}/${dogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGoodDog: newStatus }),
    });

    const updatedDog = await response.json();
    dog.isGoodDog = updatedDog.isGoodDog; // update current dog in the array
    const dogsToRender = filterDogs(allDogs); //Get dogs after changing status
    renderDogBar(dogsToRender);
    renderDogs(dogsToRender);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchDataAndRender);
goodDogFilter.addEventListener("click", toggleFilter);

dogiInfo.addEventListener("click", (event) => {
  if (event.target.classList.contains("change-dog-status")) {
    const dogId = event.target.closest(".dog-card").dataset.id;
    toggleDogStatus(dogId);
  }
});
