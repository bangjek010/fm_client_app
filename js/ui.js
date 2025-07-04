$(document).ready(function() {
    console.log("Dom loaded");

    loadSeedData();
    handleSelection();
    updateUIFromStoredSelection();
    updateSelectedRolesSummary();
    roleFilterEventListener();
    assignClearButton();
    editInit();
    setupFileChangeListener();
    setupCalculateButtonListener();
    toggleThemeListener();
    assignResetButton();
    setupFullscreenToggle();
    setupComparisonTool();
    setupPresets();
});

function setupFullscreenToggle() {
    $('#toggle-fullscreen-btn').on('click', function() {
        const resultsCard = $('#results-card');
        const body = $('body');
        const icon = $(this).find('i');
        body.toggleClass('fullscreen-active');
        resultsCard.toggleClass('card-fullscreen');
        if (resultsCard.hasClass('card-fullscreen')) {
            icon.removeClass('bi-arrows-fullscreen').addClass('bi-arrows-angle-contract');
        } else {
            icon.removeClass('bi-arrows-angle-contract').addClass('bi-arrows-fullscreen');
        }
        setTimeout(() => $('#playersTable').bootstrapTable('resetView'), 300); 
    });
}

function setupComparisonTool() {
    function generateComparisonTable(players, filter) {
        let tableHtml = '<table class="table table-bordered table-hover"><thead><tr><th>Attribute</th>';
        players.forEach(player => { tableHtml += `<th>${player.Name}</th>`; });
        tableHtml += '</tr></thead><tbody>';

        let attributesToShow = [];
        if (filter === 'key_attributes') {
            attributesToShow = ['Age', 'Position', 'Personality', 'Height', 'Speed', 'Workrate', 'HighestScore', 'HighestScoringRole'];
            const roleCodes = (JSON.parse(localStorage.getItem('selectedRoles')) || []).map(r => r.code);
            attributesToShow.push(...roleCodes);
        } else {
            const roleData = getRoleDataByCode(filter);
            if (roleData) {
                attributesToShow.push(roleData.RoleCode);
                attributesToShow.push(...Object.entries(roleData)
                    .filter(([key, value]) => typeof value === 'number' && value > 0 && key !== 'Role' && key !== 'RoleCode')
                    .sort(([, a], [, b]) => b - a).map(([key]) => key));
            }
        }
        
        attributesToShow.forEach(attr => {
            if (!players[0].hasOwnProperty(attr)) return;
            tableHtml += '<tr>';
            let attrName = attr;
            const roleDetails = getRoleDataByCode(attr);
            if (roleDetails) attrName = roleDetails.Role;
            tableHtml += `<td><strong>${attrName}</strong></td>`;
            let values = players.map(p => p[attr]);
            let bestValue = -Infinity;
            let isNumeric = values.every(val => !isNaN(parseFloat(val)));
            if (isNumeric) bestValue = Math.max(...values.map(v => parseFloat(v)));
            values.forEach(value => {
                const isBest = isNumeric && parseFloat(value) === bestValue;
                tableHtml += `<td class="${isBest ? 'table-success fw-bold' : ''}">${value}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';
        $('#comparison-content').html(tableHtml);
    }

    $('#compare-btn').on('click', function() {
        const selections = $('#playersTable').bootstrapTable('getSelections');
        if (selections.length < 2) return;
        const $filter = $('#comparison-role-filter');
        $filter.empty().append('<option value="key_attributes" selected>Key Attributes & All Scores</option>');
        const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
        selectedRoles.forEach(role => $filter.append(`<option value="${role.code}">${role.name}</option>`));
        generateComparisonTable(selections, 'key_attributes');
        $('#comparisonModal').modal('show');
    });

    $('#comparison-role-filter').on('change', function() {
        const selections = $('#playersTable').bootstrapTable('getSelections');
        generateComparisonTable(selections, $(this).val());
    });
}

const PRESETS_KEY = 'fmScoring_presets';
function savePreset() {
    const presetName = $('#preset-name-input').val().trim();
    if (!presetName) return showToast('Please enter a name for the preset.', 'Preset Error', 'error');
    const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
    if (selectedRoles.length === 0) return showToast('Select at least one role to save a preset.', 'Preset Error', 'error');
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY)) || {};
    presets[presetName] = selectedRoles.map(r => r.code);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    $('#preset-name-input').val('');
    showToast(`Preset '${presetName}' saved successfully.`, 'Success', 'success');
    loadPresetsList();
}

function loadPresetsList() {
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY)) || {};
    const $list = $('#presets-list');
    $list.find('.preset-item, .delete-preset-btn, .dropdown-item-text').remove();
    if (Object.keys(presets).length === 0) {
        $list.append('<li><span class="dropdown-item-text text-muted small px-3">No presets saved.</span></li>');
        return;
    }
    for (const name in presets) {
        const listItem = $(`<li class="preset-item dropdown-item d-flex justify-content-between align-items-center"><a href="#" class="text-decoration-none text-reset flex-grow-1">${name}</a><button class="btn btn-sm btn-outline-danger delete-preset-btn" data-preset-name="${name}" title="Delete preset"><i class="bi bi-trash3"></i></button></li>`);
        $list.append(listItem);
    }
}

function setupPresets() {
    loadPresetsList();
    $('#save-preset-btn').on('click', savePreset);
    $('#presets-list').on('click', '.preset-item a', function(e) {
        e.preventDefault();
        const presetName = $(this).text();
        const presets = JSON.parse(localStorage.getItem(PRESETS_KEY));
        const roleCodes = presets[presetName];
        const allRolesData = JSON.parse(localStorage.getItem('seedData'));
        const newSelectedRoles = roleCodes.map(code => {
            const roleData = allRolesData.find(r => r.RoleCode === code);
            return { code: roleData.RoleCode, name: roleData.Role };
        });
        localStorage.setItem('selectedRoles', JSON.stringify(newSelectedRoles));
        updateSelectedRolesSummary();
        updateUIFromStoredSelection();
        showToast(`Preset '${presetName}' loaded.`, 'Preset Loaded', 'success');
    });
    $('#presets-list').on('click', '.delete-preset-btn', function(e) {
        e.stopPropagation(); 
        const presetName = $(this).data('preset-name');
        if (confirm(`Are you sure you want to delete the preset '${presetName}'?`)) {
            const presets = JSON.parse(localStorage.getItem(PRESETS_KEY));
            delete presets[presetName];
            localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
            loadPresetsList();
            showToast(`Preset '${presetName}' deleted.`, 'Success', 'success');
        }
    });
}