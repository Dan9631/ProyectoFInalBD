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
 
}
