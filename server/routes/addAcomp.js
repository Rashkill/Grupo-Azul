const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addAcomp = (req,res,next) =>{
    // console.log(req.body.data);
    let db = getConnection();
    let sql = `INSERT INTO Acompañante(Nombre,Apellido,Dni,Telefono,Domicilio,Email,Banco,Cvu,ValorHora) VALUES("
      ${req.body.nombre}","
      ${req.body.apellido}","
      ${req.body.dni}","
      ${req.body.telefono}","
      ${req.body.domicilio}","
      ${req.body.email}","
      ${req.body.banco}","
      ${req.body.cvu}","
      ${req.body.valorHora}
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

module.exports={addAcomp}
