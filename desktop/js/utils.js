
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
    /*********************Gestion de l'heure********************************/
    setInterval(function() {
        var date = new Date();
        date.setTime(date.getTime() + clientServerDiffDatetime);
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconde = date.getSeconds();
        var horloge = (hour < 10) ? '0' + hour : hour;
        horloge += ':';
        horloge += (minute < 10) ? '0' + minute : minute;
        horloge += ':';
        horloge += (seconde < 10) ? '0' + seconde : seconde;
        $('#horloge').text(horloge);
    }, 1000);

    $.initTableFilter();
    activateTooltips();

    // Ajax Loading Screen
    $(document).ajaxStart(function() {
        $.showLoading();
    });
    $(document).ajaxStop(function() {
        $.hideLoading();
    });

    /************************Help*************************/
    //Display help
    $("#md_pageHelp").dialog({
        autoOpen: false,
        modal: true,
        height: (jQuery(window).height() - 150),
        width: 1000
    });

    $('#bt_pageHelp').on('click', function() {
        showHelpModal(getUrlVars('p'), getUrlVars('m'));
    });
});

function showHelpModal(_name, _module) {
    var module = '';
    if (init(_module) != false) {
        module = init(_module);
    }
    $('#md_pageHelp').load('index.php?v=d&module=' + module + '&modal=help.' + init(_name)).dialog('open');
}

function refreshMessageNumber() {
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "core/ajax/message.ajax.php", // url du fichier php
        data: {
            action: "nbMessage"
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
            $('#span_nbMessage').html('<i class="fa fa-envelope icon-white"></i> ' + data.result + ' message(s)');
            $('#span_nbMessage').show();
        }
    });
}

function notify(_title, _text, _class_name) {
    if (isset(_class_name) != '') {
        $.gritter.add({
            title: _title,
            text: _text,
            class_name: _class_name
        });
    } else {
        $.gritter.add({
            title: _title,
            text: _text
        });
    }
}


jQuery.fn.findAtDepth = function (selector, maxDepth) {
    var depths = [], i;

    if (maxDepth > 0) {
        for (i = 1; i <= maxDepth; i++) {
            depths.push('> ' + new Array(i).join('* > ') + selector);
        }

        selector = depths.join(', ');
    }
    return this.find(selector);
};