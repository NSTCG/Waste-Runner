  //Allows switching all other components on an object when the user is not entering from phone and when the user enters VR session
  WL.registerComponent(
    "active_switch",
    {
      /** Whether child object's components should be affected */
      affectChildren: { type: WL.Type.Bool, default: true },
    },
    {
      init: function(){
        
      },
      update : function(){
        
        this.components = [];
        this.getComponents(this.object);
        if(window.game_start==true){
          this._deactivate();
        }
        if(this.object.name="endcard"){
          if(window.game_end==true){
            this._activate();
          }
        }
      },
  
      getComponents: function (obj) {
        const comps = obj.getComponents().filter((c) => c.type != "active_switch");
        this.components = this.components.concat(comps);
  
        if (this.affectChildren) {
          let children = obj.children;
          for (let i = 0; i < children.length; ++i) {
            this.getComponents(children[i]);
          }
        }
      },
  
      setComponentsActive: function (active) {
        const comps = this.components;
        for (let i = 0; i < comps.length; ++i) {
            comps[i].active = active;
        }
      },
  
      _activate: function () {
        this.setComponentsActive(true);
      },
  
      _deactivate: function () {
        this.setComponentsActive(false);
      },
    }
  );
  