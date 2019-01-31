import Vec2 from '../../ts/utils/Vec2';
import { Tile } from './Components/TileComponent';
import { DIRECTION_EAST, DIRECTION_SOUTH, DIRECTION_WEST, DIRECTION_NORTH, TILE_TYPE_GRASS } from './Constants';
import { CreepComponent } from './Components/CreepComponent';
import { PIXICmp } from '../../ts/engine/PIXIObject';
import { PathFinderContext, BreadthFirstSearch } from './Pathfinder';
import { TowerComponent } from './Components/Towers/TowerComponent';

/**
 * Tile entity defined by type and position index
 * Be advised that the position is NOT a position on a game screen but 
 * a 2D index of a 2D array the level is represented by
 */

// number of columns of each level
export const COLUMNS_NUM = 14;
// number of rows of each level
export const ROWS_NUM = 12;

/**
 * Entity that stores metadata about each sprite as loaded from JSON file
 */
export class SpriteInfo {

    constructor(name: string, offsetX: number, offsetY: number, width: number, height: number, frames: number) {
        this.name = name;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
        this.frames = frames;
    }

    name: string;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    frames: number;
}

export class Model {
    // tiles mapped by their indices
    tiles = new Map<number, Tile>();
    //creeps
    creeps = new Array<CreepComponent>();
    //towers
    towers = new Map<number, TowerComponent>();
    // portal and castle
    portal: Tile;
    castle: Tile;
    // tile sprites mapped by their IDs
    tileSprites = new Map<number, PIXICmp.Sprite>();
    // metadata of all sprites as loaded from JSON file
    sprites: Array<SpriteInfo>;
    // 2D arrays of levels and waves as loaded from JSON file
    levels: Array<Array<Array<number>>>;
    wavesCount: Array<Array<number>>;
    wavesType: Array<Array<string>>;
    wavesSpeed: Array<Array<number>>;
    wavesHealth: Array<Array<number>>;
    wavesGold: Array<Array<number>>;

    maxWave = 0;
    maxLives = 10;

    //=============== dynamic attributes (changed as the game is played)
    remainingEnemies = 0;
    currentWave = 0;
    currentLevel = 0;
    currentLives = 0;
    currentMoney = 0;
    chosenTile: Tile = undefined;

    /**
     * Loads model from a JSON structure
     */
    loadModel(data: any) {
        this.sprites = new Array<SpriteInfo>();

        for (let spr of data.sprites) {
            this.sprites.push(new SpriteInfo(spr.name, spr.offset_px_x, spr.offset_px_y, spr.sprite_width, spr.sprite_height, spr.frames));
        }
        this.levels = new Array();

        for (let level of data.levels_maps) {
            this.levels.push(level);
        }

        this.wavesCount = new Array();
        this.wavesType = new Array();
        this.wavesSpeed = new Array();
        this.wavesHealth = new Array();
        this.wavesGold = new Array();
        for (let wave of data.waves_level) {
            this.wavesCount.push(wave.enemies_count);
            this.wavesType.push(wave.enemies_type);
            this.wavesSpeed.push(wave.enemies_speed);
            this.wavesHealth.push(wave.enemies_health);
            this.wavesGold.push(wave.enemies_gold);
        }
    }

    /**
     * Initializes the current level
     */
    initLevel() {
        this.tiles.clear();
        this.towers.clear();
        this.remainingEnemies = 0;
        this.currentWave = 0;
        this.currentLives = this.maxLives;
        this.currentMoney = 20;
        this.maxWave = this.wavesCount[this.currentLevel - 1].length;
        this.loadTiles();
    }

    getSpriteInfo(name: string): SpriteInfo {
        for (let spr of this.sprites) {
            if (spr.name == name) return spr;
        }
        return null;
    }

    public getTile(position: Vec2): Tile {
        if (position.x < 0 || position.y < 0) return undefined;
        let index = position.y * COLUMNS_NUM + position.x;
        return this.tiles.get(index);
    }

    public getTileSprite(position: Vec2): PIXICmp.Sprite {
        if (position.x < 0 || position.y < 0) return undefined;
        let index = position.y * COLUMNS_NUM + position.x;
        return this.tileSprites.get(index);
    }

    public getDirection(start: Vec2, end: Vec2) {
        if (start.x + 1 == end.x && start.y == end.y) return DIRECTION_EAST;
        if (start.x == end.x && start.y + 1 == end.y) return DIRECTION_SOUTH;
        if (start.x - 1 == end.x && start.y == end.y) return DIRECTION_WEST;
        if (start.x == end.x && start.y - 1 == end.y) return DIRECTION_NORTH;
    }

    public chosenHasCreep(): boolean {
        let array = new Array<CreepComponent>();
        for (let creep of this.creeps) {
            if (this.chosenTile.position.x === Math.floor(creep.position.x) && this.chosenTile.position.y === Math.floor(creep.position.y)) {
                return true;
            }
        }
        return false;
    }

    //TEST BLOCKING
    public chosenRoadCanBuild(): boolean {
        let tiles = new Map<number, Tile>();
        for (let [key, val] of this.tiles) {
            if (this.chosenTile === val) {
                let tile = val.clone();
                tile.type = TILE_TYPE_GRASS;
                tiles.set(key, tile);
            }
            else {
                tiles.set(key, val.clone());
            }
        }

        let pathContext = new PathFinderContext();
        let foundPath = new BreadthFirstSearch().search(tiles, this.portal.position, this.castle.position, pathContext,
            (vec: Vec2) => {
                return vec.y * COLUMNS_NUM + vec.x;
            });

        if (foundPath) {
            return true;
        }
        else {
            return false;
        }
    }

    public chosenGrassCanBuild(): boolean{
        for(let [key, val] of this.towers){
            if(key === this.chosenTile.position.x + this.chosenTile.position.y * COLUMNS_NUM){
                return false;
            }
        }
        return true;
    }

    /**
     * Fills map of bricks from an array the level is represented by
     */
    protected loadTiles() {
        for (let row = 0; row < this.levels[this.currentLevel - 1].length; row++) {
            for (let col = 0; col < COLUMNS_NUM; col++) {
                let tileIndex = this.levels[this.currentLevel - 1][row][col];
                // add a new tile
                let tile = new Tile();
                tile.position = new Vec2(col, row);
                tile.type = tileIndex;
                let index = row * COLUMNS_NUM + col;
                this.tiles.set(index, tile);
                switch (tileIndex) {
                    case 2: {
                        this.portal = tile;
                        break;
                    }
                    case 3: {
                        this.castle = tile;
                        break;
                    }
                }
            }
        }
    }
}
