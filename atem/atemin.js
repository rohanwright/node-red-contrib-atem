module.exports = function(RED) {
    function atemin(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        

		var ATEM = require('applest-atem');

		var atem = new ATEM();
		atem.connect(config.ip);

		this.status({fill:"red",shape:"ring",text:"Disconnected"});
		
		atem.on('connect', function() {
			this.status({fill:"green",shape:"ring",text:"Connected"});
		});
		atem.on('disconnect', function() {
			this.warn("ATEM is disconnected");
			this.status({fill:"red",shape:"ring",text:"Disconnected"});
		});	
			
		
		
		node.on('value', function(msg) {
			var value;
	
			if (msg.payload.startsWith("program")) {
				value = msg.payload.split(' ')[1];
				atem.changeProgramInput(value);
			}
			if (msg.payload.startsWith("preview")) {
				value = msg.payload.split(' ')[1];
				atem.changePreviewInput(value);
			}
			if (msg.payload === "cut") {
				atem.cutTransition();
			}
			if (msg.payload === "auto") {
				atem.autoTransition();
			}

			msg.payload = "";
			node.send(msg);

			
        });
		
		
		
		node.on('close', function() {

        });
		
		
		
    }
    RED.nodes.registerType("atemin",atemin);
}
