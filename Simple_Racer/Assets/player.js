#pragma strict

var movementSpeed : float;
var turningSpeed : float;

function Start () {
    movementSpeed=1;
    turningSpeed=5;
}

function Update () {
    if(Input.GetKey(KeyCode.D)){
        transform.Rotate(0, Time.deltaTime*turningSpeed, 0);
    }
    if(Input.GetKey(KeyCode.A)){
        transform.Rotate(0, -Time.deltaTime*turningSpeed, 0);
    }
    if(Input.GetKey(KeyCode.W)){
        var currentSpeed=transform.forward * Time.deltaTime * movementSpeed;
        transform.position += currentSpeed;
    }
    if(Input.GetKey(KeyCode.S)){
        var currentSpeed=transform.forward * Time.deltaTime * movementSpeed;
        transform.position -= currentSpeed;
    }
}