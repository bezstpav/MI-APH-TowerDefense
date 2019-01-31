

import Component from '../../ts/engine/Component';
import Scene from '../../ts/engine/Scene';
import { PixiRunner } from '../../ts/PixiRunner'
import { PIXICmp } from '../../ts/engine/PIXIObject';
import { ATTR_FACTORY,DATA_JSON, SCENE_HEIGHT, SPRITES_RESOLUTION_HEIGHT } from './Constants';
import { TEXTURE_TOWERDEFENSE } from './Constants';
import { Factory } from './Factory';
import { Model } from './Model';


class TowerDefense {
    engine: PixiRunner;

    // Start a new game
    constructor() {
        this.engine = new PixiRunner();
        
        let canvas = (document.getElementById("gameCanvas") as HTMLCanvasElement);

        let screenHeight = canvas.height;
        
        // calculate ratio between intended resolution (here 600px of height) and real resolution
        // - this will set appropriate scale 
        let gameScale = SPRITES_RESOLUTION_HEIGHT / screenHeight;
        // scale the scene to 12 units if height
        let resolution = screenHeight / SCENE_HEIGHT * gameScale;
        this.engine.init(canvas, resolution / gameScale);
        // set global scale which has to be applied for ALL sprites as it will
        // scale them to defined unit size
        Factory.globalScale = 1 / resolution;

        PIXI.loader
            .reset()    // necessary for hot reload
            .add(TEXTURE_TOWERDEFENSE, 'static/towerdefense/spritesheet.png')
            .add(DATA_JSON, 'static/towerdefense/data.json')
            .load(() => this.onAssetsLoaded());
    }

    onAssetsLoaded() {
        // init factory and model
        let factory = new Factory();
        let model = new Model();
        model.loadModel(PIXI.loader.resources[DATA_JSON].data);
        factory.resetGame(this.engine.scene, model);
    }
}

export var towerDefense = new TowerDefense();

