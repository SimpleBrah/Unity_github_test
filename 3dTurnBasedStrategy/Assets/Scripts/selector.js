#pragma strict

public class selector extends MonoBehaviour{
	
    public var range = new Transform[4];
    public var playerManagerScript : playerManager;

    function Start () {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
    }

    function Update () {
        range[0]=transform;
        range[0].position+=Vector3(1,-1,0);
        range[1]=transform;
        range[1].position+=Vector3(-1,-1,0);
        range[2]=transform;
        range[2].position+=Vector3(0,-1,-1);
        range[3]=transform;
        range[3].position+=Vector3(0,-1,1);
        transform.position=playerManagerScript.selector.transform.position;
    }

}