#pragma strict

public class fence extends MonoBehaviour{
    
    function Start () {

    }

    function Update () {

    }

    public function inCollision(position : Vector3){
        var position1 : Vector3;
        var position2 : Vector3;
        if(transform.eulerAngles.y==0){
            position1=transform.position+Vector3(1,0,0);
            position2=transform.position+Vector3(-1,0,0);
        }else if(transform.eulerAngles.y==90){
            position1=transform.position+Vector3(0,0,1);
            position2=transform.position+Vector3(0,0,-1);
        }
        if(position==transform.position){
            return true;
        }else if(position==position1){
            return true;
        }else if(position==position2){
            return true;
        }else{
            return false;
        }
    }

}