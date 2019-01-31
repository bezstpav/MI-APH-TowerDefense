export const MSG_TILE_CHOSEN = "TILE_CHOSEN";


// message keys
export const MSG_GAME_STARTED = "GAME_STARTED";
export const MSG_WAVE_STARTED = "WAVE_STARTED";

export const MSG_CREEP_CASTLE_HIT = "CREEP_CASTLE_HIT";
export const MSG_CREEP_HIT = "CREEP_HIT";
export const MSG_CREEP_DEATH = "CREEP_DEATH";
export const MSG_LIFE_LOST = "LIFE_LOST";
export const MSG_CHANGED_MAP = "MAP_CHANGED";
export const MSG_ERROR_HASCREEP = "ERROR_HASCREEP";
export const MSG_ERROR_BLOCK = "ERROR_BLOCK";
export const MSG_ERROR_MONEY = "ERROR_MONEY";
export const MSG_BUILD = "BUILD";
export const MSG_MONEY_EARNED = "MONEY_EARNED";
export const MSG_GAME_OVER = "GAME_OVER";
export const MSG_LEVEL_COMPLETED = "LEVEL_COMPLETED";
export const MSG_LEVEL_STARTED = "LEVEL_STARTED";
export const MSG_GAME_COMPLETED = "GAME_COMPLETED";

export const MSG_COMMAND_FINISH_LEVEL = "CMD_FINISH_LEVEL";
export const MSG_COMMAND_GAME_OVER = "CMD_GAME_OVER";
export const MSG_COMMAND_GOTO_NEXT_WAVE = "CMD_GOTO_NEXT_ROUND";

export const MSG_COMMAND_BUILD = "CMD_BUILD";

// alias for config file
export const DATA_JSON = "DATA_JSON";

// alias for texture
export const TEXTURE_TOWERDEFENSE = "towerdefense";

// attribute keys
export const ATTR_MODEL = "MODEL";
export const ATTR_FACTORY = "FACTORY";

// tags for game objects
export const TAG_TITLE = "title";
export const TAG_MENU = "menu";
export const TAG_MENU_TITLE = "menu_title";
export const TAG_MENU_WAVE = "menu_wave";
export const TAG_HEART = "heart";
export const TAG_COIN = "coin";
export const TAG_MENU_LIVES = "menu_lives";
export const TAG_MENU_MONEY = "menu_money";
export const TAG_MENU_BULLET_BUTTON = "menu_bullet";
export const TAG_MENU_ROCKET_BUTTON = "menu_rocket";
export const TAG_MENU_GRASS_BUTTON = "menu_grass";
export const TAG_MENU_UPGRADE_DAMAGE = "menu_upgrade_d";
export const TAG_MENU_UPGRADE_FIRERATE = "menu_upgrade_f";
export const TAG_MENU_UPGRADE_RANGE = "menu_upgrade_r";
export const TAG_TILES = "tiles";
export const TAG_TILE_GRASS = "grass";
export const TAG_TILE_ROAD = "road";
export const TAG_TILE_CASTLE = "castle";
export const TAG_TILE_PORTAL = "portal";
export const TAG_TILE_MARKED = "marked";
export const TAG_CREEPS = "creeps";
export const TAG_CREEP = "creep";
export const TAG_CREEP_RED = "red";
export const TAG_CREEP_GREEN = "green";
export const TAG_CREEP_YELLOW = "yellow";
export const TAG_STATUS = "status";
export const TAG_BULLET_TOWER = "bullet_tower";
export const TAG_ROCKET_TOWER = "rocket_tower";
export const TAG_BULLET = "bullet";
export const TAG_ROCKET = "rocket";

// aliases for tiles
export const TILE_TYPE_GRASS = 0;
export const TILE_TYPE_ROAD = 1;
export const TILE_TYPE_PORTAL = 2;
export const TILE_TYPE_CASTLE = 3;

// height of the scene will be set to 12 units for the purpose of better calculations
export const SCENE_HEIGHT = 12;

// native height of the game canvas. If bigger, it will be resized accordingly
export const SPRITES_RESOLUTION_HEIGHT = 600;

export const DIRECTION_NORTH = 0;
export const DIRECTION_WEST = 1;
export const DIRECTION_EAST = 2;
export const DIRECTION_SOUTH = 3;