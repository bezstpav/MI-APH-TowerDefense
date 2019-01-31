import { Model, COLUMNS_NUM } from '../Model';
import { GenericComponent } from '../../../ts/components/GenericComponent';
import { ATTR_MODEL, MSG_TILE_CHOSEN, TAG_MENU_TITLE, MSG_WAVE_STARTED, TAG_MENU_WAVE, MSG_LIFE_LOST, TAG_MENU_LIVES, TAG_MENU_BULLET_BUTTON, TAG_MENU_ROCKET_BUTTON, TAG_MENU_GRASS_BUTTON, TAG_MENU_UPGRADE_DAMAGE, TAG_MENU_UPGRADE_FIRERATE, TAG_MENU_UPGRADE_RANGE, MSG_COMMAND_BUILD, TAG_BULLET_TOWER, TAG_ROCKET_TOWER, TAG_TILE_GRASS, MSG_ERROR_HASCREEP, MSG_CHANGED_MAP, MSG_BUILD, TAG_MENU_MONEY, MSG_MONEY_EARNED } from '../Constants';
import { MouseInputComponent } from '../../../ts/components/MouseInputComponent';

/**
 * Component that display an menu
 */
export class MenuComponent extends GenericComponent {
    private model: Model;

    private buttonBullet;
    private buttonRocket;
    private buttonGrass;

    private buttonArray: Array<PIXI.Sprite>;

    constructor() {
        // use GenericComponent to pile up all message handlers
        super(MenuComponent.name);
        this.doOnMessage(MSG_TILE_CHOSEN, (cmp, msg) => this.refreshContext());
        this.doOnMessage(MSG_WAVE_STARTED, () => this.refreshWaves());
        this.doOnMessage(MSG_LIFE_LOST, () => this.refreshLives());
        this.doOnMessage(MSG_MONEY_EARNED, () => this.refreshMoney());
        this.doOnMessage(MSG_COMMAND_BUILD, () => this.refreshMoney());
        this.doOnMessage(MSG_CHANGED_MAP, (cmp, msg) => this.refreshContext())
    }

    onInit() {
        super.onInit();
        this.model = this.owner.getScene().getGlobalAttribute(ATTR_MODEL);

        let menuContainer = this.owner;

        this.buttonBullet = <PIXI.Sprite>menuContainer.getPixiObj().getChildByName(TAG_MENU_BULLET_BUTTON);
        this.buttonRocket = <PIXI.Sprite>menuContainer.getPixiObj().getChildByName(TAG_MENU_ROCKET_BUTTON);
        this.buttonGrass = <PIXI.Sprite>menuContainer.getPixiObj().getChildByName(TAG_MENU_GRASS_BUTTON);

        this.buttonBullet.position = new PIXI.Point(25, 150);
        this.buttonBullet.visible = false;

        this.buttonRocket.position = new PIXI.Point(25, 210);
        this.buttonRocket.visible = false;

        this.buttonGrass.position = new PIXI.Point(25, 270);
        this.buttonGrass.visible = false;

        this.buttonArray = new Array();
        this.buttonArray.push(this.buttonBullet);
        this.buttonArray.push(this.buttonRocket);
        this.buttonArray.push(this.buttonGrass);
    }

    refreshWaves() {
        let menuWaveCmp = <PIXI.Text>this.owner.getPixiObj().getChildByName(TAG_MENU_WAVE);
        menuWaveCmp.text = "W: " + this.model.currentWave + "/" + this.model.maxWave
    }

    refreshContext() {
        let menuContainer = this.owner;
        let menuTitleCmp = <PIXI.Text>menuContainer.getPixiObj().getChildByName(TAG_MENU_TITLE);
        //chosen tile
        switch (this.model.chosenTile.type) {
            case 0: {
                if (!this.model.towers.get(this.model.chosenTile.position.x + this.model.chosenTile.position.y * COLUMNS_NUM)) {
                    menuTitleCmp.text = "GRASS"
                    for (let button of this.buttonArray) {
                        if (button === this.buttonBullet || button === this.buttonRocket) {
                            button.visible = true;
                        }
                        else {
                            button.visible = false;
                        }
                    }
                }
                else {
                    menuTitleCmp.text = "TOWER"
                    for (let button of this.buttonArray) {
                        button.visible = false;
                    }
                }
                break;
            }
            case 1: {
                menuTitleCmp.text = "ROAD"
                for (let button of this.buttonArray) {
                    if (button === this.buttonGrass) {
                        button.visible = true;
                    }
                    else {
                        button.visible = false;
                    }
                }
                break;
            }
            default: {
                menuTitleCmp.text = "MENU"
                for (let button of this.buttonArray) {
                    button.visible = false;
                }
                break;
            }
        }
    }

    refreshLives() {
        let menuWaveCmp = <PIXI.Text>this.owner.getPixiObj().getChildByName(TAG_MENU_LIVES);
        menuWaveCmp.text = this.model.currentLives + "/" + this.model.maxLives;
    }

    refreshMoney() {
        let menuWaveCmp = <PIXI.Text>this.owner.getPixiObj().getChildByName(TAG_MENU_MONEY);
        menuWaveCmp.text = this.model.currentMoney.toString();
    }

    onUpdate() {
        let cmp = this.scene.stage.findComponentByClass(MouseInputComponent.name);
        let cmpMouse = <MouseInputComponent><any>cmp;

        //clicked on button
        if (cmpMouse.x > 700 && cmpMouse.x < 800 && cmpMouse.y > 0 && cmpMouse.y < 600) {
            for (let button of this.buttonArray) {
                if (button.visible && cmpMouse.x > 700 + button.x && cmpMouse.x < 700 + button.x + button.width && cmpMouse.y > button.y && cmpMouse.y < button.y + button.height) {

                    switch (button.name) {
                        case TAG_MENU_BULLET_BUTTON: {
                            this.sendMessage(MSG_BUILD, TAG_BULLET_TOWER);
                            break;
                        }
                        case TAG_MENU_ROCKET_BUTTON: {
                            this.sendMessage(MSG_BUILD, TAG_ROCKET_TOWER);
                            break;
                        }
                        case TAG_MENU_GRASS_BUTTON: {
                            this.sendMessage(MSG_BUILD, TAG_TILE_GRASS);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
        }
    }
}