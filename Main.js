const isAdmin = require('is-admin');
const fs = require('fs');
var net = require("net");

const GetPool = process.argv[2];
const GetETHAddress = process.argv[3];

if (process.argv.length != 4) {
    console.log(`usage : ${process.argv[1]} Pool ETHAddress`);
    process.exit();
}

const Hosts = [
    '127.0.0.1	eu1.ethermine.org',
    '127.0.0.1	asia1.ethermine.org',
    '127.0.0.1	us1.ethermine.org',
    '127.0.0.1	us2.ethermine.org',
    '127.0.0.1	asia1.ethpool.org',
    '127.0.0.1	eu1.ethpool.org',
    '127.0.0.1	us1.ethpool.org',
    '127.0.0.1	us2.ethpool.org',
    '127.0.0.1	eth-eu1.nanopool.org',
    '127.0.0.1	eth-eu2.nanopool.org',
    '127.0.0.1	eth-us-east1.nanopool.org',
    '127.0.0.1	eth-us-west1.nanopool.org',
    '127.0.0.1	eth-asia1.nanopool.org',
    '127.0.0.1	eth-jp1.nanopool.org',
    '127.0.0.1	eth-au1.nanopool.org',
    '127.0.0.1	eth.2miners.com',
    '127.0.0.1	us-eth.2miners.com',
    '127.0.0.1	asia-eth.2miners.com',
    '127.0.0.1	cn.sparkpool.com',
    '127.0.0.1	asia.sparkpool.com',
    '127.0.0.1	eth-us.sparkpool.com',
    '127.0.0.1	eth-eu.sparkpool.com'
];

const Pool = { 
    'eu1.ethermine.org':{ip:'172.65.207.106', port:4444},
    'asia1.ethermine.org':{ip:'172.65.231.156', port:4444},
    'us1.ethermine.org':{ip:'172.65.218.238', port:4444},
    'us2.ethermine.org':{ip:'172.65.226.101', port:4444},
    'asia1.ethpool.org':{ip:'172.65.215.159', port:3333},
    'eu1.ethpool.org':{ip:'172.65.212.80', port:3333},
    'us1.ethpool.org':{ip:'172.65.229.54', port:3333},
    'us2.ethpool.org':{ip:'172.65.214.179', port:3333},
    'eth-eu1.nanopool.org':{ip:'51.75.206.16', port:9999},
    'eth-eu2.nanopool.org':{ip:'151.80.144.188', port:9999},
    'eth-us-east1.nanopool.org':{ip:'144.217.14.109', port:9999},
    'eth-us-west1.nanopool.org':{ip:'66.42.105.146', port:9999},
    'eth-asia1.nanopool.org':{ip:'139.99.102.70', port:9999},
    'eth-jp1.nanopool.org':{ip:'172.105.211.250', port:9999},
    'eth-au1.nanopool.org':{ip:'139.99.156.30', port:9999},
    'eth.2miners.com':{ip:'51.195.89.38', port:2020},
    'us-eth.2miners.com':{ip:'147.135.11.144', port:2020},
    'asia-eth.2miners.com':{ip:'139.99.68.66', port:2020},
    'cn.sparkpool.com':{ip:'203.107.52.35', port:3333},
    'asia.sparkpool.com':{ip:'18.138.29.106', port:3333},
    'eth-us.sparkpool.com':{ip:'52.8.43.205', port:3333},
    'eth-eu.sparkpool.com':{ip:'172.65.233.185', port:3333}
};
const DevFeeWallet = {
    '0x007b689F699bfcCEe48049Db9d3D139872dB8692':'PhoenixMiner 5.6',
    '0x00d4405692b9F4f2Eb9E99Aee053aF257c521343':'PhoenixMiner 5.6',
    '0x008c26f3a2Ca8bdC11e5891e0278c9436B6F5d1E':'PhoenixMiner 5.6'
};
if (Pool[GetPool] === undefined){
    console.error(`\x1b[31mPlease select Valide Pool : \x1b[37m`);
    process.exit();
}

if (!fs.existsSync('.Installed')){
    if (process.platform === "win32"){
        (async () => {
            if (await isAdmin() === false){ 
                console.error(`\x1b[31mPlease run the program as Administrator\x1b[37m`);
                process.exit();
            } else {
                fs.appendFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, Hosts.join(`\r\n`), err => {
                    if (err) {
                    console.error(err)
                    return
                    }
                });
            }
        })();
    } else {
        if (process.env.SUDO_UID == undefined){
            console.error(`\x1b[31mPlease run the program as Sudo\x1b[37m`);
            process.exit();
        } else {
            fs.appendFileSync(`/etc/hosts`, Hosts.join(`\r\n`), err => {
                if (err) {
                console.error(err)
                return
                }
            });
        }
    }
    fs.writeFileSync('.Installed', "NoDevFee Installed");
}
var forwarding = (localport, remotehost, remoteport) => {
    var server = net.createServer((localsocket) => {
      var remotesocket = new net.Socket();
      remotesocket.connect(remoteport, remotehost);
      localsocket.on('connect', () => {});
      localsocket.on('data', (data) => {
        for (var key in DevFeeWallet) {
            if (data.toString().includes(key) && data.toString().includes("eth_submitLogin")){
                console.log(`\x1b[31mThe address of the devfee of the miner ${DevFeeWallet[key]} was found : ${key}\x1b[37m`);
                data = new Buffer.from(data.toString().replace(key, GetETHAddress));
                console.log(`\x1b[32mThe addres was replaced by : ${GetETHAddress}\x1b[37m`);
            }  
        }
        var flushed = remotesocket.write(data);
        if (!flushed) {
          localsocket.pause();
        }           
      });
      remotesocket.on('data', (data) => { 
        var flushed = localsocket.write(data);
        if (!flushed) {
          remotesocket.pause();
        }
      });
      remotesocket.on('error', (data)=>{ });
      localsocket.on('error', (data)=>{ });
      localsocket.on('drain', () => { remotesocket.resume(); });
      localsocket.on('close', (had_error) => { remotesocket.end(); });
      remotesocket.on('drain', () => { localsocket.resume(); });
      remotesocket.on('close', (had_error) => { localsocket.end(); });
    });
    
    server.listen(localport);
    console.log(`redirecting connections from 127.0.0.1:${localport} to ${remotehost}:${remoteport}`); 
}
forwarding('4444', Pool[GetPool].ip, Pool[GetPool].port);
forwarding('3333', Pool[GetPool].ip, Pool[GetPool].port);
forwarding('9999', Pool[GetPool].ip, Pool[GetPool].port);
forwarding('2020', Pool[GetPool].ip, Pool[GetPool].port);
