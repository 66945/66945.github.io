function addSplit(table, position) {
    let row = table.insertRow(position);
    row.insertCell(0);
    row.insertCell(1).innerHTML = '<hr>';
    row.insertCell(2);
}

function onTeacherDataLoad() {
    let table = document.getElementById('rankings');

    addRow(table, teachers[0], 1);
    addRow(table, teachers[1], 2);
    addRow(table, teachers[2], 3);

    addRow(table, teachers[teachers.length-3], teachers.length-2);
    addRow(table, teachers[teachers.length-2], teachers.length-1);
    addRow(table, teachers[teachers.length-1], teachers.length);

    addSplit(table, 4);
}

loadTeacherData();