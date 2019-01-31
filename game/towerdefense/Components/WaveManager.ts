import Component from "../../../ts/engine/Component";
import Msg from "../../../ts/engine/Msg";
import { Model } from "../Model";
import { Factory } from "../Factory";
import { ATTR_FACTORY, ATTR_MODEL, MSG_COMMAND_GOTO_NEXT_WAVE, MSG_WAVE_STARTED, TAG_TILE_CASTLE, TAG_CREEP, TAG_CREEP_RED, TAG_CREEP_GREEN, TAG_CREEP_YELLOW, TAG_CREEPS, MSG_COMMAND_FINISH_LEVEL } from "../Constants";
import { PIXICmp } from "../../../ts/engine/PIXIObject";
import PIXIObjectBuilder from "../../../ts/engine/PIXIObjectBuilder";
import { CreepController } from "./CreepComponent";
import { CreepCollisionResolver } from "./CreepCollisionResolver";

/**
 * Component that orchestrates wave logic of the game and sends waves of creeps
 */
export class WaveManager extends Component {
    private model: Model;
    private factory: Factory;
    private hasToSpawn: number;
    private timePassed: number;

    onInit() {
        this.subscribe(MSG_COMMAND_GOTO_NEXT_WAVE);

        this.factory = this.scene.getGlobalAttribute(ATTR_FACTORY);
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
        this.hasToSpawn = 0;
        this.timePassed = 0;

        if (this.model.currentWave == 0) {
            // init the first round
            this.scene.invokeWithDelay(3000, () => this.goToNextWave());
        }
    }

    goToNextWave() {
        if (this.model.currentWave < this.model.maxWave) {
            this.model.currentWave++;
            this.hasToSpawn = this.model.wavesCount[this.model.currentLevel - 1][this.model.currentWave - 1];
            this.model.remainingEnemies = this.hasToSpawn;
            this.sendMessage(MSG_WAVE_STARTED);
        }
        else{
            this.sendMessage(MSG_COMMAND_FINISH_LEVEL);
        }
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_COMMAND_GOTO_NEXT_WAVE) {
            this.scene.invokeWithDelay(3000, () => this.goToNextWave());
        }
    }

    onUpdate(delta: number, absolute: number) {
        this.timePassed += delta;
        //send next creep
        if (this.model.currentWave > 0 && this.timePassed > 300 && this.hasToSpawn > 0) {
            let texture: PIXI.Texture;

            switch(this.model.wavesType[this.model.currentLevel - 1][this.model.currentWave - 1]){
                default:
                case "red":{
                    texture = this.factory.createTexture(this.model.getSpriteInfo(TAG_CREEP_RED));
                    break;
                }
                case "green":{
                    texture = this.factory.createTexture(this.model.getSpriteInfo(TAG_CREEP_GREEN))
                    break;
                }
                case "blue":{
                    texture = this.factory.createTexture(this.model.getSpriteInfo(TAG_CREEP_YELLOW))
                    break;
                }
            }

            let container = this.owner;

            new PIXIObjectBuilder(this.scene)
                .scale(Factory.globalScale)
                .anchor(0.5, 0.5)
                .globalPos(this.model.portal.position.x + 0.5, this.model.portal.position.y + 0.5)
                .withComponent(new CreepController())
                .withComponent(new CreepCollisionResolver())
                .build(new PIXICmp.Sprite(TAG_CREEP, texture), container);
            this.hasToSpawn--;
            this.timePassed = 0;
        }
    }
}