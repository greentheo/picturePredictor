// a set of js functions that run the picture prediction app
dataTablesBB = Backbone.Model.extend({
  defaults:{
    truckLoadDataTable: null,
    viableAltTable: null
  },
  initialize: function(){
    this.on('change:truckLoadDataTable', function(model){
      model.get('truckLoadDataTable').rows().draw();
    })
    
  },
  setTruckLoadTable: function(table){
    this.set({truckLoadDataTable: table})
  },
  setViableAltTable: function(table){
    this.set({viableAltTable: table})
  }

});


var Tables;
//var editor;

$(document).ready(function() {
  Tables = new dataTablesBB();
  
  //and do the rest of the app
  
  $('.firstpicture').click(function(event){
    console.log('p1Click');
  });
  $('.secondpicture').click(function(event){
    console.log('p2Click');
  })
  $('.sidepicture').click( function(event){
    console.log('sidePClick');
  })
});