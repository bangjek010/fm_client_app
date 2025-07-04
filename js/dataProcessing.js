// File: js/dataProcessing.js (Final dengan Perbaikan Kalkulasi Speed & Workrate)

const seedDataKey = 'seedData';

// FUNGSI BARU (DIPINDAHKAN KE SINI) untuk menghitung atribut gabungan
function calculateUtilityScores(players) {
    return players.map(player => {
        // Pastikan atribut ada dan merupakan angka
        const pac = Number(player.Pac || 0);
        const acc = Number(player.Acc || 0);
        const wor = Number(player.Wor || 0);
        const sta = Number(player.Sta || 0);

        // Hitung dan tambahkan ke objek pemain
        player.Speed = ((pac + acc) / 2).toFixed(1);
        player.Workrate = ((wor + sta) / 2).toFixed(1);
        
        return player;
    });
}


// FUNGSI KALKULASI ULANG GLOBAL - bisa dipanggil dari mana saja
function recalculateScoresGlobally() {
    if (rawPlayerData && rawPlayerData.length > 0) {
        showToast("Recalculating scores with new weights...", "Processing", "success");
        const newSeedData = loadLocalData();
        const scores = calculateScores(rawPlayerData, newSeedData);
        if (scores && !scores.errorOccurred) {
            // Panggil fungsi kalkulasi utility di sini juga
            const playersWithScores = calculateUtilityScores(scores.playerScores);
            const playersWithHighestRoles = findHighestScoringRoles(playersWithScores, newSeedData);
            initializeBootstrapTable(playersWithHighestRoles);
        } else {
            showToast(scores.errorMessage, 'Calculation Error', 'error');
        }
    }
}

function dispatchSeedDataLoadedEvent(seedData) {
    const event = new CustomEvent('SeedDataLoaded', { detail: seedData });
    document.dispatchEvent(event);
}

function loadSeedData() {
    try {
        let localDataString = localStorage.getItem(seedDataKey);
        if (localDataString) {
            const parsedData = JSON.parse(localDataString);
            dispatchSeedDataLoadedEvent(parsedData);
            populateRolesList();
            return parsedData;
        }
        if (typeof rolesJSON !== 'undefined' && rolesJSON.length > 0) {
            const dataString = JSON.stringify(rolesJSON);
            localStorage.setItem(seedDataKey, dataString);
            showToast("Default attribute weightings have been loaded.", 'Data Loaded', 'success');
            dispatchSeedDataLoadedEvent(rolesJSON);
            populateRolesList();
            return rolesJSON;
        }
        throw new Error("Critical Error: No role data found.");
    } catch (error) {
        showToast('Could not load role data.', "Loading Error!", 'error');
        console.error(error);
    }
}

function reloadSeedData() {
    localStorage.removeItem(seedDataKey);
    loadSeedData();
    clearSelectedRoles();
    showToast("Default role data has been restored.", "Defaults Restored", "success");
    recalculateScoresGlobally();
}

function assignResetButton() {
    $('#restoreDefaults').on('click', function () {
        if (confirm("Are you sure you want to restore ALL role weights to their default values? This will erase any edits you've made and cannot be undone.")) {
            reloadSeedData();
        }
    });
}

function calculateScores(tableData, seedData) {
    const playerScores = tableData.map(player => {
        const scoresByRole = {};
        if (!seedData || seedData.length === 0) return { ...player, ...scoresByRole };
        for (const role of seedData) {
            let totalScore = 0;
            let totalWeight = 0;
            for (const [attribute, weight] of Object.entries(role)) {
                if (attribute === 'Role' || attribute === 'RoleCode' || typeof weight !== 'number' || weight === 0) continue;
                if (player.hasOwnProperty(attribute)) {
                    const playerAttribute = parseInt(player[attribute] || '0', 10);
                    totalScore += playerAttribute * weight;
                    totalWeight += weight;
                }
            }
            scoresByRole[role.RoleCode] = totalWeight > 0 ? (totalScore / totalWeight).toFixed(1) : '0.0';
        }
        return { ...player, ...scoresByRole };
    });
    return { playerScores };
}

function findHighestScoringRoles(playerScores, seedData) {
    if (!seedData) return playerScores;
    return playerScores.map(player => {
        let highestScore = -Infinity;
        let highestScoringRole = 'N/A';
        let highestScoringRoleCode = 'N/A';
        seedData.forEach(role => {
            const roleCode = role.RoleCode;
            if (player[roleCode]) {
                const roleScore = parseFloat(player[roleCode]);
                if (!isNaN(roleScore) && roleScore > highestScore) {
                    highestScore = roleScore;
                    highestScoringRole = role.Role;
                    highestScoringRoleCode = roleCode;
                }
            }
        });
        if (highestScore === -Infinity) highestScore = 0;
        return { ...player, HighestScoringRole: highestScoringRole, HighestScoringRoleCode: highestScoringRoleCode, HighestScore: highestScore.toFixed(1) };
    });
}

function loadLocalData() {
    let seedData = localStorage.getItem(seedDataKey);
    if (seedData) {
        try {
            return JSON.parse(seedData);
        } catch (e) {
            console.error("Error parsing seedData from localStorage", e);
            localStorage.removeItem(seedDataKey);
            return [];
        }
    }
    return [];
}

function getRoleDataByCode(roleCode) {
    var seedData = loadLocalData();
    return seedData.find(role => role.RoleCode === roleCode);
}
