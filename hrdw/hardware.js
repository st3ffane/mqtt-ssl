/**
 * Hardware.js: implmentation du client mqtt 
 * permet de recuperer les infos de bases sur le cpu de la machine
 * 
 * description:{
 *  manufacurer,
 *  brand,
 *  familly,
 *  model
 *  speed,
 *  core 
 * }
 * 
 * 
 * vitesse du processeur:
 * speed:{
 *  avg,
 *  min,
 *  max
 * }
 * 
 * temperature:{
 *  main,
 *  max
 * }
 * 
 * memoire:{
 *  total,
 *  used,
 *  active,
 *  available
 * }
 * 
 * les topics:
 * publish:
 *    hrdw/state 'online'|offline : retained, QoS 1
 *    hrdw/speed : retained, QoS 0
 *    hrdw/temp: retained, QoS 0
 *    hrdw/mem: retained, QoS 0
 * Subscribe:
 *    hrdw/config QoS 2
 * 
 * connect: session:true
 */

const CONFIG = require("./config");
const MQTT_CLIENT = require("./mqtt.client");
const SI = require("systeminformation");

let conf = null;
let CLIENT = null;
let infos = null;

function setSysInfos(client, conf, refs){
  if(refs){
    console.log("clear intervals")
    //stop
    clearInterval(refs.speed);
    clearInterval(refs.temp);
    clearInterval(refs.mem);
  }
  //lien vers le hardware
  let speed_ref = setInterval(()=>{
    SI.cpuCurrentspeed().then(result=>{
      client.publish('hrdw/speed',JSON.stringify({
        avg:result.avg,
        min: result.min,
        max: result.max
      }));
    }).catch(err=>{console.error(err)});
  },conf.speed);

  let temp_ref = setInterval(()=>{
    SI.cpuTemperature().then(result=>{
      client.publish('hrdw/temp',JSON.stringify({
        main: result.main,
        max: result.max
      }));
    }).catch(err=>{console.error(err)});
  },conf.temp);

  let mem_ref = setInterval(()=>{
    SI.mem().then(result=>{
      client.publish('hrdw/mem',JSON.stringify({
        total: result.total,
        used: result.used,
        active: result.active,
        available: result.available
      }));
    }).catch(err=>{console.error(err)});
  },conf.mem);

  return {
    speed: speed_ref,
    temp: temp_ref,
    mem: mem_ref
  }
}

console.log("Starting hardware...");
CONFIG.loadConfig().then( (c)=>{  
  conf = c;
  return MQTT_CLIENT.connect();
}).then (client=>{
  //connection OK, renvois les infos de description
  CLIENT = client;

  if(!client.hasSession){
    //uniquement la 1ere fois
    SI.cpu().then(result=>{

      infos = result;
    client.publish("hrdw/hello",JSON.stringify({
      manufacturer:result.manufacturer,
      brand: result.brand,
      model: result.model,
      speed: result.speed,
      
    }),{retain: true});
  })
  }
  
  


  let refs = setSysInfos(client,conf);//no refs on start


  //lance les recuperations de données via interval
  client.on("message", (topic, message,packet)=>{
    console.log(topic);
    if(topic == "hrdw/config"){
      //met a jour les données
      let c = JSON.parse(message.toString());
      console.log("new config: ",c);
      conf = c;
      CONFIG.saveConfig(c);
      refs = setSysInfos(client,c,refs);

    } else if(topic == "hrdw/settings"){
      client.publish("hrdw/config_set", JSON.stringify(conf),{retain: false});
    }
  });

  
}).catch( err=>{
  console.error(err);
  //end application
});

process.on('SIGINT', function() {
      console.log("end connection")
      if(CLIENT){
        //unsubscribe
        console.log("unsubscribe")
        CLIENT.unsubscribe("hrdw/config").then( (ff)=>{
          console.log("offline")
          return  CLIENT.publish("hrdw/state","offline",{retain:true});
        }).then( ()=>{
          console.log("end connection")
          return CLIENT.end();
        }).then( ()=>{
          console.log("bye")
         process.exit(0);
        });
      } else {
        process.exit(1);
      }
      
      
  });