import styled from "styled-components";
import {makeObservable, observable, action} from "mobx";
import {observer} from "mobx-react";

const PlayGrid = styled.div`
    display: inline-grid;
    gap: 0px;
`;

const Block = styled.div`
    background-color: blue;
`;

const SnakeBlock = styled(Block)`
    background-color: red;
`;

class Grid {
    cells;
    snake;
    direction;

    constructor(rows, cols) {
        this.cells = Array(rows*cols).map((x, index) => index);
        this.snake = [[Math.floor(rows/2)*Math.floor(cols/2)]];
        this.direction = 1;
        makeObservable(this, {
            cells: observable,
            snake: observable,
            direction: observable,
            changeDirection: action,
        })
    }

    changeDirection(dir) {
        this.direction = dir;
    }
}

const myGrid = new Grid(20,20);

const GridView = observer(({comp}) => {
    return (
        <PlayGrid>
            {comp.cells.map(x => <Block />)}
        </PlayGrid>
    );
});

export default function() {
    return (
        <GridView comp={myGrid}/>
    );
};