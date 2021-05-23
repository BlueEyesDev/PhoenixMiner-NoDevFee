const {existsSync, createWriteStream, readFileSync, writeFileSync} = require('fs');
const dns = require('dns');
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
const ReadFilePoolUrls = JSON.parse(readFileSync(`PoolsUrl.json`, 'utf8'));
const ReadFilePools = JSON.parse(readFileSync(`Pools.json`, 'utf8'));
ReadFilePoolUrls.forEach(Domain => {
    if (ReadFilePools[Domain] != undefined)
        dns.lookup(Domain, (err, address, family) => {
            if (err == null){  
                ReadFilePools[Domain].ip =  address;
                console.log(ReadFilePools[Domain].ip);
                writeFileSync(`Pools.json`, JSON.stringify(ReadFilePools));
            }
        });
});
writeFileSync(`Pools.json`, JSON.stringify(ReadFilePools));
ConsoleLog(`Update successful`, false);
