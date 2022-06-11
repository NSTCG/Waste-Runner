WL.registerComponent('filter-control', {

}, {
    init: function() {
        window.filterColor=this.object.getComponent('mesh').material.color[3];
    },
    start: function() {
      
    },
    update: function(dt) {
        this.object.getComponent('mesh').material.color=[0,0,0,window.filterColor];
    },
});
