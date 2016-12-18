#pragma strict

public class selector extends MonoBehaviour{
	
    public var range = new Transform[4];
    public var playerManagerScript : playerManager;
    public var selectedUnit : unit;

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

    public function setSelectedUnit(target : GameObject){
        if(target.GetComponent(worker) && target.GetComponent(worker).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
            GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[target.GetComponent(worker).ownerID-1].unitList[target.GetComponent(worker).ID];
            GameObject.Find("playerManager").GetComponent(playerManager).selectorID=target.GetComponent(worker).ID;
        }

        if(target.GetComponent(hq) && target.GetComponent(hq).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
            GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[target.GetComponent(hq).ownerID-1].unitList[target.GetComponent(hq).ID];
            GameObject.Find("playerManager").GetComponent(playerManager).selectorID=target.GetComponent(hq).ID;
        }
        if(target.GetComponent(rocketLauncherMech) && target.GetComponent(rocketLauncherMech).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
            GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[target.GetComponent(rocketLauncherMech).ownerID-1].unitList[target.GetComponent(rocketLauncherMech).ID];
            GameObject.Find("playerManager").GetComponent(playerManager).selectorID=target.GetComponent(rocketLauncherMech).ID;
        }
    }

}