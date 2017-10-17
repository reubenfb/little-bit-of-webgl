const regl = require('regl')({
	container: document.getElementsByClassName('regl-container')[0]
});

const drawSquares = regl({

  vert: `
  precision mediump float;
  uniform vec2 position;
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

  uniforms: {
    pointWidth: 400,
    position: [0,0],
    color: [1, 0, 0, 1]
  },

  count: 1,
  primitive: 'points'
});

drawSquares({});
