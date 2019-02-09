import React, { Component } from 'react';
import _ from 'lodash';

const InitialState = {
  speed: 100,
  direction: 'right',
  size: 10,
  position: [
    [6, 4], [5, 4], [4, 4]
  ],
  gameOver: false,
  apple: [0, 0]
};

export default class Snake extends Component {
  constructor(props) {
    super(props);
    this.state = InitialState;
  }

  componentDidMount() {
    this._context = this.refs.canvas.getContext('2d');
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getContainerSize = () => {
    const { width, height } = this.props
    return {
      width: width || window.innerWidth,
      height: height || window.innerHeight
    }
  }

  setPosition = (direction, lastPosition) => {
    const size = this.getContainerSize()
    const surfaceWidth = parseInt(size.width / this.state.size, 10);
    const surfaceHeight = parseInt(size.height / this.state.size, 10);

    switch (direction) {
      case 'left':
        if (lastPosition[0] - 1 === -1) {
          return ([surfaceWidth, lastPosition[1]]);
        }
        return ([lastPosition[0] - 1, lastPosition[1]]);
      case 'up':
        if (lastPosition[1] - 1 === -1) {
          return ([lastPosition[0], surfaceHeight]);
        }
        return ([lastPosition[0], lastPosition[1] - 1]);
      case 'right':
        if (lastPosition[0] + 1 > surfaceWidth) {
          return ([0, lastPosition[1]]);
        }
        return ([lastPosition[0] + 1, lastPosition[1]]);
      case 'down':
        if (lastPosition[1] + 1 > surfaceHeight) {
          return ([lastPosition[0], 0]);
        }
        return ([lastPosition[0], lastPosition[1] + 1]);
      default:
        return (lastPosition);
    }
  };

  init = () => {
    this.focusInput();
    this.setState({
      ...InitialState,
      apple: this.generateApplePosition()
    });

    this.interval = setInterval(this.gameLoop, this.state.speed);
  };

  handleKeyDown = (event) => {
    event.preventDefault();
    const keys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    const direction = keys[event.which];
    if (direction) {
      if (this.state.direction === 'left' && direction === 'right' ||
          this.state.direction === 'up' && direction === 'down' ||
          this.state.direction === 'right' && direction === 'left' ||
          this.state.direction === 'down' && direction === 'up') {
        return;
      }
      this.setState({ ...this.state, direction });
    }
  };

  focusInput = () => {
    this.refs.input.focus();
  };

  drawApple = () => {
    const { size, apple } = this.state;

    this._context.save();
    this._context.fillStyle = '#6DC983';
    this._context.beginPath();
    const radius = size / 2;
    const x = apple[0] * size + radius;
    const y = apple[1] * size + radius;
    this._context.arc(x, y, radius, 0, Math.PI * 2, true);
    this._context.fill();
    this._context.restore();
  };

  drawElement = (position) => {
    const { size } = this.state;

    const x = size * position[0];
    const y = size * position[1];
    this._context.fillRect(x, y, size, size);
  };

  drawSnake = () => {
    const { position } = this.state;

    this._context.save();
    this._context.fillStyle = '#7377CF';

    position.forEach(this.drawElement);

    this._context.restore();
  };


  generateApplePosition = () => {
    const size = this.getContainerSize();
    const surfaceWidth = parseInt(size.width / this.state.size, 10);
    const surfaceHeight = parseInt(size.height / this.state.size, 10);

    return ([
      Math.floor(Math.random() * surfaceWidth),
      Math.floor(Math.random() * surfaceHeight)
    ]);
  };

  advance = () => {
    const { direction } = this.state;
    const position = this.state.position.slice(0, this.state.position.length - 1);
    const currentPosition = this.state.position[0];
    const newPosition = this.setPosition(direction, currentPosition);

    if (_.isEqual(currentPosition, this.state.apple)) {
      this.setState({
        ...this.state,
        apple: this.generateApplePosition(),
        position: [newPosition, ...this.state.position]
      });
    } else {
      position.forEach((element) => {
        if (_.isEqual(newPosition, element)) {
          this.setState({ ...this.state, gameOver: true });
        }
      });
      this.setState({ ...this.state, position: [newPosition, ...position] });
    }
  };

  gameLoop = () => {
    const size = this.getContainerSize()
    const surfaceWidth = parseInt(size.width, 10);
    const surfaceHeight = parseInt(size.height, 10);

    this._context.clearRect(0, 0, surfaceWidth, surfaceHeight);
    this.advance();
    this.drawSnake();
    this.drawApple();

    if (this.state.gameOver) {
      clearInterval(this.interval);
    }
  };

  render() {
    const size = this.getContainerSize()
    return (
      <div>
        <input style={{ position: 'absolute', width: 0, height: 0, outline: '0 !important', border: 'none' }} ref="input" type="text" onKeyDown={ this.handleKeyDown } />
        { this.state.gameOver &&
          <div>
            <div>GAME OVER</div>
            <div onClick={ this.init }>Reset</div>
            <div>Score: { this.state.position.length } </div>
          </div>
        }
        <canvas
          ref="canvas"
          onKeyDown={ this.handleKeyDown }
          onClick={ this.focusInput }
          width={ size.width }
          height={ size.height }
        />
      </div>
    );
  }
}
