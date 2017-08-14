/**
 * Genstion de la configuration pour le hardware
 */

const fs = require("fs");

//temps de raffraichissement des infos en secondes


function loadConfig(){
  return new Promise( (resolve, reject)=>{
    try{
      config = JSON.parse(fs.readFileSync('./conf.json'));
      resolve(config);

    }catch(err){
      //default config
      resolve({
        speed: 30,
        temp: 10,
        mem: 1
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
      fs.writeFile(JSON.stringify(conf), ()=>{
        
        resolve(config);
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