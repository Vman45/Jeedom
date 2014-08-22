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
var noBootstrapTooltips = true;
var grid = false;


$("#md_addViewData").dialog({
    autoOpen: false,
    modal: true,
    height: (jQuery(window).height() - 150),
    width: (jQuery(window).width() - 450)
});
/*****************************PLAN HEADER***********************************/
$('#bt_addPlanHeader').on('click', function() {
    bootbox.prompt("Nom du plan ?", function(result) {
        if (result !== null) {
            jeedom.plan.saveHeader({
                planHeader: {name: result},
                error: function(error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function(data) {
                    window.location.replace('index.php?v=d&p=plan&plan_id=' + data.id);
                }
            });
        }
    });
});

$('#bt_removePlanHeader').on('click', function() {
    bootbox.confirm('{{Etes-vous sûr de vouloir supprimer ce plan ?', function(result) {
        if (result) {
            jeedom.plan.removeHeader({
                id: planHeader_id,
                error: function(error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function() {
                    window.location.replace('index.php?v=d&p=plan');
                }
            });
        }
    });
});

$('#bt_editPlanHeader').on('click', function() {
    bootbox.prompt("Nom du plan ?", function(result) {
        if (result !== null) {
            jeedom.plan.saveHeader({
                planHeader: {name: result, id: planHeader_id},
                error: function(error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function(data) {
                    window.location.replace('index.php?v=d&p=plan&plan_id=' + data.id);
                }
            });
        }
    });
});

$('#bt_uploadImage').fileupload({
    url: 'core/ajax/plan.ajax.php?action=uploadImage&id=' + planHeader_id,
    dataType: 'json',
    done: function(e, data) {
        if (data.result.state != 'ok') {
            $('#div_alert').showAlert({message: data.result.result, level: 'danger'});
            return;
        }
        $('#div_alert').showAlert({message: '{{Fichier(s) ajouté(s) avec succès}}', level: 'success'});
        window.location.reload();
    }
});

$('#sel_planHeader').on('change', function() {
    window.location.replace('index.php?v=d&p=plan&plan_id=' + $(this).value());
});

/*****************************PLAN***********************************/
$('#bt_addEqLogic').on('click', function() {
    jeedom.eqLogic.getSelectModal({}, function(data) {
        addEqLogic(data.id);
        savePlan();
    });
});

$('#bt_addScenario').on('click', function() {
    jeedom.scenario.getSelectModal({}, function(data) {
        addScenario(data.id);
        savePlan();
    });
});

$('#bt_addLink').on('click', function() {
    $('#md_selectLink').modal('show');
    savePlan();
});

$('#bt_addGraph').on('click', function() {
    addGraph({});
    savePlan();
});

displayPlan();

$(window).resize(function(e) {
    if (e.target == window) {
        //displayPlan();
    }
});

$('#bt_savePlan').on('click', function() {
    savePlan();
});

$('#div_displayObject').delegate('.eqLogic-widget', 'dblclick', function() {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        $('#md_modal').dialog({title: "{{Configuration du plan}}"});
        $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type=eqLogic&link_id=' + $(this).attr('data-eqLogic_id') + '&planHeader_id=' + planHeader_id).dialog('open');
    }
});

$('#div_displayObject').delegate('.scenario-widget', 'dblclick', function() {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        $('#md_modal').dialog({title: "{{Configuration du plan}}"});
        $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type=scenario&link_id=' + $(this).attr('data-scenario_id') + '&planHeader_id=' + planHeader_id).dialog('open');
    }
});

$('#div_displayObject').delegate('.plan-link-widget', 'dblclick', function() {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        $('#md_modal').dialog({title: "{{Configuration du plan}}"});
        $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type=plan&link_id=' + $(this).attr('data-link_id') + '&planHeader_id=' + planHeader_id).dialog('open');
    }
});

$('#div_displayObject').delegate('.view-link-widget', 'dblclick', function() {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        $('#md_modal').dialog({title: "{{Configuration du plan}}"});
        $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type=view&link_id=' + $(this).attr('data-link_id') + '&planHeader_id=' + planHeader_id).dialog('open');
    }
});

$('#div_displayObject').delegate('.graph-widget', 'dblclick', function() {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        $('#md_modal').dialog({title: "{{Configuration du plan}}"});
        $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type=graph&link_id=' + $(this).attr('data-graph_id') + '&planHeader_id=' + planHeader_id).dialog('open');
    }
});

$('.ingrid').on('change', function() {
    var x = $('#in_gridX').value();
    var y = $('#in_gridY').value();
    if (x != '' && !isNaN(x) && y != '' && !isNaN(y) && x > 1 && y > 1) {
        grid = [$('#div_displayObject').width() / x, $('#div_displayObject').height() / y];
        initDraggable($('#bt_editPlan').attr('data-mode'));
    } else {
        grid = false;
        initDraggable($('#bt_editPlan').attr('data-mode'));
    }
});

$('.planHeaderAttr').on('change', function() {
    var planHeader = $('#div_planHeader').getValues('.planHeaderAttr')[0];
    planHeader.id = planHeader_id;
    jeedom.plan.saveHeader({
        planHeader: planHeader,
        global: false,
        error: function(error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function(data) {

        }
    });
});

function setColorSelect(_select) {
    _select.css('background-color', _select.find('option:selected').val());
}

$('.graphDataOption[data-l1key=configuration][data-l2key=graphColor]').on('change', function() {
    setColorSelect($(this).closest('select'));
});

$('#div_displayObject').delegate('.configureGraph', 'click', function() {
    var el = $(this).closest('.graph-widget');
    $('#table_addViewData tbody tr .enable').prop('checked', false);
    var options = json_decode(el.find('.graphOptions').value());
    for (var i in options) {
        var tr = $('#table_addViewData tbody tr[data-link_id=' + options[i].link_id + ']');
        tr.find('.enable').value(1);
        tr.setValues(options[i], '.graphDataOption');
        setColorSelect(tr.find('.graphDataOption[data-l1key=configuration][data-l2key=graphColor]'));
    }

    $("#md_addViewData").dialog('option', 'buttons', {
        "Annuler": function() {
            $(this).dialog("close");
        },
        "Valider": function() {
            var tr = $('#table_addViewData tbody tr:first');
            var options = [];
            while (tr.attr('data-link_id') != undefined) {
                if (tr.find('.enable').is(':checked')) {
                    var graphData = tr.getValues('.graphDataOption')[0];
                    graphData.link_id = tr.attr('data-link_id');
                    options.push(graphData);
                }
                tr = tr.next();
            }
            el.find('.graphOptions').empty().append(json_encode(options));
            savePlan(true);
            $(this).dialog('close');
        }
    });
    $('#md_addViewData').dialog('open');
});

$('#bt_editPlan').on('click', function() {
    if ($(this).attr('data-mode') == '0') {
        initDraggable(1);
        $('.editMode').show();
        $(this).html('<i class="fa fa-pencil"></i> {{Quitter le mode édition}}');
        $(this).attr('data-mode', '1');
    } else {
        initDraggable(0);
        $('.editMode').hide();
        $(this).html('<i class="fa fa-pencil"></i> {{Mode édition}}');
        $(this).attr('data-mode', '0');
    }
});

function makeGrid(_x, _y) {
    if (_x === false) {
        $('#div_displayObject').css({
            'background-size': _x + 'px ' + _y + 'px',
            'background-image': 'none'
        });
    } else {
        $('#div_displayObject').css({
            'background-size': _x + 'px ' + _y + 'px',
            'background-position': '-4px -8px',
            'background-image': 'repeating-linear-gradient(0deg, silver, silver 1px, transparent 1px, transparent ' + _y + 'px),repeating-linear-gradient(-90deg, silver, silver 1px, transparent 1px, transparent ' + _x + 'px)'
        });
    }
}

function initDraggable(_state) {
    var offset = {};
    $('.eqLogic-widget,.scenario-widget').draggable({
        start: function(evt, ui) {
            offset.top = Math.round(ui.position.top / getZoomLevel($(this))) - ui.position.top;
            offset.left = Math.round(ui.position.left / getZoomLevel($(this))) - ui.position.left;
        },
        drag: function(evt, ui) {
            ui.position.top = Math.round(ui.position.top / getZoomLevel($(this))) - offset.top;
            ui.position.left = Math.round(ui.position.left / getZoomLevel($(this))) - offset.left;
            if (grid != false && grid[0] != false) {
                ui.position.top = Math.round(ui.position.top / (grid[1] / getZoomLevel($(this)))) * (grid[1] / getZoomLevel($(this)));
                ui.position.left = Math.round(ui.position.left / (grid[0] / getZoomLevel($(this)))) * (grid[0] / getZoomLevel($(this)));
            }

        },
    });
    $('.plan-link-widget,.view-link-widget,.graph-widget').draggable({
        drag: function(evt, ui) {
            if (grid != false && grid[0] != false) {
                ui.position.top = Math.round(ui.position.top / grid[1]) * grid[1];
                ui.position.left = Math.round(ui.position.left / grid[0]) * grid[0];
            }
        },
    });
    $('.graph-widget').resizable();
    $('#div_displayObject a').each(function() {
        if ($(this).attr('href') != '#') {
            $(this).attr('data-href', $(this).attr('href'));
            $(this).attr('href', '#');
        }
    });
    if (_state != 1 && _state != '1') {
        $('.plan-link-widget').draggable("destroy");
        $('.view-link-widget').draggable("destroy");
        $('.eqLogic-widget').draggable("destroy");
        $('.scenario-widget').draggable("destroy");
        $('.graph-widget').draggable("destroy");
        $('.graph-widget').resizable('destroy');
        $('#div_displayObject a').each(function() {
            $(this).attr('href', $(this).attr('data-href'));
        });
    }
}

function displayPlan() {
    var img = $('#div_displayObject img');
    var size_x = img.attr('data-sixe_x');
    var size_y = img.attr('data-sixe_y');
    var ratio = size_x / size_y;
    var height = $(window).height() - $('header').height() - $('#div_planHeader').height() - 45;
    var width = $(window).width() - 22;
    if (height < 500) {
        height = 500;
    }
    if (width < 750) {
        width = 750;
    }
    $('#div_displayObject').height(height);
    $('#div_displayObject').width(width);
    var rWidth = width;
    var rHeight = width / ratio;
    if (rHeight > height) {
        rHeight = height;
        rWidth = height * ratio;
    }

    $('#div_displayObject img').height(rHeight);
    $('#div_displayObject img').width(rWidth);

    if (planHeader_id != -1) {
        jeedom.plan.byPlanHeader({
            id: planHeader_id,
            error: function(error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function(data) {
                for (var i in data) {
                    if (data[i].plan.link_type == 'graph') {
                        addGraph(data[i].plan);
                    } else {
                        displayObject(data[i].plan.link_type, data[i].plan.link_id, data[i].html, data[i].plan);
                    }
                }
            },
        });
        jeedom.plan.getHeader({
            id: planHeader_id,
            error: function(error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function(data) {
                $('#div_planHeader').setValues(data, '.planHeaderAttr');
            },
        });
    }
}

function getZoomLevel(_el) {
    var zoom = _el.css('zoom');
    if (zoom == undefined) {
        return 1;
    }
    return zoom;
}

function savePlan(_refreshDisplay) {
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        var parent = {
            height: $('#div_displayObject img').height(),
            width: $('#div_displayObject img').width(),
        };
        var plans = [];
        $('.eqLogic-widget').each(function() {
            var plan = {};
            plan.position = {};
            plan.link_type = 'eqLogic';
            plan.link_id = $(this).attr('data-eqLogic_id');
            plan.planHeader_id = planHeader_id;
            if ($(this).css('zoom') != undefined) {
                var zoom = getZoomLevel($(this));
                $(this).css('zoom', '100%');
                var position = $(this).position();
                $(this).css('zoom', zoom);
            } else {
                var position = $(this).position();
                zoom = 1;
            }
            plan.position.top = (((position.top * zoom)) / parent.height) * 100;
            plan.position.left = (((position.left * zoom)) / parent.width) * 100;
            plans.push(plan);
        });
        $('.scenario-widget').each(function() {
            var plan = {};
            plan.position = {};
            plan.link_type = 'scenario';
            plan.link_id = $(this).attr('data-scenario_id');
            plan.planHeader_id = planHeader_id;
            if ($(this).css('zoom') != undefined) {
                var zoom = getZoomLevel($(this));
                $(this).css('zoom', '100%');
                var position = $(this).position();
                $(this).css('zoom', zoom);
            } else {
                var position = $(this).position();
                zoom = 1;
            }
            plan.position.top = (((position.top * zoom)) / parent.height) * 100;
            plan.position.left = (((position.left * zoom)) / parent.width) * 100;
            plans.push(plan);
        });
        $('.plan-link-widget').each(function() {
            var plan = {};
            plan.position = {};
            plan.link_type = 'plan';
            plan.link_id = $(this).attr('data-link_id');
            plan.planHeader_id = planHeader_id;
            var position = $(this).position();
            plan.position.top = ((position.top) / parent.height) * 100;
            plan.position.left = ((position.left) / parent.width) * 100;
            plans.push(plan);
        });
        $('.view-link-widget').each(function() {
            var plan = {};
            plan.position = {};
            plan.link_type = 'view';
            plan.link_id = $(this).attr('data-view_id');
            plan.planHeader_id = planHeader_id;
            var position = $(this).position();
            plan.position.top = ((position.top) / parent.height) * 100;
            plan.position.left = ((position.left) / parent.width) * 100;
            plans.push(plan);
        });
        $('.graph-widget').each(function() {
            var plan = {};
            plan.position = {};
            plan.display = {};
            plan.link_type = 'graph';
            plan.link_id = $(this).attr('data-graph_id');
            plan.planHeader_id = planHeader_id;
            plan.display.height = $(this).height();
            plan.display.width = $(this).width();
            plan.display.graph = json_decode($(this).find('.graphOptions').value());
            var position = $(this).position();
            plan.position.top = ((position.top) / parent.height) * 100;
            plan.position.left = ((position.left) / parent.width) * 100;
            plans.push(plan);
        });
        jeedom.plan.save({
            plans: plans,
            error: function(error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function() {
                if (init(_refreshDisplay, false)) {
                    displayPlan();
                }
            },
        });
    }
}

function displayObject(_type, _id, _html, _plan) {
    for (var i in jeedom.history.chart) {
        delete jeedom.history.chart[i];
    }
    _plan = init(_plan, {});
    _plan.position = init(_plan.position, {});
    _plan.css = init(_plan.css, {});
    if (_type == 'eqLogic') {
        var defaultZoom = 0.65;
        $('.eqLogic-widget[data-eqLogic_id=' + _id + ']').remove();
    }
    if (_type == 'scenario') {
        var defaultZoom = 1;
        $('.scenario-widget[data-scenario_id=' + _id + ']').remove();
    }
    if (_type == 'view') {
        var defaultZoom = 1;
        $('.view-link-widget[data-link_id=' + _id + ']').remove();
    }
    if (_type == 'plan') {
        var defaultZoom = 1;
        $('.plan-link-widget[data-link_id=' + _id + ']').remove();
    }
    if (_type == 'graph') {
        var defaultZoom = 1;
        $('.graph-widget[data-graph_id=' + _id + ']').remove();
    }
    var parent = {
        height: $('#div_displayObject img').height(),
        width: $('#div_displayObject img').width(),
    };
    var html = $(_html);
    $('#div_displayObject').append(html);

    for (var key in _plan.css) {
        if (_plan.css[key] != '') {
            html.css(key, _plan.css[key]);
        }
    }
    html.css('position', 'absolute');
    html.css('zoom', init(_plan.css.zoom, defaultZoom));
    html.css('-moz-transform', 'scale(' + init(_plan.css.zoom, defaultZoom) + ',' + init(_plan.css.zoom, defaultZoom) + ')');
    var position = {
        top: init(_plan.position.top, '10') * parent.height / 100,
        left: init(_plan.position.left, '10') * parent.width / 100,
    };
    if (html.css('zoom') != undefined) {
        html.css('top', position.top / init(_plan.css.zoom, defaultZoom));
        html.css('left', position.left / init(_plan.css.zoom, defaultZoom));
    } else {
        html.css('top', position.top - html.height() * 0.52 * (1 - init(_plan.css.zoom, defaultZoom)));
        html.css('left', position.left - html.width() * 0.52 * (1 - init(_plan.css.zoom, defaultZoom)));
    }

    if (_type == 'eqLogic') {
        if (isset(_plan.display) && isset(_plan.display.cmd)) {
            for (var id in _plan.display.cmd) {
                if (_plan.display.cmd[id] == 1) {
                    $('.cmd[data-cmd_id=' + id + ']').remove();
                }
            }
        }
        if (isset(_plan.display) && (isset(_plan.display.name) && _plan.display.name == 0) ) {
            html.find('.widget-name').remove();
        }
    }
    initDraggable($('#bt_editPlan').attr('data-mode'));
}

/***************************EqLogic**************************************/
function addEqLogic(_id, _plan) {
    jeedom.eqLogic.toHtml({
        id: _id,
        version: 'dashboard',
        error: function(error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function(data) {
            displayObject('eqLogic', _id, data.html, _plan);
        }
    })
}

/***************************Scenario**************************************/
function addScenario(_id, _plan) {
    jeedom.scenario.toHtml({
        id: _id,
        version: 'dashboard',
        error: function(error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function(data) {
            displayObject('scenario', _id, data, _plan);
        }
    })
}

/**********************************GRAPH************************************/
function addGraph(_plan) {
    _plan = init(_plan, {});
    _plan.display = init(_plan.display, {});
    _plan.link_id = init(_plan.link_id, Math.round(Math.random() * 99999999) + 9999);
    var options = init(_plan.display.graph, '[]');
    var html = '<div class="graph-widget" data-graph_id="' + _plan.link_id + '" style="width : ' + init(_plan.display.width, 400) + 'px;height : ' + init(_plan.display.height, 200) + 'px;background-color : white;border : solid 1px black;">';
    if ($('#bt_editPlan').attr('data-mode') == "1") {
        html += '<i class="fa fa-cogs pull-right editMode configureGraph" style="margin-right : 5px;margin-top : 5px;"></i>';
    } else {
        html += '<i class="fa fa-cogs pull-right editMode configureGraph" style="margin-right : 5px;margin-top : 5px;display:none;"></i>';
    }
    html += '<span class="graphOptions" style="display:none;">' + json_encode(init(_plan.display.graph, '[]')) + '</span>';
    html += '<div class="graph" id="graph' + _plan.link_id + '" style="width : 100%;height : 90%;"></div>';
    html += '</div>';
    displayObject('graph', _plan.link_id, html, _plan);
   
    for (var i in options) {
        if (init(options[i].link_id) != '') {
            jeedom.history.drawChart({
                cmd_id: options[i].link_id,
                el: 'graph' + _plan.link_id,
                dateRange: init(_plan.display.dateRange, '7 days'),
                option: init(options[i].configuration, {}),
                global : false,
            });
        }
    }
}


$('#div_displayObject').delegate('.graph-widget', 'resize', function() {
    if (isset(jeedom.history.chart['graph' + $(this).attr('data-graph_id')])) {
        jeedom.history.chart['graph' + $(this).attr('data-graph_id')].chart.reflow();
    }
});
/**********************************LINK************************************/
$('#md_selectLink .linkType').on('change', function() {
    $('#md_selectLink .linkOption').hide();
    $('#md_selectLink .link' + $(this).value()).show();
});

$('#md_selectLink .validate').on('click', function() {
    var link = {};
    link.type = $('#md_selectLink .linkType').value();
    link.id = $('#md_selectLink .link' + link.type + ' .linkId').value();
    link.name = $('#md_selectLink .link' + link.type + ' .linkId option:selected').text();
    $('#md_selectLink').modal('hide');
    addLink(link);
});

function addLink(_link, _plan) {
    var link = '';
    var label = '';
    if (_link.type == 'plan') {
        link = 'index.php?v=d&p=plan&plan_id=' + _link.id;
        label = 'label-success';
    }
    if (_link.type == 'view') {
        link = 'index.php?v=d&p=view&view_id=' + _link.id;
        label = 'label-primary';
    }
    var html = '<span class="' + _link.type + '-link-widget label ' + label + '" data-link_id="' + _link.id + '" >';
    html += '<a href="' + link + '" style="color:white;text-decoration:none;font-size : 1.5em;">';
    html += _link.name;
    html += '</a>';
    html += '</span>';
    displayObject(_link.type, _link.id, html, _plan);
}
