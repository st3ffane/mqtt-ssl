import {Injectable} from "@angular/core";
import { connect, MqttClient } from 'mqtt';

import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

import {MQTTServiceConfig} from "./mqtt.config.service";

//const SUBSCRIBES = ['hrdw/state','hrdw/hello','hrdw/speed','hrdw/temp','hrdw/mem'];
@Injectable()
export class MQTTService{


  client:MqttClient;
  events:Subject<any> = new Subject<any>();
  getEventsAsObservable():Observable<any>{return this.events.asObservable();}

  subscribes:Array<string>;

  // config:BehaviorSubject<any> = new BehaviorSubject<any>({
  //   speed:1000,
  //   temp: 1000,
  //   mem:1000
  // });
  // getConfigAsObservable():Observable<any>{return this.config.asObservable();}
  connected: boolean = false; //si connecté au serveur
  url:string;

  constructor(config:MQTTServiceConfig){
    this.url =`ws://${config.host}:${config.port}`;
    this.subscribes = config.subscribes;
  }


  connectToMosquitto():Promise<boolean>{
    console.log("Connecting to mqtt brocker");
    return new Promise<boolean>( (resolve,reject)=>{
      if(this.client){
        //deja connecté
        resolve(true);
      }
    try{
        this.client = connect(this.url);
        this.client.on('connect',()=>{
          //connection OK
          //souscrit aux differents events
          this.connected=true;
          //this.client.subscribe('hrdw/#'); //tous les events hardware
          
          
            
          
            
          this.client.on('message',(topic:string,message:Buffer,packet:any)=>{
              // let topics = topic.split('/');
              // console.log(topics);
              // if(topics[1]=="hello"){
              //   //recup la config
              //   console.log("new config",JSON.parse(message.toString()).config)
              //   this.config.next(JSON.parse(message.toString()).config)
              // }
              //1er: uuid du client, 2:serial du sensor
              try{
           
                  //let msg = JSON.parse(message.toString());
                  //what to do....
                  this.events.next({
                    topic:topic,
                    msg: message.toString()
                  });
                  
            } catch(err){
              console.error("JSON Parse error mainly....", err);
            }
          });
          if(this.subscribes.length>0){
            for(let s of this.subscribes) this.client.subscribe(s);
          }
          //demande l'etat
          resolve(true);
        });
    }catch(err){
      reject(err);
    }

     })
  }




  publish(topic:string, message:string, opt:any={}){
    console.log("publish",topic,"opt:",opt);
    return new Promise<any>( (resolve, reject)=>{
      if(this.connected){
        this.client.publish(topic, message,opt, (err)=>{
          if(err) reject(err);
          else resolve(message);
        });
      } else reject("Not connected to broker...");
    })
    
  }

  subscribeTo(topic){
    this.client.subscribe(topic);
  }
  unsubscribeTo(topic){
    this.client.unsubscribe(topic);
  }
}