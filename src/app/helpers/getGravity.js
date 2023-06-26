const getGravity = (gravityValue) => {
    let base = 9.8;
    let comodinOptions = ['N/A','unknown'];
    let gravityOfPlanet = (comodinOptions.includes(gravityValue))?0:gravityValue.split(" ")[0];    
    return base * gravityOfPlanet;
}


module.exports = getGravity;