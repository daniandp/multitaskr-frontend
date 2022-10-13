let params = new URLSearchParams(location.search);

/* Form & Inputs */
let form = document.querySelector('#pokemon-search')
let count_input = document.querySelector('input[name=count]')
let offset_input = document.querySelector('input[name=offset]')
let limit_input = document.querySelector('input[name=limit]')

offset_input.value = params.get('offset')
limit_input.value = params.get('limit')

/* Buttons */
let previous_button = document.querySelector('#pokemon-previous')
let next_button = document.querySelector('#pokemon-next')

/* Request */
let http = new XMLHttpRequest();
let url = `https://pokeapi.co/api/v2/pokemon?offset=${params.get('offset')}&limit=${params.get('limit')}`;

/* Functions */
function onSearch(pagination = 1, limitation = null) {
    let submit = false
    let offset = parseInt(params.get('offset')); 
    let limit = limitation ? limitation : parseInt(params.get('limit')); 
    let count = parseInt(count_input.value); 

    if (pagination > 0 && offset + limit < count) {
        offset += limit
        submit = true
    } else if (pagination < 0 && offset > 0) {
        offset -= limit
        submit = true
    }

    offset_input.value = offset
    limit_input.value = limit

    submit && form.submit();
}

function disablePagination() {
    let offset = parseInt(params.get('offset'))
    let limit = parseInt(params.get('limit'))
    let count = parseInt(params.get('count'))

    if (offset <= 0) previous_button.disabled = true
    if (offset + limit >= count) next_button.disabled = true
}

http.onload = function() {
    let offset = parseInt(params.get('offset'))
    let response = JSON.parse(http.response)
    let table_body = document.querySelector('#pokemon-table tbody')
    count_input.value = response.count;
    table_body.innerHTML = "";

    response.results.forEach((pokemon, index) => {
        table_body.innerHTML += `
            <tr> \
                <th>${index + 1 + offset}</th> \
                <td>${pokemon.name}</td> \
                <td>${pokemon.url}</td> \
            </tr> \
        `
    });
}

http.open('GET', url);
http.send();
disablePagination()