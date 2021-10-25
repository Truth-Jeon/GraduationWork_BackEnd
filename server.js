const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mysql = require('mysql');
const db = mysql.createPool({
    host:'localhost',
    user:'graduation',
    password:'graduate_201931042',
    database:'graduationwork',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/guestbook', (req,res) => {
    const idx = req.body.id;

    const sqlSelect = "SELECT * FROM board ORDER BY id DESC";
    if(idx === undefined){
        db.query(sqlSelect, (err, result) => {
            res.send(result);
        });
    } else {
        db.query(sqlSelect, (err, result) => {
            const sqlRead = "SELECT * FROM board WHERE id=?";
            if(error){
                throw error;
            }
            db.query(sqlRead, [idx], (err2, results) => {
                if(err2){
                    throw err2;
                }
                console.log(results[0].title);
                res.send(results);
            })
        })
    }
});

// app.get('/guestbook', (req,res) => {
//     const sqlSelect = "SELECT * FROM board ORDER BY id DESC";
//     db.query(sqlSelect, (err, result) => {
//         res.send(result);
//     });
// });

app.post('/writing', (req,res) => {
    const name = req.body.name;
    const pw = req.body.pw;
    const title = req.body.title;
    const content = req.body.content;
    const date = req.body.date;
    const hit = req.body.hit;

    const sqlInsert = "INSERT INTO board (name, pw, title, content, date, hit) VALUES (?,?,?,?,default,0)"
    db.query(sqlInsert, [name, pw, title, content, date, hit], (err, result) => {
        console.log(result);
    })
})

// app.delete('/delete', (req, res) => {
//     const idx = req.body.id;
//     const deletePassword = req.body.pw;
//     const sqlDelete = "DELETE FROM board WHERE id = ? and pw = ?;";

//     db.query(sqlDelete, [idx, deletePassword], (err, result) => {
//         if(err) console.log(err);
//         if(result.affectedRows == 0)
//         {
//             res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>")
//         }
//         else
//         {
//             res.redirect('/guestbook');
//         }
//     });
// });

app.delete('/delete/:id', (req, res) => {
    const idx = req.params.id;
    const sqlDelete = "DELETE FROM board WHERE id = ?;";

    db.query(sqlDelete, idx, (err, result) => {
        if(err) console.log(err);
    });
});

app.put('/update', (req, res) => {
    const name = req.body.name;
    const pw = req.body.pw;
    const title = req.body.title;
    const content = req.body.content;
    const idx = req.body.id;
    const sqlUpdate = "UPDATE board SET name = ?, pw = ?, title = ?, content = ?  WHERE id = ?;";

    db.query(sqlUpdate, [name, pw, title, content, idx], (err, result) => {
        if(err) console.log(err);
    });
});

app.listen('3001', () => {
    console.log("running on port 3001");
})

// const http = require('http').createServer(app);
// http.listen(PORT, () => {
//     console.log(`Server run : http://localhost:${PORT}/`);
// });

// app.use(express.static(path.join(__dirname, '../graduation_work/build')))

// app.get('/', function(req, res){
//     res.sendFile(path.join(__dirname, '../graduation_work/build/index.html'))
// })

// app.get('*', function(req, res){
//     res.sendFile(path.join(__dirname, '../graduation_work/build/index.html'))
// })