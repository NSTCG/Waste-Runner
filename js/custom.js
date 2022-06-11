WL.registerComponent('sfx', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        this.gameplayflag=0;
        this.introflag=0;
    },
    start: function() {
        this.intro = this.object.addComponent('howler-audio-source', {src: 'sfx/bird.mp3', spatial: true,autoplay: false , loop:true});
        this.gameplay = this.object.addComponent('howler-audio-source', {src: 'sfx/millitant.mp3', spatial: true,autoplay: false ,loop:true});
        this.intro.volume=10;
        this.gameplay.volume=10;
        console.log("-------------------Ignore the Trade logs , It doesnt do any harm --------------------------------")
       
       
    },
    update: function(dt) {
        
        if(window.game_start!=true){
            this.introPlay();
        }
        else{
            this.gameplayPlay();
        }
       
    },


    introPlay : function(){
        if(window.game_start!=true){
            if(this.introflag!=1){
                this.intro.play();
                this.introflag=1;
            }
        }
    },

    gameplayPlay :function(){
        if(window.game_start==true){
            //
            if(this.gameplayflag!=1){
                this.intro.stop();
                this.gameplay.play();
                this.gameplayflag=1;
                
            }
        
        
        
    }
    }

});
