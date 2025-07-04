// File: js/processFile.js (Diperbarui untuk memanggil fungsi utility global)

let rawPlayerData = [];

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

async function processFile(file) {
    try {
        showSpinner(); 

        const content = await readFile(file);
        const table = await validateHtmlContent(content);

        if (table) {
            rawPlayerData = convertTableToObject(table);
            
            const seedData = loadLocalData();
            const scores = calculateScores(rawPlayerData, seedData);

            if (scores && !scores.errorOccurred) {
                const numberOfPlayers = scores.playerScores.length;
                const formattedNumberOfPlayers = numberOfPlayers.toLocaleString();
                // Waktu tidak didefinisikan di calculateScores baru, jadi kita hapus
                // const timeTakenMs = scores.timeTaken; 
                // showToast(`Calculated all scores for ${formattedNumberOfPlayers} players in ${timeTakenMs} ms`, 'Calculation Complete', 'success');
                showToast(`Calculated all scores for ${formattedNumberOfPlayers} players`, 'Calculation Complete', 'success');
                
                // Panggil fungsi utility scores yang ada di dataProcessing.js
                const playersWithUtilityScores = calculateUtilityScores(scores.playerScores);
                const playersWithHighestRoles = findHighestScoringRoles(playersWithUtilityScores, seedData);
                
                initializeBootstrapTable(playersWithHighestRoles);
            } else if (scores.errorOccurred) {
                showToast(scores.errorMessage, 'Calculation Error', 'error');
            }
        }
    } catch (error) {
        showToast(error.message, 'File Read Error', 'error');
    } finally {
        hideSpinner();
    }
}


function validateHtmlContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = hasValidTable(doc);
    if (!table || !hasValidRowCount(table)) return null;
    return table;
}

function hasValidTable(doc) {
    const table = doc.querySelector('table');
    if (!table) {
        showToast('No valid table found in the file.', 'Validation Error', 'error');
        return false;
    }
    return table;
}

function hasValidRowCount(table) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 20000) {
        showToast('The table has more than 20,000 rows.', 'Validation Error', 'error');
        return false;
    }
    return true;
}

function convertTableToObject(table) {
    let result = [];
    let headers = [];
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(header => headers.push(header.textContent.trim()));
    const rows = Array.from(table.querySelectorAll('tr'));
    if (headers.includes('Nat')) {
        let natIndexes = headers.reduce((indices, header, index) => {
            if (header === 'Nat') indices.push(index);
            return indices;
        }, []);
        natIndexes.forEach(natIndex => {
            for (let i = 1; i < Math.min(rows.length, 5); i++) {
                if (rows[i].querySelectorAll('td')[natIndex]) { // Pastikan selnya ada
                    let sampleCellContent = rows[i].querySelectorAll('td')[natIndex].textContent.trim();
                    if (/^[A-Za-z]{3}$/.test(sampleCellContent)) {
                        headers[natIndex] = 'Nationality';
                        break;
                    }
                }
            }
        });
    }
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        let rowData = {};
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            let header = headers[cellIndex];
            if (header) {
                rowData[header] = cell.textContent.trim();
            }
        });
        result.push(rowData);
    });
    return result;
}
