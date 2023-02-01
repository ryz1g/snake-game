import styled from "styled-components";
import {makeObservable, observable, action} from "mobx";
import {observer} from "mobx-react";
import PartialDeque from "../Utils/PartialDeque";

const PlayGrid = styled.div`
    display: inline-grid;
    grid-template-columns: repeat(${({rows}) => rows},15px);
    grid-template-rows: repeat(${({cols}) => cols},15px);
    width : ${({rows}) => rows*15}px;
    gap: 0px;
`;

const Block = styled.div`
    background-color: blue;
    width: 15px;
    height: 15px;
`;

const SnakeBlock = styled(Block)`
    background-color: red;
    border-radius: 3px;
`;

const FoodBlock = styled(Block)`
    background-color: green;
`;

class Grid {
    rows;
    cols;
    totalCells;
    foodCell;
    cells;
    snake;
    direction;

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.totalCells = rows*cols;

        this.cells = Array(rows*cols).fill(0);
        this.foodCell = Math.floor(Math.random()*this.totalCells);

        this.snake = new PartialDeque(50);
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2));
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+1);
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+2);
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+3);
        // this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+4);
        // this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+5);
        // this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+6);
        // this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+7);
        this.direction = 1;
        makeObservable(this, {
            cells: observable,
            snake: observable,
            // direction: observable,
            // foodCell: observable,
            // changeDirection: action,
            // paintGrid: action,
            // moveSnake: action,
            // spawnFood: action,
            updateBoard: action,
        })
        this.cells = this.cells.map((x, index) => {
            if(this.snake.includes(index)) return 2;
            else if(index === this.foodCell) return 1;
            else return 0;
        })
    }

    paintGrid() {
        this.cells = this.cells.map((x, index) => {
            if(this.snake.includes(index)) return 2;
            else if(index === this.foodCell) return 1;
            else return 0;
        })
    }

    moveSnake() {
        this.snake.pop();
        var nextBlock = this.snake.peek() + this.direction;
        if(Math.floor(nextBlock/this.rows) !== Math.floor(this.snake.peek()/this.rows) && Math.abs(this.direction) === 1) {
            if(this.direction === 1) nextBlock-=this.rows;
            else nextBlock+=this.rows;
        }
        else if(nextBlock<0) nextBlock+=(this.totalCells);
        else if(nextBlock>this.totalCells) nextBlock-=(this.totalCells);
        // this.snake.print();
        this.snake.push(nextBlock);
        this.paintGrid();
    }

    changeDirection(dir) {
        this.direction = dir !== (this.direction*-1) ? dir : this.direction;
    }

    spawnFood() {
        var spawnBlock;
        do {
            spawnBlock = Math.floor(Math.random()*this.totalCells);
        } while(this.cells[spawnBlock] === 2);
        this.cells[this.foodCell] = 0;
        this.foodCell = spawnBlock;
        // console.log(`Food spawned at ${spawnBlock}`);
    }

    updateBoard() {
        this.moveSnake();
        if(this.snake.peek() === this.foodCell) this.spawnFood();
        this.paintGrid();
        // this.snake.print();
    }

    handleKeyEvent(e) {
        switch(e.key) {
            case "ArrowUp":
                this.changeDirection(-this.rows);
                break;
            case "ArrowLeft":
                this.changeDirection(-1);
                break;
            case "ArrowRight":
                this.changeDirection(1);
                break;
            case "ArrowDown":
                this.changeDirection(this.rows)
                break;
            default:
        }
    }
}

const GridView = observer(({comp, gameOn}) => {
    return (
        <div tabIndex={0} onKeyDown={(event) => comp.handleKeyEvent(event)}>
            <PlayGrid rows={comp.rows} cols={comp.cols}>
                {comp.cells.map((x, index) => {
                    if(x === 1) {
                        return (
                            <Block key={"Block"+index}>
                                <FoodBlock key={"Food"+index}/>
                            </Block>
                        );
                    }
                    else if(x === 2) {
                        return (
                            <Block key={"Block"+index}>
                                <SnakeBlock key={"snake"+index}/>
                            </Block>
                        );
                    }
                    else {
                        return <Block key={"Block"+index}/>;
                    }
                })}
            </PlayGrid>
            <div>
                <button onClick={() => comp.changeDirection(-comp.cols)}>Up</button>
                <button onClick={() => comp.changeDirection(-1)}>Left</button>
                <button onClick={() => comp.changeDirection(1)}>Right</button>
                <button onClick={() => comp.changeDirection(comp.cols)}>Down</button>
                <button onClick={() => clearInterval(gameOn)}>Pause</button>
            </div>
        </div>
        
    );
});

function GridComponent({rows, cols}) {
    const myGrid = new Grid(rows, cols);
    const gameOn = setInterval(() => {
        myGrid.updateBoard();
    },125);
    return (
        <GridView comp={myGrid} gameOn={gameOn}/>
    );
};

export default GridComponent;