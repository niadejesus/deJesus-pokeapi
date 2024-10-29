self.onmessage = function(event) {
    const pokemonName = event.data; // The Pokémon name that is inputted into the program

    // Fetching the data and handling promises inside the worker
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`) //fetch function is done in order to get resources from the poke api
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();  // json() function is used to turn the text from the pokemon name into a value for the program to check for.
        })
        .then(data => {
            self.postMessage(data);
        })
        .catch(error => {
            // If there's an error, these lines of code log it in the console.
            self.postMessage({ error: error.message });
        });
};

/*Web workers are important because it allows for a script to be ran
in the background. The worker thread allows for tasks to be performed
without any interference with what the user can interact with.
For programs where you don't want boxes to be grayed out while the user is
waiting for a request to go through, this can be used.*/