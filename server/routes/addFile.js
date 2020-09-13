const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
var fs = require('fs');

const addFile = (req,res) =>{
    console.log(req.body);
    fs.readFile(req.body.path, (err, data) => {
        if (err) res.status(500).send(err);
        console.log(data);
    });

}
  
    

module.exports={addFile}
    



    // fs.readFile(`image_path`, (err, data) => {
    //     if (err) res.status(500).send(err);
    //     let extensionName = path.extname(`banner.png`);
    //     let base64Image = new Buffer(data, 'binary').toString('base64');
    //     let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;

    //     // for converting it to formData
    //     let formData = new FormData();
    //     formData.append("content_file", data)
        
    //     // for calling remote REST API
    //     Request.post({
    //         "headers": { "token": "my_token" },
    //         "url": "api_url",
    //         "body": formData
    //     }, (error, response, body) => {
    //         if (error) {
    //             return console.log(error);
    //         }
    //         let result = JSON.parse(body)
    //         res.send("image_url: " + result.url)
    //     });
    // })



    // var bData = fs.readFileSync(__dirname + 'FilePath');
    // var db = getConnection();
    // db.run('INSERT INTO Acompañante (Poliza) VALUES (?)', bData, function(err){
    //     if (err) throw err;
    // });


