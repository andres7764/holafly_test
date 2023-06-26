const getGravity = (gravityValue) => {
    let base = 9.8;
    let gravityOfPlanet = (gravityValue === 'N/A')?0:gravityValue.split(" ")[0];    
    return base * gravityOfPlanet;
}


module.exports = getGravity;