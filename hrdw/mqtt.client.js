/**
 * client mqtt pour l'application
 */
const mqtt = require("async-mqtt");

//connection au broker avec clientid et session:true
const client_id = "HRDW0001";

const connect_config = {
  clientId: client_id,
  clean:false,//met en place la session
  will:{
    topic:"hrdw/state",
    payload:"offline",
    retain:true
  }
}

function connect(){
  return new Promise( (resolve, reject)=>{
     let client = mqtt.connect('mqtt://localhost',connect_config);
      //connection OK, subscribe et publish...
      client.on("connect", (connack)=>{
        if(!connack.sessionPresent){
          console.log("subscribe to config change");
          //subscribe to config change
          client.subscribe('hrdw/config',{qos:2});//DOIT etre au courant
        }
        //publie un bonjour
        console.log("publish current state");
        client.publish('hrdw/state',"online",{retain:true});

        client.hasSession = connack.sessionPresent;
      resolve (client);
      });
      
  }); 

}


module.exports = {
  connect: connect
}