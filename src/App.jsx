import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import { IconButton, Grid, Container, Button} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import classNames from "classnames";
import './App.css'

function App() {
  const [ypos, updateYPos] = useState(0)
  const [xpos, updateXPos] = useState(0)

  //////////////////////////////// Move {
  function moveUp() {
      if (ypos > 0) {
        //updateBoard(updateGrid(0))
        //updateYPos(ypos - 1)
        clicker(0)
      }

  }
  
  function moveDown() {
      if (ypos < 19) {
        //updateBoard(updateGrid(2))
        //updateYPos(ypos + 1)
        clicker(2)
      }
  }
  
  function moveLeft() {
      if (xpos > 0) {
        //updateBoard(updateGrid(1))
        //updateXPos(xpos - 1)
        clicker(1)
      }
  }
  
  function moveRight() {
      if (xpos < 19) {
        //updateBoard(updateGrid(3))
        //updateXPos(xpos + 1)
        clicker(3)
      }
  }
  

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  class Tile {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.visited = false
      this.neighbor = []
      this.movement = 0
    }
  }

  function createMaze() {
    var board = Array(20).fill(null).map(() => Array(20).fill());
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        board[i][j] = new Tile(i, j)
        //console.log(board[i][j].x, " ", board[i][j].y)
      }
    }
    //tile[19][19] = 2
    return board
  }

  function makeRoute(board) {
    let visits = 0

    let currX = 0
    let currY = 0
    let tileStack = []

    while(visits < 400) {
      //currT = tileStack.pop()
      var currN = []
      if(currY > 0 && board[currX][currY-1].neighbor.length == 0) {
        currN.push(0)
      }
      if(currX > 0 && board[currX-1][currY].neighbor.length == 0) {
        currN.push(1)
      }
      if(currY < 19 && board[currX][currY+1].neighbor.length == 0) {
        currN.push(2)
      }
      if(currX < 19 && board[currX+1][currY].neighbor.length == 0) {
        currN.push(3)
      }
      if(currN.length > 0) {
        //console.log(currN, ", ", currX, ", ", currY)
        let direction = getRandomInt(currN.length)
        switch(currN[direction]) {
          case 0:
            board[currX][currY].neighbor.push(1)
            board[currX][currY-1].neighbor.push(3)
            tileStack.push(board[currX][currY])
            currY--
            break;
          case 1:
            board[currX][currY].neighbor.push(0)
            board[currX-1][currY].neighbor.push(2)
            tileStack.push(board[currX][currY])
            currX--
            break;
          case 2:
            board[currX][currY].neighbor.push(3)
            board[currX][currY+1].neighbor.push(1)
            tileStack.push(board[currX][currY])
            currY++
            break;
          case 3:
            board[currX][currY].neighbor.push(2)
            board[currX+1][currY].neighbor.push(0)
            tileStack.push(board[currX][currY])
            currX++
            break;
        }
        visits++
      } else {
        var currT = tileStack.pop()
        //console.log(currT, ", ", currX, ", ", currY)
        currX = currT.x
        currY = currT.y
        visits++
      }
      
    }
    return board
  }

  function initGrid(tiles) {
    //var tiles = createMaze()
    //tiles = makeRoute(tiles)
    while (tiles[19][19].neighbor.length == 0) {
      tiles = createMaze()
      tiles = makeRoute(tiles)
    }
    //amazed(tiles)
   //console.log(tiles)
    var b = []
    var count = 0
    for(var i = 0; i < 20; i++) {
      b.push(<tr></tr>)
      for(var j = 0; j < 20; j++) {
        //console.log(tiles[i][j])
        let tileNeighbor = tiles[i][j].neighbor
        //if(tileNeighbor)
        var player = (i == 0 && j == 0) ? true : false
        b.push(<td className={classNames({
          tile:true, 
          removeTop: tileNeighbor.includes(0),
          removeLeft: tileNeighbor.includes(1),
          removeBottom: tileNeighbor.includes(2),
          removeRight: tileNeighbor.includes(3),
          player: (i == 0 && j == 0) ? true : false,
          destination: (i == 19 && j == 19) ? true : false
        }) } key = {[i, j].concat(tileNeighbor)}> </td>)
      }
    }
    return b
  }

  //const [board, updateBoard] = useState(initGrid())
  const [amaze, updateMaze] = useState(makeRoute(createMaze()))
  const [board, updateBoard] = useState()

  useEffect(() =>{
    console.log(amaze)
    updateBoard(initGrid(amaze))
  }, [amaze])

  const [click, clicker] = useState(-1)

  function resetGrid() {
    updateYPos(0)
    updateXPos(0)
    //clicker(0)
    updateMaze(makeRoute(createMaze()))
    updateBoard(initGrid(amaze))
  }

  function updateGrid(dir) {
    var b = board
    var newX = xpos
    var newY = ypos
    console.log(board[xpos][ypos])
    switch (dir) {
      case 0:
        if(board[xpos][ypos].neighbor.includes(0)){
          newX--
        }
        break;
      case 1:
        if(board[xpos][ypos].neighbor.includes(1)){
          newY--
        }
        break;
      case 2:
        if(board[xpos][ypos].neighbor.includes(2)){
          newX++
        }
        break;
      case 3:
        if(board[xpos][ypos].neighbor.includes(3)){
          newY++
        }
        break;
    }
    for(var i = 0; i < 20; i++) {
      b.push(<tr></tr>)
      for(var j = 0; j < 20; j++) {
        //console.log(tiles[i][j])
        let tileNeighbor = tiles[i][j].neighbor
        //if(tileNeighbor)
        var player = (i == 0 && j == 0) ? true : false
        b.push(<td className={classNames({
          tile:true, 
          removeTop: tileNeighbor.includes(0),
          removeLeft: tileNeighbor.includes(1),
          removeBottom: tileNeighbor.includes(2),
          removeRight: tileNeighbor.includes(3),
          player: (i == newX && j == newY) ? true : false,
          destination: (i == 19 && j == 19) ? true : false
        }) }> {tileNeighbor} </td>)
      }
    }

    return b
  }

  useEffect(() => {
    var b = board
    var currX = xpos
    var currY = ypos
    var newX = xpos
    var newY = ypos
    var neighbors = []
    if(board && amaze) {

      if(click != 0) {
        for(let i = 0; i < board.length; i++) {
          if (board[i].props.className && board[i].props.className.includes('player')) {
              console.log(board[i].key)
              var noNeighbors = board[i].key.length
              switch(noNeighbors) {
                case 5:
                  neighbors.push(parseInt(board[i].key.charAt(4)))
                  break;
                case 7:
                  neighbors.push(parseInt(board[i].key.charAt(4)))
                  neighbors.push(parseInt(board[i].key.charAt(6)))
                  break;
                case 9:
                  neighbors.push(parseInt(board[i].key.charAt(4)))
                  neighbors.push(parseInt(board[i].key.charAt(6)))
                  neighbors.push(parseInt(board[i].key.charAt(8)))
                  break;
              }
          }
        }
      }
      
      console.log(click)
      switch(click) {
        case 0:
          newY = currY
          newX = currX - 1
          break;
        case 1:
          newY = currY - 1
          newX = currX
          break;
        case 2:
          newY = currY
          newX = currX + 1
          break;
        case 3:
          newY = currY + 1
          newX = currX
          break;
        default:
          newY = currY
          newX = currX
          break;
      }
      
      console.log(newX, newY)
      var b = []
      var count = 0
      for(var i = 0; i < 20; i++) {
        b.push(<tr></tr>)
        for(var j = 0; j < 20; j++) {
          //console.log(tiles[i][j])
          let tileNeighbor = amaze[i][j].neighbor
          //if(tileNeighbor)
          var player = (i == 0 && j == 0) ? true : false
          b.push(<td className={classNames({
            tile:true, 
            removeTop: tileNeighbor.includes(0),
            removeLeft: tileNeighbor.includes(1),
            removeBottom: tileNeighbor.includes(2),
            removeRight: tileNeighbor.includes(3),
            player: (i == newX && j == newY) ? true : false,
            destination: (i == 19 && j == 19) ? true : false
          }) } key = {[i, j].concat(tileNeighbor)}></td>)
        }
      }
    }

    updateBoard(b)
    updateYPos(newY)
    updateXPos(newX)
    clicker(-1)
  },[click])

  return (
    <div className="App">
      <Container>
        <div className="header">
          <h1>A-Mazing Game</h1>
        </div>
        <div className="header">
          <h2>Position: &#40;{xpos}, {ypos}&#41;</h2>
        </div>
        <div className="ButtonBox">
          <Grid container spacing={0}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <IconButton variant="outlined" size="large" onClick={moveUp}>
                <ArrowUpwardIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <IconButton variant="outlined" size="large" onClick={moveLeft}>
                <ArrowBackIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <IconButton variant="outlined" size="large" onClick={moveRight}>
                <ArrowForwardIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <IconButton variant="outlined" size="large"  onClick={moveDown}>
                <ArrowDownwardIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={4}> </Grid>
          </Grid>
        </div>

        <div className='MazeBoard'>
          <table className='MazeTable'>
           {board}
          </table>
        </div>

        <div className="ButtonBox">
          <Grid item xs={12}>
              <IconButton variant="outlined" size="large" onClick={resetGrid}>
                <RefreshIcon/>
              </IconButton>
            </Grid>
        </div>
      </Container>
    </div>
  )
}

export default App
