let express = require('express')
let cors = require('cors')
const dotenv=require('dotenv')
let mysql = require('mysql')
let app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.listen(5000,()=>{
    console.log("server startes at port number 4000");
})


dotenv.config()

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:process.env.password,
    database:'Attendence'
})

app.get('/attendence-list',(req,res)=>{
    return new Promise(function(success,reject){
        connection.query(`select * from students `,function(err,rows){
            if (err) reject(err)
            else success(rows)
        })
    })
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send("<p>error in server</p>")
    })
})
app.get('/student-attendence',(req,res)=>{
    return new Promise(function(success,reject){
        connection.query(`select * from attendencelist `,function(err,rows){
            if (err) reject(err)
            else success(rows)
        })
    })
    .then((data)=>{
       
        res.send(data)
        
    })
    .catch((err)=>{
        res.send(err.message)
    })
})

app.post('/studentSignup',(req,res)=>{
    console.log(req.body);
    
    return new Promise(function(success,reject){
        connection.query(`INSERT INTO students (sname,rollno,password,mobile) values (?,?,?,?)`,[req.body.name,req.body.rollno,req.body.password,req.body.mobile],function(err,rows){
            if (err) reject(err)
            else success(rows)
        })
    })
    .then((data)=>{
        res.send(data)
        
    })
    .catch((err)=>{
        res.send(err.message)
    })
})
app.get('/search-attendence/:rollno', (req, res) => {
    const rollno = req.params.rollno;

    // Query to find attendance records for the given roll number
    const query = 'SELECT * FROM attendencelist WHERE rollNo = ?';

    connection.query(query, [rollno], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'No records found' });
        } else {
            res.json(results);
        }
    });
});

app.post('/save-attendence',(req,res)=>{
    return new Promise(function(success,reject){
        connection.query(`INSERT INTO attendenceList (rollNo,date,attendence,purpose) values (?,?,?,?)`,[req.body.rollno,req.body.date,req.body.attendence,req.body.purpose],function(err,rows){
            if (err) reject(err)
            else success(rows)
        })
    })
    .then((data)=>{
        res.send(data)
        
    })
    .catch((err)=>{
        res.send(err.message)
    })
})

app.post('/login',(req,res)=>{
    return new Promise(function(success,reject){
     
        connection.query(`SELECT * FROM students where rollno=? and password=?`,[req.body.rollno,req.body.password],function(err,rows){
            if (err) reject(err)
            else {
                if (rows.length>0){
                    success(rows)
                }
                else{
                    success({"message":"not found"})
                }
            }
        })
    })
    .then((data)=>{
        res.send(data)
        
    })
    .catch((err)=>{
        res.send("<p>error in server</p>")
    })
})

app.post('/mentor-login',(req,res)=>{
   
    
    return new Promise(function(success,reject){
        connection.query(`SELECT * FROM mentor where rollno=? and password=?`,[req.body.mentorId,req.body.mentorPwd],function(err,rows){
            if (err) reject(err)
            else {
                if (rows.length>0){
                    success(rows)
                }
                else{
                    success({"message":"invalid"})
                }
            }
        })
    })
    .then((data)=>{
        res.send(data)
        
    })
    .catch((err)=>{
        res.send("<p>error in server</p>")
    })
})
app.put('/mentor-change-password',(req,res)=>{
    console.log(req.body.newpassword);
    
    return new Promise(function(success,reject){
        connection.query(`UPDATE mentor SET password=? where rollno=? and password=?`,[req.body.newpassword,"22jn1a05d1-g5",req.body.password],function(err,rows){
            if (err) reject(err)
            else if (rows.length===0){
                res.send({"message":'invalid'})
            }   
            else{
               res.send(rows)
            }
        })
    })
    .then(data=>res.send(data))
    .catch(err=>res.send('error',err))
})
app.put('/student-change-password',(req,res)=>{
    
    
    return new Promise(function(success,reject){
        let {np,cp} = req.body
        connection.query(`UPDATE students SET password=? where password=?`,[np,cp],function(err,rows){
            if (err) reject(err)
            else if (rows.length==0){
                
                res.send({"message":'invalid'})
            }   
            else{
                res.send({"message":'success'})
               
            }
        })
    })
    .then(data=>res.send(data))
    .catch(err=>res.send('error',err))
})

