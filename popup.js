var port = browser.extension.connect({
	name: 'Tab DJ'
});

function currenttabcallback(callback)
{
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var currTab = tabs[0];
		
		if (currTab) {
			callback(currTab.id);
		}
	});
}

function setvalue()
{
	var newval = document.getElementById('TabDJExtensionPanInput').value;
	newval = (newval / 4);
	
	currenttabcallback(function(tabid)
	{
		var msgdata = {
			'type': 'set_request',
			'value': newval,
			'tabid': tabid
		};
		
		port.postMessage(msgdata);
	});
}

function update()
{
	currenttabcallback(function(tabid)
	{
		var msgdata = {
			'type': 'update_request',
			'value': 0,
			'tabid': tabid
		};
		
		port.postMessage(msgdata);
	});
}

port.onMessage.addListener(function(msg)
{
	currenttabcallback(function(tabid)
	{
		console.log(msg);
		console.log(tabid);
		
		if (msg.tabid == tabid)
		{
			if (msg.type == "update_response")
			{
				var newval = (msg.value * 5)
				document.getElementById('TabDJExtensionPanInput').value = newval;
			}
		}
	});
});

document.getElementById('TabDJExtensionPanInput').addEventListener("input", setvalue);

update();
