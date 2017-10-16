var d3 = require('d3-scale');

var regl = require('regl')({
	container: document.getElementsByClassName('regl-container')[0]
});





function makeSquares(width, margin){

	let squares = {
		width: width,
		margin: margin,
		finalPositions: []
	}

	let squaresPerRow = 1000/width;
	let convertScale = d3.scaleLinear().range([-1, 1]).domain([0, 1000]);


	for(var i = 0; i < (squaresPerRow * squaresPerRow); i++){
		let square = [];

		// column position
		let colPosition = (i % squaresPerRow) * width + width/2;
		square.push(convertScale(colPosition));

		// row position
		let rowPosition = Math.floor(i/squaresPerRow) * width + width/2;
		square.push(convertScale(rowPosition));

		squares.finalPositions.push(square);

	}

	return squares;

}

let squares = makeSquares(5, 1);

console.log(squares.finalPositions.length)


const drawSquares = regl({

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
    pointWidth: squares.width - squares.margin * 2
  },

  count: squares.finalPositions.length,
  primitive: 'points'
});



drawSquares({
	position: squares.finalPositions
});

