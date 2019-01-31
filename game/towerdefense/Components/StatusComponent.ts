import { GenericComponent } from "../../../ts/components/GenericComponent";
import { Model } from "../Model";
import { MSG_LEVEL_STARTED, MSG_WAVE_STARTED, MSG_GAME_OVER, MSG_LEVEL_COMPLETED, MSG_GAME_COMPLETED, ATTR_MODEL, MSG_LIFE_LOST, MSG_ERROR_HASCREEP, MSG_ERROR_BLOCK, MSG_ERROR_MONEY } from "../Constants";
import { PIXICmp } from "../../../ts/engine/PIXIObject";

export class StatusComponent extends GenericComponent {
    private model: Model;

    constructor() {
        // use GenericComponent to pile up all message handlers
        super(StatusComponent.name);
        this.doOnMessage(MSG_LEVEL_STARTED, (cmp, msg) => this.showText(`LEVEL ${this.model.currentLevel}`));
        this.doOnMessage(MSG_GAME_OVER, (cmp, msg) => this.showText(`GAME OVER`));
        this.doOnMessage(MSG_LEVEL_COMPLETED, (cmp, msg) => this.showText(`LEVEL COMPLETED`));
        this.doOnMessage(MSG_GAME_COMPLETED, (cmp, msg) => this.showText(`!!YOU FINISHED THE GAME!!`));
        this.doOnMessage(MSG_ERROR_HASCREEP, (cmp, msg) => this.showText(`TILE CONTAINS CREEP!`));
        this.doOnMessage(MSG_ERROR_BLOCK, (cmp, msg) => this.showText(`CAN'T BLOCK PATH!`));
        this.doOnMessage(MSG_ERROR_MONEY, (cmp, msg) => this.showText(`MISSING: ` + (msg.data - this.model.currentMoney)));
    }

    onInit() {
        super.onInit();
        this.model = this.owner.getScene().getGlobalAttribute(ATTR_MODEL);
    }

    protected showText(text: string) {
        let textObj = <PIXICmp.Text>this.owner;
        textObj.text = text;
        textObj.visible = true;

        this.scene.invokeWithDelay(2000, () => {
            textObj.visible = false;
        });
    }
}