<?php
if (!isConnect()) {
    throw new Exception('Error 401 Unauthorized');
}
sendVarToJS('select_id', init('id', '-1'));
sendVarToJS('eqType', 'weather');
sendVarToJS('dontRemoveCmd', '1');
?>

<div class="row">
    <div class="col-lg-2 bs-sidebar">
        <ul id="ul_eqLogic" class="nav nav-list bs-sidenav fixnav">
            <li class="nav-header">Liste des equipements méteo 
                <i class="fa fa-plus-circle pull-right cursor eqLogicAction" action="add" style="font-size: 1.5em;margin-bottom: 5px;"></i>
            </li>
            <li class="filter" style="margin-bottom: 5px;"><input class="form-control" class="filter form-control" placeholder="Rechercher" style="width: 100%"/></li>
            <?php
            foreach (eqLogic::byType('weather') as $eqLogic) {
                echo '<li class="cursor li_eqLogic" eqLogic_id="' . $eqLogic->getId() . '"><a>' . $eqLogic->getHumanName() . '</a></li>';
            }
            ?>
        </ul>
    </div>
    <div class="col-lg-10 eqLogic" style="border-left: solid 1px #EEE; padding-left: 25px;display: none;">
        <form class="form-horizontal">
            <fieldset>
                <legend>Générale</legend>
                <div class="form-group">
                    <label class="col-lg-2 control-label">Nom de l'équipement météo</label>
                    <div class="col-lg-3">
                        <input type="text" class="eqLogicAttr form-control" l1key="id" style="display : none;" />
                        <input type="text" class="eqLogicAttr form-control" l1key="name" placeholder="Nom de l'équipement météo"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" >Objet parent</label>
                    <div class="col-lg-3">
                        <select id="sel_object" class="eqLogicAttr form-control" l1key="object_id">
                            <option value="">Aucun</option>
                            <?php
                            foreach (object::all() as $object) {
                                echo '<option value="' . $object->getId() . '">' . $object->getName() . '</option>';
                            }
                            ?>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" >Activer</label>
                    <div class="col-lg-1">
                        <input type="checkbox" class="eqLogicAttr form-control" l1key="isEnable" size="16" checked/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" >Visible</label>
                    <div class="col-lg-1">
                        <input type="checkbox" class="eqLogicAttr form-control" l1key="isVisible" checked/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label">WOEID</label>
                    <div class="col-lg-3">
                        <input type="text" class="eqLogicAttr configuration form-control" l1key="configuration" l2key="city" placeholder="WOEID"/>
                    </div>
                    <div class="col-lg-3">
                        <a class="btn btn-default" href="http://isithackday.com/geoplanet-explorer/" target=_blank>Obtenir le code WOEID</a>
                    </div>
                </div>
            </fieldset> 
        </form>

        <legend>Météo</legend>
        <div id="div_weather"></div>
        <table id="table_weather" class="table table-bordered table-condensed">
            <thead>
                <tr>
                    <th>Nom</th><th>Valeur</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <form class="form-horizontal">
            <fieldset>
                <div class="form-actions">
                    <a class="btn btn-danger eqLogicAction" action="remove"><i class="fa fa-minus-circle"></i> Supprimer</a>
                    <a class="btn btn-success eqLogicAction" action="save"><i class="fa fa-check-circle"></i> Sauvegarder</a>
                </div>
            </fieldset>
        </form>

    </div>
</div>

<div class="modal fade" id="md_addEqLogic">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button class="close" data-dismiss="modal">×</button>
                <h3>Ajouter un équipement météo</h3>
            </div>
            <div class="modal-body">
                <div style="display: none;" id="div_addEqLogicAlert"></div>
                <form class="form-horizontal">
                    <fieldset>
                        <div class="form-group">
                            <label class="col-lg-4 control-label">Nom de l'équipement météo</label>
                            <div class="col-lg-8">
                                <input class="form-control eqLogicAttr" l1key="name" type="text" placeholder="Nom de l'équipement météo"/>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <a class="btn btn-danger" data-dismiss="modal"><i class="fa fa-minus-circle"></i> Annuler</a>
                <a class="btn btn-success eqLogicAction" action="newAdd"><i class="fa fa-check-circle icon-white"></i> Enregistrer</a>
            </div>
        </div>
    </div>
</div>

<?php include_file('desktop', 'weather', 'js', 'weather'); ?>
<?php include_file('core', 'module.template', 'js'); ?>