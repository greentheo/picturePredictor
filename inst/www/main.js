// a set of js functions that run the picture prediction app
pictures = Backbone.Model.extend({
  defaults:{
    pictureName: null
    
  },
  initialize: function(){
    this.on('change:pictureName', function(model){
      //TODO functions that save the last picture that was clicked on triggering
    //the changes that move the last picture into the main picture frame
    //and two new suggestions below it...
    })
  },
  pictureClick: function(pictureName){
    this.set({pictureClicked: pictureName});
    this.
  },
 
});


var pictureBB;
//var editor;

$(document).ready(function() {
  pictureBB = new pictures();
  
  //and do the rest of the app
  
  $('.firstpicture').click(function(event){
    console.log('p1Click');
  });
  $('.secondpicture').click(function(event){
    //TODO make an OPENCPU call here that basically logs the event 
    //Then trigger the function in the backbone model that the p2 was the last one clicked
    
    pictureBB.pictureClick( 'the pictures name')
    console.log('p2Click');
  })
  $('.sidepicture').click( function(event){
    console.log('sidePClick');
  })
});