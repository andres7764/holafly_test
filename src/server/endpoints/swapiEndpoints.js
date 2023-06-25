
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
        
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
       
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;