/**
 * Genstion de la configuration pour le hardware
 */

const fs = require("fs");

//temps de raffraichissement des infos en secondes


function loadConfig(){
  return new Promise( (resolve, reject)=>{
    try{
      config = JSON.parse(fs.readFileSync('./conf.json'));
      console.log(config)
      resolve(config);

    }catch(err){
      //default config
      console.log(err)
      resolve({
        speed: 3000,
        temp: 2000,
        mem: 1000
      });
    }
  });
}
function saveConfig(conf){

  return new Promise( (resolve, reject)=>{
    if(!conf){
      reject("no conf object");
    }
    try{
      fs.writeFile('./conf.json',JSON.stringify(conf), ()=>{
        
        resolve(conf);
      });
      
    } catch(err){
      reject(err);
    }
  });
  
}

module.exports = {
  loadConfig:loadConfig,
  saveConfig: saveConfig
}