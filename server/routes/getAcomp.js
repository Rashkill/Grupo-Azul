const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database


const getAcomp = (req,res,next) =>{
    let db = getConnection();
    let sql = `SELECT * FROM acompañante
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

module.exports={getAcomp}
