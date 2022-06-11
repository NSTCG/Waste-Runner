WL.registerComponent(
    "player_animator",
    {
      walkAnimation: { type: WL.Type.Animation },
      runAnimation: { type: WL.Type.Animation },
      getHitAnimation: { type: WL.Type.Animation },
      idleAnimation: { type: WL.Type.Animation },

      bodyMeshObject: { type: WL.Type.Object },
    },
    {
      start: function () {
        this.animationComponents = {
          "walk": this.object.getComponent('animation', 3),
          "run": this.object.getComponent('animation', 2),
          "getHit": this.object.getComponent('animation', 1),
          "idle": this.object.getComponent('animation', 0),
        }
  
        
  
        if (this.walkAnimation) {
          let mesh = this.bodyMeshObject.getComponent("mesh");
  
          this.walkAnimation = this.walkAnimation.retarget(mesh.skin);
          this.animationComponents["walk"].animation = this.walkAnimation;
          

          this.runAnimation = this.runAnimation.retarget(mesh.skin);
          this.animationComponents["run"].animation = this.runAnimation;
          this.animationComponents["run"].animation.playCount = 0;
          
          //this.animationComponents["run"].play();


          this.getHitAnimation = this.getHitAnimation.retarget(mesh.skin);
          this.animationComponents["getHit"].animation = this.getHitAnimation;
          this.animationComponents["getHit"].animation.playCount = 1;


          this.idleAnimation = this.idleAnimation.retarget(mesh.skin);
          this.animationComponents["idle"].animation = this.idleAnimation;
          this.animationComponents["idle"].animation.playCount = 0;
          


          this.lastPlayedAnimation = "idle";
        }
      },

      update: function(){
        if(window.game_start!=true && window.idleActivateFlag!=true){
          this.playAnimation("idle")
          window.runActivateFlag=false;
          window.idleActivateFlag=true;

        }
        if(window.game_start==true && window.runActivateFlag!=true){
          this.playAnimation("run")
          window.runActivateFlag=true;
          window.idleActivateFlag=false;
        }
       
      },


      playAnimation: function(animationName) {
        if (this.lastPlayedAnimation == animationName) return;
            if (this.lastPlayedAnimation) {
                this.animationComponents[this.lastPlayedAnimation].stop();
            }
        this.lastPlayedAnimation = animationName;
        this.animationComponents[animationName].play();
      }
    }
  );