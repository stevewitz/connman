connectssid('w24','22224444')
function connectssid(ssidWanted,passphrase) {
    var exec = require('child_process').exec;
    console.log('scanning wifi');
    exec('connmanctl scan wifi', (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var child = exec('connmanctl services');
        child.stdout.on('data', function (data) {
            console.log(data + '%');
            data = data.split('\n');
            var connected = false;
            var ssidWantedIsVisible = false
            var ssid;
            var path;
            console.log('Looking for connected access point ' + data.length)
            for (var i = 0; i < data.length; ++i) {
                ssid = data[i].substring(4, data[i].lastIndexOf(' ')).trim();
                path = data[i].substr(data[i].lastIndexOf(' ')).trim();
                if (data[i].substr(0, 3) == '*AO') {
                    connected = true;
                    console.log('Connected access point found#' + i)

                    console.log('ssid:' + ssid)
                    console.log('path:' + path)
                    if (ssidWanted == ssid){
                        console.log('Already Connected to:'+ssid);
                        return(0);
                    }
                }
                if (ssidWanted = ssid){
                    var pathWanted = path;
                    ssidWantedIsVisible = true
                    break;
                }

            }
            if (ssidWantedIsVisible == false){
                console.log('Unable to connect to '+ssidWanted+ ' accesspoint not visible')
                return (-1,'Accesspoint not visible')
            } else {
                if (connected == true){
                    console.log('Connected to wrong access point:'+ssid+' - disconnecting')
                    //call discconect then callback connect
                    disconnect(path,connect(pathWanted,ssidWanted))
                } else
                {
                    connect(pathWanted, ssidWanted)
                }
            }

        });
        child.stderr.on('data', function (data) {
            console.log('stdoerr: ' + data)
        });
        child.on('close', function (code) {
            console.log('closing code: ' + code);
        });

    });
    function disconnect(inpath,cb){
        console.log('disconnecting...');
        exec('connmanctl scan wifi', (error, stdout, stderr) => {

            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

        })

    }
    function connect(p,s){
        console.log('attemting to connect to '+p,s)
    }
}