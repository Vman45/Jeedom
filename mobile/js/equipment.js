function initLocalPage(_object_id) {
    if (isset(_object_id) && is_numeric(_object_id)) {
        loadObject(_object_id);
    }
    var objects = object.all();
    var li = ' <ul data-role="listview">';
    for (var i in objects) {
        li += '<li><a href="#" class="link" data-page="equipment" data-title="' + objects[i].name + '" data-option="' + objects[i].id + '">' + objects[i].name + '<a></li>'
    }
    li += '</ul>';
    panel(li);
}

function loadObject(_object_id) {
    var equipements = object.getEqLogic(_object_id);

    var html = '';
    for (var i in equipements) {
        var result = eqLogic.toHtml(equipements[i].id, 'mobile');
        html += result.html;
    }
    $('#div_displayEquipement').empty().html(html).trigger('create');
}