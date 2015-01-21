// a set of js functions that run the picture prediction app
pictures = Backbone.Model.extend({
  defaults:{
    pictureName: "NA",
    pictureLocation: "NA",
    user: null,
    pictureTopic: "puppies"
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
    
    
    var key="pp:"+this.get('user').UID+":"+Date.now();
    var userEvent = this.get('user');
    userEvent.pictureName = pictureName;
    userEvent.pictureLocation = pictureLocation;
    userEvent.prevPictureName = this.get('pictureClicked');
    userEvent.prevPictureLocation = this.get('pictureLocation');
    userEvent.pictureTopic = this.get('pictureTopic')
    userEvent.time = Date.now();
    console.log("http://192.168.15.102:7379/SET/"+key+"/"+saferStringify(userEvent));
    //push info to DB
    $.ajax({
      url: "http://192.168.15.102:7379/SET/"+key+"/"+saferStringify(userEvent),
      complete: function(data){console.log(data)}
    });
    this.set({pictureClicked: pictureName});
    this.set({pictureLocation: pictureLocation});
  },
  setUser: function(user){
    this.set({user: user});
  }
 
});


var pictureBB;
var apiKey="904cf61ca4fc611d5d618b8b4fcdf732";
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
  results = $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apiKey+"&text="+
        pictureBB.get('pictureTopic')+"&format=json&jsoncallback=?", 
        function(data){
          //append the first item to the main picture, the second to the first of the two options... and so on 
          item = data.photos.photo[0];
          var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
       
          //get photo info
          info = $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+
                    "&photo_id="+item.id+
                    "&format=json&jsoncallback=?", 
                  function(data){
                    //get the largest size picture
                    pic=data.sizes.size[data.sizes.size.length-1];
                    
                    //scale height and width to the available size constrained by proportion
                    //TODO
                    
                    var imgCont = '<img src="'+pic.source+'" height="'+pic.height+'" width="'+pic.width+'">';
                      //append the 'imgCont' variable to the document
                       $(imgCont).appendTo($('#mainPhoto'));
                      return {};
                    });
          
          console.log(data)
        }    
  );
  
  
  
  //and do the rest of the app
  
  $('.firstpicture').click(function(event){
    console.log('p1Click');
    pictureBB.pictureClick(this.attributes.src.value, 'p1');
  });
  $('.secondpicture').click(function(event){
    //TODO make an OPENCPU call here that basically logs the event 
    //Then trigger the function in the backbone model that the p2 was the last one clicked
    
    pictureBB.pictureClick( this.attributes.src.value, 'p2')
    console.log('p2Click');
  })
  $('.sidepicture').click( function(event){
    pictureBB.pictureClick(this.attributes.src.value, 'sidePicture')
    console.log('sidePClick');
  })
});

saferStringify = function(obj, replacer, space) {
    return JSON.stringify(obj, replacer, space).replace(new RegExp('/', 'g'), '||')
    // Escape u2028 and u2029
    // http://timelessrepo.com/json-isnt-a-javascript-subset
    // https://github.com/mapbox/tilestream-pro/issues/1638
    .replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
};