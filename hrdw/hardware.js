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
let client = null;


function setSysInfos(client, conf, refs){
  if(refs){
    //stop
    clearInterval(refs.speed);
    clearInterval(refs.tmp);
    cleaarInterval(refs.mem);
  }
  //lien vers le hardware
  let speed_ref = setInterval(()=>{
    SI.cpuCurrentspeed().then(result=>{
      client.publish('hrdw/speed',JSON.stringify({
        avg:result.avg,
        min: result.min,
        max: result.max
      }),{retain:true});
    }).catch(err=>{console.error(err)});
  },conf.speed*1000);

  let temp_ref = setInterval(()=>{
    SI.cpuTemperature().then(result=>{
      client.publish('hrdw/temp',JSON.stringify({
        main: result.main,
        max: result.max
      }),{retain:true});
    }).catch(err=>{console.error(err)});
  },conf.temp*1000);

  let mem_ref = setInterval(()=>{
    SI.mem().then(result=>{
      client.publish('hrdw/mem',JSON.stringify({
        total: result.total,
        used: result.used,
        active: result.active,
        available: result.available
      }),{retain:true});
    }).catch(err=>{console.error(err)});
  },conf.mem*1000);

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
  if(!client.hasSession){
    //uniquement la 1ere fois
    SI.cpu().then(result=>{
    client.publish("hrdw/hello",JSON.stringify({
      manufacturer:result.manufacturer,
      brand: result.brand,
      familly: result.familly,
      model: result.model,
      speed: result.speed,
      core: result.core
    }),{retain: true});
  })
  }
  
  


  let refs = setSysInfos(client,conf);//no refs on start


  //lance les recuperations de données via interval
  client.on("message", (topic, message,packet)=>{
    if(topic == "hrdw/config"){
      //met a jour les données
      let c = JSON.parse(message.toString());
      refs = setSysInfos(client,c,refs);

    }
  });

  
}).catch( err=>{
  console.error(err);
  //end application
});