
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
    $("#sel_plugin").on('change', function() {
        window.location = 'index.php?v=d&p=message&plugin=' + $('#sel_plugin').value();
    });

    $("#bt_clearMessage").on('click', function(event) {
        var tr = $(this).closest('tr');
        if (message.clear($('#sel_plugin').value())) {
            window.location.reload();
        }
    });

    $("#table_message").delegate(".removeMessage", 'click', function(event) {
        var tr = $(this).closest('tr');
        if (message.remove(tr.attr('data-message_id'))) {
            tr.remove();
        }
    });
});