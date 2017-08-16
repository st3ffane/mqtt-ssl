/**
 * client mqtt pour l'application
 */
const mqtt = require("async-mqtt");

//connection au broker avec clientid et session:true
const client_id = "HRDW0005";

const connect_config = {
  clientId: client_id,
  clean:false,//met en place la session
  will:{
    topic:"hrdw/state",
    payload:"offline",
    retain:true
  }
}
var connectOptions = {
    host: "127.0.0.1",
    port: 8883,
    protocol: "mqtts",
    keepalive: 10,
    clientId: client_id,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: false,
    /*reconnectPeriod: 2000,
    connectTimeout: 2000,
    key: fs.readFileSync("./keys/key.pem"),
    cert: fs.readFileSync("./keys/cert.pem"),*/
    rejectUnauthorized: false,
};

function connect(){
  return new Promise( (resolve, reject)=>{
     let client = mqtt.connect(connectOptions);//'mqtt://localhost',connect_config);
      //connection OK, subscribe et publish...
      client.on("connect", (connack)=>{
      //if(!connack.sessionPresent){
          console.log("subscribe to config change");
          //subscribe to config change
          client.subscribe({'hrdw/config':1, 'hrdw/settings':0}).then( (err, granted)=>{
              console.log(err,granted);
          });//DOIT etre au courant
          
      //}
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