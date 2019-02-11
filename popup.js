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

// https://stackoverflow.com/a/25612056
function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? browser.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}

document.getElementById('TabDJExtensionPanInput').addEventListener("input", setvalue);
document.getElementById('TabDJExtensionVolumeInput').addEventListener("input", setvalue);

localizeHtmlPage();
update();
