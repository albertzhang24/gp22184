// var mouseDown = false;
// document.onmousedown = function(event){
//     customMaterial.uniforms.mousePos.value.x = event.clientX;
//     customMaterial.uniforms.mousePos.value.y = window.innerHeight - event.clientY;
//     mouseDown = true;
//     customMaterial.uniforms.mousePos.value.z = 0.1;
// }
// document.onmouseup = function(event){
//     mouseDown = false;
//     customMaterial.uniforms.mousePos.value.z = 0;
// }
//Send position of smoke source with value
var mouseDown = false;
function UpdateMousePosition(X,Y){
    var mouseX = X;
    var mouseY = window.innerHeight - Y;
    bufferMaterial.uniforms.smokeSource.value.x = mouseX;
    bufferMaterial.uniforms.smokeSource.value.y = mouseY;
}
document.onmousemove = function(event){
      UpdateMousePosition(event.clientX,event.clientY)
}

document.onmousedown = function(event){
    mouseDown = true;
    bufferMaterial.uniforms.smokeSource.value.z = 0.1;
}
document.onmouseup = function(event){
    mouseDown = false;
    bufferMaterial.uniforms.smokeSource.value.z = 0;
}