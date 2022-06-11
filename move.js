
let PlayerSpeed=0;
WL.registerComponent('move-comp', {
   player: {type: WL.Type.Object},
   PlayerSpeed: {type: WL.Type.Float, default:1},
}, {
    init: function() {
      this.collider = this.object.getComponent('collision');
      this.objects = [];
      this.check = false;  // internal needs 
    
      this.gameend=false;
      this.timer=0;
      
      this.StarttimerFlag=0;
      this.timerFlag=0

      this.dead_animated=false;
    },
    start: function() {
    },

    
    update: function(dt) {

      if(this.StarttimerFlag==1){
        this.timer=this.timer+dt;
        //console.log(PlayerSpeed)
      }
      if(this.StarttimerFlag==0){
        this.timer=0
      }

      //console.log("game start "+ window.game_start +" , "+ " game end "+ window.game_end)
      
      if(this.object.transformWorld[6] < -18){

        //player reset code here 

        //this.object.translate([0, 0, 20]);
        //this.game_end=true;
        //window.game_end=true

        //window.game_start=false;
      };

      if(window.game_end){
        if(!this.dead_animated){
          this.object.translate([0, 0, 0.2]);
          this.dead_animated=true
        }
        
        this.object.setTranslationWorld([0,0.5,0]);
      }
      if(window.game_end==true){
        this.player.setTranslationWorld([-6.510,0.784,131.873]);
        window.game_end=false;
        this.StarttimerFlag=0;
        PlayerSpeed=0;
      }

    
      //Sphere Movement
      if(window.game_start==true){
        if(this.timer==0){
          this.StarttimerFlag=1;
          
        }

        //incremental speed 

        if(this.timer>2)PlayerSpeed=2;
        if(this.timer>6)PlayerSpeed=2;
        if(this.timer>10)PlayerSpeed=2;
        if(this.timer>22)PlayerSpeed=2;
        if(this.timer>35)PlayerSpeed=2;
        
        this.player.translate([0, 0, ((-2-PlayerSpeed)*dt)]);
        
      }

      //Collision Detection & Material Change
      let collidingComps = this.collider.queryOverlaps();
      for(let i = 0; i < collidingComps.length; ++i) {

        if(collidingComps[i].object.name=="waste"){
          console.log("waste detected")
          collidingComps[i].object.getComponent("mesh").active=false;
          if(window.filterColor>0){
            window.filterColor=window.filterColor-0.007;
          }
        }
         

        if(!this.check) {
          //when the object is colliding 
          
          if(collidingComps[i].object.name!="waste"){
            window.game_end=true;
            window.game_start=false;
  
            this.objects.push(collidingComps[i]);
            this.check = true;

          }
         
        }
      }
      if(collidingComps.length == 0) {
        this.check = false;
        for (var i = 0; i < this.objects.length; i++) {
          //when not colliding
        }
        this.objects = [];
      }
    },
});
