import { MouseInputComponent } from '../../../ts/components/MouseInputComponent';
import Component from '../../../ts/engine/Component';
import { MSG_TILE_CHOSEN, ATTR_FACTORY, ATTR_MODEL, TAG_TILE_MARKED, TILE_TYPE_PORTAL, TILE_TYPE_CASTLE, MSG_COMMAND_BUILD, TILE_TYPE_GRASS, TAG_TILE_GRASS, TAG_COIN, MSG_CHANGED_MAP, MSG_ERROR_HASCREEP, MSG_ERROR_BLOCK, TAG_BULLET_TOWER, TAG_ROCKET_TOWER } from '../Constants';
import { Model, COLUMNS_NUM } from '../Model';
import { Factory } from '../Factory';
import Vec2 from '../../../ts/utils/Vec2';
import Msg from '../../../ts/engine/Msg';
import { BreadthFirstSearch, PathFinderContext } from '../Pathfinder';
import { TowerComponent } from './Towers/TowerComponent';
import { BulletTowerComponent } from './Towers/BulletTowerComponent';
import { RocketTowerComponent } from './Towers/RocketTowerComponent';
import PIXIObjectBuilder from '../../../ts/engine/PIXIObjectBuilder';
import { PIXICmp } from '../../../ts/engine/PIXIObject';

export class Tile {
    type: number;
    position: Vec2;

    public clone(): Tile {
        let tile = new Tile();
        tile.position = this.position.clone();
        tile.type = this.type;
        return tile;
    }
}

/**
 * controller for tiles (mouse and building)
 */
export class TileController extends Component {
    private factory: Factory;
    private model: Model;

    onInit() {
        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
        this.factory = this.scene.getGlobalAttribute(ATTR_FACTORY);
        this.subscribe(MSG_COMMAND_BUILD);
    }

    onMessage(msg: Msg) {
        if (msg.action == MSG_COMMAND_BUILD) {
            if (msg.data === TAG_TILE_GRASS) {
                this.model.chosenTile.type = TILE_TYPE_GRASS;

                let sprite = this.model.getTileSprite(this.model.chosenTile.position);
                sprite.texture = this.factory.createTexture(this.model.getSpriteInfo(TAG_TILE_GRASS));

                this.sendMessage(MSG_CHANGED_MAP);
            }
            else if (msg.data === TAG_BULLET_TOWER) {
                let builder = new PIXIObjectBuilder(this.scene);

                builder
                    .scale(Factory.globalScale)
                    .localPos(this.model.chosenTile.position.x, this.model.chosenTile.position.y)
                    .withComponent(new BulletTowerComponent())
                    .build(new PIXICmp.Sprite("", this.factory.createTexture(this.model.getSpriteInfo(TAG_BULLET_TOWER))), this.scene.stage)
            }
            else if (msg.data === TAG_ROCKET_TOWER) {
                let builder = new PIXIObjectBuilder(this.scene);

                builder
                    .scale(Factory.globalScale)
                    .localPos(this.model.chosenTile.position.x, this.model.chosenTile.position.y)
                    .withComponent(new RocketTowerComponent())
                    .build(new PIXICmp.Sprite("", this.factory.createTexture(this.model.getSpriteInfo(TAG_ROCKET_TOWER))), this.scene.stage)
            }
        }
    }
    onUpdate(delta: number, absolute: number) {
        let cmp = this.scene.stage.findComponentByClass(MouseInputComponent.name);
        let cmpMouse = <MouseInputComponent><any>cmp;

        //clicked on tile
        if (cmpMouse.x > 0 && cmpMouse.x < 700 && cmpMouse.y > 0 && cmpMouse.y < 600) {
            let tile = this.model.getTile(new Vec2(Math.floor(cmpMouse.x / 50), Math.floor(cmpMouse.y / 50)));
            if (this.model.chosenTile !== tile) {
                this.markChosenTile(tile);
                this.model.chosenTile = tile;
                this.sendMessage(MSG_TILE_CHOSEN);
            }
        }
    }

    markChosenTile(tile: Tile) {
        let markSprite = this.owner.getPixiObj();
        if (tile.type == TILE_TYPE_PORTAL || tile.type == TILE_TYPE_CASTLE) {
            markSprite.visible = false;
        }
        else {
            markSprite.position.x = tile.position.x;
            markSprite.position.y = tile.position.y;
            markSprite.visible = true;
        }
    }
}