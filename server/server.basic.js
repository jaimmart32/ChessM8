import * as http from "node:http";
import * as url from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";

http.createServer(function server_onRequest (request, response) {
    const parsedUrl = url.parse(request.url);
    let pathname = `./public${parsedUrl.pathname}`;

    //Ruta especial para el script
    if(request.method === 'POST' && pathname === './public/script'){
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const { script } = JSON.parse(body);
            const filePath = './scripts/malware.js';

            //Guardar el script en un archivo
            fs.writeFile(filePath, script, (err) => {
                if(err){
                    response.writeHead(500);
                    response.end('Error al guardar el script');
                    return;
                }

                //Ejecuto mi script por seguridad
                exec('bash ./scripts/print_message.sh', (err, stdout) => {
                    if(err){
                        response.writeHead(500, { 'Content-type': 'text/plain'});
                        response.end('Error al ejecutar el script');
                        console.error('Error:', err);
                        return;
                    }

                    response.writeHead(200, { 'Content-type': 'text/plain'});
                    response.end(stdout);
                });

            })
            return;
        });
        return;
    }
    const ext = path.extname(pathname) || '.html';

    //servir index.html si la ruta es /
    if(pathname === './public/')
        pathname = './public/index.html';

    //Extension a tipo MIME para el header
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpeg': 'image/jpeg',
        '.ico': 'image/x-icon'
    };

    fs.readFile(path.resolve(pathname), (err, data) => {
        if(err){
            response.writeHead(404, {'Content-type': 'text/plain'});
            response.end('404 Not Found');
        }
        else{
            response.writeHead(200, {'Content-type': mimeTypes[ext] || 'text/plain'});
            response.end(data);
        }
    })
    console.log("Request for " + pathname + " received.");

}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');