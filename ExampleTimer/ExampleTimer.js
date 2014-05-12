var ExTime = {
	name: 		'ExampleTimer',
	author: 	'BadZombi',
	version: 	'0.1.0',
	DStable: 	'ExampleTimer',
	// These config functions (createConfig, loadConfig and confSetting) are usually in my core...
	createConfig: function(data, filename, pluginname){
		Util.ConsoleLog("Config does not exist... creating "+ filename +".ini for " + pluginname, true);
		Plugin.CreateIni(filename);
		var newConf = Plugin.GetIni(filename);
		for (var x in data) {
			var section_name = x;
			var section_data = data[x];

			if(typeof(section_data) == "object"){
				for (var d in section_data) {
					var itemName = d;
					var itemValue = section_data[d];
					newConf.AddSetting(section_name, itemName, itemValue);
					Util.ConsoleLog("  --  Adding \"" + itemName + "\" = \"" + itemValue + "\" to " + section_name + " section...", true);
				}
			} 
		}
		newConf.Save();
		return newConf;
	},
	loadConfig: function(file){
		if(file == undefined){ file = "Config"; }
		var readConf = Plugin.GetIni(file);
		return readConf;
	},
	confSetting: function(name, section, file) {
		if(section == undefined){ section = "Config"; }
		if(file == undefined){ file = "Config"; }
		var conf = this.loadConfig(file);
		return conf.GetSetting(section, name);
	},
	addTimer: function(P, data){
		P.MessageFrom(this.confSetting("chatname"), "Adding entry: " + data);
		P.MessageFrom(this.confSetting("chatname"), "Response should be in ~"+this.confSetting("execute_delay")+" seconds.");
		
		var epoch = Plugin.GetTimestamp();
		var exectime = parseInt(epoch) + parseInt(this.confSetting("execute_delay"));
		DataStore.Add(this.DStable, exectime, String(data));
		this.startTimer();
	},
	startTimer: function(){
		if(!Plugin.GetTimer("DoIt")){
			Plugin.CreateTimer("DoIt", this.confSetting("run_timer") * 1000).Start();
		}
	},
	stopTimer: function(P) {
		Plugin.KillTimer("DoIt");
	},
	clearTimers: function(P){
		P.MessageFrom(ExTime.confSetting("chatname"), "Erasing all example timers.");
		Datastore.Flush(this.DStable);
	}
}



function On_PluginInit() { 

	if ( !Plugin.IniExists( 'Config' ) ) {

		var Config = {};
			Config['run_timer'] = 2;
			Config['execute_delay'] = 30;
			Config['expiration'] = 40;
			Config['example_message'] = "A timer has executed! Wow!";
			Config['chatname'] = "ExTime";


		var iniData = {};
			iniData["Config"] = Config;

		var conf = ExTime.createConfig(iniData, 'Config', ExTime.name);

	}

	Util.ConsoleLog(ExTime.name + " v" + ExTime.version + " loaded.", true);
}

function On_Command(P, cmd, args) { 

	cmd = Data.ToLower(cmd);
	switch(cmd) {

		case "extimer":
			if(args.Length >= 1){
				var phrase = "";
				for (var a in args){
					phrase += a+" ";
				}
				ExTime.addTimer(P, phrase);
			} else {
				ExTime.addTimer(P, P.Name);
				P.MessageFrom(ExTime.confSetting("chatname"), "You can also enter a phrase with this command.");
				P.MessageFrom(ExTime.confSetting("chatname"), "e.g. /extimer bob likes chicken");
			}
			
		break;

		case "cleartimers":
			ExTime.clearTimers();
		break;

		case "listtimers":

			P.MessageFrom(ExTime.confSetting("chatname"), "Listing pending timer entries:");
			var dsTable = Datastore.Keys(ExTime.DStable);
			for (var x in dsTable){
				P.MessageFrom(ExTime.confSetting("chatname"), "Timer entry: " + x + " : " + Datastore.Get(ExTime.DStable, x));	
			}
			P.MessageFrom(ExTime.confSetting("chatname"), "==============================");
		break;
		
	}
}

function DoItCallback(){
	var epoch = Plugin.GetTimestamp();
	var exp = parseInt(ExTime.confSetting("expiration") - ExTime.confSetting("execute_delay"))
	if(Datastore.Count(ExTime.DStable) >= 1){
		var pending = Datastore.Keys(ExTime.DStable);
		for (var p in pending){
			var x = parseInt(epoch - p);
			if(x < 0){
				x = x * -1;
				Server.BroadcastFrom(ExTime.confSetting("chatname"), 'One entry will execute in ' + x + ' seconds...');
			} else if(x >= 0 < exp){
				Server.BroadcastFrom(ExTime.confSetting("chatname"), ExTime.confSetting("example_message"));
				Server.BroadcastNotice( Datastore.Get(ExTime.DStable, p) );
				Datastore.Remove(ExTime.DStable, p)
			} else if(x >= exp){
				Datastore.Remove(ExTime.DStable, p)
			}
				
		}
		Server.BroadcastFrom(ExTime.confSetting("chatname"), '-----------------------------------');
	} else {
		ExTime.stopTimer();
	}

}