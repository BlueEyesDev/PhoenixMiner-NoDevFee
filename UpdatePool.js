const http = require('http');
const fs = require('fs');
const dns = require('dns');
const isAdmin = require('is-admin');
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
    'eu1.ethermine.org':4444,
    'asia1.ethermine.org':4444,
    'us1.ethermine.org':4444,
    'us2.ethermine.org':4444,
    'asia1.ethpool.org':3333,
    'eu1.ethpool.org':3333,
    'us1.ethpool.org':3333,
    'us2.ethpool.org':3333,
    'eth-eu1.nanopool.org':9999,
    'eth-eu2.nanopool.org':9999,
    'eth-us-east1.nanopool.org':9999,
    'eth-us-west1.nanopool.org':9999,
    'eth-asia1.nanopool.org':9999,
    'eth-jp1.nanopool.org':9999,
    'eth-au1.nanopool.org':9999,
    'eth.2miners.com':2020,
    'us-eth.2miners.com':2020,
    'asia-eth.2miners.com':2020,
    'cn.sparkpool.com':3333,
    'asia.sparkpool.com':3333,
    'eth-us.sparkpool.com':3333,
    'eth-eu.sparkpool.com':3333
};
const PoolLigne = 38;
var RewriteMainJS = (domain) => {
    dns.lookup(domain, (err, address, family) => {
        if (err == null){
            const data = fs.readFileSync(`Main.js`, 'utf8').split('\r\n');
            if (Object.keys(Pool).indexOf(domain) != 21)
                data[PoolLigne + Object.keys(Pool).indexOf(domain)] = `\t'${domain}':{ip:'${address}', port:${Pool[domain]}},`;
            else 
                data[PoolLigne + Object.keys(Pool).indexOf(domain)] = `\t'${domain}':{ip:'${address}', port:${Pool[domain]}}`;
            fs.writeFileSync(`Main.js`, data.join('\r\n').toString());
        }
    });
}

if (fs.existsSync('.Installed')){
    if (process.platform === "win32")
        console.error(`\x1b[31mPlease use the command "node Unistall.js" as Administrator before UpdatePool.js \x1b[37m`);
    else
        console.error(`\x1b[31mPlease use the command "sudo node Unistall.js" before UpdatePool.js\x1b[37m`);
    process.exit();
}

if (process.platform === "win32"){
    const data = fs.readFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, 'utf8').split('\r\n');
    Object.keys(Pool).forEach(function (val) {
       if (data.includes(val)){
            console.error(`\x1b[31mPlease use the command "node Unistall.js" as Administrator before UpdatePool.js \x1b[37m`);
            process.exit();
       }
       RewriteMainJS(val);
    });
}else{
    const data = fs.readFileSync(`/etc/hosts`, 'utf8').split('\r\n');
    Object.keys(Pool).forEach(function (val) {
        if (data.includes(val)){
            console.error(`\x1b[31mPlease use the command "sudo node Unistall.js" before UpdatePool.js\x1b[37m`);
            process.exit();
        }
        RewriteMainJS(val);
    });
}

if (!fs.existsSync('.Installed')){
    if (process.platform === "win32"){
        (async () => {
            if (await isAdmin() === false){ 
                console.error(`\x1b[31mPlease run the program as Administrator\x1b[37m`);
                process.exit();
            } else {
                fs.appendFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, Hosts.join(`\r\n`));
            }
        })();
    } else {
        if (process.env.SUDO_UID == undefined){
            console.error(`\x1b[31mPlease run the program as Sudo\x1b[37m`);
            process.exit();
        } else {
            fs.appendFileSync(`/etc/hosts`, Hosts.join(`\r\n`));
        }
    }
    fs.writeFileSync('.Installed', "NoDevFee Installed");
}
console.log(`\x1b[32mThe Pools we were updated !\x1b[37m`);
