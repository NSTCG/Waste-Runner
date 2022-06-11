
WL.registerComponent('set_boundary', {
  left_bound: {type: WL.Type.Float, default: 7.0},
  right_bound: {type: WL.Type.Float, default: 7.0},
  back_bound: {type: WL.Type.Float, default: 7.0},
  front_bound: {type: WL.Type.Float, default: 7.0},
  restrictY: { type: WL.Type.Bool, default: true },
  height: {type: WL.Type.Float, default: 1},
}, {
 
  update: function() {

      let position = glMatrix.vec3.create();
      this.object.getTranslationWorld(position);
      
      //resetting the position of the player whenever it crosses the threshold

      if(position[2]>this.back_bound)position[2]=this.back_bound;this.object.setTranslationWorld(position);
      if(position[2]<-1*this.front_bound)position[2]=-1*this.front_bound;this.object.setTranslationWorld(position);
      if(position[0]>this.right_bound)position[0]=this.right_bound;this.object.setTranslationWorld(position);
      if(position[0]<-1*this.left_bound)position[0]=-1*this.left_bound;this.object.setTranslationWorld(position);

      //optional y restict option to clamp player in y axis ( ie no upward or downward movement)
      
      if(this.restrictY==true){  
          if (position[1]>this.height || position[1]<this.height)position[1]=this.height;this.object.setTranslationWorld(position);
      }
  },

});


//import {vec3} from 'gl-matrix'; (sometimes this won't work on manual js import, in that case use the following)
const vec3 = glMatrix.vec3;

//Manual movement with W/A/S/D keys and virtual joystick.
WL.registerComponent(
    "wasd-manual",
    {
      /** Movement speed in m/s. */
      normal_speed: { type: WL.Type.Float, default: 0.1 },
      /**Accelerated speed in m/s. */
      accelerated_speed: { type: WL.Type.Float, default: 0.2 },
      /** Object of which the orientation is used to determine forward direction */
      headObject: { type: WL.Type.Object },
      /** Whether or not to restrict movement on the Y axis */
      restrictY: { type: WL.Type.Bool, default: false },
    },
    {
      init: function () {
        window.IsMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        window.j1x=0;
        window.j1y=0;
        this.speed = this.normal_speed;
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;
  
        this.up_main = false;
        this.right_main = false;
        this.down_main = false;
        this.left_main = false;

        window.game_start=false;
  
        window.addEventListener("keydown", this.press.bind(this));
        window.addEventListener("keyup", this.release.bind(this));
  
      },
  
      start: function () {
        this.headObject = this.headObject || this.object;
      },
  
      update: function (dt) {

      if(PlayerSpeed>0){
        //this.speed*=(PlayerSpeed/4)
      }
      if(window.game_end==true){
        this.speed=this.normal_speed;
      }

      //this.speed*=dt;

      if (WL.xrSession != null ) {
          //console.log(WL.xrSession);
          this.joysctickUpdate();
          
      }

        //this.HandControl();
        this.Main_controller();
        let direction = [0, 0, 0];
  
        if (this.up_main) direction[2] -= 1.0;
        if (this.down_main) direction[2] += 1.0;
        if (this.left_main) direction[0] -= 1.0;
        if (this.right_main) direction[0] += 1.0;
  
        vec3.normalize(direction, direction);
        direction[0] *= this.speed;
        direction[2] *= this.speed;
        vec3.transformQuat(direction, direction, this.headObject.transformWorld);
        if (this.restrictY) direction[1] = 0;
        if(window.game_start!=false)this.object.translate(direction);
      },
  
      Main_controller: function(){
      if(window.j2x!=null)this.object.rotateAxisAngleDegObject([0, 1, 0], -2 * window.j2x);
      //if(window.j2y!=null)this.object.rotateAxisAngleDegObject([1, 0, 0], -0.65 * window.j2y); // vertical rotation ( needs to be fixed)

      this.up_main = window.j1y < -0.1  || this.up ? true : false;   //add || window.j1y < -0.1 if  you wanna use left joystick for locomotion too 
      this.down_main = window.j1y > 0.1 || this.down? true : false;  //add || window.j1y < -0.1 if you wanna use left joystick for locomotion too 
      this.right_main = window.j1x > 0.1 || this.right ? true : false;  
      this.left_main = window.j1x < -0.1 ||this.left ? true : false;
      },
  
      press: function (e) {
        if (
          e.keyCode === 38 /* up */ ||
          e.keyCode === 87 /* w */ ||
          e.keyCode === 90 /* z */ 
        ) {
          this.up = true;
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ) {
          this.right = true;
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ) {
          this.down = true;
        } else if (
          e.keyCode === 37 /* left */ ||
          e.keyCode === 65 /* a */ ||
          e.keyCode === 81 /* q */
        ) {
          this.left = true;
        } else if (e.keyCode === 16 /* increment_speed */) {
          this.speed = this.accelerated_speed;
        }
        
      },
  
      release: function (e) {
        if (
          e.keyCode === 38 /* up */ ||
          e.keyCode === 87 /* w */ ||
          e.keyCode === 90 /* z */
        ) {
          this.up = false;
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
          this.right = false;
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
          this.down = false;
        } else if (
          e.keyCode === 37 /* left */ ||
          e.keyCode === 65 /* a */ ||
          e.keyCode === 81 /* q */
        ) {
          this.left = false;
        } else if (e.keyCode === 16 /* reset_speed */) {
          this.speed = this.normal_speed;
        }
      },


      joysctickUpdate: function (e){
        this.joyH=WL.xrSession.inputSources[0].gamepad.axes[2];
        this.joyV=WL.xrSession.inputSources[0].gamepad.axes[3];

        //console.log(this.joyV);
        if(this.joyH>.7)this.right=true;
        else{this.right=false}
        if(this.joyH<-.7)this.left=true;
        else{this.left=false}

        if(this.joyV>.7)this.down=true;
        else{this.down=false}
        if(this.joyV<-.7)this.up=true;
        else{this.up=false}
      },
      
      HandControl :function(e){

        function equals(a,b){
          let equals = true;
          if(a.length == b.length){
           for(let i=0;i<a.length;i++){
             if(a[i] != b[i]){
          equals= false;
          break;
          }
          }
          }else{
          equals = false;
          }
          return equals;
          }

        this.left= equals([0,1,1,1,1],window.left) ? true : false;
        this.right= equals([0,1,1,1,1],window.right) ? true : false;
        


      }
      
    }
  );

  
//turns on 360 degree device orientation for mobile ( based on global variable defined in index.html)
WL.registerComponent(
  "360-switch",
  {},
  {
    update: function () {
      if (window.view360 == true) {
        if (window.IsMobile == true) {
          this.object.getComponent("device-orientation-look").active = true;
        }
        if (window.IsMobile == false) {
          window.alert(
            "device orientation not supported (note that this feature is intended for mobile phones)"
          );
        }
      } else {
        this.object.getComponent("device-orientation-look").active = false;
      }
    },
  }
);



function equals(a,b){
  let equals = true;
  if(a.length == b.length){
   for(let i=0;i<a.length;i++){
     if(a[i] != b[i]){
  equals= false;
  break;
  }
  }
  }else{
  equals = false;
  }
  return equals;
  }


WL.registerComponent('hand_collision', {
    feed_text:{type: WL.Type.Object},
    emoji_text:{type: WL.Type.Object},
 }, {
     init: function() {
       this.collider = this.object.getComponent('collision');
       this.objects = [];
       this.check = false;
       this.count=0;
       
       this.colliding_list_name = " ";
       this.colliding_object_name=" ";
       
       this.fingers=[0,0,0,0,0];                 // thumb , index , middle ,ring , pinky 
       window.left=[0,0,0,0,0]; 
       window.right=[0,0,0,0,0]; 
       this.list=""
       this.handedness=this.object.name;
       
       
     },

     start: function() {
     },

     update: function() {
      for(let i=0;i<this.fingers.length;i++){
        this.list += this.fingers[i]
      }
      
       let collidingComps = this.collider.queryOverlaps(); 
       this.count=0;
       this.colliding_list_name=" ";

      for(let i = 0; i < collidingComps.length; ++i) {
         this.count++;
         this.objects.push(collidingComps[i]);

         this.colliding_object_name =collidingComps[i].object.name;

         if(!this.colliding_list_name.includes(this.colliding_object_name) ){
           this.colliding_list_name += this.colliding_object_name;
         }
       }

       this.fingers_update();
       this.emoji();
       this.feed_text.getComponent("text").text=this.handedness ;

       if(this.handedness=="left"){
        for(let i=0;i<window.left.length;i++){
          this.templist += window.left[i]
          this.emoji_text.getComponent("text").text=this.templist;
        }
       }

       if(this.handedness=="right"){
        for(let i=0;i<window.right.length;i++){
          this.templist += window.right[i]
          this.emoji_text.getComponent("text").text=this.templist;
        }
       }


      
       this.list=" "
       
       if(this.handedness=="left"){
         window.left=this.fingers;
         //console.log("left : " + window.left);
       }
       if(this.handedness=="right"){
         window.right=this.fingers;
         //console.log("right : " + window.right);
       }


     },


     fingers_update : function(){
        
        if(this.colliding_list_name.includes("thumb")){
          this.fingers[0]=1;
        }
        else{
          this.fingers[0]=0;
        }


        if(this.colliding_list_name.includes("index")){
          this.fingers[1]=1;
        }
        else{
          this.fingers[1]=0;
        }


        if(this.colliding_list_name.includes("middle")){
          this.fingers[2]=1;
        }
        else{
          this.fingers[2]=0;
        }


        if(this.colliding_list_name.includes("ring")){
          this.fingers[3]=1;
        }
        else{
          this.fingers[3]=0;
        }


        if(this.colliding_list_name.includes("pinky")){
          this.fingers[4]=1;
        }
        else{
          this.fingers[4]=0;
        }


     },

// 


     emoji : function(){

      if(  equals([1,1,1,1,1],this.fingers)  ){
        window.player_shape="Fist bump";
      }  

      if(  equals([0,0,0,0,0],this.fingers)  ){
        window.player_shape="Hi";
      } 

      if(  equals([1,0,0,1,1],this.fingers)  ){
        window.player_shape=" victory ! ";
      } 

      if(  equals([0,0,1,1,0],this.fingers)  ){
        window.player_shape="U R SPIDEY!"
      } 

      if(  equals([1,0,1,1,0],this.fingers)  ){
        window.player_shape="Horns"
      } 
      
      if(  equals([0,1,1,1,1],this.fingers)  ){
        window.player_shape="Like ";
      } 
      if(  equals([1,0,1,1,1],this.fingers)  ){
        window.player_shape="Index pointing Up";
      } 

      if(  equals([1,1,1,0,1],this.fingers)  ){
        window.player_shape="Ring finger";
      } 

      if(  equals([1,1,1,1,0],this.fingers)  ){
        window.player_shape="Pinkey finger ";
      } 


      if(  equals([0,0,1,1,1],this.fingers)  ){
        window.player_shape="Finger Pointing ";
      } 

      if(  equals([0,1,1,1,0],this.fingers)  ){
        window.player_shape="Call";
      } 

      if(  equals([1,1,0,1,1],this.fingers)  ){
        window.player_shape="Middle finger";
      } 

      if(  equals([1,1,0,0,0],this.fingers)  ){
        window.player_shape="Superb! ";
      } 
      if(  equals([0,0,0,1,1],this.fingers)  ){
        window.player_shape="Gun";
      } 

     },

     
     

 });
