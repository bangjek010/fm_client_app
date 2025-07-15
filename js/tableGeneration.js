function initializeBootstrapTable(data) {

    $('#table-placeholder').hide();
    $('#table-container').show();

    var useWageTitle = data.some(item => item.Wage !== undefined);

    var columns = [
        { field: 'state', checkbox: true },
        { field: 'Inf', title: 'Inf', sortable: true, visible: false },
        { field: 'Name', title: 'Name', sortable: true, filterControl: 'input' },
        { field: 'Age', title: 'Age', sortable: true, filterControl: 'input' },
        { field: 'Club', title: 'Club', sortable: true, filterControl: 'select', visible: false },
        {
            field: 'Wage',
            title: useWageTitle ? 'Wage' : 'Salary',
            sortable: true,
            visible: false,
            formatter: function (value, row) {
                return row.Wage || row.Salary;
            }
        },
        { field: 'Nationality', title: 'Nat', titleTooltip: 'Nationality', sortable: true, filterControl: 'select' },
        { field: 'Position', title: 'Position', sortable: true, filterControl: 'select' },
        { field: 'Personality', title: 'Personality', sortable: true, filterControl: 'select', visible: false },
        { field: 'Media Handling', title: 'Media Handling', sortable: true, filterControl: 'select', visible: false },
        { field: 'Left Foot', title: 'Left Foot', sortable: true, visible: false },
        { field: 'Right Foot', title: 'Right Foot', sortable: true, visible: false },
        { field: 'Speed', title: 'Spd', titleTooltip: 'Speed', sortable: true, filterControl: 'input' },
        { field: 'Jum', title: 'Jmp', titleTooltip: 'Jumping Reach', sortable: true, filterControl: 'input' },
        { field: 'Str', title: 'Str', titleTooltip: 'Strength', sortable: true, filterControl: 'input' },
        { field: 'Workrate', title: 'Work', titleTooltip: 'Workrate', sortable: true, filterControl: 'input' },
        { field: 'Height', title: 'Height', sortable: true, visible: false, filterControl: 'input' },
    ];


    var selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
    selectedRoles.forEach(function (role) {
        columns.push({
            field: role.code,
            title: role.code,
            sortable: true,
            titleTooltip: role.name,
            filterControl: 'input' 
        });
    });

    columns.push(
        { field: 'HighestScore', title: 'Best Score', sortable: true, filterControl: 'input' },
        { field: 'HighestScoringRole', title: 'Best Role', sortable: true, filterControl: 'select' }
    );

    var $table = $('#playersTable');

    if ($table.bootstrapTable('getData').length > 0 || $table.data('bootstrap.table')) {
        $table.bootstrapTable('destroy');
    }

    $table.bootstrapTable({
        data: data,
        columns: columns,
        clickToSelect: true,
        filterControl: true,
        filterShowClear: true,
        onCheck: function (row) { updateCompareButtonState(); },
        onUncheck: function (row) { updateCompareButtonState(); },
        onCheckAll: function (rows) { updateCompareButtonState(); },
        onUncheckAll: function (rows) { updateCompareButtonState(); }
    });
}

function updateCompareButtonState() {
    var selections = $('#playersTable').bootstrapTable('getSelections');
    var count = selections.length;
    $('#selection-count').text(count);

    if (count >= 2) {
        $('#compare-btn').prop('disabled', false);
    } else {
        $('#compare-btn').prop('disabled', true);
    }
}
