import { ATTR_MODEL, TAG_BULLET } from "../../Constants";
import { TowerComponent } from "./TowerComponent";
import PIXIObjectBuilder from "../../../../ts/engine/PIXIObjectBuilder";
import { Factory } from "../../Factory";
import { PIXICmp } from "../../../../ts/engine/PIXIObject";
import { BulletComponent } from "./Projectile/BulletComponent";

//handles bullet tower
export class BulletTowerComponent extends TowerComponent {
    onInit() {
        this.damage = 10;
        this.firerate = 2;
        this.range = 2.5;

        super.onInit();
    }


    onUpdate(delta: number, absolute: number) {
        this.timePassed += delta;

        //send bullet
        if (this.timePassed >= this.firerate * 100) {
            let creep = this.checkRange();
            let builder = new PIXIObjectBuilder(this.scene);
         
            if (creep) {
                builder
                    .localPos(this.position.x + 0.5, this.position.y + 0.5)
                    .scale(Factory.globalScale)
                    .anchor(0.5, 0.5)
                    .withComponent(new BulletComponent(creep, this))
                    .build(new PIXICmp.Sprite("", this.factory.createTexture(this.model.getSpriteInfo(TAG_BULLET))), this.scene.stage)
            }
            this.timePassed = 0;
        }
    }
}