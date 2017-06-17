module.exports = function(RED) {
    function redatem(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        

		var Atem = require('atem'); // Load the atem module 
		var newatem = new Atem("10.1.0.9"); // Create a new Atem instace with an IP address 


			newatem.ip = config.ip;
			newatem.connect();
		
		

		node.on('input', function(msg) {
			
			newatem.changeProgramInput(msg.payload);
			
			msg.payload = "Hello";
            node.send(msg);
			
        });
		
		
		
		node.on('close', function() {
            //Disconnect from ATEM
        });
		
		
		
    }
    RED.nodes.registerType("redatem",redatem);
}
