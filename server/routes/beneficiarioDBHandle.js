const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addBenef = (req,res) =>{
    // console.log(req.body.data);
    let db = getConnection();
    let sql = `INSERT INTO Beneficiario(Nombre,Apellido,DNI,CUIL,FechaNacimiento,Domicilio,Localidad,CodigoPostal,Email,Telefono,Enfermedades,FichaInicial,IdCoordinador)` + 
    ` VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;   
    
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
      req.file.buffer,
      req.body.IdCoordinador,
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
  let sql = `UPDATE Beneficiario SET Nombre=?,Apellido=?,DNI=?,CUIL=?,FechaNacimiento=?,Domicilio=?,Localidad=?,CodigoPostal=?,Email=?,Telefono=?,Enfermedades=?,FichaInicial=?,IdCoordinador=? WHERE id=?`; 

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
    req.file.buffer,
    req.body.IdCoordinador,
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

module.exports={addBenef, getBenef, getBenefOnly, updBenef, delBenef}