const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');

const addCoord = (req,res) =>{
  // console.log(req.body.data);
  let db = getConnection();
  let sql = `INSERT INTO Coordinador(Nombre,Apellido,DNI,CUIL,EntidadBancaria,CBU,Domicilio,ValorMes,ConstanciaAFIP,CV)` + 
  ` VALUES(?,?,?,?,?,?,?,?,?,?)`;
  let ConstanciaAFIP = req.files.ConstanciaAFIP[0].buffer
  let CV = req.files.CV[0].buffer;

  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    //req.body.Email,
    //req.body.Telefono,
    req.body.ValorMes,
    ConstanciaAFIP,
    CV, 
      function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Coordinador Cargado con exito");
      console.log("Coordinador Cargado con Exito");
  });
}

const updCoord = (req,res) =>{
  let db = getConnection();
  let sql = `UPDATE Coordinador SET Nombre=?,Apellido=?,DNI=?,CUIL=?,EntidadBancaria=?,CBU=?,Domicilio=?,ValorMes=?,ConstanciaAFIP=?,CV=? WHERE Id=?`;

  let ConstanciaAFIP = req.files.ConstanciaAFIP[0].buffer
  let CV = req.files.CV[0].buffer;

  console.log(req.body);

  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    //req.body.Email,
    //req.body.Telefono,
    req.body.ValorMes,
    ConstanciaAFIP,
    CV,
    req.params.id,
      function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Coordinador Actualizado con exito");
      console.log("Coordinador Actualizado con Exito");
  });
}

const getCoord = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Coordinador ORDER BY Id ${limitOffset}`;
  
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
  // close the database connection
  // db.close();
}

const getCoordOnly = (req, res) => {
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Coordinador WHERE Id=`+req.params.id;
  db.all(sql, [], (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      //console.log(row);
      res.json(row);
  });
}

const delCoord = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Coordinador WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

/*--- MONOTRIBUTOS ---*/

const addMonoCoord = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO PagoMonotributoCoordinador(IdCoordinador,Fecha,Archivo,NombreArchivo) VALUES(?,?,?,?)`; 

  // insert one row into the langs table
  db.run(sql,
    req.body.IdCoordinador,
    req.body.Fecha,
    req.file.buffer,
    req.body.NombreArchivo,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Nota añadida con exito");
      console.log("Nota añadida con exito");
  });
}

const getMonoCoordOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM PagoMonotributoCoordinador WHERE Id=${req.params.id}`;
  
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

const getMonoCoord = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM PagoMonotributoCoordinador WHERE IdCoordinador=${req.params.idcoord} ORDER BY Id ${limitOffset}`;
  
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

const updMonoCoord = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE PagoMonotributoCoordinador SET Fecha=?,Archivo=?,NombreArchivo=? WHERE id=?`; 

  // insert one row into the langs table
  db.run(sql, 
    req.body.Fecha,
    req.file.buffer,
    req.body.NombreArchivo,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Nota " + req.params.id + " actualizada con exito");
      console.log("Nota " + req.params.id + " actualizada con exito");
  });
}

const delMonoCoord = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM PagoMonotributoCoordinador WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

/*--- CONTRATOS ---*/

const addConCoord = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO ContratoCoordinador(IdCoordinador,Fecha,Archivo,NombreArchivo) VALUES(?,?,?,?)`; 

  // insert one row into the langs table
  db.run(sql,
    req.body.IdCoordinador,
    req.body.Fecha,
    req.file.buffer,
    req.body.NombreArchivo,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Nota añadida con exito");
      console.log("Nota añadida con exito");
  });
}

const getConCoordOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM ContratoCoordinador WHERE Id=${req.params.id}`;
  
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

const getConCoord = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM ContratoCoordinador WHERE IdCoordinador=${req.params.idcoord} ORDER BY Id ${limitOffset}`;
  
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

const updConCoord = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE ContratoCoordinador SET Fecha=?,Archivo=?,NombreArchivo=? WHERE id=?`; 

  // insert one row into the langs table
  db.run(sql, 
    req.body.Fecha,
    req.file.buffer,
    req.body.NombreArchivo,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Nota " + req.params.id + " actualizada con exito");
      console.log("Nota " + req.params.id + " actualizada con exito");
  });
}

const delConCoord = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM ContratoCoordinador WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}
module.exports={addCoord, updCoord, getCoord, getCoordOnly, delCoord, addMonoCoord, getMonoCoord, getMonoCoordOnly, updMonoCoord, delMonoCoord, addConCoord, getConCoord, getConCoordOnly, updConCoord, delConCoord}