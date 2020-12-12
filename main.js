var express=require('express');
const app=express();
var mysql=require('mysql');

var bodyparser=require('body-parser');
const { builtinModules } = require('module');
const { nextTick } = require('process');

var connect=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"Kiran@123",
    database: 'moviesdb'
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.post('/addMovie/',(req,res,next)=>{

    var data=req.body;
    var name= data.name;
    var language=data.language;
    var genre=data.genre;
    var rating=data.rating;
    var date=data.date;
    var lang=0;
    var gen=0;

    function setLang (value) {
        lang = value;
      }

      function setGen (value) {
        gen = value;
      }

    

    connect.query("select * from movies where name=?",[name], function(err,result,fields){
        connect.on('error',(err)=>{
            console.log("[MySQL Error",err);
        });
        
        if(result && result.length){
            res.json("Movie already Exists");
        }
        else{

            //check for language
            connect.query("select * from languages where name=?",[language],function(err,result,fields){
                connect.on('error',(err)=>{
                    console.log("[MySQL Error",err);
                });
                if(result && result.length){

                    connect.query("select id from languages where name=?",[language],function(err,result,fields){
                        if (err) throw err;
                 else {
                    setLang(result[0].id);
                    console.log(lang);
                      }
                     // console.log(result[0].id);  
                      lang= result[0].id;
                    });
                }

                else{

                    var insert_cmd="insert into languages(name) values (?)";
                    values=[language];
                    connect.query(insert_cmd,values,(err,results,fields)=>{
                        connect.on('error',(err)=>{
                            console.log("[MySQL Error",err);
                        });
                        res.json("Language Inserted");
                    });

                    connect.query("select id from languages where name=?",[language],function(err,result,fields){
                        if (err) throw err;
                 else {
                    setLang(result[0].id);
                    console.log(lang);
                      }
                        lang=result[0].id;
                      //console.log(result[0].id);  
                    });
                }
            });

            // end language

            // start genre

            connect.query("select * from genre where name=?",[genre],function(err,result,fields){
                connect.on('error',(err)=>{
                    console.log("[MySQL Error",err);
                });
                if(result && result.length){

                    connect.query("select id from genre where name=?",[genre],function(err,result,fields){
                        if (err) throw err;
                        else {
                           setGen(result[0].id);
                           console.log(gen);
                             }
                     // console.log(result[0].id); 
                      gen= result[0].id; 
                    });

                    
                    
                }

                else{

                    var insert_cmd="insert into genre(name) values (?)";
                    values=[genre];
                    connect.query(insert_cmd,values,(err,results,fields)=>{
                        connect.on('error',(err)=>{
                            console.log("[MySQL Error",err);
                        });
                        res.json("Genre Inserted");
                    });

                    connect.query("select id from genre where name=?",[genre],function(err,result,fields){
                        if (err) throw err;
                        else {
                           setGen(result[0].id);
                           console.log(gen);
                             }
                     // console.log(result[0].id); 
                      gen= result[0].id;
                    });
                }
            });
            
            // end genre

            var insert_cmd="insert into movies(name,language,genre,rating,date) values (?,?,?,?,?)";
                    //values=[name,lang,gen,rating,date];
                    values=[name,language,genre,rating,date];
connect.query(insert_cmd,values,(err,results,fields)=>{
    connect.on('error',(err)=>{
        console.log("[MySQL Error",err);
    });
    console.log("Inserted");
    //res.json(values);
});

connect.query("select * from movies where name=?",[name], function(err,result,fields){
    connect.on('error',(err)=>{
        console.log("[MySQL Error",err);
    });
    
    if(result && result.length){
        res.json(result[0]);
    }
});
           
        }
    });
});

var server=app.listen(3030,()=>{   
    console.log("Server running at http://localhost:3030");
});

