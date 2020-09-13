const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addAcomp = (req,res,next) =>{
    console.log(req.body);
    let db = getConnection();
    let sql = `INSERT INTO Acompañante(Nombre,PrecioHora) VALUES("${req.body.data[0]}","${req.body.data[1]}")`;
    // insert one row into the langs table
    db.run(sql, function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json("succed");
    });
    // close the database connection
    // db.close();
}

module.exports={addAcomp}
