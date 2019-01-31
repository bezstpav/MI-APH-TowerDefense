import Vec2 from "../../ts/utils/Vec2";
import { Tile } from "./Components/TileComponent";
import Queue from './datastruct/Queue';
import { Model, COLUMNS_NUM, ROWS_NUM } from "./Model";
import { TILE_TYPE_ROAD, TILE_TYPE_CASTLE } from "./Constants";

/**
 * Context object for pathfinding algorithm
 */
export class PathFinderContext {
    // map with steps from start to goal
    cameFrom = new Map<number, Vec2>();
    // set of all visited nodes 
    visited = new Set<number>();
    // output entity
    pathFound = new Array<Vec2>();
    // direction
    direction = new Array<number>();
}

class Pair<A, B>{
    first: A;
    second: B;
    constructor(first: A, second: B) {
        this.first = first;
        this.second = second;
    }
}


export class BreadthFirstSearch {
    search(grid: Map<number, Tile>, start: Vec2, goal: Vec2, outputCtx: PathFinderContext, indexMapper: (Vec2) => number): boolean {
        let frontier = new Queue<Vec2>();
        frontier.add(start);

        outputCtx.cameFrom.set(indexMapper(start), start);
        while (!frontier.isEmpty()) {
            let current = frontier.peek();
            outputCtx.visited.add(indexMapper(current));

            frontier.dequeue();

            if (current.equals(goal)) {
                // the goal was achieved
                outputCtx.pathFound = this.calcPathFromSteps(start, goal, outputCtx.cameFrom, indexMapper);
                return true;
            }

            // get neighbors of the current grid block
            let neighbors = new Array<Vec2>();
            let LTile = grid.get(current.x + COLUMNS_NUM * current.y - 1);
            let RTile = grid.get(current.x + COLUMNS_NUM * current.y + 1);
            let UTile = grid.get(current.x + COLUMNS_NUM * (current.y - 1));
            let DTile = grid.get(current.x + COLUMNS_NUM * (current.y + 1));

            if(LTile && (LTile.type == TILE_TYPE_ROAD || LTile.type == TILE_TYPE_CASTLE)){
                neighbors.push(new Vec2(current.x - 1, current.y))
            }
            if(RTile && (RTile.type == TILE_TYPE_ROAD || RTile.type == TILE_TYPE_CASTLE)){
                neighbors.push(new Vec2(current.x + 1, current.y))
            }
            if(UTile && (UTile.type == TILE_TYPE_ROAD || UTile.type == TILE_TYPE_CASTLE)){
                neighbors.push(new Vec2(current.x, current.y - 1))
            }
            if(DTile && (DTile.type == TILE_TYPE_ROAD || DTile.type == TILE_TYPE_CASTLE)){
                neighbors.push(new Vec2(current.x, current.y + 1))
            }

            for (let next of neighbors) {
                if (!outputCtx.cameFrom.has(indexMapper(next))) {
                    frontier.enqueue(next);
                    outputCtx.cameFrom.set(indexMapper(next), current);
                }
            }
        }
        return false;
    }
    calcPathFromSteps(start: Vec2, goal: Vec2, steps: Map<number, Vec2>, indexMapper: (Vec2) => number): Array<Vec2> {
        let current = goal;
        let output = new Array<Vec2>();
        output.push(current);
        while (!current.equals(start)) {
            current = steps.get(indexMapper(current));
            output.push(current);
        }
        // reverse path so the starting position will be at the first place
        output = output.reverse();
        return output;
    }
}