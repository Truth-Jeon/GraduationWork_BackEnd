const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mysql = require('mysql');
const { query } = require('express');
const db = mysql.createPool({
    host:'localhost',
    user:'graduation',
    password:'graduate_201931042',
    database:'graduationwork',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Guestbook (ASP에서 List.aspx) */
app.post('/guestbook', (req,res) => {
    const sqlSelect = "SELECT id, name, pw, title, content, date_format(date, '%Y-%m-%d %H:%m:%s') date, hit FROM board ORDER BY id DESC";
    db.query(sqlSelect, (err, result) => {
        if(err) console.log(err);
        res.send(result);
    });
});

/* Read (ASP에서 Show.aspx) */
app.get('/read/:id', (req,res) => {
    const idx = req.params.id;
    console.log(idx); 
    const sqlRead = "SELECT id, name, pw, title, content, date_format(date, '%Y-%m-%d %H:%m:%s') date, hit FROM board WHERE id = ?";
    db.query(sqlRead, [idx], (err, result) => {
        if (err) console.log(err);
        else {
            const hitUpdate = "UPDATE board SET hit = hit + 1 WHERE id = ?";
            db.query(hitUpdate, [idx], (err2, result2) => {
                if(err2) console.log(err2);
                else console.log(result2);
            })
        }
        res.send(result);
    });
});

/* Writing (ASP에서 AddPhoto.aspx) */
app.post('/writing', (req,res) => {
    const name = req.body.name;
    const pw = req.body.pw;
    const title = req.body.title;
    const content = req.body.content;
    const date = req.body.date;
    const hit = req.body.hit;

    const sqlInsert = "INSERT INTO board (name, pw, title, content, date) VALUES (?,?,?,?,default)"
    db.query(sqlInsert, [name, pw, title, content, date, hit], (err, result) => {
        if(err) console.log(err);
        res.send(result);
    })
});

/* UpdateGet */
app.get('/update/:id', (req,res) => {
    const idx = req.params.id;
    console.log(idx);
    const sqlUG = "SELECT id, name, pw, title, content, date_format(date, '%Y-%m-%d %H:%m:%s') date, hit FROM board WHERE id = ?";
    db.query(sqlUG, [idx], (err,result) => {
        if(err) console.log(err);
        res.send(result);
    })
})

/* Update (ASP에서 Edit.aspx) */
app.put('/update/:id', (req, res) => {
    const name = req.body.name;
    const pw = req.body.pw;
    const title = req.body.title;
    const content = req.body.content;
    const idx = req.body.id;
    const sqlUpdate = "UPDATE board SET name = ?, pw = ?, title = ?, content = ?  WHERE id = ?;";

    db.query(sqlUpdate, [name, pw, title, content, idx], (err, result) => {
        if(err) console.log(err);
        res.send(result);
    });
});


/* Delete (ASP에서 Delete.aspx) */
app.delete('/delete/:id', (req, res) => {
    const idx = req.params.id;
    const sqlDelete = "DELETE FROM board WHERE id = ?;";

    db.query(sqlDelete, idx, (err, result) => {
        if(err) console.log(err);
        res.send(result);
    });
});


/* PasswordCheck (ASP에서 CheckPassword.aspx) */
app.post('/passwordcheck/:id', (req, res) => {
    const idx = req.body.id;
    const password = req.body.pw;
    const sqlUpdate = "SELECT pw FROM board WHERE id = ? AND pw =?;";

    db.query(sqlUpdate, [idx, password], (err, result) => {
        if(err) res.send({err : err});
        else {
            if (result.length > 0) {
                res.redirect("/update/:id");
            } else {
                res.send({message: "비밀번호가 틀렸습니다."});
            }
        }
    });
});




app.listen('3001', () => {
    console.log("running on port 3001");
})