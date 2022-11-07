var express =require('express');
const Sql = require('./model/Conexion');
var app=express();
var config=require('./model/config');
let cors = require('cors');
app.use(cors());

app.set('view engine','ejs')
app.set('views',__dirname+'/view')
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:false}))
app.set('sesion',null)


//para redireccionar la pagina web y devolver las paginas html en formato ejs
app.get('/',(req,res)=>{
        res.render('index',{respuesta:null});
})

app.get('/inicio',(req,res)=>{
    if(app.get('sesion')){
    res.render('inicio');
    }else{
        res.render('index',{respuesta:null});
    }
})
app.get('/seleccionp',(req,res)=>{
    if(app.get('sesion')){
    res.render('seleccionp');
    }else{
        res.render('index',{respuesta:null});
    }
})

app.get('/contratacion',(req,res)=>{
    if(app.get('sesion')){
    res.render('contratacion');
    }else{
        res.render('index',{respuesta:null});
    }
})

app.get('/nominas',(req,res)=>{
    if(app.get('sesion')){
    res.render('nominas')
    }else{
        res.render('index',{respuesta:null});
    }
})

app.get('/puesto',(req,res)=>{
    if(app.get('sesion')){
    res.render('puesto')
    }else{
        res.render('index',{respuesta:null});
    }
})

app.get('/session',(req,res)=>{
    app.set('sesion',null);
    res.render('index',{respuesta:null});
})

//consulta get para logearse
app.post('/login',async(req,res)=>{
    try {
        let user=req.body.user;
        let password=req.body.password;
        console.log(req.body)
        conexion = new Sql(config);
        const result=await conexion.selectId('dbo.RegistrodeUsuarios',user)  
        console.dir(result)
        console.dir(result.recordset[0].contrasenas)
        if(result.recordset.length>0){
            if(result.recordset[0].usuarios==user && result.recordset[0].contrasenas==password){
                app.set('sesion','true')
                res.render('inicio');
            }else{
                res.render('index',{respuesta:{message:'Contraseña incorrectos'}});
            } 

        }else{
            console.log('Usuario no existe');
            res.render('index',{respuesta:{message:'El usuario no existe en la base de datos'}});
        }
    } catch (error) {
        res.render('index',{respuesta:{
        message:'Sucedio un error a la hora de intentar logearse, revise que se ingresen datos en el formulario'}});
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