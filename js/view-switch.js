WL.registerComponent('view-switch', {
    PlayerSUbRoot: {type : WL.Type.Object},
    body : { type : WL.Type.Object},
    sword: { type :WL.Type.Object},
    face:{type : WL.Type.Object } ,
    eye : { type: WL.Type.Object },


}, {
    init: function() {
        
    },
    start: function() {
        this.firstpersonplayer=true
        this.PlayerSUbRoot.translate([0,-1.26,-5.205]);

        
        this.body.getComponent("mesh").active=false;
        this.sword.getComponent("mesh").active=false;
        this.face.getComponent("mesh").active = false;
        this.eye.getComponent("mesh").active = false;
    },
    update: function(dt) {
        if(this.firstpersonplayer){
            
        }
    },
});
