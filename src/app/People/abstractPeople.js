class AbstractPeople {

    constructor(id) {
        this.id = id;
        if (this.constructor == AbstractPeople) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    async init(){
        //throw new Error('To be implemented');
    }

    getId() {
       return this.id;
    }

    getName() {
        return this.name;
    }

    getMass() {
        return this.mass;
    }

    getHeight() {
        return this.height;
    }

    getHomeworldName() {
        return this.homeworldName;
    }

    getHomeworlId() {
        return this.homeworlId;
    }

    getWeightOnPlanet(planetId){
        throw new Error('To be implemented');
    }

    setName(name) {
        this.name = name;
    }

    setMass(mass) {
        this.mass = mass;
    }

    setHeight(height) {
        this.height = height;
    }

    setHomeworldName(homeworldName) {
        this.homeworldName = homeworldName;
    }

    setHomeworlId(homeworlId) {
        this.homeworlId = homeworlId;
    }
}

module.exports = AbstractPeople;