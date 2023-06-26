'use strict';

const Sequelize = require('sequelize');
const models = require('./models');

let sequelize;

sequelize = new Sequelize("sqlite::memory:", {
  logging: false //console.log
});

const db = {
	Sequelize,
	sequelize,
};

for (const modelInit of models) {
	const model = modelInit(db.sequelize, db.Sequelize.DataTypes);
	db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


const initDB = async () => {
  await db.swPeople.sync({ force: true });
  await db.swPlanet.sync({ force: true });
  await db.logging.sync({ force: true });
}

const populateDB = async () => {
  await db.swPlanet.bulkCreate([
    {
      name: "Tatooine",
      gravity: 1.0
    }
  ]);
  await db.swPeople.bulkCreate([
    {
      name: "Luke Skywalker",
      height: 172,
      mass: 77,
      homeworld_name: "Tatooine",
      homeworld_id: "/planets/1"
    }
  ]);
}

const deleteDB = async () => {
  await db.swPeople.drop();
  await db.swPlanet.drop();
  await db.logging.drop();
}

const watchDB = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true,
  });

  const people = await db.swPeople.findAll({
    raw: true,
  });

  console.log("============= swPlanet =============");
  console.table(planets);
  console.log("\n");
  console.log("============= swPeople =============");
  console.table(people);
}

const insertDataPlanetDB = async (dataToInsert) => {
  await db.swPlanet.create(dataToInsert)
}

const insertDataPeopleDB = async (dataToInsert) => {
  await db.swPeople.create(dataToInsert);
}

const insertLogDB = async (logRow) => {
  await db.logging.create(logRow);
}

const getLogs = async () => {
  return await db.logging.findAll({});
}

const findPeopleByIdDB = async (id) => {
  const value = await db.swPeople.findOne({
    attributes: ["id","name","mass","height","homeworld_name","homeworld_id"],
    where: {"id": id}
  })
  return value;
}

db.insertDataPeopleDB = insertDataPeopleDB;
db.insertDataPlanetDB = insertDataPlanetDB;
db.findPeopleByIdDB = findPeopleByIdDB;
db.insertLogDB = insertLogDB;
db.populateDB = populateDB;
db.deleteDB = deleteDB;
db.watchDB = watchDB;
db.getLogs = getLogs;
db.initDB = initDB;

module.exports = db;
