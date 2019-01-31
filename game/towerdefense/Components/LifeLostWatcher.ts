import Component from "../../../ts/engine/Component";
import { MSG_LIFE_LOST, ATTR_MODEL, MSG_COMMAND_GAME_OVER, MSG_CREEP_CASTLE_HIT } from "../Constants";
import { Model } from "../Model";
import Msg from "../../../ts/engine/Msg";

/**
 * Watcher for lost lives
 */
export class LifeLostWatcher extends Component {

    private model: Model;

    onInit() {
        this.subscribe(MSG_CREEP_CASTLE_HIT);
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_CREEP_CASTLE_HIT) {
            this.model.currentLives--;
            this.sendMessage(MSG_LIFE_LOST);
    
            if (this.model.currentLives == 0) {
                // game over -> pass messages to the game manager
                this.sendMessage(MSG_COMMAND_GAME_OVER);
            }

        }
    }
}