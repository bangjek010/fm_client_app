function editInit() {
    $('#roleList').on('click', '.edit-role', function (e) {
        e.stopPropagation();
        var roleCode = $(this).data('rolecode');
        var roleData = getRoleDataByCode(roleCode);
        $('#resetSingleRoleBtn').data('rolecode', roleCode);
        $('#roleListModal').modal('hide');
        $('#roleListModal').one('hidden.bs.modal', function () {
            var $editForm = generateEditForm(roleData);
            $('#editRoleModal').find('.modal-body').empty().append($editForm);
            $('#editRoleModal').modal('show');
        });
    });

    $('#saveRoleChanges').click(function () {
        var updatedRoleData = {};
        $('#editRoleForm').find('input, select').each(function () {
            var inputName = $(this).attr('name');
            var inputValue = $(this).val();
            updatedRoleData[inputName] = $(this).attr('type') === 'number' ? parseFloat(inputValue) : inputValue;
        });
        updateRoleData(updatedRoleData, true);
        $('#editRoleModal').modal('hide');
    });

    $('#resetSingleRoleBtn').on('click', function() {
        const roleCodeToReset = $(this).data('rolecode');
        if (!roleCodeToReset || !confirm("Are you sure you want to reset this role's weights to their default values?")) return;

        const defaultRoleData = rolesJSON.find(role => role.RoleCode === roleCodeToReset);
        if (!defaultRoleData) return showToast("Could not find default data for this role.", "Error", "error");

        updateRoleData(defaultRoleData, true);
        

        const $form = $('#editRoleForm');
        for (const key in defaultRoleData) {
            if (defaultRoleData.hasOwnProperty(key)) {
                $form.find(`[name="${key}"]`).val(defaultRoleData[key]);
            }
        }
        showToast(`Role '${defaultRoleData.Role}' has been reset to default.`, "Success", "success");
    });
}

function updateRoleData(roleData, shouldRecalculate) {
    let allRolesData = loadLocalData();
    const roleIndex = allRolesData.findIndex(role => role.RoleCode === roleData.RoleCode);

    if (roleIndex !== -1) {
        allRolesData[roleIndex] = roleData;
    } else {

        allRolesData.push(roleData);
    }
    
    localStorage.setItem(seedDataKey, JSON.stringify(allRolesData));
    
    if (shouldRecalculate) {

        recalculateScoresGlobally();
    }
}


function generateEditForm(roleData) {
    var $form = $('<form id="editRoleForm" class="container-fluid"></form>');
    var $currentRow = $('<div class="row"></div>');
    var index = 0;
    var keys = Object.keys(roleData);
    keys.sort((a, b) => {
        if (a === 'Role') return -1; if (b === 'Role') return 1;
        if (a === 'RoleCode') return -1; if (b === 'RoleCode') return 1;
        return a.localeCompare(b);
    });
    for (var key of keys) {
        if (roleData.hasOwnProperty(key)) {
            if (index % 4 === 0) {
                $currentRow = $('<div class="row"></div>');
                $form.append($currentRow);
            }
            var $col = $('<div class="col-md-3"></div>');
            var $formGroup = $('<div class="mb-3"></div>');
            var $label = $(`<label class="form-label">${key}</label>`);
            var inputType = (key === 'Role' || key === 'RoleCode') ? 'text' : 'number';
            var $input = $(`<input type="${inputType}" class="form-control" id="${key}" name="${key}" value="${roleData[key]}" autocomplete="off">`);
            if (key === 'Role' || key === 'RoleCode') $input.prop('disabled', true);
            if (inputType === 'number') $input.attr('min', 0).attr('max', 5).attr('step', 1);
            $formGroup.append($label, $input);
            $col.append($formGroup);
            $currentRow.append($col);
            index++;
        }
    }
    return $form;
}
