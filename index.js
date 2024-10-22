// Function to create a Promise-based Web Worker interaction
function fetchPokemonWithWorker() {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

    // Create a promise that interacts with the Web Worker
    return new Promise((resolve, reject) => {
        const worker = new Worker('worker.js');
        
        // Send the Pokémon name to the Web Worker
        worker.postMessage(pokemonName);

        // Listen for messages from the worker (success case)
        worker.onmessage = function(event) {
            const data = event.data;

            if (data.error) {
                reject(data.error);  // Reject the promise if there's an error
            } else {
                resolve(data);  // Resolve the promise with the fetched data
            }
        };

        // Handle worker errors (fail case)
        worker.onerror = function(error) {
            reject("Worker error: " + error.message);
        };
    });
}

// Function to call the promise-based Web Worker and handle the result
function fetchAndDisplayPokemon() {
    fetchPokemonWithWorker()
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