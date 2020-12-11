const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addBenef = (req,res) =>{
    // console.log(req.body.data);
    let db = getConnection();
    let sql = `INSERT INTO Beneficiario(Nombre,Apellido,DNI,CUIL,FechaNacimiento,Domicilio,Localidad,CodigoPostal,Email,Telefono,Enfermedades,FichaInicial,IdCoordinador,Latitud,Longitud)` + 
    ` VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;   
    
    db.run(sql, 
      req.body.Nombre,
      req.body.Apellido,
      req.body.DNI,
      req.body.CUIL,
      req.body.FechaNacimiento,
      req.body.Domicilio,
      req.body.Localidad,
      req.body.CodigoPostal,
      req.body.Email,
      req.body.Telefono,
      req.body.Enfermedades,
      req.file ? req.file.buffer : null,
      req.body.IdCoordinador,
      req.body.Latitud,
      req.body.Longitud,
      function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Beneficiario Cargado con exito");
      console.log("Beneficiario Cargado con Exito");
    });

    // close the database connection
    // db.close();
}

const updBenef = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE Beneficiario SET Nombre=?,Apellido=?,DNI=?,CUIL=?,FechaNacimiento=?,Domicilio=?,Localidad=?,CodigoPostal=?,Email=?,Telefono=?,Enfermedades=?,FichaInicial=?,IdCoordinador=?,Latitud=?,Longitud=? WHERE id=?`; 

  //console.log(req.body.FichaInicial)
  // insert one row into the langs table
  db.run(sql, 
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.FechaNacimiento,
    req.body.Domicilio,
    req.body.Localidad,
    req.body.CodigoPostal,
    req.body.Email,
    req.body.Telefono,
    req.body.Enfermedades,
    req.file ? req.file.buffer : null,
    req.body.IdCoordinador,
    req.body.Latitud,
    req.body.Longitud,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Beneficiario " + req.params.id + " actualizado con exito");
      console.log("Beneficiario " + req.params.id + " actualizado con exito");
  });

}

const updBenefSeg = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE Beneficiario SET Seguimientos=? WHERE id=?`; 

  const seguimientos = Buffer.from(JSON.stringify(req.body));

  // insert one row into the langs table
  db.run(sql, 
    seguimientos,
    req.params.id,
    function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("Beneficiario " + req.params.id + " actualizado con exito");
      console.log("Beneficiario " + req.params.id + " actualizado con exito");
  });

}

const getBenef = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Beneficiario ORDER BY Id ${limitOffset}`;
  
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

const getBenefOnly = (req, res) => {
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Beneficiario WHERE id=`+req.params.id;
  db.all(sql, (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      //console.log(row);
      res.json(row);
  });
}

const delBenef = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Beneficiario WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

/*--- NOTAS BENEFICIARIOS ---*/

const addNotaBenef = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO NotaBeneficiario(IdBeneficiario,Fecha,Archivo,NombreArchivo) VALUES(?,?,?,?)`; 

  // insert one row into the langs table
  db.run(sql,
    req.body.IdBeneficiario,
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

const getNotaBenef = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM NotaBeneficiario WHERE Id=${req.params.id}`;
  
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

const getNotasBenef = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let limitOffset = req.params.limit ? `LIMIT ${req.params.limit} OFFSET ${req.params.offset ? req.params.offset : 0}` : "";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM NotaBeneficiario WHERE IdBeneficiario=${req.params.idbenef} ORDER BY Id ${limitOffset}`;
  
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

const updNotaBenef = (req,res) =>{

  let db = getConnection();
  let sql = `UPDATE NotaBeneficiario SET Fecha=?,Archivo=?,NombreArchivo=? WHERE id=?`; 

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

const delNotaBenef = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM NotaBeneficiario WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}
module.exports={addBenef, getBenef, getBenefOnly, updBenef, updBenefSeg, delBenef, addNotaBenef, getNotaBenef, getNotasBenef, updNotaBenef, delNotaBenef}