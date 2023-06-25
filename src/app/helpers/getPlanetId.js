

const getPlanetId = (urlPlanet) => {
    let deconstructUrl = urlPlanet.split("/");
    return deconstructUrl[deconstructUrl.length-2];
}

module.exports = getPlanetId;