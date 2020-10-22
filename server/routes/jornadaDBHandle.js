const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addJornada = (req,res,next) =>{
    let db = getConnection();
    let sql = `INSERT INTO Jornada(IdBeneficiario,IdAcompañante,FechaIngreso,FechaEgreso,CantHoras) VALUES(?,?,?,?,?)`;

    // insert one row into the langs table
    db.run(sql,
      req.body.IdBeneficiario,
      req.body.IdAcompañante,
      req.body.FechaIngreso,
      req.body.FechaEgreso, 
      req.body.CantHoras,
      function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Jornada cargada con exito");
      console.log("Jornada cargada con exito");
    });

    // close the database connection
    // db.close();
}

const getJornadas = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
    let sql = `SELECT ${fields} FROM Jornada
         ORDER BY id`;
  var arrayData = [];
  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      rows.forEach((row) => {
          // console.log(row);
          arrayData.push(row);
      });
      res.json(rows)
  });
}

const getJor4Liq = (req,res,next) => {
  let idbenef = req.params.idbenef
  let desde = req.params.desde
  let hasta = req.params.hasta
  // let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT Id, IdAcompañante, CantHoras FROM Jornada WHERE IdBeneficiario = "${idbenef}" 
    AND 
    (
      FechaIngreso LIKE '%${desde}%' OR (FechaIngreso > '${desde}' AND FechaIngreso < '${hasta}')
      AND
      FechaEgreso LIKE '%${hasta}%' OR (FechaEgreso < '${hasta}' AND FechaEgreso > '${desde}')
    )
  `;
    console.log(sql)
  var arrayData = [];
  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      rows.forEach((row) => {
          // console.log(row);
          arrayData.push(row);
      });
      res.json(rows)
  });
}

const getJornadaOnly = (req,res,next) =>{
  var id = req.params.id;
  // delete a row based on id
  let db = getConnection();
  let sql = `GET FROM Jornada WHERE id="${id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
  });
}


const updJornada = (req,res,next) =>{
  let db = getConnection();
  let sql = `UPDATE Jornada SET IdBeneficiario=?, IdAcompañante=?, FechaIngreso=?, FechaEgreso=?,CantHoras=? WHERE Id=${req.params.id}`

  // insert one row into the langs table
  db.run(sql,
    req.body.IdBeneficiario,
      req.body.IdAcompañante,
      req.body.FechaIngreso,
      req.body.FechaEgreso, 
      req.body.CantHoras,
    function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("Exito");
    console.log("Exito");
  });

  // close the database connection
  // db.close();
}

const delJornada = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Jornada WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

module.exports = {addJornada, updJornada, getJornadas, getJornadaOnly, delJornada, getJor4Liq}