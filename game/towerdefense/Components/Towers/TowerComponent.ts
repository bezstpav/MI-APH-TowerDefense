import Component from "../../../../ts/engine/Component";
import { Model, COLUMNS_NUM } from "../../Model";
import { ATTR_MODEL, ATTR_FACTORY, MSG_TILE_CHOSEN } from "../../Constants";
import { CreepComponent } from "../CreepComponent";
import { Factory } from "../../Factory";

//prototype
export class TowerComponent extends Component {
    public model: Model;
    public factory: Factory;

    public damage: number;
    public firerate: number;
    public range: number;
    public position: PIXI.Point;

    protected timePassed: number;

    onInit() {
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
        this.factory = this.scene.getGlobalAttribute(ATTR_FACTORY);
        this.position = this.owner.getPixiObj().position.clone();
        this.timePassed = 0;

        this.model.towers.set(this.model.chosenTile.position.x + this.model.chosenTile.position.y * COLUMNS_NUM, this);
        //refresh menu
        this.sendMessage(MSG_TILE_CHOSEN);
    }

    checkRange(): CreepComponent {
        for (let creep of this.model.creeps) {
            let distX = creep.position.x - (this.position.x + 0.5);
            let distY = creep.position.y - (this.position.y + 0.5);
            let distance = Math.sqrt((distX * distX) + (distY * distY));
            if (distance <= this.range) {
                return creep;
            }
        }
        return undefined;
    }
}