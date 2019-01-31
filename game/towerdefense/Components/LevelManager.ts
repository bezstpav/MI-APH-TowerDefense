import { Factory } from '../Factory';
import Component from '../../../ts/engine/Component';
import { Model } from '../Model';
import {
    MSG_COMMAND_FINISH_LEVEL, ATTR_FACTORY, ATTR_MODEL,
    MSG_LEVEL_COMPLETED, MSG_GAME_OVER, MSG_COMMAND_GAME_OVER, MSG_LEVEL_STARTED
} from '../Constants';
import Msg from '../../../ts/engine/Msg';


/**
 * Component that orchestrates level logic of the game
 */
export class LevelManager extends Component {
    private model: Model;
    private factory: Factory;

    onInit() {
        this.subscribe(MSG_COMMAND_GAME_OVER, MSG_COMMAND_FINISH_LEVEL);

        this.factory = this.scene.getGlobalAttribute(ATTR_FACTORY);
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);

        this.sendMessage(MSG_LEVEL_STARTED);
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_COMMAND_GAME_OVER) {
            this.gameOver();
        } else if (msg.action == MSG_COMMAND_FINISH_LEVEL) {
            this.finishLevel();
        }
    }

    protected gameOver() {
        this.model.currentLevel = 0;
        this.sendMessage(MSG_GAME_OVER);
        this.reset();
    }

    protected finishLevel() {
        // go to the next level
        if(this.model.currentLevel == this.model.levels.length){
            this.model.currentLevel = -1;
        }
        this.model.currentLevel++;
        this.sendMessage(MSG_LEVEL_COMPLETED);

        this.reset();
    }

    private reset() {
        this.scene.invokeWithDelay(3000, () => this.factory.resetGame(this.scene, this.model));
    }
}