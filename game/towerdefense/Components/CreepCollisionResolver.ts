import { Model } from "../Model";
import Component from "../../../ts/engine/Component";
import { MSG_CREEP_CASTLE_HIT, ATTR_MODEL, MSG_CREEP_DEATH, MSG_COMMAND_GOTO_NEXT_WAVE, MSG_LIFE_LOST } from "../Constants";
import Msg from "../../../ts/engine/Msg";

/**
 * Component that handles creep collisions
 */
export class CreepCollisionResolver extends Component {
    private model: Model;

    onInit() {
        this.subscribe(MSG_CREEP_CASTLE_HIT);
        this.model = this.owner.getScene().getGlobalAttribute(ATTR_MODEL);
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_CREEP_CASTLE_HIT) {
            if (msg.data.owner === this.owner) {
                for (let i = 0; i < this.model.creeps.length; i++) {
                    if (this.model.creeps[i] === msg.data) {
                        this.model.creeps.splice(i, 1);
                        this.model.remainingEnemies--;
                        if (this.model.remainingEnemies == 0 && this.model.currentLives > 0) {
                            this.sendMessage(MSG_COMMAND_GOTO_NEXT_WAVE);
                        }
                    }
                }
                this.owner.remove();
            }
        }
    }
}