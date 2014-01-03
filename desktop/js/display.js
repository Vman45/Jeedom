
/* This file is part of Jeedom.
*
* Jeedom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Jeedom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
*/

$(function() {
    $("#div_tree").jstree({"plugins": ["themes", "html_data"]});

    /***************************Commandes****************************/
    $('.infoCmd').on('click', function() {
        displayCmd($(this).attr('cmd_id'));
    });

    $('.infoObject').on('click', function() {
        displayObject($(this).attr('object_id'));
    });

    $('.infoEqLogic').on('click', function() {
        displayEqLogic($(this).attr('eqLogic_id'));
    });

});


/***************************Commandes****************************/
function displayCmd(_cmd_id) {
    $.hideAlert();
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "core/ajax/cmd.ajax.php", // url du fichier php
        data: {
            action: "getById",
            id: _cmd_id
        },
        dataType: 'json',
        error: function(request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function(data) {
            if (data.state != 'ok') {
                $('#div_alert').showAlert({message: data.result, level: 'danger'});
                return;
            }
            $('#div_displayInfo').empty();
            var div = '<div class="row">';
            div += '<div class="col-lg-6" >';
            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">ID</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="id"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Nom</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="name"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Type</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="type"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Sous-type</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="subType"></span>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '</div>';
            div += '<div class="col-lg-6" >';


            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Unité</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="unite"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Memcache</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary tooltips" l1key="cache" l2key="enable" title="Actif"></span> ';
            div += '<span class="label label-default tooltips" title="Durée du cache"><span class="cmdAttr" l1key="cache" l2key="lifetime"></span> seconde(s)</span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Historisé</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="isHistorized"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Evenement seulement</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="cmdAttr label label-primary" l1key="eventOnly"></span>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '</div>';
            div += '</div>';


            div += '<div>';
            div += '<legend>Configuration</legend>';
            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-2 control-label">Dashboard widget</label>';
            div += '<div class="col-lg-3">';
            div += '<select class="form-control cmdAttr" l1key="template" l2key="dashboard">';
            for (var i in cmd_widgetDashboard[data.result.type][data.result.subType]) {
                div += '<option>' + cmd_widgetDashboard[data.result.type][data.result.subType][i].name + '</option>';
            }
            div += '</select>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-2 control-label">Mobile widget</label>';
            div += '<div class="col-lg-3">';
            div += '<select class="form-control cmdAttr" l1key="template" l2key="mobile">';
            for (var i in cmd_widgetMobile[data.result.type][data.result.subType]) {
                div += '<option>' + cmd_widgetMobile[data.result.type][data.result.subType][i].name + '</option>';
            }
            div += '</select>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '<a class="btn btn-success" id="saveCmd"><i class="fa fa-check-circle"></i> Enregistrer</a>';

            $('#div_displayInfo').html(div);
            $('#div_displayInfo').setValues(data.result, '.cmdAttr');
            $('#saveCmd').off().on('click', function() {
                saveCmd();
            });

        }
    });
}

function saveCmd() {
    var cmd = $('#div_displayInfo').getValues('.cmdAttr');
    cmd = cmd[0];
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "core/ajax/cmd.ajax.php", // url du fichier php
        data: {
            action: "save",
            cmd: json_encode(cmd)
        },
        dataType: 'json',
        global: false,
        error: function(request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function(data) { // si l'appel a bien fonctionné
            if (data.state != 'ok') {
                $('#div_alert').showAlert({message: data.result, level: 'danger'});
                return;
            }
            $('#div_alert').showAlert({message: 'Enregistrement réussi', level: 'success'});
        }
    });
}

/***********************Objet***************************/
function displayObject(_object_id) {
    $.hideAlert();
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "core/ajax/object.ajax.php", // url du fichier php
        data: {
            action: "byId",
            id: _object_id
        },
        dataType: 'json',
        error: function(request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function(data) {
            if (data.state != 'ok') {
                $('#div_alert').showAlert({message: data.result, level: 'danger'});
                return;
            }
            $('#div_displayInfo').empty();
            var div = '<div class="row">';
            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-2 control-label">ID</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="objectAttr label label-primary" l1key="id"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-2 control-label">Nom</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="objectAttr label label-primary" l1key="name"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-2 control-label">Visible</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="objectAttr label label-primary" l1key="isVisible"></span>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '</div>';
            $('#div_displayInfo').html(div);
            $('#div_displayInfo').setValues(data.result, '.objectAttr');
        }
    });
}

/***********************EqLogic***************************/
function displayEqLogic(_eqLogic_id) {
    $.hideAlert();
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "core/ajax/eqLogic.ajax.php", // url du fichier php
        data: {
            action: "byId",
            id: _eqLogic_id
        },
        dataType: 'json',
        error: function(request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function(data) {
            if (data.state != 'ok') {
                $('#div_alert').showAlert({message: data.result, level: 'danger'});
                return;
            }
            $('#div_displayInfo').empty();
            var div = '<div class="row">';
            div += '<div class="col-lg-6" >';
            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">ID</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="id"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Nom</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="name"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Logical ID</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="logicalId"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Object ID</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="object_id"></span>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '</div>';
            div += '<div class="col-lg-6" >';
            div += '<form class="form-horizontal">';
            div += '<fieldset>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Type</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="eqType_name"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Activer</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="isEnable"></span>';
            div += '</div>';
            div += '</div>';

            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Visible</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="isVisible"></span>';
            div += '</div>';
            div += '</div>';
            
            div += '<div class="form-group">';
            div += '<label class="col-lg-4 control-label">Tentative échouée</label>';
            div += '<div class="col-lg-4">';
            div += '<span class="eqLogicAttr label label-primary" l1key="status" l2key="numberTryWithoutSuccess"></span>';
            div += '</div>';
            div += '</div>';

            div += '</fieldset>';
            div += '</form>';
            div += '</div>';
            div += '</div>';
            $('#div_displayInfo').html(div);
            $('#div_displayInfo').setValues(data.result, '.eqLogicAttr');
        }
    });
}