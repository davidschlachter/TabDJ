var port = browser.extension.connect({
	name: 'Tab DJ'
});

function currenttabcallback(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var currTab = tabs[0];
		
		if (currTab) {
			callback(currTab.id);
		}
	});
}

function setvalue()
{
	var panvalue = document.getElementById('TabDJExtensionPanInput').value;
    var gainvalue = document.getElementById('TabDJExtensionVolumeInput').value;
	
	currenttabcallback(function(tabid)
	{
		var msgdata = {
			'type': 'set_request',
			'value': [
                panvalue,
                gainvalue
            ],
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
			'value': [
                0,
                1
            ],
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
				var panvalue = msg.value[0];
                var gainvalue = msg.value[1];
				document.getElementById('TabDJExtensionPanInput').value = panvalue;
                document.getElementById('TabDJExtensionVolumeInput').value = gainvalue;
			}
		}
	});
});

document.getElementById('TabDJExtensionPanInput').addEventListener("input", setvalue);
document.getElementById('TabDJExtensionVolumeInput').addEventListener("input", setvalue);

update();
