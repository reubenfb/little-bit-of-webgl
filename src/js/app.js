var d3 = require('d3-scale');

var regl = require('regl')({
	container: document.getElementsByClassName('regl-container')[0]
});


let convertScale = d3.scaleLinear().range([-1, 1]).domain([0, 1000]);

let squareWidth = 100;
let squareMargin = 1;
let squaresPerRow = 1000/squareWidth;
let finalPositions = [];

for(var i = 0; i < (squaresPerRow * squaresPerRow); i++){
	let square = [];

	// column position
	let colPosition = (i % squaresPerRow) * squareWidth + squareWidth/2;
	square.push(convertScale(colPosition));

	// row position
	let rowPosition = Math.floor(i/squaresPerRow) * squareWidth + squareWidth/2;
	square.push(convertScale(rowPosition));

	finalPositions.push(square);

}


const drawPoints = regl({

  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

  vert: `
  precision mediump float;
  attribute vec2 position;
  uniform float pointWidth;
  void main () {
  	gl_PointSize = pointWidth;
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: function(context, props){
    	return props.position;
    }
  },

  uniforms: {
    color: [1, 0, 0, 1],
    pointWidth: squareWidth - squareMargin * 2
  },

  count: finalPositions.length,
  primitive: 'points'
});



drawPoints({
	position: finalPositions
});

