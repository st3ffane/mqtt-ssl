import {Component} from "@angular/core";
import {MQTTService} from "../core/mqtt.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector:"config-cmp",
  templateUrl:"./config.html",
  styleUrls:['./config.scss']
})
export class ConfigComponent{

  speed:number;
  temp:number;
  mem:number;

  events_obs:Subscription;

  constructor(private _mqtt:MQTTService, private _router:Router){}
  ngOnInit(){
    //recup la configuration
    // this._mqtt.getConfigAsObservable().subscribe((conf)=>{
    //   console.log("config: ", conf);
    //   this.speed = conf.speed;
    //   this.temp = conf.temp;
    //   this.mem = conf.mem;
    // });
    this.events_obs = this._mqtt.getEventsAsObservable().subscribe((events)=>{
      let topics = events.topic.split('/');
      let what = topics.length > 1 ? topics[1] : null;
      switch(what){

       
        case 'config_set':{
          //infos sur le hardware
          let conf = JSON.parse(events.msg);
          console.log("config: ", conf);
          this.speed = conf.speed;
          this.temp = conf.temp;
          this.mem = conf.mem;
          break;
        }
       
        default: {
          break;
        }
      }
    })

    //connecte toi au besoin
    this._mqtt.connectToMosquitto().then( (client:any)=>{
        //demande la configuration
        this._mqtt.publish("hrdw/settings",'',{qos:1});
    });
    
  }

  ngOnDestroy(){
    this.events_obs.unsubscribe();
  }
  saveConfig(){
    this._mqtt.publish("hrdw/config",JSON.stringify({
        speed: this.speed,
        temp: this.temp,
        mem: this.mem
      }),{qos:1, retain:true, messageId:new Date().getTime()}).then (fullfilled=>{
        //a voir...
        console.log(fullfilled);
        this._router.navigate(['/hrdw']);
      })
  }
  
}