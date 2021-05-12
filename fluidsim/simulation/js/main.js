
var camera;
var renderer;
var gui; 

function scene_setup(){
	//This is the basic scene setup
	scene = new THREE.Scene();
	var width = window.innerWidth;
	var height = window.innerHeight;
	//Note that we're using an orthographic camera here rather than a prespective
	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
	camera.position.z = 2;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}

var bufferScene;
var textureA;
var textureB;
var bufferMaterial;
var plane;
var bufferObject;
var finalMaterial;
var quad;
gui = new dat.GUI();
	var obj = {
		red: .5 ,
		blue: .5,
		green: .5,
		north:.5,
		south:0.1,
		east:0.1,
		west:0.1,
    diffusion:8.0,
    radius:5.0,
	};
	gui.green = 1.0;
	gui.red=1.0;
	gui.blue=1.0;
	gui.north = .5;
	gui.south = 0.1;
	gui.east = 0.1;
	gui.west = 0.1
  gui.diffusion = 8.0;
  gui.radius = 5.0;
	


	
	gui.add(obj, "red").min(.1).max(1.0).step(.1).onChange(function(newValue) {
		gui.red= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "blue").min(.1).max(1.0).step(.1).onChange(function(newValue) {
		gui.blue= newValue;
		buffer_texture_setup();

	});
	gui.add(obj, "green").min(.1).max(1.0).step(.1).onChange(function(newValue) {
		gui.green= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "north").min(.05).max(1.0).step(.05).onChange(function(newValue) {
		gui.north= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "south").min(.05).max(1.0).step(.05).onChange(function(newValue) {
		gui.south= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "east").min(.05).max(1.0).step(.05).onChange(function(newValue) {
		gui.east= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "west").min(.05).max(1.0).step(.05).onChange(function(newValue) {
		gui.west= newValue;
		buffer_texture_setup();
	});
	gui.add(obj, "diffusion").min(1.0).max(50.0).step(1).onChange(function(newValue) {
		gui.diffusion= newValue;
		buffer_texture_setup();
  });
  gui.add(obj, "radius").min(1.0).max(50.0).step(1).onChange(function(newValue) {
		gui.radius= newValue;
		buffer_texture_setup();
	});
	
	

function buffer_texture_setup(){
	//Create buffer scene
	
	bufferScene = new THREE.Scene();
	//Create 2 buffer textures
	textureA = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.NearestMipmapNearestFilter, magFilter: THREE.NearestMipmapNearestFilter});
	textureB = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.NearestMipmapNearestFilter, magFilter: THREE.NearestMipmapNearestFilter} );
	//Pass textureA to shader
	bufferMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			bufferTexture: { type: "t", value: textureA },
			res : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
			smokeSource: {type:"v3",value:new THREE.Vector3(0,0,0)},
			time: {type:"f",value:Math.random()*Math.PI*2+Math.PI},
			red:{type:"f", value: gui.red},
			blue:{type:"f", value: gui.blue},
			green:{type:"f", value: gui.green},
			north:{type:"f", value: gui.north},
			south:{type:"f", value: gui.south},
			east: {type:"f", value:gui.east},
			west: {type:"f", value:gui.west},
      diffusion: {type:"f", value:gui.diffusion},
      radius: {type:"f", value:gui.radius}

		},
		fragmentShader: document.getElementById( 'fragShader' ).innerHTML
	} );
	plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
	bufferObject = new THREE.Mesh( plane, bufferMaterial );
	bufferScene.add(bufferObject);

	//Draw textureB to screen 
	finalMaterial =  new THREE.MeshBasicMaterial({map: textureB});
	
	quad = new THREE.Mesh( plane, finalMaterial );
	scene.add(quad);
}

//Initialize the Threejs scene
scene_setup();

//Setup the frame buffer/texture we're going to be rendering to instead of the screen
buffer_texture_setup();

//Render everything!
function render() {

	requestAnimationFrame( render );

	//Draw to textureB
	renderer.render(bufferScene,camera,textureB,true);
	
	//Swap textureA and B
	var t = textureA;
	textureA = textureB;
	textureB = t;
	quad.material.map = textureB;
	bufferMaterial.uniforms.bufferTexture.value = textureA;


	//Finally, draw to the screen
	renderer.render( scene, camera );
}
render();
