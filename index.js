// Function to fetch Pokemon using Promise.any and Promise.all
function fetchPokemonWithWorker(pokemonNames) {
    const promises = pokemonNames.map(name => {
        return new Promise((resolve, reject) => {
            const worker = new Worker('worker.js');

            // Sends the Pokémon name to the web worker
            worker.postMessage(name);

            // Listen for messages from the worker
            worker.onmessage = function(event) {
                const data = event.data;

                if (data.error) {
                    reject(data.error);  // Reject the promise if there's an error
                } else {
                    resolve(data);  // Resolve the promise with the fetched data
                }
            };

            // Handle worker errors
            worker.onerror = function(error) {
                reject("Worker error: " + error.message);
            };
        });
    });

    // Using Promise.any to run promises and returns the first promise that's fulfilled from a list of promises
    return Promise.any(promises);
}
// Function to call the promise-based Web Worker and handle the result
function fetchAndDisplayPokemon() {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

    // Fetch data for the input name and an alternative name
    const pokemonNames = [pokemonName]; // Add more Pokémon names as needed

    fetchPokemonWithWorker(pokemonNames)
        .then(data => {
            const pokemonSprite = data.sprites.front_default;
            const imgElement = document.getElementById("pokemonSprite");
            
            // Display the Pokemon sprite
            imgElement.src = pokemonSprite;
            imgElement.style.display = "block";
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Function to fetch multiple Pokemon using Promise.all
function fetchAllPokemons() {
    const pokemonNames = ["pikachu", "bulbasaur", "charmander"]; // Example Pokémon names

    const promises = pokemonNames.map(name => fetchPokemonWithWorker([name]));

    Promise.all(promises)
        .then(dataArray => {
            dataArray.forEach(data => {
                const pokemonSprite = data.sprites.front_default;
                const imgElement = document.createElement("img");
                imgElement.src = pokemonSprite;
                imgElement.style.display = "block";
                document.body.appendChild(imgElement); // Append each Pokémon sprite to the body, if it's able to fetch it properly
            });
        })
        .catch(error => {
            console.error("Error fetching all Pokémon:", error);
        });
}
