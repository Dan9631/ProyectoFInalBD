var express =require('express');
const Sql = require('./model/Conexion');
var app=express();
var config=require('./model/config');



//consulta get para logearse
app.get('/login/:user',async(req,res)=>{
    try {
        conexion = new Sql(config);
        const result=await conexion.selectId('dbo.RegistrodeUsuarios',req.params.user)  
        res.json(result)
        console.dir(result)
    } catch (error) {
        console.log(error)
    }
})

//consulta get usuarios
app.get('/getUsers',async(req,res)=>{
    try{

    conexion = new Sql(config)
    const result=await conexion.select('dbo.RegistrodeUsuarios')
    console.dir(result)
    res.json(result)
    }catch(error){
        console.log(error)
    }
})

var puerto=process.env.PORT|3000

var server=app.listen(puerto,()=>{
    console.log(`Servidor Corriendo en el puerto ${puerto}`);
})