const isAdmin = require('is-admin');
const {get} = require('https');
const {existsSync, appendFileSync, createWriteStream, readFileSync, writeFileSync} = require('fs');
const {EOL, platform} = require('os');
const ConsoleLog = (Message, Error) => {
    if (Error === true){
        console.error(`\x1b[31m${Message}\x1b[37m`);
        process.exit();
    } else
        console.log(`\x1b[32m${Message}\x1b[37m`);
}
if (!existsSync('PoolsUrl.json')){
    const file = createWriteStream("PoolsUrl.json");
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/PoolsUrl.json", (response) => { response.pipe(file); });
}
if (!existsSync('Pools.json')){
    const file = createWriteStream("Pools.json");
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/Pools.json", (response) => { response.pipe(file); });
}
const Hosts = () => {
    const ReadFilePoolUrls = JSON.parse(readFileSync(`PoolsUrl.json`, 'utf8'));
    const HostsArrays = [EOL]; 
    ReadFilePoolUrls.forEach((value) => { HostsArrays.push(`127.0.0.1\t${value}`) });
    return HostsArrays;
}
if (!existsSync('.Installed')){
    if (platform() == 'win32')
        (async () => {
            if (await isAdmin() === false)
                ConsoleLog("Please run the program as Administrator", true);
            else{
                appendFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, Hosts().join(EOL));
                ConsoleLog("Install successful", false);
                writeFileSync('.Installed', "NoDevFee Installed");
            }
        })();
    else {
        if (process.env.SUDO_UID == undefined)
            ConsoleLog("Please run the program as Sudo", true);
        else{
            appendFileSync(`/etc/hosts`, Hosts().join(EOL));
            ConsoleLog("Install successful", false);
            writeFileSync('.Installed', "NoDevFee Installed");
        }
    }   
}
