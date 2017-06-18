module.exports = function(RED) {
    function atemin(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        

		var ATEM = require('applest-atem');

		var atem = new ATEM();
		atem.connect(config.ip);

		this.status({fill:"red",shape:"ring",text:"Disconnected"});
		
		atem.on('connect', function() {
			node.status({fill:"green",shape:"ring",text:"Connected"});
		});
		atem.on('disconnect', function() {
			node.warn("ATEM is disconnected");
			node.status({fill:"red",shape:"ring",text:"Disconnected"});
		});	
			
		var me = config.me;
		
		node.on('value', function(msg) {
			var value;
	
			if (msg.payload.startsWith("program")) {
				value = msg.payload.split(' ')[1];
				atem.changeProgramInput(value, me);
			}
			if (msg.payload.startsWith("preview")) {
				value = msg.payload.split(' ')[1];
				atem.changePreviewInput(value, me);
			}
			if (msg.payload === "cut") {
				atem.cutTransition(me);
			}
			if (msg.payload === "auto") {
				atem.autoTransition(me);
			}

			msg.payload = "";
			node.send(msg);

			
        });
		
		
		
		node.on('close', function() {

        });
		
		
		
    }
    RED.nodes.registerType("atemin",atemin);
}
