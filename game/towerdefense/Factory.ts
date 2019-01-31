import { DynamicsComponent } from './../../ts/components/DynamicsComponent';
import { LevelManager } from './Components/LevelManager';
import { ATTR_FACTORY, TEXTURE_TOWERDEFENSE, TAG_TITLE, ATTR_MODEL, TAG_TILES, TAG_TILE_ROAD, TAG_TILE_GRASS, TAG_TILE_PORTAL, TAG_TILE_CASTLE, TAG_MENU, TAG_MENU_TITLE, TAG_TILE_MARKED, TAG_MENU_WAVE, TAG_CREEPS, TAG_STATUS, TAG_MENU_LIVES, TAG_MENU_MONEY, TAG_HEART, TAG_COIN, TAG_MENU_BULLET_BUTTON, TAG_MENU_ROCKET_BUTTON, TAG_MENU_GRASS_BUTTON, TAG_MENU_UPGRADE_DAMAGE, TAG_MENU_UPGRADE_FIRERATE, TAG_MENU_UPGRADE_RANGE, TAG_BULLET_TOWER, TAG_ROCKET_TOWER } from './Constants';
import Scene from '../../ts/engine/Scene';
import { Model, SpriteInfo, COLUMNS_NUM } from './Model';
import Component from '../../ts/engine/Component';
import PIXIObjectBuilder from '../../ts/engine/PIXIObjectBuilder';
import { IntroComponent } from './Components/IntroComponent';
import Dynamics from '../../ts/utils/Dynamics';
import { ATTR_DYNAMICS } from './../../ts/engine/Constants';
import { PIXICmp } from '../../ts/engine/PIXIObject';
import { KeyInputComponent } from '../../ts/components/KeyInputComponent';
import { WaveManager } from './Components/WaveManager';
import { TileController } from './Components/TileComponent';
import { MouseInputComponent } from '../../ts/components/MouseInputComponent';
import { MenuComponent } from './Components/MenuComponent';
import { LifeLostWatcher } from './Components/LifeLostWatcher';
import { StatusComponent } from './Components/StatusComponent';
import { MoneyWatcher } from './Components/MoneyWatcher';

export class Factory {

    static globalScale = 1;

    initializeLevel(scene: Scene, model: Model) {
        // scale the scene
        if (model.currentLevel == 0) {
            this.addIntro(scene, model);
        } else {
            model.initLevel();

            this.addTiles(scene, model);
            this.addMenu(scene, model);
            this.addWaves(scene, model);
            this.addStatus(scene, model);

            scene.addGlobalComponent(new LevelManager());
            scene.addGlobalComponent(new LifeLostWatcher());
            scene.addGlobalComponent(new MoneyWatcher());
            scene.addGlobalComponent(new MouseInputComponent());
        }
    }

    addIntro(scene: Scene, model: Model) {
        let builder = new PIXIObjectBuilder(scene);

        // stage components
        builder
            .withComponent(new IntroComponent())
            .build(scene.stage)
        // title
        builder
            .scale(Factory.globalScale)
            .build(new PIXICmp.Sprite(TAG_TITLE, this.createTexture(model.getSpriteInfo(TAG_TITLE))), scene.stage);
    }

    addTiles(scene: Scene, model: Model) {
        let tiles = new PIXICmp.Container(TAG_TILES);
        scene.stage.getPixiObj().addChild(tiles);

        for (let [key, val] of model.tiles) {
            let spriteIndex = val.type; // 0 is for empty space
            let texture: PIXI.Texture;
            switch (spriteIndex) {
                case 1: {
                    texture = this.createTexture(model.getSpriteInfo(TAG_TILE_ROAD));
                    break;
                }
                case 2: {
                    let backgroundSprite = new PIXICmp.Sprite("", this.createTexture(model.getSpriteInfo(TAG_TILE_GRASS)));
                    backgroundSprite.scale.set(Factory.globalScale);

                    backgroundSprite.position.x = val.position.x;
                    backgroundSprite.position.y = val.position.y;
                    tiles.addChild(backgroundSprite);

                    texture = this.createTexture(model.getSpriteInfo(TAG_TILE_PORTAL));
                    break;
                }
                case 3: {
                    texture = this.createTexture(model.getSpriteInfo(TAG_TILE_CASTLE));
                    break;
                }
                default: {
                    texture = this.createTexture(model.getSpriteInfo(TAG_TILE_GRASS));
                    break;
                }
            }
            let sprite = new PIXICmp.Sprite("", texture);
            sprite.scale.set(Factory.globalScale);

            sprite.position.x = val.position.x;
            sprite.position.y = val.position.y;
            tiles.addChild(sprite);

            let index = val.position.y * COLUMNS_NUM + val.position.x;
            // connect sprite with tile object
            model.tileSprites.set(index, sprite);
        }
        //marked tile
        let gfx = new PIXI.Graphics();
        gfx.beginFill(0x0000FF, 0.3);
        gfx.drawRect(0, 0, 50, 50);
        gfx.endFill();

        let markedTile = new PIXICmp.Sprite(TAG_TILE_MARKED, gfx.generateCanvasTexture());
        markedTile.visible = false;
        markedTile.scale.set(Factory.globalScale);
        markedTile.addComponent(new TileController());
        tiles.addChild(markedTile);
    }

    addMenu(scene: Scene, model: Model) {
        let menu = new PIXICmp.Container(TAG_MENU);


        let builder = new PIXIObjectBuilder(scene);

        builder
            .scale(Factory.globalScale)
            .localPos(14, 0)
            .withComponent(new MenuComponent())
            .build(menu, scene.stage)

        builder
            .localPos(0, 0)
            .build(new PIXICmp.Sprite(TAG_MENU, this.createTexture(model.getSpriteInfo(TAG_MENU))), menu);

        builder
            .localPos(5, 510)
            .build(new PIXICmp.Sprite("", this.createTexture(model.getSpriteInfo(TAG_HEART))), menu);

        builder
            .localPos(5, 550)
            .build(new PIXICmp.Sprite("", this.createTexture(model.getSpriteInfo(TAG_COIN))), menu);


        let title = new PIXICmp.Text(TAG_MENU_TITLE, "MENU");
        title.name = TAG_MENU_TITLE;
        let wave = new PIXICmp.Text(TAG_MENU_WAVE, "W: " + model.currentWave + "/" + model.maxWave);
        wave.name = TAG_MENU_WAVE;
        let lives = new PIXICmp.Text(TAG_MENU_LIVES, model.currentLives + "/" + model.maxLives);
        lives.name = TAG_MENU_LIVES;
        let money = new PIXICmp.Text(TAG_MENU_MONEY, model.currentMoney.toString());
        money.name = TAG_MENU_MONEY;

        builder
            .localPos(5, 70)
            .build(title, menu);

        builder
            .localPos(5, 15)
            .build(wave, menu);

        builder
            .localPos(30, 507)
            .build(lives, menu);

        builder
            .localPos(30, 547)
            .build(money, menu);

        //buttons
        let gfx = new PIXI.Graphics();
        gfx.beginFill(0xb97a57)
        gfx.drawRect(0, 0, 50, 50);
        gfx.endFill();

        let buttonbullet = new PIXICmp.Sprite(TAG_MENU_BULLET_BUTTON, gfx.generateCanvasTexture());
        buttonbullet.name = TAG_MENU_BULLET_BUTTON;
        menu.addChild(buttonbullet);

        let bulletIcon = new PIXICmp.Sprite("", this.createTexture(model.getSpriteInfo(TAG_BULLET_TOWER)));
        buttonbullet.addChild(bulletIcon);

        let buttonrocket = new PIXICmp.Sprite(TAG_MENU_ROCKET_BUTTON, gfx.generateCanvasTexture());
        buttonrocket.name = TAG_MENU_ROCKET_BUTTON;
        menu.addChild(buttonrocket);

        let rocketIcon = new PIXICmp.Sprite("", this.createTexture(model.getSpriteInfo(TAG_ROCKET_TOWER)));
        buttonrocket.addChild(rocketIcon);

        let buttongrass = new PIXICmp.Sprite(TAG_MENU_GRASS_BUTTON, this.createTexture(model.getSpriteInfo(TAG_TILE_GRASS)));
        buttongrass.name = TAG_MENU_GRASS_BUTTON;
        menu.addChild(buttongrass);
        //end buttons
    }

    addWaves(scene: Scene, model: Model) {
        new PIXIObjectBuilder(scene)
            .withComponent(new WaveManager())
            .build(new PIXICmp.Container(TAG_CREEPS), scene.stage);
    }

    addStatus(scene: Scene, model: Model) {
        let status = new PIXICmp.Text(TAG_STATUS);
        status.style = new PIXI.TextStyle({
            fontFamily: "Comfont",
            fill: "0xFFFFFF"
        });

        new PIXIObjectBuilder(scene)
            .scale(Factory.globalScale)
            .localPos(0, 0)
            .withComponent(new StatusComponent())
            .build(status, scene.stage);
    }

    resetGame(scene: Scene, model: Model) {
        scene.clearScene();
        scene.addGlobalAttribute(ATTR_FACTORY, this);
        scene.addGlobalAttribute(ATTR_MODEL, model);
        this.initializeLevel(scene, model);
    }

    // loads texture from SpriteInfo entity
    public createTexture(spriteInfo: SpriteInfo, index: number = 0): PIXI.Texture {
        let texture = PIXI.Texture.fromImage(TEXTURE_TOWERDEFENSE);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(spriteInfo.offsetX + spriteInfo.width * index, spriteInfo.offsetY, spriteInfo.width, spriteInfo.height);
        return texture;
    }
}