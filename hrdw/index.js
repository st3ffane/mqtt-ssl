let si = require("systeminformation");

//get sys infos for cpus
si.cpu().then( data=>{
	console.log("CPU INFOS:");
	console.log(data);
	return si.cpuTemperature();

}).then(temp=>{
	console.log("TEMPERATURE CPU:");
	console.log(temp);
	return si.cpuCurrentspeed();
}).then( speed=>{
	console.log("Speed");
	console.log(speed);

}).catch(err=>console.error(err));
