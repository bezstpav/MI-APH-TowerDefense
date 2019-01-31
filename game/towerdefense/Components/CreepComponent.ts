import Component from "../../../ts/engine/Component";
import { Model, COLUMNS_NUM } from "../Model";
import { ATTR_FACTORY, ATTR_MODEL, DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_WEST, DIRECTION_EAST, MSG_CREEP_CASTLE_HIT, MSG_CHANGED_MAP, TILE_TYPE_GRASS, MSG_CREEP_HIT, MSG_COMMAND_GOTO_NEXT_WAVE, MSG_MONEY_EARNED } from "../Constants";
import { PathFinderContext, BreadthFirstSearch } from "../Pathfinder";
import Vec2 from "../../../ts/utils/Vec2";
import Msg from "../../../ts/engine/Msg";

/**
 * Component that handles creep hit taken
 */
export class CreepComponent extends Component {
    public model: Model;
    public health: number;
    public speed: number;
    public gold: number;
    public position: PIXI.Point;

    onInit() {
        this.subscribe(MSG_CREEP_HIT);

        this.model = this.scene.getGlobalAttribute(ATTR_MODEL);
        this.speed = this.model.wavesSpeed[this.model.currentLevel - 1][this.model.currentWave - 1];
        this.health = this.model.wavesHealth[this.model.currentLevel - 1][this.model.currentWave - 1];
        this.gold = this.model.wavesGold[this.model.currentLevel - 1][this.model.currentWave - 1];
        this.model.creeps.push(this);

        this.position = this.owner.getPixiObj().position.clone();
    }
    onMessage(msg: Msg) {
        if (msg.action == MSG_CREEP_HIT) {
            if (msg.data.target == this) {
                this.health -= msg.data.damage;
                if (this.health <= 0) {
                    for (let i = 0; i < this.model.creeps.length; i++) {
                        if (this.model.creeps[i] == this) {
                            this.model.creeps.splice(i, 1);
                            this.model.remainingEnemies--;
                            this.model.currentMoney += this.gold;
                            this.sendMessage(MSG_MONEY_EARNED);
                            this.owner.remove();
                            if (this.model.remainingEnemies == 0) this.sendMessage(MSG_COMMAND_GOTO_NEXT_WAVE);
                        }
                    }
                }
            }
        }
    }
}

/**
 * Component that handles creep movement and hit taken
 */
export class CreepController extends CreepComponent {
    private pathFinder = new BreadthFirstSearch();
    private indexMapper: (vec: Vec2) => number;

    private foundPath;
    private pathContext: PathFinderContext;
    private movingFrom: Vec2;
    private movingTowards: Vec2;
    private movingTowardsIndex: number;

    onInit() {
        super.onInit();

        this.subscribe(MSG_CHANGED_MAP);

        // map Vec2 to indices because of hashing
        this.indexMapper = (vec: Vec2) => {
            return vec.y * COLUMNS_NUM + vec.x;
        }

        this.pathContext = new PathFinderContext();
        this.foundPath = this.pathFinder.search(this.model.tiles, this.model.portal.position, this.model.castle.position, this.pathContext, this.indexMapper);

        if (this.foundPath) {
            this.movingFrom = this.pathContext.pathFound[0];
            this.movingTowards = this.pathContext.pathFound[1];
            this.movingTowardsIndex = 1;
        }
    }

    onMessage(msg: Msg) {
        super.onMessage(msg);
        if (msg.action == MSG_CHANGED_MAP) {
            this.pathContext = new PathFinderContext();
            this.foundPath = this.pathFinder.search(this.model.tiles, new Vec2(Math.floor(this.position.x), Math.floor(this.position.y)), this.model.castle.position, this.pathContext, this.indexMapper);

            if (this.foundPath) {
                this.movingFrom = this.pathContext.pathFound[0];
                this.movingTowards = this.pathContext.pathFound[1];
                this.movingTowardsIndex = 1;
            }
        }
    }

    onUpdate(delta: number, absolute: number) {
        if (this.movingTowards) {
            let distance = this.speed * delta / 200;

            while (distance > 0 && this.movingTowards) {
                let direction = this.model.getDirection(this.movingFrom, this.movingTowards);
                let lookingForNext = false;
                switch (direction) {
                    case DIRECTION_NORTH: {
                        let remainingDistance = this.position.y - (this.movingTowards.y + 0.5);
                        if (remainingDistance < distance) {
                            this.position.y = this.movingTowards.y + 0.5
                            distance -= remainingDistance;
                            lookingForNext = true;
                        }
                        else {
                            this.position.y -= distance;
                            distance = 0;
                        }
                        break;
                    }
                    case DIRECTION_SOUTH: {
                        let remainingDistance = (this.movingTowards.y + 0.5) - this.position.y;
                        if (remainingDistance < distance) {
                            this.position.y = this.movingTowards.y + 0.5
                            distance -= remainingDistance;
                            lookingForNext = true;
                        }
                        else {
                            this.position.y += distance;
                            distance = 0;
                        }
                        break;
                    }
                    case DIRECTION_WEST: {
                        let remainingDistance = this.position.x - (this.movingTowards.x + 0.5);
                        if (remainingDistance < distance) {
                            this.position.x = this.movingTowards.x + 0.5
                            distance -= remainingDistance;
                            lookingForNext = true;
                        }
                        else {
                            this.position.x -= distance;
                            distance = 0;
                        }
                        break;
                    }
                    case DIRECTION_EAST: {
                        let remainingDistance = (this.movingTowards.x + 0.5) - this.position.x;
                        if (remainingDistance < distance) {
                            this.position.x = this.movingTowards.x + 0.5
                            distance -= remainingDistance;
                            lookingForNext = true;
                        }
                        else {
                            this.position.x += distance;
                            distance = 0;
                        }
                        break;
                    }
                }
                if (lookingForNext) {
                    this.movingFrom = this.movingTowards;
                    this.movingTowards = this.pathContext.pathFound[++this.movingTowardsIndex];
                    if (!this.movingTowards) this.sendMessage(MSG_CREEP_CASTLE_HIT, this);
                }
            }
            this.owner.getPixiObj().position = this.position;
        }
    }
}