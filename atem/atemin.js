module.exports = function(RED) {
    function atemin(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        

		var Atem = require('atem'); // Load the atem module 
		var newatem = new Atem("10.1.0.9"); // Create a new Atem instace with an IP address 


			newatem.ip = config.ip;
			newatem.connect();
		
		
		this.status({fill:"blue",shape:"ring",text:"disconnected"});
		
		node.on('input', function(msg) {
			
			if (newatem.state === "2" ) {
				this.status({fill:"green",shape:"ring",text:"Connected"});
				newatem.changeProgramInput(msg.payload);

				msg.payload = "message sent";
				node.send(msg);
			} else {
				newatem.connect();
				this.warn("ATEM is disconnected");
				this.status({fill:"red",shape:"ring",text:"disconnected"});
				msg.payload = "disconnected";
				node.send(msg);
			}
			
        });
		
		
		
		node.on('close', function() {
            //Disconnect from ATEM
        });
		
		
		
    }
    RED.nodes.registerType("atemin",atemin);
}
