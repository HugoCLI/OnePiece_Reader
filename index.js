let readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout });
let request = require('request');
const fs = require('fs');
let chalk = require('chalk');

const formatBytes = (a, b = 2, k = 1024) => { with(Math) { let d = floor(log(a) / log(k)); return 0 == a ? "0b" : parseFloat((a / pow(k, d)).toFixed(max(0, b))) + " " + ["b", "Kb", "Mb", "Gb", "Tb", "Pb"][d] } }
function clearLine() {
    for(let i = 0; i < 20; i++) /* => */ console.log(' ');
}
clearLine();
console.log('-------------------- '+ chalk.green('OnePiece Reader')+' --------------------');
console.log(' ');
console.log(' Github : '+chalk.yellow('@HugoCLI') + chalk.gray(" https://github.com/HugoCLI"));
console.log(' Site web : '+chalk.cyan('https://hugochilemme.com'));
console.log(' ');
console.log('----------------------------------------------------------');
console.log(' ');
console.log(' ');

rl.question("Quel chapitre voulez-vous lire ? (Par exemple 637) : \n", function(number) {
    
    clearLine();
    console.log(chalk.green("Recherche du chapitre "+number+" de One Piece version Française..."));
    rl.close();
    let urlExists = require('url-exists');
    urlExists('https://one-piece-scan.fr/comic/'+number+'/01.jpg', function(err, exists) {
        console.log(chalk.yellow("Téléchargement du chapitre "+number+"..."));

        if (!fs.existsSync('scans/OnePiece_'+number)){
            fs.mkdirSync('scans/OnePiece_'+number, { recursive: true });
        }

        console.log(' ');
        let page = 1;



        let num = 1;
        download();
        function download() {
            page = num;
            if(num < 10) 
                page = "0"+String(num);

            let received_bytes = 0;
            let total_bytes = 0;

            var req = request({
                method: 'GET',
                uri: 'https://one-piece-scan.fr/comic/'+number+'/'+page+'.jpg'
            });
            
            req.on('response', function (data) {
                total_bytes = parseInt(data.headers['content-length']);
                console.log(' ');
                
                if(data.headers['content-type'] == 'image/jpeg') {
                    var out = fs.createWriteStream('scans/OnePiece_'+number+"/"+page+".jpg");
                    req.pipe(out);

                    req.on('data', function (chunk) {
                        // Update the received bytes
                        received_bytes += chunk.length;
            
            
                        let pourcent = 100 / total_bytes * received_bytes;
                        readline.moveCursor(process.stdout, 0, -1);
                        readline.clearLine(process.stdout, 1);
                        console.log('\t' + chalk.gray(number+"_"+page+".jpg") + ' (' + formatBytes(received_bytes) + '/' + formatBytes(total_bytes) + ') - ' + pourcent.toFixed(0) + "%");
                        
                
                    });

                    req.on('end', function (data) {
                        readline.moveCursor(process.stdout, 0, -1);
                        readline.clearLine(process.stdout, 1);
                        console.log('\t' + chalk.green(number+"_"+page+".jpg") + ' (' + formatBytes(received_bytes) + '/' + formatBytes(total_bytes) + ')');
                        num++;
                        download();

                    });
                } else {
                    console.log('\t'+chalk.cyan("Fin de l\'opération") + " - "+(num-1)+" fichiers téléchargés vers "+ chalk.yellow(__dirname + "\\scans\\OnePiece_"+number+"\\"));
                    console.log(' ');
                }
            });

            
        }

        
    });

    
    
});

