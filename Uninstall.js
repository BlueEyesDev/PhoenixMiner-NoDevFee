const isAdmin = require('is-admin');
const {existsSync, createWriteStream, readFileSync, unlinkSync, writeFileSync} = require('fs');
const {EOL, platform} = require('os');
const ReadFilePoolUrls = JSON.parse(readFileSync(`PoolsUrl.json`, 'utf8'));
const ConsoleLog = (Message, Error) => {
    if (Error === true){
        console.error(`\x1b[31m${Message}\x1b[37m`);
        process.exit();
    } else
        console.log(`\x1b[32m${Message}\x1b[37m`);
}
const WriteHosts = (Path) => {
    const data = readFileSync(Path, 'utf8').split(EOL);   
    const HostsFile = [];
    data.forEach(line => {
        if (ReadFilePoolUrls.findIndex(Domain => line.includes(Domain)) == -1)
            HostsFile.push(line);
    });
    writeFileSync(Path, HostsFile.join(EOL));
}
if (!existsSync('PoolsUrl.json')){
    const file = createWriteStream("PoolsUrl.json");
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/PoolsUrl.json", (response) => { response.pipe(file); });
}
if (!existsSync('Pools.json')){
    const file = createWriteStream("Pools.json");
    get("https://raw.githubusercontent.com/BlueEyesDev/PhoenixMiner-NoDevFee/main/Pools.json", (response) => { response.pipe(file); });
}
if (existsSync('.Installed')){
    if (platform() === "win32"){
        (async () => {
            if (await isAdmin() === false) 
                ConsoleLog(`Please run the program as Administrator`, true);
            else
                WriteHosts(`${process.env.DriverData}\\..\\etc\\hosts`);
        })();
    } else {
        if (process.env.SUDO_UID == undefined){
            ConsoleLog(`Please run the program as Sudo`, true);
        } else {
            WriteHosts(`/etc/hosts`);
        }
    }
    unlinkSync('.Installed');
}
ConsoleLog(`Uninstall successful`, false);
