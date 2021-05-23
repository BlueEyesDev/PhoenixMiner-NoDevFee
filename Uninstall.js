const isAdmin = require('is-admin');
const fs = require('fs');
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
if (fs.existsSync('.Installed')){
    const HostsFile = [];
    if (process.platform === "win32"){
        (async () => {
            if (await isAdmin() === false){ 
                console.error(`\x1b[31mPlease run the program as Administrator\x1b[37m`);
                process.exit();
            } else {
                const data = fs.readFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, 'utf8').split('\r\n');
                data.forEach(element => {
                    if (!Hosts.includes(element))
                        HostsFile.push(element);
                });
                fs.writeFileSync(`${process.env.DriverData}\\..\\etc\\hosts`, HostsFile.join('\r\n'));
            }
        })();
    } else {
        if (process.env.SUDO_UID == undefined){
            console.error(`\x1b[31mPlease run the program as Sudo\x1b[37m`);
            process.exit();
        } else {
            const data = fs.readFileSync(`/etc/hosts`, 'utf8').split('\r\n');
            data.forEach(element => {
                if (!Hosts.includes(element))
                    HostsFile.push(element);
            });
            console.log(HostsFile);
           fs.writeFileSync(`/etc/hosts`, HostsFile.join('\r\n'));
        }
    }
    fs.unlinkSync('.Installed');
}
console.log('\x1b[32mUninstall successful\x1b[37m');
