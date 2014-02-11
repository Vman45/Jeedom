<?php
if (!isConnect('admin')) {
    throw new Exception('Error 401 Unauthorized');
}

$nbLinePerPage = 500;

$page = init('page', 1);
$logfile = init('logfile', 'core');
$list_logfile = array();
$dir = opendir('log/');
$logExist = false;
while ($file = readdir($dir)) {
    if ($file != '.' && $file != '..') {
        $list_logfile[] = $file;
        if ($logfile == $file) {
            $logExist = true;
        }
    }
}
natcasesort($list_logfile);
if ((!$logExist || $logfile == '') && count($list_logfile) > 0) {
    $logfile = $list_logfile[0];
}
if ($logfile == '') {
    throw new Exception('No log file');
}
?>
<a class="btn btn-danger pull-right" id="bt_removeLog"><i class="fa fa-trash-o"></i> Supprimer</a>
<a class="btn btn-warning pull-right" id="bt_clearLog"><i class="fa fa-times"></i> Vider</a>
<select id="sel_log" class="pull-left form-control" style="width: 200px;">
    <?php
    foreach ($list_logfile as $file) {
        if ($file == $logfile) {
            echo '<option value="' . $file . '" selected>' . $file . '</option>';
        } else {
            echo '<option value="' . $file . '">' . $file . '</option>';
        }
    }
    ?>
</select>

<?php
$nbLine = log::nbLine($logfile);
$nbPage = ceil($nbLine / $nbLinePerPage);
$firstLine = $nbLine - $nbLinePerPage * $page;
if ($firstLine < 0) {
    $nbLinePerPage+=$firstLine;
    $firstLine = 0;
}
$log = log::get($logfile, $firstLine, $nbLinePerPage);

if (isset($log[0][0]) && $log[0][0] == '') {
    unset($log[0]);
}
?>
<br/><br/>

<center>
    <ul class="pagination">
        <?php
        if ($page > 1) {
            echo '<li><a class="changePage cursor" page="1">&laquo;</a></li>';
        } else {
            echo '<li class="disabled"><a>&laquo;</a></li>';
        }

        for ($i = 1; $i <= $nbPage; $i++) {
            if ($i == $page) {
                echo '<li class="active"><a class="changePage" data-page="' . $i . '">' . $i . '</a></li>';
            } else {
                echo '<li><a class="changePage cursor" data-page="' . $i . '">' . $i . '</a></li>';
            }
        }

        if ($page < $nbPage) {
            echo '<li><a class="changePage cursor" data-page="' . $nbPage . '">&raquo;</a></li>';
        } else {
            echo '<li class="disabled"><a>&raquo;</a></li>';
        }
        ?>
    </ul>
</center>


<table class="table table-condensed table-bordered tablesorter">
    <thead>
        <tr>
            <th style="width: 150px;">Date et heure</th><th style="width: 70px;">Type</th><th>Message</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($log !== false) {
            foreach ($log as $ligne) {
                $class = '';
                if (strtolower($ligne[1]) == 'error') {
                    $class = 'alert-danger';
                }
                if (strtolower($ligne[1]) == 'event') {
                    $class = 'alert-success';
                }
                if (strtolower($ligne[1]) == 'debug') {
                    $class = 'alert';
                }
                echo '<tr class="' . $class . '">';
                echo '<td class="datetime">' . $ligne[0] . '</td>';
                echo '<td class="type">' . $ligne[1] . '</td>';
                echo '<td class="message"><pre>' . $ligne[2] . '</pre></td>';
                echo '</tr>';
            }
        }
        ?>
    </tbody>
</table>

<center>
    <ul class="pagination">
        <?php
        if ($page > 1) {
            echo '<li><a class="changePage cursor" page="1">&laquo;</a></li>';
        } else {
            echo '<li class="disabled"><a>&laquo;</a></li>';
        }

        for ($i = 1; $i <= $nbPage; $i++) {
            if ($i == $page) {
                echo '<li class="active"><a class="changePage cursor" data-page="' . $i . '">' . $i . '</a></li>';
            } else {
                echo '<li><a class="changePage cursor" data-page="' . $i . '">' . $i . '</a></li>';
            }
        }

        if ($page < $nbPage) {
            echo '<li><a class="changePage cursor" data-page="' . $nbPage . '">&raquo;</a></li>';
        } else {
            echo '<li class="disabled"><a>&raquo;</a></li>';
        }
        ?>
    </ul>
</center>

<script>
    $(function() {
        $('.changePage').click(function() {
            window.location = 'index.php?v=d&p=log&page=' + $(this).attr('data-page') + '&logfile=' + $('#sel_log').value();
        });

        $("#sel_log").on('change', function() {
            log = $('#sel_log').value();
            window.location = 'index.php?v=d&p=log&logfile=' + log;
        });

        $("#bt_clearLog").on('click', function(event) {
            $.ajax({// fonction permettant de faire de l'ajax
                type: "POST", // methode de transmission des données au fichier php
                url: "core/ajax/log.ajax.php", // url du fichier php
                data: {
                    action: "clear",
                    logfile: $('#sel_log').value()
                },
                dataType: 'json',
                error: function(request, status, error) {
                    handleAjaxError(request, status, error);
                },
                success: function(data) { // si l'appel a bien fonctionné
                    if (data.state != 'ok') {
                        $('#div_alertError').showAlert({message: data.result, level: 'danger'});
                    } else {
                        window.location.reload();
                    }
                }
            });
        });

        $("#bt_removeLog").on('click', function(event) {
            $.ajax({// fonction permettant de faire de l'ajax
                type: "POST", // methode de transmission des données au fichier php
                url: "core/ajax/log.ajax.php", // url du fichier php
                data: {
                    action: "remove",
                    logfile: $('#sel_log').value()
                },
                dataType: 'json',
                error: function(request, status, error) {
                    handleAjaxError(request, status, error);
                },
                success: function(data) { // si l'appel a bien fonctionné
                    if (data.state != 'ok') {
                        $('#div_alertError').showAlert({message: data.result, level: 'danger'});
                    } else {
                        window.location.href = 'index.php?v=d&p=log';
                    }
                }
            });
        });
    });
</script>