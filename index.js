var express =require('express');
const Sql = require('./model/Conexion');
var app=express();
var config=require('./model/config');


app.get('/',async (req,res)=>{

    conexion =new Sql(config);
     conexion.connect();
    const result=await conexion.select('dbo.Clientes');
    console.dir(result);

})


var server=app.listen(3000,()=>{
    console.log('Servidor Corriendo');
})