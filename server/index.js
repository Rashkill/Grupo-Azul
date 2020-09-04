const express = require('express');
const cors = require('cors');
const port = 4000
const {getAcomp} = require('./routes/getAcomp');
const {getConnection} = require('./db/conn');
const app = express()
app.use(express.json());
app.use(cors());


app.get('/acomp', async (req, res, next) => {
    // const acomp = await getAcomp(req, res, next);
    // console.log("acomp: "+ acomp);
    // res.json(acomp);
    let db = getConnection();
    let sql = `SELECT * FROM acompañante
           ORDER BY id`;
    var arrayData = [];
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        rows.forEach((row) => {
            console.log(row);
            arrayData.push(row);
        });
        res.json(rows)
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})