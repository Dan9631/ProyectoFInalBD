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

app.get('/Usuarios',(req,res)=>{
    if(app.get('sesion')){
    res.render('Usuarios',{busca:null,respuesta:null});
    }else{
        res.render('index',{respuesta:null});
    }
})

app.get('/seleccionp',(req,res)=>{
    if(app.get('sesion')){
    res.render('seleccionp',{busca:null,respuesta:null});
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
app.post('/createUser',async (req,res)=>{
try{
    let codigoUser=req.body.codigousuario
    let user=req.body.Usuario
    let password=req.body.Contrasena
    let nombre=req.body.Nombres
    let apellido=req.body.Apellidos

    conexion = new Sql(config)
    const result=await conexion.createUser(codigoUser,nombre,apellido,user,password)
    const result2=await conexion.selectPorID('dbo.RegistrodeUsuarios',codigoUser)  
    console.dir(result2)
    if(result2.recordset.length>0 && result2.recordset[0].usuarios==user){
        res.render('Usuarios',{busca:null,respuesta:{message:'Usuario creado correctamente'}});
    }else{
        res.render('Usuarios',{busca:null,respuesta:{message:'Usuario no creado, revise que el id y el username no existan'}});
    }
    
   
}catch(error){
    console.log(error)
    res.render('Usuarios',{respuesta:{message:'Surgio un error en la creacion del usuario, revise que los datos ingresados sean correctos'}});
}

})

app.post('/ConsultarUser',async (req,res)=>{
    try{
        let codigoUser=req.body.codigousuario
        conexion = new Sql(config)
        const result=await conexion.selectPorID('dbo.RegistrodeUsuarios',codigoUser)  
        console.dir(result)
        if(result.recordset.length>0){
            res.render('Usuarios',{datos:result.recordset[0],busca:true,respuesta:null});
        }else{
            res.render('Usuarios',{busca:null,respuesta:{message:'El usuario no existe en la base de datos'}});
        }
        
       
    }catch(error){
        console.log(error)
        res.render('Usuarios',{respuesta:{message:'Surgio un error en la creacion del usuario, revise que los datos ingresados sean correctos'}});
    }
    
    }
)


//modificar datos usuario por una consulta all
app.post('/UpdateUser',async (req,res)=>{
    try{
        let codigoUser=req.body.codigousuario
        let user=req.body.Usuario
        let password=req.body.Contrasena
        let nombre=req.body.Nombres
        let apellido=req.body.Apellidos
    
        conexion = new Sql(config)
        var result=await conexion.modificarUser(codigoUser,nombre,apellido,user,password)
        console.log(result)
        const result2=await conexion.selectPorID('dbo.RegistrodeUsuarios',codigoUser)  
        console.dir(result2)
        if(result2.recordset.length>0){
            res.render('Usuarios',{datos:result2.recordset[0],busca:true,respuesta:{message:'Usuario modificado correctamente'}});
        }else{
            res.render('Usuarios',{busca:null,respuesta:{message:'El usuario no existe en la base de datos'}});
        }
     
    }catch(error){
        console.log(error)
    }
    
    })

//eliminar usuario por una consulta all
app.post('/deleteUser',async (req,res)=>{
    try{
        let codigoUser=req.body.codigousuario
        conexion = new Sql(config)
        var result=await conexion.deleteUser(codigoUser)
        const result2=await conexion.selectPorID('dbo.RegistrodeUsuarios',codigoUser)  
        console.dir(result2)
        if(result2.recordset.length=0){
            res.render('Usuarios',{busca:null,respuesta:{message:'Usuario no pudo ser eliminado, revise que el id exista'}});
        }else{
            res.render('Usuarios',{busca:null,respuesta:{message:'El usuario fue eliminado de manera exitosa'}});
        }
        
        
    }catch(error){
        res.render('Usuarios',{busca:null,respuesta:{message:'Sucedio un error al eliminar el usuario'}});
        console.log(error)
    }
})

//----------------------Rutas para el CRUD de productos----------------------//
app.post('/createPersonal',async (req,res)=>{
    try{
        let codigoUser=req.body.codigoaspirannte
        let nombre=req.body.Nombres
        let apellido=req.body.Apellidos
        let habilidades=req.body.Habilidades
        console.log(req.body)
        conexion = new Sql(config)
        const result=await conexion.createPersonal(codigoUser,nombre,apellido,habilidades)
        const result2=await conexion.selectPorIDPersonal('dbo.SelecciondePersonal',codigoUser)  
        console.dir(result2)
        if(result2.recordset.length>0 ){
            res.render('seleccionp',{busca:null,respuesta:{message:'Personal creado correctamente'}});
        }else{
            res.render('seleccionp',{busca:null,respuesta:{message:'Personal no creado, revise que el id y los datos sean validos'}});
        }
        
       
    }catch(error){
        console.log(error)
        res.render('seleccionp',{respuesta:{message:'Surgio un error en la creacion de la persona, revise que los datos ingresados sean correctos'}});
    }
    
    })

 app.post('/ConsultarPesonal',async (req,res)=>{
        try{
            let codigoUser=req.body.codigoaspirante
            conexion = new Sql(config)
            const result=await conexion.selectPorIDPersonal('dbo.SelecciondePersonal',codigoUser)  
            console.dir(result.recordset[0])
            if(result.recordset.length>0){
                res.render('seleccionp',{datos:result.recordset[0],busca:true,respuesta:null});
            }else{
                res.render('seleccionp',{busca:null,respuesta:{message:'El Personal no existe en la base de datos'}});
            }
            
           
        }catch(error){
            console.log(error)
            res.render('seleccionp',{respuesta:{message:'Surgio un error en la creacion del usuario, revise que los datos ingresados sean correctos'}});
        }
        
        }
    )
    


//-----------------------------------------------------------------------------
var puerto=process.env.PORT|3000

var server=app.listen(puerto,()=>{
    console.log(`Servidor Corriendo en el puerto ${puerto}`);
})