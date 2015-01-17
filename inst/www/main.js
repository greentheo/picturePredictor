// a set of js functions that run the picture prediction app
pictures = Backbone.Model.extend({
  defaults:{
    pictureName: null,
    pictureLocation: null,
    user: null
  },
  initialize: function(){
    this.on('change:pictureName', function(model){
      //TODO functions that save the last picture that was clicked on triggering
    //the changes that move the last picture into the main picture frame
    //and two new suggestions below it...
    
    //log the data
    console.log(model.get('user'));
    console.log(model.get('pictureName'));
    console.log(model.get('pictureLocation'));
    
    //change the pictures
    })
  },
  pictureClick: function(pictureName, pictureLocation){
    this.set({pictureClicked: pictureName});
    this.set({pictureLocation: pictureLocation});
  },
  setUser: function(user){
    this.set({user: user});
  }
 
});


var pictureBB;
//var editor;

$(document).ready(function() {
  
  pictureBB = new pictures();
  
  //create a new unique identifier cookie if no cookie exists yet 
  if($.isEmptyObject($.cookie())){
    rUID = new Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16)
    $.cookie('UID', rUID, {expires: 365});
    
    //set some geovariables
    $.cookie('lat', geoplugin_latitude(), {expires: 365});
    $.cookie('long', geoplugin_longitude(), {expires: 365});
    $.cookie('city', geoplugin_city(), {expires: 365});
    $.cookie('region', geoplugin_region(), {expires: 365});
    $.cookie('country', geoplugin_countryCode(), {expires: 365});
    pictureBB.setUser($.cookie());
  }else{
    pictureBB.setUser($.cookie());
  }
  
  //random starting pictures from flickr
  pAvailable = 
  
  
  //and do the rest of the app
  
  $('.firstpicture').click(function(event){
    console.log('p1Click');
    pictureBB.pictureClick('pictureName', 'p1')
  });
  $('.secondpicture').click(function(event){
    //TODO make an OPENCPU call here that basically logs the event 
    //Then trigger the function in the backbone model that the p2 was the last one clicked
    
    pictureBB.pictureClick( 'the pictures name', 'p2')
    console.log('p2Click');
  })
  $('.sidepicture').click( function(event){
    pictureBB.pictureClick('picturename', 'p3')
    console.log('sidePClick');
  })
});