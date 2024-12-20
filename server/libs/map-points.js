// mapa-points.js
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url'; // Import

// Utilise fileURLToPath pour convertir import.meta.url en chemin d'accès
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction permettant d'obtenir des données cartographiques brutes à partir d'un fichier local
const getRawMapData = async (networkCode) => {
    const fileName = `${networkCode}-270.ntm`; //270 --> Luxembourg
    const rawDataPath = join(__dirname, 'public', 'database', fileName);

    try {
        // Lire le contenu du fichier
        const data = await readFile(rawDataPath, 'utf-8');
        // En supposant que le contenu du fichier contienne les données cartographiques brutes
        return data.split('\n').filter(line => line.trim() !== '');  // Supprimer les lignes vides
    } catch (error) {
        console.error(`Erro ao obter dados brutos do mapa para ${networkCode}:`, error);
        throw error;
    }
};

// Fonction principale d'obtention de données cartographiques formatées
export async function getAllDataForMap() {
    const networkCodes = ['01', '05', '77', '06']; // Code pour POST, LOL, Tago, Orange

    try {
        const allMappedData = [];

        // Itère sur chaque code de réseau
        for (const networkCode of networkCodes) {
            const rawMapData = await getRawMapData(networkCode);

            // Convertie dans le format vouly
            const mappedData = rawMapData.map((point) => {
                const fields = point.split(';');

                // Lógica de mapeamento específica para cada tipo de ponto
                if (fields[0] === '2G') {
                    return {
                        Technology: '2G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CID: fields[3],
                        LAC: fields[4],
                        BSIC: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        ARFCN: fields[10],
                    };
                } else if (fields[0] === '3G') {
                    return {
                        Technology: '3G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CID: fields[3],
                        LAC: fields[4],
                        RNC: fields[5],
                        PSC: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        UARFCN: fields[10],
                    };
                } else if (fields[0] === '4G') {
                    return {
                        Technology: '4G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CI: fields[3],
                        TAC: fields[4],
                        eNB: fields[5],
                        PCI: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        EARFCN: fields[10],
                    };
                } else if (fields[0] === '5G') {
                    return {
                        Technology: '5G',
                        MCC: fields[1],
                        MNC: fields[2],
                        NCI: fields[3],
                        TAC: fields[4],
                        PCI: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        ARFCN: fields[10],
                    };
                } else if (fields[0] === 'CD') {
                    return {
                        Technology: 'CDMA',
                        MCC: fields[1],
                        MNC: fields[2],
                        BID: fields[3],
                        NID: fields[4],
                        SID: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                    };
                }

                // Adicione mais condições para outros tipos de pontos
                return null; // ou um valor padrão para tipos desconhecidos
            }).filter(point => point !== null);

            allMappedData.push(mappedData);
        }

        return allMappedData;
    } catch (error) {
        console.error('Erro ao obter dados do mapa:', error);
        throw error;
    }
}

// Exemplo de uso
const allData = await getAllDataForMap();
console.log(allData);
