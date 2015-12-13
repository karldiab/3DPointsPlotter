/*
	3D Points Plotter
	Author - Karl Diab
 */

//$( document ).ready(function() {	
// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var pointsArray = [[0,0,0],[0,0,10],[0,10,10],[0,10,0],[10,0,0],[10,0,10],[10,10,0],[10,10,10]];
var objectArray = new Array();

// custom global variables
var cube;

// initialization
init();

// animation loop
animate();

function enterPoints() {
	/*for (var i =0; i < pointsArray.length;i++) {
		//scene.removeObject(pointsArray[i]);
	}*/
	pointsArray = new Array();
	var input = document.getElementById("pointsInput").value;
	//document.getElementById("pointsOutput").innerHTML = document.getElementById("pointsOutput").value + input;
	var subArray = new Array();
	//document.getElementById("pointsOutput").innerHTML = document.getElementById("pointsOutput").value + "\n" + input.length;
	while (input.length > 0) {
		//document.getElementById("pointsOutput").innerHTML = document.getElementById("pointsOutput").value + "\n" + input.length;
		while (input.length > 0 && isNaN(input.charAt(0))) {
			input = input.substr(1);
			
		}
		var numberHolder = "";
		while (input.length > 0 && (input.charAt(0) === '.' || !isNaN(input.charAt(0)))) {
			numberHolder += "" + input.charAt(0);
			input = input.substr(1);
			
		}
		subArray.push(numberHolder);
		if (subArray.length == 3) {
			pointsArray.push(subArray);
			subArray = new Array();
		}
	}
	
	var outputString = "";
	for (var i = 0; i < pointsArray.length; i++) {
		outputString += i + " [" + pointsArray[i] + "]\n";
	}
	document.getElementById("pointsOutput").innerHTML = "" + outputString;
	plotPoints();
	

}
function init() 
{

	scene = new THREE.Scene();

	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);

	camera.position.set(0,150,100);
	
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	
	renderer.setSize(750, 750);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	THREEx.WindowResize(renderer, camera);
	// toggle full-screen on given key press
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	controls = new THREE.OrbitControls( camera, renderer.domElement );


	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	
	// fog must be added to scene before first render
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	plotPoints();
	createOptions();
	changeOptions();
	
	userOptions();
}
function changeOptions() {
	xGrid = document.getElementById("xGrid").checked;
	yGrid = document.getElementById("yGrid").checked;
	zGrid = document.getElementById("zGrid").checked;
	axisHelper = document.getElementById("axisHelper").checked;
	userOptions();
}
function createOptions() {
	axes = new THREE.AxisHelper(100);
	gridXZ = new THREE.GridHelper(100, 10);
	gridXY = new THREE.GridHelper(100, 10);
	gridXY.rotation.x = Math.PI/2;
	gridYZ = new THREE.GridHelper(100, 10);
	gridYZ.rotation.z = Math.PI/2;
}
function userOptions() {

	//axis pointers
	if (axisHelper) {
		scene.add( axes );
	} else {
		scene.remove(axes);
	}

	//grid helpers
	if (xGrid) {
		scene.add(gridXZ);
	} else {
		scene.remove(gridXZ);
	}
	if (yGrid) {
		scene.add(gridXY);
	} else {
		scene.remove(gridXY);
	}
	if (zGrid) {
		scene.add(gridYZ);
	} else {
		scene.remove(gridYZ);
	}
}
function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
	//plotPoints();
}

function update()
{
	controls.update();
}

function render() 
{	
	renderer.render( scene, camera );
}
function plotPoints() { 
	//remove old objects
	for (var i = 0; i < objectArray.length; i++) {
		scene.remove(objectArray[i]);
	}
	objectArray = new Array();
	//alert(typeof objectArray);
	var cubeMaterial = new THREE.MeshBasicMaterial(  { color: 0x000000 } );
	for (var i = 0; i < pointsArray.length; i++) {
		var cubeGeometry = new THREE.CubeGeometry( 0.5, 0.5, 0.5);
		// using THREE.MeshFaceMaterial() in the constructor below
		//   causes the mesh to use the materials stored in the geometry
		objectArray[i] = new THREE.Mesh( cubeGeometry, cubeMaterial );
		objectArray[i].position.set(pointsArray[i][0], pointsArray[i][1], pointsArray[i][2]);
		scene.add( objectArray[i] );	
	};
};
//});