// Listen for messages from the main thread
self.onmessage = function(event) {
    const pokemonName = event.data; // The Pokémon name sent by the main thread

    // Fetching the data and handling promises inside the worker
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();  // Return the parsed JSON data as a promise
        })
        .then(data => {
            // Send the data back to the main thread
            self.postMessage(data);
        })
        .catch(error => {
            // Send an error back to the main thread if the promise fails
            self.postMessage({ error: error.message });
        });
};