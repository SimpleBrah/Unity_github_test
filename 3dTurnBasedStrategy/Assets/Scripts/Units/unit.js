#pragma strict

public class unit extends MonoBehaviour{
    public var ownerID : int; //SAME AS OWNER PLAYERS ID
    public var ID : int;
    public var hp : int;
    public var buildingMode : boolean;
    public var tookAction : boolean;
    public var mode : String;
    public var cooldown : int;

    function start(){

    }

    function update(){
        
    }

    virtual function build(direction : Vector3){

    }

    virtual function moveOrAttack(direction : Vector3){

    }
    
    function die(){
        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList.Remove(this);
        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].renewIDs();
        Destroy(this.gameObject);
    }
}
