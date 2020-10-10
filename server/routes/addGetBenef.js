const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addBenef = (req,res,next) =>{
    // console.log(req.body.data);
    let db = getConnection();
    let sql = `INSERT INTO Acompañante(Nombre,IdServicio,IdCoordinador) VALUES("
      ${req.body.nombre}","
      ${req.body.idservicio}","
      ${req.body.idcoordinador}
      ")`;
      // console.log(sql);
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

const getBenef = (req,res,next) =>{
  let db = getConnection();
  let sql = `SELECT * FROM beneficiario
         ORDER BY nombre`;
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
      res.json({
          "message":"success",
          "data":rows
      })
  });
  // close the database connection
  // db.close();
}

module.exports={addBenef},{getBenef}