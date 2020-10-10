const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addJornada = (req,res,next) =>{
    let db = getConnection();
    let sql = `INSERT INTO Jornada(IdBeneficiario,IdAcompañante,CantHoras,FechaIngreso,FechaEgreso) VALUES(
      ${req.body.agdID},
      ${req.body.ucdID},
      ${req.body.horas},
      "${req.body.ingreso}",
      "${req.body.egreso}"
      )`;

    // insert one row into the langs table
    db.run(sql, function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("succed");
      console.log("succed");
    });

    // close the database connection
    // db.close();
}

const updJornada = (req,res,next) =>{
  let db = getConnection();
  let sql = `UPDATE Jornada SET IdBeneficiario=${req.body.agdID}, IdAcompañante=${req.body.ucdID}, CantHoras=${req.body.horas}, FechaIngreso=?, FechaEgreso=? WHERE Id=${req.params.id}`

  console.log(sql);

  // insert one row into the langs table
  db.run(sql,req.body.ingreso, req.body.egreso ,function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("succed");
    console.log("succed");
  });

  // close the database connection
  // db.close();
}

module.exports = {addJornada, updJornada}