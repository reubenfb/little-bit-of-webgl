const d3 = require('d3');

const regl = require('regl')({
	container: document.getElementsByClassName('regl-container')[0]
});

const totalLeg = 7384;

let squares = {
	width: 10,
	margin: 1,
	position: []
}

const squaresPerRow = 1000/squares.width;
const convertScale = d3.scaleLinear().range([-1, 1]).domain([0, 1000]);

for(var i = 0; i < totalLeg; i++){
	let square = [];

	let colPosition = (i % squaresPerRow) * squares.width + squares.width/2 - 1;
	square.push(convertScale(colPosition));

	let rowPosition = Math.floor(i/squaresPerRow) * squares.width + squares.width/2 - 1;
	square.push(-convertScale(rowPosition));

	squares.position.push(square);
}

const drawSquares = regl({

  vert: `
  precision mediump float;
  attribute vec2 position;
  uniform float pointWidth;
  void main () {
    gl_PointSize = pointWidth;
    gl_Position = vec4(position, 0, 1);
  }`,

  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

  attributes: {
    position: function(context, props){
    	return props.position;
    }
  },

  uniforms: {
    pointWidth: squares.width * window.devicePixelRatio - squares.margin * window.devicePixelRatio * 2,
    color: [1, 0, 0, 1]
  },

  count: totalLeg,
  primitive: 'points'
});


drawSquares({
	position: squares.position
});