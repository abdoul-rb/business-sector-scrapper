const http = require('http');
const https = require('https');
const fs = require('fs/promises');
const { JSDOM } = require("jsdom");
const querystring = require('querystring');

/**
 * Scrape une page web et extrait les liens d'une classe cible
 * @param {object} config - La configuration contenant l'URL et les options
 * @param {string} targetClass - Le sélecteur CSS pour cibler les éléments
 * @param {function} callback - La fonction de rappel pour traiter les données
 */
exports.scrapper = function ({ url, body, ...options }, targetClass, callback) {
    const protocol = url.startsWith('https') ? https : http;

    if (body) {
        options.headers['Content-type'] ??= 'application/x-www-form-urlencoded';

        if (options.headers['Content-type'] === 'application/x-www-form-urlencoded') {
            body = querystring.stringify(body);
        }

        if (options.headers['Content-type'] === 'application/json') {
            body = JSON.stringify(body);
        }

        options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const request = protocol.request(url, options, (response) => {
        let data = [];

        response.on('data', (chunk) => data.push(chunk));

        response.on('end', () => {
            data = Buffer.concat(data, data.reduce((acc, buff) => acc + Buffer.byteLength(buff), 0));

            // Parse en fonction du type de contenu
            if (response.headers["content-type"].includes("json")) {
                data = JSON.parse(data.toString());
            } else if (response.headers["content-type"].includes("html")) {
                const dom = new JSDOM(data.toString());
                data = dom.window.document;
            }

            // Traitement des données avec la classe cible
            const result = Array.from(data.querySelectorAll(targetClass)).map((liElement) => {
                const field = liElement.querySelector('a h3');
                
                return {
                    sector: field.textContent.trim(),
                };
            });

            callback(result);
            saveToFile(result, 'sectors', 'txt');
        });
    });

    request.end();
};


/**
 * Sauvegarde les données dans un fichier JSON
 * @param {Array} data - Les données à sauvegarder
 * @param {string} filename - Le nom du fichier de destination
 * @param {string} format - Le format du fichier de destination
 */
function saveToFile(data, filename = 'sectors', format = 'json') {
    const extension = format === 'json' ? 'json' : 'txt';
    const formattedData = format === 'json' 
        ? JSON.stringify(data, null, 2) 
        : data.map(item => item.sector).join('\n');

    const path = `./data/${filename}.${extension}`;

    fs.writeFile(path, formattedData, (err) => {
        if (err) {
            console.error(`Erreur lors de la sauvegarde du fichier : ${err}`);
        } else {
            console.log(`Les données ont été sauvegardées dans le fichier ${filename}`);
        }
    });
}