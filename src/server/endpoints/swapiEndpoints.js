const swagger = require("../swagger");

const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
}

const applySwapiEndpoints = (server, app) => {

    swagger(server);

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        try {
            let idPeople = req.params.id;
            const data = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${idPeople}`, 'GET', null, false);
            if(data.detail && data.detail === "Not found") {
                res.status(404).json(data);
            } else {
                let newPerson = await app.people.peopleFactory(idPeople,'');
                let homeworld = await app.swapiFunctions.genericRequest(data.homeworld, 'GET',null, false);
                    newPerson.setHomeworldName(homeworld.name);
                    newPerson.setName(data.name);
                    newPerson.setMass(data.mass);
                    newPerson.setHeight(data.height);
                    newPerson.setHomeworlId(app.helpers.getPlanetId(data.homeworld));
                    await app.db.insertDataPeopleDB(newPerson);
                res.status(200).json(newPerson);
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
                response.name = data.name;
                response.gravity = app.helpers.getGravity(data.gravity);
                await app.db.insertDataPlanetDB(response);
                res.status(200).json(response);
            }
        } catch(err) {
            res.status(500).json({'detail': `General error  on query ${req.url} (reason) ${err.message}`});
        }
    });
    /**
     * @swagger
     * /hfswapi/getWeightOnPlanetRandom:
     *   get:
     *     description: Get two random dates [Peopleid and planetid] and 
     *     responses:
     *       200:
     *         description: Success weight
     *      501:
     *          description: Custom rule because the person has the same planet id of the random planet id generated
     *       500:
     *         description: Server error inside try catch
    */
    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            let randomUser = Math.round(Math.random()*83);
            let randomPlanet = Math.round(Math.random()*60);

            const infoPeople = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${randomUser}`, 'GET', null, false);
            if(parseInt(app.helpers.getPlanetId(infoPeople.homeworld)) === randomPlanet) {
                res.send(501).json({'detail':`You cannot calculate the mass because is the same planet of the ${data.name}`});
            } else if(infoPeople.mass !== 'unknown') {
                const infoPlanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${randomPlanet}`, 'GET', null, false);
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
        const data = await app.db.getLogs();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;