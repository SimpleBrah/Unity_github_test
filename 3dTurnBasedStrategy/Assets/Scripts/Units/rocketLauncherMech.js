#pragma strict

public class rocketLauncherMech extends unit{

    public var hpSlider : GameObject;

    function Start () {

    }

    function Update () {
        if(hp<1){
            this.die();
        }

        for(pu in GameObject.Find("mapManager").GetComponent(mapManager).powerUpList){
            if(pu.transform.position==transform.position){
                if(pu.tag=="resource_power_up"){
                    GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].resources+=50;
                    Destroy(pu);
                    GameObject.Find("mapManager").GetComponent(mapManager).powerUpList.Remove(pu);
                }else if(pu.tag=="rocket_launcher_power_up"){
                    //has seed to build the upgraded hq
                }            
            }
        }
        hpSlider.GetComponent(Slider).value=hp;
    }

    public function attack(target : unit){
        if(this.inLineOfSight(target)){
            Debug.Log("in line of sight");
            if(transform.position.x==target.transform.position.x && Mathf.Abs(transform.position.z-target.transform.position.z)<4){
                target.takeDamage();
                tookAction=true;
            }else if(transform.position.z==target.transform.position.z && Mathf.Abs(transform.position.x-target.transform.position.x)<4){
                target.GetComponent(worker).takeDamage();
                tookAction=true;
            }
        }else{
            Debug.Log("not in line of sight");
        }
    }

    public function moveOrAttack(target : Vector3){
        var move : boolean = true;
        //move
        //transform.position+=direction;
        //if not on floor go back
        if(Vector3.Distance(transform.position,target)==1 && GameObject.Find("mapManager").GetComponent(mapManager).onFloor(target)==false){
            //transform.position-=direction;
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Cant move there";
            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
        }
        /*if(GameObject.Find("mapManager").GetComponent(mapManager).onFloor(transform.position)==false){
            transform.position-=direction;
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Cant move there";
            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
        }*/else{
            for(p in GameObject.Find("playerManager").GetComponent(playerManager).playerList){
                for(unit in p.unitList){
                    if(unit.ID==GameObject.Find("playerManager").GetComponent(playerManager).selectorID && unit.ownerID==GameObject.Find("playerManager").GetComponent(playerManager).selector.ownerID){
                        //for every player for every unit that is not this one
                    }
                        //check for collision
                    else if(unit.transform.position==transform.position){
                        move=false;
                        //move back
                        //transform.position-=direction;
                        //if enemy attack
                        if(p.ID!=ownerID){
                            move=false;
                            unit.takeDamage();
                        }
                    }
                }
            }
            for(w in GameObject.FindGameObjectsWithTag("wire_fence")){
                if(w.GetComponent(fence).inCollision(target)){
                    move=false;
                }
            }

            //if over ramp go again and down
            /*for(ramp in GameObject.Find("mapManager").GetComponent(mapManager).rampPosition){
                if(transform.position==ramp.transform.position+Vector3(0,1,0)){
                    transform.position+=direction;
                    transform.position+=Vector3(0,-1,0);
                }
                if(transform.position==ramp.transform.position){
                    transform.position+=direction;
                    transform.position+=Vector3(0,1,0);
                }
            }*/
            if(move){
                transform.position=target;
                tookAction=true;
            } 

        }

    }

}