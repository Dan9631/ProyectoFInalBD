const msql=require('mssql')


module.exports = class Sql{
    constructor(stringConnection){
        this.stringConnection=stringConnection;
    }

    connect(){
        msql.on('error',err=>{
            console.log(err);
            msql.close();
        })
        console.log('Conectado de manera exitosa');
        return msql.connect(this.stringConnection);
    }

    close(){
        return msql.close();
    }

    async select(table){
        return new Promise((resolve,reject)=>{
            this.connect().then(pool => {
                return pool.request().query(`select * from ${table}`);
            
        }).then(result=>{
            msql.close();
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    });
  
 }

 async selectId(table,id){
    return new Promise((resolve,reject)=>{
        this.connect().then(pool=>{
            return pool.request().query(`select * from ${table} WHERE usuarios='${id}'`);
        }).then(result=>{
            msql.close();
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });
 }

 async selectPorID(table,id){
    return new Promise((resolve,reject)=>{
        this.connect().then(pool=>{
            return pool.request().query(`select * from ${table} WHERE codigousuario='${id}'`);
        }).then(result=>{
            msql.close();
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });
 }

 // insercion de registros a la tabla de usuarios
async createUser(Codigo,name,lastname,username,password){
    return new Promise((resolve,reject)=>{
        this.connect().then(pool=>{
            return pool.request()
            .input('codigo',msql.Int,Codigo)
            .input('nombres',msql.VarChar,name)
            .input('apellidos',msql.VarChar,lastname)
            .input('usuarios',msql.VarChar,username)
            .input('contrasenas',msql.VarChar,password)	
            .execute('dbo.DatosPersona',(err,result)=>{
               if(err){
                   reject(err);
               }else{
                   resolve(result);
               }
            })
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });

}


// insercion de registros a la tabla de usuarios
async modificarUser(Codigo,name,lastname,username,password){
    return new Promise((resolve,reject)=>{
        this.connect().then(pool=>{
            return pool.request()
            .input('codigousuario',msql.Int,Codigo)
            .input('nombres',msql.VarChar,name)
            .input('apellidos',msql.VarChar,lastname)
            .input('usuarios',msql.VarChar,username)
            .input('contrasenas',msql.VarChar,password)	
            .execute('dbo.SP_ModificarPersona',(err,result)=>{
               if(err){
                   reject(err);
               }else{
                   resolve(result);
               }
            })
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });

}

//consulta para eliminar un usuario
async deleteUser(Codigo){
    return new Promise((resolve,reject)=>{
        this.connect().then(pool=>{
            return pool.request()
            .input('codigousuario',msql.Int,Codigo)
            .execute('dbo.SP_EliminarPersona',(err,result)=>{
               if(err){
                   reject(err);
               }else{
                   resolve(result);
               }
            })
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });

}
 
}
