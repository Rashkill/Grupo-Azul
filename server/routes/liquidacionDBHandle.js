const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addLiq = (req,res,next) =>{
    let db = getConnection();
    let sql = `INSERT INTO Liquidacion(IdBeneficiario,FechaEmision,Desde,Hasta) VALUES(?,?,?,?)`;

    // insert one row into the langs table
    db.run(sql,
      req.body.IdBeneficiario,
      req.body.FechaEmision,
      req.body.Desde,
      req.body.Hasta,
      function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Liquidacion cargada con exito");
      console.log("Liquidacion cargada con exito");
    });

    // close the database connection
    // db.close();
}

const getLiq = (req,res,next) =>{
  let whereId = req.params.whereId ? `WHERE Id${req.params.whereId}` : "";
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Liquidacion ${whereId} ORDER BY Id ${limitOffset}`;

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

const rangoLiq = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let rango = req.params.desde && req.params.hasta ? `WHERE 
    (
      Desde LIKE '%${req.params.desde}%' OR (Desde > '${req.params.desde}' AND Desde < '${req.params.hasta}')
      AND
      Hasta LIKE '%${req.params.hasta}%' OR (Hasta < '${req.params.hasta}' AND Hasta > '${req.params.desde}')
    )` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Liquidacion ${rango}`;

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

const getLiqOnly = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Liquidacion WHERE Id=`+id;
  db.all(sql, [], (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      console.log(row);
      res.json(row);
  });
}

const updLiq = (req,res,next) =>{
  let db = getConnection();
  let sql = `UPDATE Liquidacion SET IdBeneficiario=?,FechaEmision=?,Desde=?,Hasta=? WHERE Id=${req.params.id}`

  // insert one row into the langs table
  db.run(sql,
    req.body.IdBeneficiario,
    req.body.FechaEmision,
    req.body.Desde,
    req.body.Hasta,
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

const delLiq = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Liquidacion WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

module.exports = {addLiq, updLiq, getLiq, rangoLiq, getLiqOnly, delLiq}