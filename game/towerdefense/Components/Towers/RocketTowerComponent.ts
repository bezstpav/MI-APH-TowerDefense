import { ATTR_MODEL, TAG_BULLET, TAG_ROCKET } from "../../Constants";
import { TowerComponent } from "./TowerComponent";
import PIXIObjectBuilder from "../../../../ts/engine/PIXIObjectBuilder";
import { Factory } from "../../Factory";
import { PIXICmp } from "../../../../ts/engine/PIXIObject";
import { RocketComponent } from "./Projectile/RocketComponent";

//handles rocket tower
export class RocketTowerComponent extends TowerComponent {
    onInit() {
        this.damage = 30;
        this.firerate = 5;
        this.range = 5;

        super.onInit();
    }


    onUpdate(delta: number, absolute: number) {
        this.timePassed += delta;

        //send rocket
        if (this.timePassed >= this.firerate * 100) {
            let creep = this.checkRange();
            let builder = new PIXIObjectBuilder(this.scene);
         
            if (creep) {
                builder
                    .localPos(this.position.x + 0.5, this.position.y + 0.5)
                    .scale(Factory.globalScale)
                    .anchor(0.5, 0.5)
                    .withComponent(new RocketComponent(creep, this))
                    .build(new PIXICmp.Sprite("", this.factory.createTexture(this.model.getSpriteInfo(TAG_ROCKET))), this.scene.stage)
            }
            this.timePassed = 0;
        }
    }
}