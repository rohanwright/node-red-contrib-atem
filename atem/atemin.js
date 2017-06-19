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
			msg.payload = "disconnected";
			node.send(msg);
		});	
		
		atem.on('stateChanged', function(err, state) {
			console.log(state);
			msg.payload = state;
			node.send(msg);
		});
		
		
		node.on('value', function(msg) {
			var value, value2, me, payloadarray[];
			
			if (msg.payload.startsWith("program")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[2]) {
					me = payloadarray[2];
				} else {
					me = 0;
				}
				value = payloadarray[1];
				atem.changeProgramInput(value, me);
			} else if (msg.payload.startsWith("preview")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[2]) {
					me = payloadarray[2];
				} else {
					me = 0;
				}
				value = payloadarray[1];
				atem.changePreviewInput(value, me);
			} else if (msg.payload.startsWith("cut")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[1]) {
					me = payloadarray[1];
				} else {
					me = 0;
				}
				atem.cutTransition(me);
			} else if (msg.payload.startsWith("auto")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[1]) {
					me = payloadarray[1];
				} else {
					me = 0;
				}
				atem.autoTransition(me);
			} else if (msg.payload.startsWith("aux")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[3]) {
					me = payloadarray[3];
				} else {
					me = 0;
				}
				value = payloadarray[1];
				value2 = payloadarray[2];
				atem.changeAuxInput(value, value2, me);
			} else if (msg.payload.startsWith("downstreamkey")) {
				payloadarray = msg.payload.split(' ');
				value = payloadarray[1];
				value2 = payloadarray[2];
				atem.changeDownstreamKeyOn(value, value2);
			} else if (msg.payload.startsWith("upstreamkey")) {
				payloadarray = msg.payload.split(' ');
				if (payloadarray[3]) {
					me = payloadarray[3];
				} else {
					me = 0;
				}
				value = payloadarray[1];
				value2 = payloadarray[2];
				atem.changeUpstreamKeyState(value, value2, me);
			} else if (msg.payload.startsWith("macro")) {
				atem.runMacro(value);
			} else {
				msg.payload = "command not recognised";
				node.send(msg);
			}
			

        });
		
		node.on('close', function() {

        });
		
    }
    RED.nodes.registerType("atemin",atemin);
}