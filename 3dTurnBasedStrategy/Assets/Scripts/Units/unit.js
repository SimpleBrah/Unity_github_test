#pragma strict

public class unit extends MonoBehaviour{
    public var ownerID : int; //SAME AS OWNER PLAYERS ID
    public var ID : int;
    public var hp : int;
    //public var buildingMode : boolean;
    public var tookAction : boolean;
    public var cooldown : int;
    public var inputMode : String;

    function start(){

    }

    function update(){
        
    }

    virtual function build(target : Vector3){

    }

    virtual function attack(target : unit){

    }

    virtual function moveOrAttack(target : Vector3){

    }
    
    function die(){
        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList.Remove(this);
        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].renewIDs();
        Destroy(this.gameObject);
    }
    
    function takeDamage(){
        var dmg = Random.Range(20,50); 
        this.hp-=dmg;
        GameObject.Find("helpMessage").GetComponent.<Text>().text="Hit for "+dmg;
        GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
    }
    function inLineOfSight(u : unit){
        //var ray = new Ray (transform.position, u.transform.position);
        //Debug.Log("ray: this "+transform.position+"unit "+u.transform.position);
        //Create a RaycastHit to store target hit
        var hitInfo : RaycastHit;
        if(Physics.Linecast(transform.position,u.transform.position,hitInfo)){
            Debug.Log("ray did hit");
            if(hitInfo.transform.root.gameObject.transform.position==u.transform.position){
                Debug.Log("hitInfo "+hitInfo.transform.root.transform.position+" unit "+u.transform.position);
                return true;
            }else{
                Debug.Log("hitInfo "+hitInfo.transform.root.transform.position+" unit "+u.transform.position);
                return false;
            }
        }else{
            Debug.Log("ray didnt hit");
            return false;
        }
    }
}
