import {Component, OnInit} from "@angular/core";
import {MQTTService} from "../core/mqtt.service";
import {Observable} from "rxjs/Observable";

//pour les affichages
declare var d3;
declare var nvd3;


@Component({
  selector:"main-cmp",
  templateUrl:"./main.html",
  styleUrls:['./main.scss','./loader.css']
})
export class MainPageComponent implements OnInit{

  connected:boolean = false;
  hardware_present:boolean = false;
  wainting_msg:string;


  //le necessaire pour les differents graphiques
  hrdw_infos:any = {};
  speed:any = [{key:"average",values:[]},{key:"min",values:[]},{key:"max",values:[]}];
  mem:any = [{key:"total",values:[]},{key:"used",values:[]},{key:"active",values:[]},{key:"available",values:[]}];
  temp:any = [{key:"main",values:[]},{key:"max",values:[]}];

  
  speed_options={
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        
        
        showValues: true,
        
        duration: 0,
        xAxis: {
          axisLabel: 'time'
        },
        yAxis: {
          axisLabel: 'Hertz (Hz)',
          axisLabelDistance: -10
        }
        
      }
    };
  temp_options = {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        
       showValues: true,
        
        duration: 500,
        xAxis: {
          axisLabel: 'Temp'
        },
        yAxis: {
          axisLabel: 'Celsius',
          axisLabelDistance: -10
        }
        
      }
    };
  mem_options= {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        
       showValues: true,
        
        duration: 500,
        xAxis: {
          axisLabel: 'time'
        },
        yAxis: {
          axisLabel: 'usage (mo)',
          axisLabelDistance: -10
        }
        
      }
    };
   
   
   


  constructor(private _mqtt:MQTTService){}
  ngOnInit(){
    this.wainting_msg = "Connecting to MQTT Broker....";

    this._mqtt.getEventsAsObservable().subscribe( (events)=>{
      
      
      //suivant le topic...
      let topics = events.topic.split('/');
      let what = topics.length > 1 ? topics[1] : null;
      switch(what){

        case 'state':{
          console.log("new state: ",events.msg);
          this.hardware_present = events.msg=="online";
          break;
        }
        case 'hello':{
          //infos sur le hardware
          this.hrdw_infos = JSON.parse(events.msg);
          break;
        }
        case 'speed':{
          this.speed = this.addDatas(JSON.parse(events.msg), this.speed);
          break;
        }
        case 'temp':{
          this.temp = this.addDatas(JSON.parse(events.msg),this.temp);
          break;
        }
        case 'mem':{
          this.mem = this.addDatas(JSON.parse(events.msg),this.mem);
          break;
        }
        default: {
          console.log("unknown topic ", what);
          break;
        }
      }
    });



    //connection
    this._mqtt.connectToMosquitto(['hrdw/state','hrdw/hello','hrdw/speed','hrdw/temp','hrdw/mem']).then( (connected:boolean)=>{
      if(connected){
        //youpi!
        this.connected = true;
        this.wainting_msg = "wainting for hardware...";
      }
    })

  }

  private addDatas(dt, cible){
    let dts = [];
    for (let key of Object.keys(dt)){
      let arr = this.getArrayByKey(key,cible);
      if(arr.length>10){
        arr.shift();
      }
      arr.push({x:new Date().getTime(), y:dt[key]?dt[key]: 0});
      dts.push({key:key,values:arr});
    }
    //cree une nouvelle instance
    return dts;
  }
  private getArrayByKey(key, cible){
    for (let dt of cible){
      if(key==dt.key) return dt.values;
    }
    return [];
  }
  
}