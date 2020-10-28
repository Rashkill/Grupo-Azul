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

const getCoord = (req,res,next) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
  let sql = `SELECT ${fields} FROM Coordinador
         ORDER BY Id`;
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

module.exports={addCoord, updCoord, getCoord, getCoordOnly, delCoord}