var express =require('express');
const Sql = require('./model/Conexion');
var app=express();
var config=require('./model/config');
let cors = require('cors');
app.use(cors());

app.set('view engine','ejs')
app.set('views',__dirname+'/view')
app.use(express.static(__dirname+'/public'))



//para redireccionar la pagina web y devolver las paginas html en formato ejs
app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/inicio',(req,res)=>{
    res.render('inicio');
})
app.get('/seleccionp',(req,res)=>{
    res.render('seleccionp');
})

app.get('/contratacion',(req,res)=>{
    res.render('contratacion');
})

app.get('/nominas',(req,res)=>{
    res.render('nominas')
})

app.get('/puesto',(req,res)=>{
    res.render('puesto')
})


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


//consulta all para crear usuarios
app.all('/createUser/:Codigo/:name/:lastname/:username/:password',async (req,res)=>{
try{
    conexion = new Sql(config)
    var result=await conexion.createUser(req.params.Codigo,req.params.name,req.params.lastname,req.params.username,req.params.password)
    res.json({message:'Usuario creado',status:200})
    console.log('Usuario creado',result)
}catch(error){
    console.log(error)
}

})

//modificar datos usuario por una consulta all
app.all('/UpdateUser/:Codigo/:name/:lastname/:username/:password',async (req,res)=>{
    try{
        conexion = new Sql(config)
        var result=await conexion.modificarUser(req.params.Codigo,req.params.name,req.params.lastname,req.params.username,req.params.password)
        res.json({message:'Usuario modificado',status:200})
        console.log('Usuario modificado',result)
    }catch(error){
        console.log(error)
    }
    
    })

//eliminar usuario por una consulta all
app.all('/deleteUser/:Codigo',async (req,res)=>{
    try{
        conexion = new Sql(config)
        var result=await conexion.deleteUser(req.params.Codigo)
        
        res.json({message:'Usuario eliminado',status:200})
        console.log('Usuario eliminado',result)
    }catch(error){
        console.log(error)
    }
})


var puerto=process.env.PORT|3000

var server=app.listen(puerto,()=>{
    console.log(`Servidor Corriendo en el puerto ${puerto}`);
})