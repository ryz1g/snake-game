import styled from "styled-components";
import {makeObservable, observable, action, toJS} from "mobx";
import {observer} from "mobx-react";
import PartialDeque from "./PartialDeque";

const PlayGrid = styled.div`
    display: inline-grid;
    grid-template-columns: repeat(50,10px);
    grid-auto-rows: auto;
    width : 500px;
    gap: 0px;
`;

const Block = styled.div`
    background-color: blue;
    width: 10px;
    height: 10px;
`;

const SnakeBlock = styled(Block)`
    background-color: red;
`;

class Grid {
    rows;
    cols;
    cells;
    snake;
    direction;

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.cells = Array(rows*cols).fill(0);
        this.snake = new PartialDeque(50);
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2));
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+1);
        this.snake.push(Math.floor(rows/2)*Math.floor(cols/2)+2);
        this.direction = 1;
        makeObservable(this, {
            cells: observable,
            snake: observable,
            direction: observable,
            changeDirection: action,
            paintGrid: action,
            moveSnake: action,
        })
        this.cells = this.cells.map((x, index) => {
            if(this.snake.includes(index)) return 2;
            else return 0;
        })
    }

    paintGrid() {
        this.cells = this.cells.map((x, index) => {
            if(this.snake.includes(index)) return 2;
            else return 0;
        })
    }

    moveSnake() {
        this.snake.pop();
        var nextBlock = this.snake.peek() + this.direction;
        if(Math.floor(nextBlock/this.cols) !== Math.floor(this.snake.peek()/this.cols) && Math.abs(this.direction) === 1) {
            if(this.direction === 1) nextBlock-=this.cols;
            else nextBlock+=this.cols;
        }
        else if(nextBlock<0) nextBlock+=(this.rows*this.cols);
        else if(nextBlock>this.rows*this.cols) nextBlock-=(this.rows*this.cols);
        // this.snake.print();
        this.snake.push(nextBlock);
        this.paintGrid();
    }

    changeDirection(dir) {
        this.direction = dir !== (this.direction*-1) ? dir : this.direction;
        // console.log(dir);
    }

    handleKeyEvent(e) {
        switch(e.key) {
            case "ArrowUp":
                this.changeDirection(-this.cols);
                break;
            case "ArrowLeft":
                this.changeDirection(-1);
                break;
            case "ArrowRight":
                this.changeDirection(1);
                break;
            case "ArrowDown":
                this.changeDirection(this.cols)
                break;
            default:
        }
    }
}

const myGrid = new Grid(50,50);

setInterval(() => {
    myGrid.moveSnake();
},50);

const GridView = observer(({comp}) => {
    return (
        <div tabIndex={0} onKeyDown={(event) => myGrid.handleKeyEvent(event)}>
            <PlayGrid>
                {comp.cells.map((x, index) => x===0 ? <Block key={index}/> : <SnakeBlock key={index}/>)}
            </PlayGrid>
            <div>
                <button onClick={() => myGrid.changeDirection(-myGrid.cols)}>Up</button>
                <button onClick={() => myGrid.changeDirection(-1)}>Left</button>
                <button onClick={() => myGrid.changeDirection(1)}>Right</button>
                <button onClick={() => myGrid.changeDirection(myGrid.cols)}>Down</button>
            </div>
        </div>
        
    );
});

function GridComponent() {
    return (
        <GridView comp={myGrid}/>
    );
};

export default GridComponent;