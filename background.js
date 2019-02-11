var tabs = {};

browser.extension.onConnect.addListener(function(port)
{
	port.onMessage.addListener(function(msg)
	{
		var curTab = msg.tabid;
		
		if (!curTab)
		{
			return;
		}
		
		if (curTab < 0)
		{
			return;
		}
		
		if (!tabs[curTab])
		{
			tabs[curTab] = {};
			tabs[curTab].panning = 0;
            tabs[curTab].volume = 1;
			tabs[curTab].enabled = 0;
			tabs[curTab].panNode;
			tabs[curTab].context;
			tabs[curTab].source;
		}
		
		if (msg.type == 'set_request')
		{
			tabs[curTab].panning = msg.value[0];
            tabs[curTab].volume = msg.value[1];            
			
			if (tabs[curTab].enabled == 0)
			{
				browser.tabCapture.capture(
				{
					audio: true,
					video: false
				}, function (stream)
				{
					tabs[curTab].context = new AudioContext();
					tabs[curTab].source = tabs[curTab].context.createMediaStreamSource(stream);
					
                    tabs[curTab].gainNode = tabs[curTab].context.createGain();
                    tabs[curTab].gainNode.gain.setValueAtTime(tabs[curTab].volume, tabs[curTab].context.currentTime);
                    
					tabs[curTab].panNode = tabs[curTab].context.createStereoPanner();
					tabs[curTab].panNode.pan.setValueAtTime(tabs[curTab].panning, tabs[curTab].context.currentTime);
					
					tabs[curTab].source.connect(tabs[curTab].gainNode).connect(tabs[curTab].panNode).connect(tabs[curTab].context.destination);
				});
				
				tabs[curTab].enabled = 1;
			}
			else
			{
                if (typeof tabs[curTab].panNode !== "undefined" && typeof tabs[curTab].panNode.pan !== "undefined" && typeof tabs[curTab].gainNode !== "undefined" && typeof tabs[curTab].gainNode.gain !== "undefined") {
    				tabs[curTab].panNode.pan.setValueAtTime(tabs[curTab].panning, tabs[curTab].context.currentTime);
                    tabs[curTab].gainNode.gain.setValueAtTime(tabs[curTab].volume, tabs[curTab].context.currentTime);
                }
			}
		}
		else if (msg.type == 'update_request')
		{
			var msgdata = {
				'type':'update_response',
				'value': [
                    tabs[curTab].panning,
                    tabs[curTab].volume
                ],
				'tabid': curTab
			};
			
			port.postMessage(msgdata);
		}
		else if (mst.type == 'resetall_request')
		{
			
		}
	});
});

browser.tabs.onRemoved.addListener(function(tabid, removed) {
	if (tabs[tabid])
	{
		delete tabs[tabid];
	}
});
