const AbstractPeople = require("./abstractPeople");

class CommonPeople extends AbstractPeople{
    
    constructor(id){
        super(id);
        this.id = id;
        //throw new Error("To be implemented");
    }
}

module.exports = CommonPeople;