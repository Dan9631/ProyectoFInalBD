var express =require('express');
const Sql = require('./model/Conexion');
var app=express();
var config=require('./model/config');


app.get('/ClientesQ',async (req,res)=>{

    conexion =new Sql(config);
     conexion.connect();
    const result=await conexion.select('dbo.Clientes');
    console.dir(result);
    res.send(result)
})


app.get('/cliente/:id',async(req,res)=>{
    conexion =new Sql(config);
    const result=await conexion.selectId('dbo.Clientes',req.params.id);
    console.dir(result)
    res.json(result);
})

//consulta get para logearse
app.get('/login/:user/:password',(req,res)=>{
    conexion = new Sql(config);
})

var server=app.listen(3000,()=>{
    console.log('Servidor Corriendo');
})