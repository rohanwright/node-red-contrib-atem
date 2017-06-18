module.exports = function(RED) {
    function atemin(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        

		var Atem = require('atem'); // Load the atem module 
		var newatem = new Atem("10.1.0.9"); // Create a new Atem instace with an IP address 


		newatem.ip = config.ip;
		newatem.connect();
		
		if (newatem.state === "2" ) {
			this.status({fill:"green",shape:"ring",text:"Connected"});
		} else {
			newatem.connect();
			this.warn("ATEM is disconnected");
			this.status({fill:"red",shape:"ring",text:"Disconnected"});
		}
		
		node.on('value', function(msg) {
			var value;
			if (newatem.state === "2" ) {
				this.status({fill:"green",shape:"ring",text:"Connected"});
				
				if (msg.payload.startsWith("program")) {
					value = msg.payload.split(' ')[1];
					newatem.setProgram(value);
				}
				if (msg.payload.startsWith("preview")) {
					value = msg.payload.split(' ')[1];
					newatem.setPreview(value);
				}
				if (msg.payload === "cut") {
					newatem.cut();
				}
				if (msg.payload === "auto") {
					newatem.auto();
				}

				msg.payload = "message sent";
				node.send(msg);
			} else {
				newatem.connect();
				this.warn("ATEM is disconnected");
				this.status({fill:"red",shape:"ring",text:"Disconnected"});
				msg.payload = "disconnected";
				node.send(msg);
			}
			
        });
		
		
		
		node.on('close', function() {
        	newatem.disconnect();
        });
		
		
		
    }
    RED.nodes.registerType("atemin",atemin);
}
