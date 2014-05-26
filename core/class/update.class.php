<?php

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

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class update {
    /*     * *************************Attributs****************************** */

    private $id;
    private $type;
    private $logicalId;
    private $name;
    private $localVersion;
    private $remoteVersion;
    private $status;
    private $configuration;

    /*     * ***********************Methode static*************************** */

    public static function checkAllUpdate($_filter = '') {
        $findCore = false;
        self::findNewUpdateObject();
        foreach (self::all() as $update) {
            if ($update->getStatus() != 'hold' && ($_filter == '' || $_filter == $update->getType() )) {
                $update->checkUpdate();
            }
            if ($update->getType() == 'core') {
                $findCore = true;
            }
        }
        if (!$findCore) {
            $update = new update();
            $update->setType('core');
            $update->setLogicalId('jeedom');
            $update->setLocalVersion(getVersion('jeedom'));
            $update->save();
            $update->checkUpdate();
        }
    }

    public static function updateAll($_filter = '') {
        if ($_filter == 'core') {
            foreach (self::byType($_filter) as $update) {
                $update->doUpdate();
            }
        } else {
            log::clear('update');
            log::add('update', 'update', __("[START UPDATE]\n", __FILE__));
            $error = false;
            if ($_filter == '') {
                $updates = self::all();
            } else {
                $updates = self::byType($_filter);
            }
            foreach ($updates as $update) {
                if ($update->getStatus() != 'hold' && $update->getStatus() == 'update') {
                    if ($update->getType() != 'core') {
                        try {
                            $update->doUpdate();
                        } catch (Exception $e) {
                            log::add('update', 'update', $e->getMessage());
                            $error = true;
                        }
                    }
                }
            }
            if ($error) {
                log::add('update', 'update', __("[END UPDATE ERROR]\n", __FILE__));
            } else {
                log::add('update', 'update', __("[END UPDATE SUCCESS]\n", __FILE__));
            }
        }
    }

    public static function byId($_id) {
        $values = array(
            'id' => $_id,
        );
        $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
                FROM `update` 
                WHERE id=:id';
        return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
    }

    public static function byLogicalId($_logicalId) {
        $values = array(
            'logicalId' => $_logicalId,
        );
        $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
                FROM `update`
                WHERE logicalId=:logicalId';
        return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
    }

    public static function byType($_type) {
        $values = array(
            'type' => $_type,
        );
        $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
                FROM `update`
                WHERE type=:type';
        return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
    }

    public static function byTypeAndLogicalId($_type, $_logicalId) {
        $values = array(
            'logicalId' => $_logicalId,
            'type' => $_type,
        );
        $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
                FROM `update`
                WHERE logicalId=:logicalId
                    AND type=:type';
        return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
    }

    /**
     *
     * @return array de tous les utilisateurs 
     */
    public static function all() {
        $sql = 'SELECT ' . DB::buildField(__CLASS__) . ' 
                FROM `update`
                ORDER BY ( `type` = "core") DESC,( `status` = "update") DESC';
        return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
    }

    public static function nbNeedUpdate() {
        $sql = 'SELECT count(*)
                FROM `update`
                WHERE `status`="update"';
        $result = DB::Prepare($sql, array(), DB::FETCH_TYPE_ROW);
        return $result['count(*)'];
    }

    public static function findNewUpdateObject() {
        foreach (plugin::listPlugin(true) as $plugin) {
            $plugin_id = $plugin->getId();
            if (method_exists($plugin_id, 'listMarketObject')) {
                foreach ($plugin_id::listMarketObject() as $logical_id) {
                    $update = self::byTypeAndLogicalId($plugin_id, $logical_id);
                    if (!is_object($update)) {
                        $update = new update();
                        $update->setLogicalId($logical_id);
                        $update->setType($plugin_id);
                        $update->setLocalVersion(date('Y-m-d H:i:s'));
                        $update->save();
                    }
                }
            }
        }
    }

    /*     * *********************Methode d'instance************************* */

    public function checkUpdate() {
        if ($this->getType() == 'core') {
            $update_info = jeedom::needUpdate(true);
            $this->setLocalVersion($update_info['version']);
            $this->setRemoteVersion($update_info['currentVersion']);
            if ($update_info['needUpdate']) {
                $this->setStatus('update');
            } else {
                $this->setStatus('ok');
            }
            $this->save();
        } else {
            $retry = 0;
            while ($retry < 4) {
                try {
                    $market_info = market::getInfo($this->getLogicalId());
                    $this->setStatus($market_info['status']);
                    $this->setConfiguration('market_owner', $market_info['market_owner']);
                    $this->setConfiguration('market', $market_info['market']);
                    $this->save();
                    $retry = 4;
                } catch (Exception $ex) {
                    sleep(1);
                }
                $retry++;
            }
        }
    }

    public function preSave() {
        if ($this->getLogicalId() == '') {
            throw new Exception(__('Le logical ID ne peut etre vide', __FILE__));
        }
        if ($this->getLocalVersion() == '') {
            throw new Exception(__('La version locale ne peut etre vide', __FILE__));
        }
        if ($this->getName() == '') {
            $this->setName($this->getLogicalId());
        }
    }

    public function save() {
        return DB::save($this);
    }

    public function remove() {
        return DB::remove($this);
    }

    public function refresh() {
        DB::refresh($this);
    }

    public function doUpdate() {
        if ($this->getType() == 'core') {
            jeedom::update();
        } else {
            $market = market::byLogicalId($this->getLogicalId());
            if (is_object($market)) {
                $market->install();
            }
        }
        $this->refresh();
        $this->checkUpdate();
    }

    public function deleteObjet() {
        if ($this->getType() == 'core') {
            throw new Exception('Vous ne pouvez supprimer le core de Jeedom');
        } else {
            try {
                $market = market::byLogicalId($this->getLogicalId());
                if (is_object($market)) {
                    $market->remove();
                }
            } catch (Exception $e) {
                
            }
            $this->remove();
        }
    }

    /*     * **********************Getteur Setteur*************************** */

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getStatus() {
        return $this->status;
    }

    public function getConfiguration($_key = '', $_default = '') {
        return utils::getJsonAttr($this->configuration, $_key, $_default);
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function setConfiguration($_key, $_value) {
        $this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
    }

    public function getType() {
        return $this->type;
    }

    public function setType($type) {
        $this->type = $type;
    }

    public function getLocalVersion() {
        return $this->localVersion;
    }

    public function getRemoteVersion() {
        return $this->remoteVersion;
    }

    public function setLocalVersion($localVersion) {
        $this->localVersion = $localVersion;
    }

    public function setRemoteVersion($remoteVersion) {
        $this->remoteVersion = $remoteVersion;
    }

    public function getLogicalId() {
        return $this->logicalId;
    }

    public function setLogicalId($logicalId) {
        $this->logicalId = $logicalId;
    }

}

?>
