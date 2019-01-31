import Component from "../../../ts/engine/Component";
import { ATTR_MODEL, MSG_BUILD, TAG_BULLET_TOWER, TAG_ROCKET_TOWER, TAG_TILE_GRASS, MSG_COMMAND_BUILD, MSG_ERROR_HASCREEP, MSG_ERROR_BLOCK, MSG_ERROR_MONEY } from "../Constants";
import { Model } from "../Model";
import Msg from "../../../ts/engine/Msg";

/**
 * Watcher for spend money
 */
export class MoneyWatcher extends Component {

    private model: Model;

    onInit() {
        this.subscribe(MSG_BUILD);
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_BUILD) {
            if (msg.data == TAG_BULLET_TOWER) {
                if (this.model.chosenGrassCanBuild()) {
                    if (this.model.currentMoney >= 10) {
                        this.model.currentMoney -= 10;
                        this.sendMessage(MSG_COMMAND_BUILD, TAG_BULLET_TOWER);
                    }
                    else {
                        this.sendMessage(MSG_ERROR_MONEY, 10);
                    }
                }
            }
            else if (msg.data == TAG_ROCKET_TOWER) {
                if (this.model.chosenGrassCanBuild()) {
                    if (this.model.currentMoney >= 20) {
                        this.model.currentMoney -= 20;
                        this.sendMessage(MSG_COMMAND_BUILD, TAG_ROCKET_TOWER);
                    }
                    else {
                        this.sendMessage(MSG_ERROR_MONEY, 20);
                    }
                }
            }
            else if (msg.data == TAG_TILE_GRASS) {
                if (this.model.chosenHasCreep()) {
                    this.sendMessage(MSG_ERROR_HASCREEP)
                    return;
                }
                if (!this.model.chosenRoadCanBuild()) {
                    this.sendMessage(MSG_ERROR_BLOCK)
                    return;
                }

                if (this.model.currentMoney >= 5) {
                    this.model.currentMoney -= 5;
                    this.sendMessage(MSG_COMMAND_BUILD, TAG_TILE_GRASS);
                }
                else {
                    this.sendMessage(MSG_ERROR_MONEY, 5);
                }

            }
        }
    }
}