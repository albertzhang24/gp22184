const N = 128;
const iterations = 6;
const scale = 8;
var gui = new dat.GUI();
var fluid = new Fluid(0.2, 0.000001, 0.0000001);