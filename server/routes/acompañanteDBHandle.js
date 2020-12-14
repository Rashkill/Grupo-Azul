const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO Acompañante(Nombre,Apellido,DNI,CUIL,EntidadBancaria,CBU,Domicilio,Localidad,CodigoPostal,Email,Telefono,ValorHora,NumeroPoliza,NombreSeguros,Latitud,Longitud,ConstanciaAFIP,CV)` + 
  ` VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 

  let ConstanciaAFIP = req.files.ConstanciaAFIP ? req.files.ConstanciaAFIP[0].buffer : null;
  let CV = req.files.CV > 0 ? req.files.CV[0].buffer : null;
  // insert one row into the langs table
  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    req.body.Localidad,
    req.body.CodigoPostal,
    req.body.Email,
    req.body.Telefono,
    req.body.ValorHora,
    req.body.NumeroPoliza,
    req.body.NombreSeguros,
    req.body.Latitud,
    req.body.Longitud,
    ConstanciaAFIP,
    CV,
    function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("Acompañante añadido");
    console.log("Acompañante añadido");
  });
}

const updAcomp = (req,res) =>{
  let db = getConnection();
  let sql = 'UPDATE Acompañante SET Nombre=?,Apellido=?,DNI=?,CUIL=?,EntidadBancaria=?,CBU=?,Domicilio=?,Localidad=?,CodigoPostal=?,Email=?,Telefono=?,ValorHora=?,NumeroPoliza=?,NombreSeguros=?,Latitud=?,Longitud=?,ConstanciaAFIP=?,CV=? WHERE Id=?'; 

  let ConstanciaAFIP = req.files.ConstanciaAFIP ? req.files.ConstanciaAFIP[0].buffer : null;
  let CV = req.files.CV > 0 ? req.files.CV[0].buffer : null;

  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    req.body.Localidad,
    req.body.CodigoPostal,
    req.body.Email,
    req.body.Telefono,
    req.body.ValorHora,
    req.body.NumeroPoliza,
    req.body.NombreSeguros,
    req.body.Latitud,
    req.body.Longitud,
    ConstanciaAFIP,
    CV, 
    req.params.id,
    function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("Acompañante Actualizado");
    console.log("Acompañante Actualizado");
  });
}

const getAcomp = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Acompañante ORDER BY Id ${limitOffset}`;
  
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

const getAcompOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
    let sql = `SELECT ${fields} FROM Acompañante WHERE id=`+req.params.id;

  db.all(sql, [], (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      res.json(row);
  });
}

const delAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Acompañante WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

/*--- MONOTRIBUTOS ---*/

const addMonoAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO PagoMonotributoAcompañante(IdAcompañante,Fecha,Archivo,NombreArchivo) VALUES(?,?,?,?)`; 

  // insert one row into the langs table
  db.run(sql,
    req.body.IdAcompañante,
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

const getMonoAcompOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM PagoMonotributoAcompañante WHERE Id=${req.params.id}`;
  
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

const getMonoAcomp = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM PagoMonotributoAcompañante WHERE IdAcompañante=${req.params.idacomp} ORDER BY Id ${limitOffset}`;
  
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

const updMonoAcomp = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE PagoMonotributoAcompañante SET Fecha=?,Archivo=?,NombreArchivo=? WHERE id=?`; 

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

const delMonoAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM PagoMonotributoAcompañante WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

/*--- CONTRATOS ---*/

const addConAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO ContratoAcompañante(IdAcompañante,Fecha,Archivo,NombreArchivo) VALUES(?,?,?,?)`; 

  // insert one row into the langs table
  db.run(sql,
    req.body.IdAcompañante,
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

const getConAcompOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM ContratoAcompañante WHERE Id=${req.params.id}`;
  
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

const getConAcomp = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM ContratoAcompañante WHERE IdAcompañante=${req.params.idacomp} ORDER BY Id ${limitOffset}`;
  
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

const updConAcomp = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE ContratoAcompañante SET Fecha=?,Archivo=?,NombreArchivo=? WHERE id=?`; 

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

const delConAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM ContratoAcompañante WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}
module.exports={addAcomp, updAcomp, getAcomp, getAcompOnly, delAcomp, addMonoAcomp, getMonoAcomp, getMonoAcompOnly, updMonoAcomp, delMonoAcomp, addConAcomp, getConAcomp, getConAcompOnly, updConAcomp, delConAcomp}
