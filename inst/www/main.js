// a set of js functions that run the picture prediction app
pictures = Backbone.Model.extend({
  defaults:{
    prevPictureID: "NA",
    prevPictureSec: "NA",
    pictureID: "NA",
    pictureSec: "NA",
    pictureName: "NA",
    pictureLocation: "NA",
    picNum: "NA",
    user: "NA",
    pictureTopic: "puppies",
    pics: null
  },
  initialize: function(){
    this.on('change:pictureName', function(model){
      this.pictureClick();
    
    });
    this.on('change:pictureTopic', function(model){
      getPics();
    });
    this.on('change:pics', function(model){
      setPics(0);
    });
  },
  pictureClick: function(){
    
    
    var key="pp:"+this.get('user').UID+":"+Date.now();
    var userEvent = this.get('user');
    userEvent.pictureName = this.get('pictureName');
    userEvent.pictureLocation = this.get('pictureLocation');
    userEvent.pictureTopic = this.get('pictureTopic');
    userEvent.prevPictureID = this.get('prevPictureID');
    userEvent.prevPictureSec = this.get('prevPictureSec');
    userEvent.pictureID=this.get('pictureID');
    userEvent.pictureSec = this.get('pictureSec');
    userEvent.time = Date.now();
    //console.log("http://192.168.15.102:7379/SET/"+key+"/"+saferStringify(userEvent));
    //push info to DB
    ocpu.call('storeInDB', {key: key, value: saferStringify(userEvent)}, function(session){
      console.log(session);
    });
    
    setPics(this.get('picNum'));
  },
  setUser: function(user){
    this.set({user: user});
  },
  setPictureTopic: function(string){
    this.set({pictureTopic: string});
  },
  setPics: function(pics){
    this.set({pics: pics});
  },
  setPicDets: function(newPictureID, newPictureSec,pictureName, pictureLocation, picNum){
    this.set({
       pictureID: newPictureID,
       pictureSec: newPictureSec,
       pictureName: pictureName,
       pictureLocation: pictureLocation,
       picNum: picNum
       });
      
  },
  setPrevPics: function(oldPictureID, oldPictureSec){
    this.set({
      prevPictureID: oldPictureID,
      prevPictureSec: oldPictureSec
    })
  }
  
});


var pictureBB;
var apiKey="904cf61ca4fc611d5d618b8b4fcdf732";
var safeSearch=3;
//var editor;

$(document).ready(function() {
  
  pictureBB = new pictures();
  
  //create a new unique identifier cookie if no cookie exists yet 
  if(typeof $.cookie('UID')=="undefined"){
    rUID = new Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16);
    sessionID = new Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16);
    $.cookie('UID', rUID, {expires: 365});
    $.cookie('Session', sessionID, {expires: 1});
    //set some geovariables
    if(window.location.host!=""){
      $.cookie('lat', geoplugin_latitude(), {expires: 365});
      $.cookie('long', geoplugin_longitude(), {expires: 365});
      $.cookie('city', geoplugin_city(), {expires: 365});
      $.cookie('region', geoplugin_region(), {expires: 365});
      $.cookie('country', geoplugin_countryCode(), {expires: 365});
    }
    pictureBB.setUser($.cookie());
  }else{
    $('#introText').hide();
    sessionID = new Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16);
    $.cookie('Session', sessionID, {expires: 1});
    pictureBB.setUser($.cookie());
  }
  
  //random starting pictures from flickr "puppies"
  getPics(0);
  
  
  //and do the rest of the app
  /*
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
  })*/
 
  
  $('#submitBtn').click(function(e){
    pictureBB.setPictureTopic($('#searchText').val());
  });
  $(document).keypress(function(e) {
    if(e.which == 13) {
        pictureBB.setPictureTopic($('#searchText').val());
    }
  });
  
});
setClicks = function(){
  $('.firstpicture').click(function(event){
    console.log('p1Click');
    pictureBB.setPrevPics(pictureBB.get('pictureID'), pictureBB.get('pictureSec'));
    pictureBB.setPicDets(this.attributes.picID.value, this.attributes.picSec.value,
          this.attributes.src.value, 'p1', this.attributes.picnum.value);
    
  });
  $('.secondpicture').click(function(event){
    pictureBB.setPrevPics(pictureBB.get('pictureID'), pictureBB.get('pictureSec'));
    pictureBB.setPicDets(this.attributes.picID.value, this.attributes.picSec.value,
          this.attributes.src.value, 'p2', this.attributes.picnum.value);
    console.log('p2Click');
  })
  $('.sidepicture').click( function(event){
    
    var picLoc = this.parentNode.parentNode.attributes.id.value;
    pictureBB.setPrevPics(pictureBB.get('pictureID'), pictureBB.get('pictureSec'));
    pictureBB.setPicDets(this.attributes.picID.value, this.attributes.picSec.value,
          this.attributes.src.value, picLoc, this.attributes.picnum.value);
  })
}
getPics = function(){  
   $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apiKey+"&text="+
        pictureBB.get('pictureTopic')+
        "&safe_search="+safeSearch+
        "&sort=interestingness-desc&per_page=500&format=json&jsoncallback=?", 
        function(data){
          var pics=data.photos.photo;
          pictureBB.setPics(pics);
       
        });
}
setPics = function(mainPic){
  var pics = pictureBB.get('pics');
  getPicsSub(mainPic, $('#mainPhoto'), 'large', pics, 'noclass');
          //getPicsSub(Math.round((pics.length-1)*Math.random(), 2),$('#firstOption'), 'medium', pics, 'firstpicture');
          //getPicsSub(Math.round((pics.length-1)*Math.random(), 2), $('#secondOption'), 'medium', pics, 'secondpicture');

          for (i = 0; i < 12; i++) { 
              //fill in some sidebar options
             getPicsSub(Math.round((pics.length-1)*Math.random(), 2), $('#side'+i), 'small', pics, 'sidepicture');
          }
}
getPicsSub = function(num, picturePlace, size, pics, linkclass){

          //append the first item to the main picture, the second to the first of the two options... and so on 
          item = pics[num];
          var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
          //get photo info
          info = $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+
                    "&photo_id="+item.id+
                    "&format=json&jsoncallback=?", 
                  function(data){
                    //get the largest size picture
                    switch(size) {
                        case "small":
                            pic=data.sizes.size[0];
                            sf=1
                            break;
                        case "medium":
                            pic=data.sizes.size[1];
                            sf=1
                            break;
                        case "large":
                            //scale so that the height isn't larger than the visible height of the window also
                            pic=data.sizes.size[data.sizes.size.length-2];
                            sf=1/(pic.width/picturePlace.width());
                            break;
                    }
                    
                    
                    var imgCont = '<a href="#"><img src="'+pic.source+
                                  '" height="'+pic.height*sf+'" width="'+pic.width*sf+
                                  '" class="'+linkclass+
                                  '" picNum="'+num+
                                  '" picID="'+item.id+
                                  '" picSec="'+item.secret+'"></a>';
                      //insert the 'imgCont' variable to the document
                      picturePlace.html($(imgCont));
                      setClicks();
                    });
          
          
   }
saferStringify = function(obj, replacer, space) {
    return JSON.stringify(obj, replacer, space).replace(new RegExp('/', 'g'), '||')
    // Escape u2028 and u2029
    // http://timelessrepo.com/json-isnt-a-javascript-subset
    // https://github.com/mapbox/tilestream-pro/issues/1638
    .replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
};