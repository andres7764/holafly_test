
const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
}


const applySwapiEndpoints = (server, app) => {

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        try {
            let idPeople = req.params.id;
            let response = {};
            const data = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${idPeople}`, 'GET', null, false);
            console.log(data);
            if(data.detail && data.detail === "Not found") {
                res.status(404).json(data);
            } else {
                let homeworld = await app.swapiFunctions.genericRequest(data.homeworld, 'GET',null, false);
                response.homeworldName = homeworld.name;
                response.name = data.name;
                response.mass = data.mass;
                response.height = data.height;
                response.homeworldId = app.helpers.getPlanetId(data.homeworld);
                console.log(response);
                res.status(200).json(response);
            }
        } catch(err) {
            res.status(500).json({'data': `General error  on query ${req.url} (reason) ${err.message}`});
        }
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        try {
            let response = {};
            let idPlanet = req.params.id;
            const data = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${idPlanet}`, 'GET', null, true);
            if(data.detail && data.detail === "Not found") {
                res.status(404).json(data);
            } else {
                console.log(data);
                response.name = data.name;
                response.gravity = app.helpers.getGravity(data.gravity);
                res.status(200).json(response);
            }
        } catch(err) {
            res.status(500).json({'detail': `General error  on query ${req.url} (reason) ${err.message}`});
        }
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            console.log(req.url);
            let randomUser = Math.round(Math.random()*83);
            let randomPlanet = Math.round(Math.random()*60);

            const infoPeople = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${randomUser}`, 'GET', null, false);
            console.log(parseInt(app.helpers.getPlanetId(infoPeople.homeworld)), "randomdata",randomUser,randomPlanet);
            if(parseInt(app.helpers.getPlanetId(infoPeople.homeworld)) === randomPlanet) {
                res.send(501).json({'detail':`You cannot calculate the mass because is the same planet of the ${data.name}`});
            } else if(infoPeople.mass !== 'unknown') {
                const infoPlanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${randomPlanet}`, 'GET', null, false);
                console.log(parseFloat(app.helpers.getGravity(infoPlanet.gravity)),infoPeople,infoPlanet);
                let weight = parseFloat(app.helpers.getGravity(infoPlanet.gravity)) * parseInt(infoPeople.mass);
                res.status(200).json({'detail': `The mass of ${infoPeople.name} on ${infoPlanet.name} is ${weight}`});
            } else {
                res.status(400).json({'detail': `It's not possible get the mass of person because person ${infoPeople.name} doesn't mass`})
            }

        } catch(err) {
            res.status(500).json({'detail': `General error  on query ${req.url} (reason) ${err.message}`});
        }
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;