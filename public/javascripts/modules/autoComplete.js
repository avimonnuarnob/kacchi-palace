function autoComplete(input, latInput, lngInput) {
    if (!input) return

    var placesAutocomplete = places({
        appId: 'plJBGYBK32UT',
        apiKey: 'a5713d4be0b1cdd59f7891d0cd84ab3b',
        container: input
    });

    placesAutocomplete.on('change', function(e) {
        input.value = e.suggestion.value
        latInput.value = e.suggestion.latlng.lat
        lngInput.value = e.suggestion.latlng.lng
    });
    
    //const dropdown = new google.maps.places.Autocomplete(input)
    // dropdown.addListener('place_changed', () => {
    //     const place = dropdown.getPlace()
    // }) 

    input.on('keydown', (e) => {
        if (e.keyCode === 13) e.preventDefault()
    })
}

export default autoComplete