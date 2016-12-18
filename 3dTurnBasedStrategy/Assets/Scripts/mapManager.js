#pragma strict

public class mapManager extends MonoBehaviour{

    public var resourcePowerUpPrefab : GameObject;
    public var rocketLauncherPowerUpPrefab : GameObject;
    //RAMP REWORK
    public var rampPosition = new GameObject[6];
    public var rampVector = new Vector3[6]; //not usable yet
    //RAMP REWORK
    public var startingPosition = new GameObject[2];
    public var powerUpList : List.<GameObject> = new List.<GameObject>();

    function Start () {
        //floorPosition=GameObject.FindGameObjectsWithTag("floor");
        rampPosition=GameObject.FindGameObjectsWithTag("ramp");
        //resourcePosition=GameObject.FindGameObjectsWithTag("resource");
        startingPosition=GameObject.FindGameObjectsWithTag("player_spawn");
    }

    function Update () {

    }

    public function onFloor(unit : Transform,direction : Vector3){
        var result = false;
        //check if target is on floor tile
        for(floor in GameObject.FindGameObjectsWithTag("floor")){
            if(floor.transform.position==(unit.position+Vector3(0,-1,0)+direction)){
                result = true;
            }
        }
        //check if target is on ramp tile
        for(ramp in rampPosition){
            if(ramp.transform.position==(unit.position+Vector3(0,-1,0)+direction)){
                result = true;
            }
        }

        return result;
    }

    public function spawnPowerUps(){
        //za svaki floor tile
        for(floor in GameObject.FindGameObjectsWithTag("floor")){
            //proveri da li je prazan
            var isEmpty : boolean = true;
            for(p in GameObject.Find("playerManager").GetComponent(playerManager).playerList){
                for(u in p.unitList){
                    if(u.transform.position==floor.transform.position+Vector3(0,1,0)){
                        isEmpty=false;
                    }
                }
            }
            for(pu in powerUpList){
                if(pu.transform.position==floor.transform.position+Vector3(0,1,0)){
                    isEmpty=false;
                }
            }
            var random : int = Random.Range(1,100);
            //Debug.Log(random+">98");
            if(isEmpty && (random>98)){
                if(Random.Range(1,10)>8){
                    powerUpList.Add(Instantiate(rocketLauncherPowerUpPrefab,floor.transform.position+Vector3(0,1,0),rocketLauncherPowerUpPrefab.transform.rotation));
                }else{
                    powerUpList.Add(Instantiate(resourcePowerUpPrefab,floor.transform.position+Vector3(0,1,0),resourcePowerUpPrefab.transform.rotation));
                } 
            }
        }
    }


}