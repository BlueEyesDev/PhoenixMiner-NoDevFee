const {existsSync, createWriteStream, readFileSync} = require('fs');
const {createServer, Socket} = require("net");
const ConsoleLog = (Message, Error = false, Exit = false) => {
    if (Error){
        console.error(`\x1b[31m${Message}\x1b[37m`);
        if (Exit)
            process.exit();
    } else
        console.log(`\x1b[32m${Message}\x1b[37m`);
}
const GetPool = process.argv[2];
const GetETHAddress = process.argv[3];
if (process.argv.length != 4)
    ConsoleLog(`usage : ${process.argv[1]} Pool ETHAddress`, true)
if (!existsSync('Pools.json')){
    const file = createWriteStream("Pools.json");
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/Pools.json", (response) => { response.pipe(file); });
}
if (!existsSync('DevFee.json')){
    const file = createWriteStream('DevFee.json');
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/DevFee.json", (response) => { response.pipe(file); });
}
const Pools = JSON.parse(readFileSync(`Pools.json`, 'utf8'));
const DevFeeWallet = JSON.parse(readFileSync(`DevFee.json`, 'utf8'));
if (Pools[GetPool] === undefined)
    ConsoleLog(`The selected pool is not compatible !`, true);
const forwarding = (localport, remotehost, remoteport) => {
    const server = createServer((localsocket) => {
        const remotesocket = new Socket();
        remotesocket.connect(remoteport, remotehost);
        localsocket.on('connect', () => {});
        localsocket.on('data', (data) => {
            Object.keys(DevFeeWallet).forEach(function (Wallet) {
                if (data.toString().includes(Wallet) && data.toString().includes("eth_submitLogin")){
                    ConsoleLog(`The address of the devfee of the miner ${DevFeeWallet[Wallet]} was found : ${Wallet}`, true);
                    data = new Buffer.from(data.toString().replace(Wallet, GetETHAddress));
                    ConsoleLog(`The addres was replaced by : ${GetETHAddress}`, true);
                }
            });
            var flushed = remotesocket.write(data);
            if (!flushed)
                localsocket.pause();     
        });
        remotesocket.on('data', (data) => { 
            var flushed = localsocket.write(data);
            if (!flushed)
                remotesocket.pause();
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
forwarding('4444', Pools[GetPool].ip, Pools[GetPool].port);
forwarding('3333', Pools[GetPool].ip, Pools[GetPool].port);
forwarding('9999', Pools[GetPool].ip, Pools[GetPool].port);
forwarding('2020', Pools[GetPool].ip, Pools[GetPool].port);
