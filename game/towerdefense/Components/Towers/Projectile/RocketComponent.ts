import { ATTR_MODEL, ATTR_FACTORY, MSG_CREEP_HIT } from "../../../Constants";
import { CreepComponent } from "../../CreepComponent";
import Component from "../../../../../ts/engine/Component";
import { Model } from "../../../Model";
import { TowerComponent } from "../TowerComponent";

//moves rocket towards target and handles collision
export class RocketComponent extends Component {
    public model: Model;

    public fromTower: TowerComponent;
    public target: CreepComponent

    public position: PIXI.Point;
    public speed: number;

    constructor(target: CreepComponent, fromTower: TowerComponent) {
        super();
        this.target = target;
        this.fromTower = fromTower;
    }

    onInit() {
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);

        this.position = this.owner.getPixiObj().position.clone();
        this.speed = 0.2;
    }

    onUpdate(delta: number, absolute: number) {
        let distance = this.speed * delta / 15;

        let remainingDistance = Math.sqrt(Math.pow((this.target.position.y - this.position.y), 2) + Math.pow((this.target.position.x - this.position.x), 2));

        if (remainingDistance < distance) {
            this.position = this.target.position.clone();
            this.sendMessage(MSG_CREEP_HIT, { target: this.target, damage: this.fromTower.damage });
            this.owner.remove();
        }
        else {
            this.position.x = this.position.x + (distance * ((this.target.position.x - this.position.x) / remainingDistance));
            this.position.y = this.position.y + (distance * ((this.target.position.y - this.position.y) / remainingDistance));
        }
        
        let angle = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x) + 0.5 * Math.PI;

        this.owner.getPixiObj().rotation = angle;
        this.owner.getPixiObj().position = this.position.clone();
    }
}