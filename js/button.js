WL.registerComponent('button', {
    buttonMeshObject: {type: WL.Type.Object},
    hoverMaterial: {type: WL.Type.Material},


    PlayerSUbRoot: {type : WL.Type.Object},
    body : { type : WL.Type.Object},
    sword: { type :WL.Type.Object},
    face:{type : WL.Type.Object } ,
    eye : { type: WL.Type.Object },


}, {
    start: function() {
        this.FirstPersonflag=false;
        
        this.mesh = this.buttonMeshObject.getComponent('mesh');
        //this.defaultMaterial = this.mesh.material;

        this.target = this.object.getComponent('cursor-target');
        this.target.addHoverFunction(this.onHover.bind(this));
        this.target.addUnHoverFunction(this.onUnHover.bind(this));
        this.target.addDownFunction(this.onDown.bind(this));
        this.target.addUpFunction(this.onUp.bind(this));

        this.soundClick = this.object.addComponent('howler-audio-source', {src: 'sfx/click.wav', spatial: true});
        this.soundUnClick = this.object.addComponent('howler-audio-source', {src: 'sfx/unclick.wav', spatial: true});


        //this.object.addComponent('howler-audio-source', {src: 'sfx/bird.mp3', spatial: true,autoplay: true});
    },

    onHover: function(_, cursor) {
        //this.mesh.material = this.hoverMaterial;
        if(cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    },

    onDown: function(_, cursor) {
        

        this.soundClick.play();
        //this.buttonMeshObject.translate([0.0, -0.1, 0.0]);
        this.hapticFeedback(cursor.object, 1.0, 20);

        if(this.object.name=="Start"){
                //this.soundUnClick = this.object.addComponent('howler-audio-source', {src: 'sfx/millitant.mp3', spatial: true, autoplay:true});
            if(window.game_start!=true){
                window.game_start=true;
                window.game_end=false;
            }
            else{
            //   this.object.setTranslationWorld([0,0.5,0]);
            // window.game_end=false;
            }
        }

        if(this.object.name=="ViewToggle"){

            if(this.FirstPersonflag==false)this.FirstPersonflag=true;
            else if(this.FirstPersonflag==true)this.FirstPersonflag=false;

            if(this.FirstPersonflag==false){
                this.PlayerSUbRoot.translate([0,+1.26,+5.205]);
                this.body.getComponent("mesh").active=true;
                this.sword.getComponent("mesh").active=true;
                this.face.getComponent("mesh").active = true;
                this.eye.getComponent("mesh").active = true;

                
            }
            else{
                this.PlayerSUbRoot.translate([0,-1.26,-5.205]);
                this.body.getComponent("mesh").active=false;
                this.sword.getComponent("mesh").active=false;
                this.face.getComponent("mesh").active = false;
                this.eye.getComponent("mesh").active = false;
            }

           
            
        }

        
        
    },

    onUp: function(_, cursor) {
        this.soundUnClick.play();
        //this.buttonMeshObject.translate([0.0, 0.1, 0.0]);
        this.hapticFeedback(cursor.object, 0.7, 20);
    },

    onUnHover: function(_, cursor) {
        //this.mesh.material = this.defaultMaterial;
        if(cursor.type == 'finger-cursor') {
            this.onUp(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.3, 50);
    },

    hapticFeedback: function(object, strenght, duration) {
        const input = object.getComponent('input');
        if(input && input.xrInputSource) {
            const gamepad = input.xrInputSource.gamepad;
            if(gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strenght, duration);
        }
    },
});
