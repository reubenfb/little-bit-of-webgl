const d3 = require('d3');

const regl = require('regl')({
	container: document.getElementsByClassName('regl-container')[0]
});

const totalLeg = 7384;
const demLeg = 3300;
const repLeg = 3965;
const otherLeg = totalLeg - demLeg - repLeg;

let squares = {
	width: 10,
	margin: 1,
	position: [],
  color: []
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

  if(i < demLeg){
    squares.color.push([0, 0, 1, 1]);
  }
  else if(i < demLeg + otherLeg){
    squares.color.push([0.7, 0.7, 0.7, 1]);
  }
  else{
    squares.color.push([1, 0, 0, 1]);
  }

}

const drawSquares = regl({

  vert: `
  precision mediump float;
  attribute vec2 position;
  attribute vec4 color;
  varying vec4 fragColor;
  uniform float pointWidth;
  void main () {
    gl_PointSize = pointWidth;
    gl_Position = vec4(position, 0, 1);
    fragColor = color;
  }`,

  frag: `
  precision mediump float;
  varying vec4 fragColor;
  void main () {
    gl_FragColor = fragColor;
  }`,

  attributes: {
    position: function(context, props){
    	return props.position;
    },
    color: function(context, props){
      return props.color;
    }
  },

  uniforms: {
    pointWidth: squares.width * window.devicePixelRatio - squares.margin * window.devicePixelRatio * 2
  },

  count: totalLeg,
  primitive: 'points'
});


drawSquares({
	position: squares.position,
  color: squares.color
});

d3.select('body').on('click', function(){

  squares.color.forEach(function(color){
    color[3] = color[3] - Math.random()/15;
    if(color[3] < 0){
      color[3] == 0;
    }
  })

  drawSquares({
    position: squares.position,
    color: squares.color
  });

});