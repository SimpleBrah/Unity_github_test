#pragma strict

public class rocketLauncherMech extends unit{

    function Start () {

    }

    function Update () {

    }

    public function attack(target : GameObject){
        if(transform.position.x==target.transform.position.x && Mathf.Abs(transform.position.z-target.transform.position.z)<4){
            if(target.GetComponent(worker)){
                target.GetComponent(worker).takeDamage();
                tookAction=true;
            }else if(target.GetComponent(hq)){
                target.GetComponent(hq).takeDamage();
                tookAction=true;
            }else if(target.GetComponent(rocketLauncherMech)){
                target.GetComponent(rocketLauncherMech).takeDamage();
                tookAction=true;
            }
        }else if(transform.position.z==target.transform.position.z && Mathf.Abs(transform.position.x-target.transform.position.x)<4){
            if(target.GetComponent(worker)){
                target.GetComponent(worker).takeDamage();
                tookAction=true;
            }else if(target.GetComponent(hq)){
                target.GetComponent(hq).takeDamage();
                tookAction=true;
            }else if(target.GetComponent(rocketLauncherMech)){
                target.GetComponent(rocketLauncherMech).takeDamage();
                tookAction=true;
            }
        }
    }

    public function moveOrAttack(direction : Vector3){
        //move
        transform.position+=direction;
        //if not on floor go back
        if(GameObject.Find("mapManager").GetComponent(mapManager).onFloor(transform,Vector3(0,0,0))==false){
            transform.position-=direction;
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Cant move there";
            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
        }else{
            for(p in GameObject.Find("playerManager").GetComponent(playerManager).playerList){
                for(unit in p.unitList){
                    if(unit.ID==GameObject.Find("playerManager").GetComponent(playerManager).selectorID && unit.ownerID==GameObject.Find("playerManager").GetComponent(playerManager).selector.ownerID){
                        //for every player for every unit that is not this one
                    }
                        //check for collision
                    else if(unit.transform.position==transform.position){
                        //move back
                        transform.position-=direction;
                        //if enemy attack
                        if(p.ID!=ownerID){
                            unit.takeDamage();
                        }
                    }
                }
            }

            //if over ramp go again and down
            for(ramp in GameObject.Find("mapManager").GetComponent(mapManager).rampPosition){
                if(transform.position==ramp.transform.position+Vector3(0,1,0)){
                    transform.position+=direction;
                    transform.position+=Vector3(0,-1,0);
                }
                if(transform.position==ramp.transform.position){
                    transform.position+=direction;
                    transform.position+=Vector3(0,1,0);
                }
            }
  
            tookAction=true;

        }

    }

}