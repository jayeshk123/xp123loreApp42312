
//globel veriables
var map;
var marker;
var infowindows=[];
var map_place_list=[];
var MapFlag = 0;
var Location_info='';
var watchID = null;
var timer = 0; // timer for the distance slider to clear the categories.
var Markers=[];
var infowindow;
var service;
var myLatLng;
var mylat ='';
var mylong ='';
var Places_Result = [];
var service_d;
var place_id_list=[];
var destination_list = [];
var types_prop = [];
var Category_prop=[];
var Itineraries_list = [];
var Experiances_list_all = [];
var Itineraries_Ad = [];
var curent_location='';
var Tour_List = []; 
var bar= '';
var Destination_addr='';
var selected_places = [];
var loop=0,No=1;
//var site_url = 'https://wms-dev.com/xplore/index.php?/';
var site_url = 'http://52.87.180.150/xplore/index.php?/';
var FbUserId_Log='';
var detail_Id='';
var T_Flag="false"; //where T stands for trip.
var T_Profile = ""; //this stores trip details that were loaded in the tours section.
var T_name = "";    //ª
var T_SrNo = "";
var T_des =  "";
var T_tag = "";
var res_list_google = {}; //response list from google places
var res_list_server= {}; //response list from our server
var res_list_direction= {}; // response list from distance matrix
var Flag_For_Distance = "";
var category_In_Grid = "";
var arr=[]; //listings for listings UI
var categories={};
var HasNextPage="false"; //flag for click to see more tag
var pagination_={};
var interval=0;
var Save_id="0";
var process="";
var Ui_Name='';
var status="";
var WebLink="";//for web links in places details section
//var tour_Places = [];
//globel variable

categories = {
    "tech" : "Tech",
    "popup" : "Pop Up",
    "ecofriendly" : "Eco-Friendly",
    "healthandwellness" : "Health and Wellness",
    "multicultural" : "Multicultural",
    "urbanformat" : "Urban Format",
    "grocery" : "Grocery",
    "gourmet" : "Gourmet",
    "foodhall" : "Foodhall",
    "convenience" : "Convenience",
    "homefurnishings" : "Home Furnishings",
    "homeimprovement" : "Home Improvement",
    "garden" : "Garden",
    "electronics" : "Electronics",
    "sport" : "Sport",
    "mens" : "Men's",
    "womens" : "Women's",
    "kids" : "Kid's",
    "extendedsizes" : "Extended Sizes",
    "shoes" : "Shoes",
    "accessories" : "Accessories",
    "active" : "Active",
    "drugstore" : "Drugstore",
    "pharmacy" : "Pharmacy",
    "healthandbeauty" : "Health and Beauty",
    "pet" : "Pet",
    "stationary" :"Stationary",
    "hotandnew" : "Hot and New",
    "fastcasual" : "Fast Casual",
    "chicagostaples" : "Chicago Staples",
    "diner" : "Diner",
    "chicagopizza" : "Chicago Pizza",
    "upscaletraditional" : "Upscale Traditional",
    "chic" : "Chic",
    "cafe" : "Cafe",
    "rooftops" : "Rooftops",
    "mixology" : "Mixology",
    "wine" : "Wine",
    "whiskey" : "Whiskey",
    "distilleries" : "Distilleries",
    "breweries" : "Breweries",
    "craftbeers" : "Craft Beers",
    "clubs" : "Clubs",
    "mingling" : "Mingling",
    "lounge" : "Lounge",
    "seasonal" : "Seasonal",
    "artsy" : "Artsy",
    "parks" : "Parks",
    "indie" : "Indie",
    "theatre" : "Theatre",
    "outdoors" : "Outdoors",
    "concerts" : "Concerts",
    "jazz" : "Jazz",
    "smallvenue" : "Small Venue",
    "triedandtrue" : "Tried and True",
    "michelinrated" : "Michelin Rated",
    "diy" : "DIY",
    "shoppingcenter" : "Shopping Center",
    "concept-store" : "Concept Store",
    "c-store" : "C-store",
    "newconcept" : "New Concept",
    "teststore" : "Test Store",
    "eventsinstore" : "Events In Store",
    "local" : "Local",
    "evergreen" : "Evergreen",
    "optical" : "Optical",
    "cosperson" : "Cosmetics/Personal Care",
    "jewelry" : "Jewelry",
    "specialsizes" : "Special Sizes",
    "coffeetea" : "Coffee/Tea",
    "candybakery" : "Candy/Bakery",
    "fastfastcasual" : "Fast/Fast Casual",
    "restaurant" : "Restaurant",
    "bar" : "Bar",
    "event1" : "Event 1",
    "event2" : "Event 2"
};



function handleOpenURL(url) {
    // This function is triggered by Plugin
    setTimeout(function() {
               process="load_tour";
               var url_ = "" + url;
               var index=url_.indexOf('=');
               //alert(index+1);
               FbUserId_Log="_";
               url_ = url_.slice(index+1);
               //alert(url_);
               mylat  = 41.8818; //Chicago
               mylong = -87.6633;  //Chicago
               myLatLng = new google.maps.LatLng(mylat, mylong);
               var mapOptions = {
               zoom: 15,
               center: myLatLng,
               mapTypeId: google.maps.MapTypeId.ROADMAP
               }
               map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
               $('#homepage').hide();
               GoToItinerary();
               FbLogin(url_);
               }, 400);
}


function showMap_marker_initial()
{
  //reset_main();
  MapProp();
  $('#homepage').show();
  $('#mapCanvas').hide();
 
 	return;	
 
 	var mapDiv = document.getElementById("map_canvas");
 
 	// Initialize the map plugin
 	var map = plugin.google.maps.Map.getMap(mapDiv);
 
 	// You have to wait the MAP_READY event.
 	map.on(plugin.google.maps.event.MAP_READY, onMapInit);

		//navigator.geolocation.getCurrentPosition(success_1, fail_1 , { enableHighAccuracy: true });
 
  function success_1(position){
    Markers=[];
    map_place_list=[];
    mylat = position.coords.latitude;
    mylong = position.coords.longitude;
    myLatLng = new google.maps.LatLng(mylat,mylong);
    var mapOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var geocoder = new google.maps.Geocoder();
    var ad='';
    if (geocoder)
    {
      geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
                       {
                       if (status == google.maps.GeocoderStatus.OK) {
                       ad=(results[0].formatted_address);
                       }
                       map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                       marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
                       Markers.push(marker);
                       console.log('push'+Markers.length);
                       map_place_list.push('1');
                       Location_info=ad;
                       marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >You are at.. </br>'+ad+'</div>'});
                       //$('#User_location_bar').html(ad);
                       if(Location_info.length <= 50)
                       {
                         $('#User_location_bar').html(ad);
                       }
                       else
                       {
                        $('#User_location_bar').html(ad.substr(0, 50));
                       }
                       marker.info.open(map, marker);
                       google.maps.event.addListener(map, "idle", function() {
                                                     google.maps.event.trigger(map, 'resize');
                                                     });
                       infoWindow_custom();
                       });
    }
   //}
  }
 
  function fail_1(position){
    swal(" Current location is not found ... Showing the default location.");
    Markers = [];
    map_place_list = [];
    mylat  = 41.8818; //Chicago
    mylong = -87.6633;  //Chicago
    myLatLng = new google.maps.LatLng(mylat, mylong);
    var mapOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }; 
    var geocoder = new google.maps.Geocoder();
    var ad='';
    if (geocoder)
    {
      geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
                       {
                       if (status == google.maps.GeocoderStatus.OK) {
                       ad=(results[0].formatted_address);
                       }
                       map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                       marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
                       Markers.push(marker);
                       console.log('push'+Markers.length);
                       map_place_list.push('1');
                       Location_info=ad;
                       marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo">You are at.. </br>'+ad+'</div>'});
                       //$('#User_location_bar').html(ad);
                       if(Location_info.length <= 50)
                       {
                         $('#User_location_bar').html(ad);
                       }
                       else
                       {
                        $('#User_location_bar').html(ad.substr(0, 50));
                       }
                       marker.info.open(map, marker);
                       google.maps.event.addListener(map, "idle", function() {
                                                     google.maps.event.trigger(map, 'resize');
                                                     });
                       infoWindow_custom();
                       });
    }
  }
  setTimeout(function(){
             $.LoadingOverlay("hide");
             Map_places_suggestion();
             }, 2000);
}

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        google.maps.event.addListener(infowindow, 'domready', function() 
        {
              $('.gm-style-iw').prev().css({'display' : 'none'});
        });
    },
    receivedEvent: function(id) {
                StatusBar.overlaysWebView(false);
                localStorage.setItem("HelpToggle", "False");
    }
    
};

google.maps.event.addDomListener(window, 'load', function () {
     var places = new google.maps.places.Autocomplete(document.getElementById('starting_location'));
     google.maps.event.addListener(places, 'place_changed', function () {
              var numItems = $('.YetToVisitedNode').length;
              if(numItems != 0)
              {
                swal({
                  title: "Are you sure?",
                  text: "Resetting a location will clear your selections.To save your selection click cancel.",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Yes, clear it.",
                  closeOnConfirm: false
                  },
                  function(isConfirm)
                  {
                    if(isConfirm)
                    {
                        swal.close();
                        getCurrentLocation_auto(places);
                    }else
                    {
                        swal.close();
                        $("#starting_location").val("");
                    }
                });
              }else
              {
                  getCurrentLocation_auto(places);
              }
              
     });
     var new_place = new google.maps.places.Autocomplete(document.getElementById('ADD_New'));
     google.maps.event.addListener(new_place, 'place_changed', function () {
                                   var place = new_place.getPlace();
                                   if (!place.geometry) {
                                   return;
                                   }
                                   var flag=false;
                                   $(".visitedNode").each(function() {
                                               var id = this.id;
                                               var index = id.indexOf('_');
                                               if(index != -1)
                                               {
                                                    id= id.substr(index+1);
                                               }
                                               if(id==place.place_id)
                                               {
                                                  flag=true;
                                                 //alert("place is already exists..");
                                                 return false;
                                               }
                                   });
                                   
                                   if(flag==true)
                                   {
                                      swal("Place is already exists in experiance visited list..");
                                     $("#ADD_New").val("");
                                      return;
                                   }
                                   
                                   $(".YetToVisitedNode").each(function() {
                                                          var id = this.id;
                                                          var index = id.indexOf('_');
                                                          if(index != -1)
                                                          {
                                                          id= id.substr(index+1);
                                                          }
                                                          if(id==place.place_id)
                                                          {
                                                          flag=true;
                                                          //alert("place is already exists..");
                                                          return false;
                                                          }
                                                          });
                                   
                                   if(flag==true)
                                   {
                                      swal("Place is already exists in experiance unvisited list..");
                                     $("#ADD_New").val("");
                                      return;
                                   }
                                   
                                   var address = place.formatted_address;
                                   service = new google.maps.places.PlacesService(map);
                                   service.getDetails({
                                                      placeId:place.place_id
                                                      }, function(place, status) {
                                                      if (status === google.maps.places.PlacesServiceStatus.OK) {
                                                      
                                                      var current = new google.maps.LatLng(mylat,mylong);
                                                      
                                                      if(typeof service_d === "undefined")
                                                      {
                                                      service_d = new google.maps.DistanceMatrixService();
                                                      }
                                                      
                                        var destination = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                                        service_d.getDistanceMatrix({
                                                                    origins: [current], //LatLng Array
                                                                    destinations: [destination], //LatLng Array
                                                                    travelMode: google.maps.TravelMode.DRIVING,
                                                                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                                                                    avoidHighways: false,
                                                                    avoidTolls: false
                                                                    }, callback_Dis);
                                                      
                                                      function callback_Dis(response, status)
                                                      {
                                                      if (status === google.maps.DistanceMatrixStatus.OK)
                                                      {
                                                      
                                                      var results_ele = response.rows[0].elements;
                                                      
                                                      if(!(typeof results_ele[0] === "undefined"))
                                                      {
                                                      element = results_ele[0];
                                                      if(!(typeof element.distance === "undefined"))
                                                      {
                                                      var distance = element.distance.text;
                                                      add_itinerary(place,distance,'Itinerary');
                                                      }
                                                      else
                                                      {
                                                      var distance = "";
                                                      add_itinerary(place,distance,'Itinerary');
                                                      }
                                                      }
                                                      else
                                                      {
                                                      var distance="";
                                                      add_itinerary(place,distance,'Itinerary');
                                                      }
                                                      
                                                      }
                                                      else
                                                      {
                                                      var distance="";
                                                      add_itinerary(place,distance,'Itinerary');
                                                      }
                                                      }
                                                      }
                                                      });
                                   
                                   });                     
     });
// auto correct script start here
function getCurrentLocation_auto(places)
{
   reset_main();
   if (watchID != null) 
   {
      navigator.geolocation.clearWatch(watchID);
      //alert('clear watch');
      watchID = null;
   }
                   Markers=[];
                   map_place_list=[];
                   var place = places.getPlace();
                   var address = place.formatted_address;
                   mylat= place.geometry.location.lat();
                   mylong=place.geometry.location.lng();
                   //google.maps.event.trigger(map, 'resize');
                   
                   MapProp();
                   
                   $('#homepage').hide();
                   $('#mapCanvas').show();
                   if(mylat != '' && mylong !='')
                   {
                   myLatLng = new google.maps.LatLng(mylat, mylong);
                   var mapOptions = {
                   zoom: 15,
                   center: myLatLng,
                   mapTypeId: google.maps.MapTypeId.ROADMAP
                   }
                   var geocoder = new google.maps.Geocoder();
                   var ad='';
                   if (geocoder)
                   {
                   geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
                                    {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                    ad=(results[0].formatted_address);
                                    }
                                    Location_info = ad;
                                    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                                    marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
                                    marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo">You are at..  <br/>'+ad+'</div>'});
                                   // $('#User_location_bar').html(ad);
                                    if(Location_info.length <= 50)
                                    {
                                       $('#User_location_bar').html(ad);
                                    }
                                    else
                                    {
                                      $('#User_location_bar').html(ad.substr(0, 50));
                                    }
                                    google.maps.event.addListener(map, "idle", function() {
                                                 
                                                 google.maps.event.trigger(map, 'resize');
                                    });
                                    Markers.push(marker);
                                    console.log('push'+Markers.length);
                                    map_place_list.push('1');
                                    marker.info.open(map, marker);
                                    infoWindow_custom();
                                    });
                  }
                  else
                  {
                      setTimeout(function()
                      {
                        $.LoadingOverlay("hide");
                      }, 2000);
                  }
                   
                  }
                  setTimeout(function(){
                              $.LoadingOverlay("hide");
                  }, 2000);
}


function add_itinerary(place,Dis,Sort)
{
    var addr=$("#ADD_New").val();
    var p_address=place.vicinity;

    var arr_addr=p_address.split(",");
    var index = '';  // Gets the first index where a space occours
    var id = ''; // Gets the first part
    var text = '';

    if(arr_addr.length >= 4)
    {
      id = arr_addr[0]; // Gets the first part
      text = arr_addr[1];
    }
    else
    {
      index = place.vicinity.lastIndexOf(',');  // Gets the first index where a space occours
      id = place.vicinity.substr(0, index); // Gets the first part
      text = place.vicinity.substr(index + 1);
    }

    var struct='';
    
    if(!(typeof place.photos === "undefined"))
    {
        if(!(typeof place.photos[0] === "undefined"))
        {
            struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="'+place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 350})+'" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title itinerarydes" id="Add_'+place.place_id+'">'+id+'</li><li class="title itinerarydes" id="Distaaa_'+place.place_id+'"><div style="float:left;">'+text+'</div><div id="Dista_'+place.place_id+'">'+Dis+'&nbsp;away</div></li></ul></div></div>';
        }
    }
    else
    {
        struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="images/default.jpg" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title itinerarydes" id="Add_'+place.place_id+'"> '+id+'- <span id="Dista_'+place.place_id+'">'+Dis+'</span></li><li class="title itinerarydes" id="Dista_'+place.place_id+'"><div style="float:left;">&nbsp;&nbsp;</div><div id="Di"></div></li></ul></div></div>';
    }
    
    var struct1='<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+place.place_id+'"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-1 col-xs-1 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px;"/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div>';
    
    
   
    document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + struct1;
    //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;

    
    Itineraries_list.push(place.place_id);
    Itineraries_Ad.push(addr);
    Tour_List.push('1');
    $("#ADD_New").val("");
    var abcn="."+place.place_id;
    
    $(abcn).each(function() 
    {
        $(this).addClass('addItinerary');
    });
    //function used to add colore difference code
    col_Diff();
    
    //code to hide edit mode if it is open.
    Editor();
}


//Function to add colore difference code starts here
function col_Diff()
{
  var i=0;
  $(".YetToVisitedNode").each(function()
  {                        
      if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
      {
        if($(this).hasClass('oddItinerary'))
        {
          $(this).removeClass('oddItinerary');
        }
        $(this).addClass('evenItinerary');
      }
      else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
      {
        if($(this).hasClass('evenItinerary'))
        {
          $(this).removeClass('evenItinerary');
        }
        $(this).addClass('oddItinerary');
      }
      i++;
  });
  
  i=1;
  
  $(".visitedNode").each(function() 
  {
      if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
      {
        if($(this).hasClass('oddItinerary'))
        {
          $(this).removeClass('oddItinerary');
        }
        $(this).addClass('evenItinerary');  
      }
      else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
      {
        if($(this).hasClass('evenItinerary'))
        {
          $(this).removeClass('evenItinerary');
        }
        $(this).addClass('oddItinerary');
      }
      i++;
  });
  //Adding colore difference code ends here
}
//Function to add colore difference code starts here
                    
//mapProp is used to set property of the map on the screen
function MapProp()
{
  //$.LoadingOverlay("show");//loader for map
 
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map_canvas");
  var mapitem = document.getElementById("map_item");
 
 	var helpstatus=localStorage.getItem("HelpToggle");
 	if(helpstatus == 'false')
  {
    $('.help').each(function() {
        $(this).css("display","none");
    });
  }
  else
  {
    $('#radio2').trigger("click");
    $('.help').each(function() {
      $(this).css("display","block");
    });
  }
 
  if ((useragent.indexOf('Android 3.') != -1) && (screen.width >= 800) && (screen.height >= 800)) {
  }
  else if ((useragent.indexOf('Android 2.') != -1 ) || (useragent.indexOf('Android 3.') != -1 )) {
  }
  else {
  } 
}
//mapProp is used to set property of the map on the screen

function warning_before_map()
{
  var numItems = $('.YetToVisitedNode').length;
  if(numItems != 0)
  {
    swal({
        title: "Are you sure?",
        text: "Resetting a location will clear your selections.To save your selection click cancel.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, clear it.",
        closeOnConfirm: false
        },
        function()
        {
          showMap();
          swal.close();
        });
  }
  else
  {
    showMap();
  }
}


// show map function start here
//function showMap()
//{
//  reset_main();
//  MapProp();
// 
//  if (watchID != null)
//  {
//      navigator.geolocation.clearWatch(watchID);
//      watchID = null;
//  }
// 	MapFlag=0;
//  $('#homepage').hide();
//  $('#mapCanvas').show();
// 
//  $("#starting_location").val("");
//  var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
// 	watchID = navigator.geolocation.watchPosition(success1, fail1, options);
//  
//  function success1(position)
//  {
//  		if(MapFlag == 1 && Markers.length>0)
//    {
//   	  latLngSetMarker1(Markers[0],Markers[0].position.lat(),Markers[0].position.lng(),position.coords.latitude,position.coords.longitude,0);
//      return;
//  		}
//    MapFlag=1;
//    Markers=[];
//    map_place_list=[];
//    mylat = position.coords.latitude;
//    mylong = position.coords.longitude;
//    myLatLng = new google.maps.LatLng(mylat,mylong);
//   
//    var mapOptions = {
//    zoom: 15,
//    center: myLatLng,
//    mapTypeId: google.maps.MapTypeId.ROADMAP
//    };
//   
//    var geocoder = new google.maps.Geocoder();
//    var ad='';
//   
//    if (geocoder)
//    {
//      geocoder.geocode({ 'latLng': myLatLng},
//      																						function (results, status)
//                       					{
//                       							if (status == google.maps.GeocoderStatus.OK)
//                       							{
//                       									ad=(results[0].formatted_address);
//                              }
//                       							Markers=[];
//                       							map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
//                       
//                      	 						marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
//                       
//                              Markers.push(marker);
//                              console.log('push'+Markers.length);
//                       							map_place_list.push('1');
//                       							Location_info=ad;
//                       
//                       							marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >You are at.. </br>'+ad+'</div>'});
//                                   
//                                    if(Location_info.length <= 50)
//                                    {
//                                       $('#User_location_bar').html(ad);
//                                    }
//                                    else
//                                    {
//                                      $('#User_location_bar').html(ad.substr(0, 50));
//                                    }
//                       							marker.info.open(map, marker);
//                       
//                       							google.maps.event.addListener(map, "idle", function() {
//                                                     google.maps.event.trigger(map, 'resize');
//                              });
//                                    infoWindow_custom();
//                       });
//    }
//   
//  }
// 
//  function latLngSetMarker1(marker,fromLat,fromLng,toLat,toLng,index)
// 	{
//  		var curLat,curLng;
//  		frames = [];
//  		for (var percent = 0; percent < 1; percent += (0.050 * 0.5))
//  		{
//   		curLat = fromLat + percent * (toLat - fromLat);
//   		curLng = fromLng + percent * (toLng - fromLng);
//   		frames.push(new google.maps.LatLng(curLat, curLng));
//  		}
//  
//  		move = function(marker, latlngs, index1, wait, newDestination)
//				{
//   		marker.setPosition(latlngs[index1]);
//   		Markers[index]= marker;
//   			if(index1 != latlngs.length-1) {
//    				setTimeout(function() {
//               move(marker, latlngs, index1+1, wait, newDestination);
//               }, wait);
//   			}
//  		}
//  
//  		move(marker, frames, 0, 10, marker.position);
// 	}
// 
//  function fail1(position)
//  {
//    console.log(position);
//  }
// 
//  setTimeout(function(){
//             $.LoadingOverlay("hide");
//             Map_places_suggestion();
//             }, 2000);
//}
//show map function end here


// Back Button on google map page
function goToBack()
{
  $('#homepage').hide();
  $('#mapCanvas').show();
  $('#nearByPlace').hide();
  $('#CatagoryPage').hide();
  $('#Detail').hide();
  $('#NotificationUi').hide();
  $('#itinerary_Ui').hide();
  $('#ListDetail').hide();
  $('#Save_Ui').hide();
  $('#MyTrips').hide();
  $('#BuildSearchUi').hide();
 
  document.getElementById("thread_").innerHTML='<a href="#" onclick="goToNearByPlace()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
 
}

 function goToBackCat()
{
  document.getElementById("thread_").innerHTML='<a href="#" onclick="goToNearByPlace()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
  res_list_google = {};
  res_list_server= {};
  res_list_direction= {};
  Category_prop=[];
  types_prop=[];
  Save_id="0";
  process="";
  $('#NotificationUi').hide();
  $('#itinerary_Ui').hide();
  $('#mapCanvas').show();
  $('#nearByPlace').hide();
  $('#CatagoryPage').hide();
  $('#Detail').hide();
  $('#ListDetail').hide();
  $('#Save_Ui').hide();
  $('#MyTrips').hide();
  $('#BuildSearchUi').hide();
  document.getElementById('Itinerary').innerHTML = "";
  document.getElementById("MyTripList").innerHTML="";
  detail_Id = '';
}

// Next Button on google map page
function goTonext()
{
  $('#CatagoryPage').show();
  $('#mapCanvas').hide();
}

function goTonextcat()
{
  $('#mapCanvas').show();
  $('#homepage').hide();
  $('#CatagoryPage').hide();
  $('#Detail').hide();
  $('#NotificationUi').hide();
  $("#starting_location").val("");
  $('#itinerary_Ui').hide();
  $('#ListDetail').hide();
  $('#Save_Ui').hide();
  $('#MyTrips').hide();
  $('#BuildSearchUi').hide();
}


function Reset(thiss)
{
  swal({
      title: "Are you sure?",
      text: "You are about to clear all selections.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, clear it.",
      closeOnConfirm: false
      },
      function()
      {
        reset_main();
        var top=thiss.getBoundingClientRect().top;
        $(thiss).trigger('showtooltip');

        setTimeout($(thiss).trigger('hidetooltip'),5000);
        swal.close();
      });
}

function reset_main()
{
    $('.check').each(function() {
        if ($(this).is(':checked'))
        {
           $(this).prop('checked',false);
           if($(this).parent().parent().hasClass('active'))
           {
               $(this).parent().parent().removeClass('active');
           }
           else
           {
               $(this).parent().parent().parent().removeClass('active');
           }
        }
    });

    Itineraries_list=[];
    Itineraries_Ad=[];
    Tour_List=[];
    T_Flag="false";

    document.getElementById("desc_t").value="";
    document.getElementById("Tag_t").value="";
    document.getElementById("Tour_Owner_Status").value="";
    document.getElementById("name_t").value="";

    T_SrNo = '';
    document.getElementById('Itinerary').innerHTML='';
    document.getElementById('selected_site_list1').innerHTML='';

    $(".addItinerary").each(function()
    {
        $(this).removeClass('addItinerary');
    });

    Save_id="0";
    process="";

    
}
 //Function shows list of result that that has been requested by user. List contains different types of result depends upon the selected catagory this function also contains list structure.
function Places()
{
 
  interval=0;
  HasNextPage="false";
  types_prop = [];
  place_id_list=[];
  Category_prop=[];
  
  $( '.Token' ).find( 'span' ).each(function(){
                                    Category_prop.push(this.innerHTML);
  });
  
  $('.check').each(function() {
                    if ($(this).is(':checked')) 
                    {
                      Category_prop.push(this.value);
                    }
  });
  
 
  if(Category_prop.indexOf("Hotandnew") != -1 || Category_prop.indexOf("fastcasual") != -1 || Category_prop.indexOf("ChicagoStaples") != -1 || Category_prop.indexOf("Diner") != -1 || Category_prop.indexOf("ChicagoPizza") != -1 || Category_prop.indexOf("UpscaleTraditional") != -1 || Category_prop.indexOf("chic") != -1 )
  {
    types_prop.push("restaurant");
  }
  
  if(Category_prop.indexOf("cafe") != -1)
  {
    types_prop.push("cafe");
  }
  
  if(Category_prop.indexOf("rooftops") != -1 || Category_prop.indexOf("mixology") != -1 || Category_prop.indexOf("wine") != -1 || Category_prop.indexOf("whiskey") != -1 || Category_prop.indexOf("distilleries") != -1 || Category_prop.indexOf("Breweries") != -1 || Category_prop.indexOf("craftbeers") != -1 || Category_prop.indexOf("clubs") != -1 || Category_prop.indexOf("mingling") != -1 || Category_prop.indexOf("lounge") != -1)
  {
    types_prop.push("bar");
    types_prop.push("night_club");
  }
 
 if(Category_prop.indexOf("tech") != -1 || Category_prop.indexOf("popup") != -1 || Category_prop.indexOf("green") != -1 || Category_prop.indexOf("healthandwellness") != -1 || Category_prop.indexOf("multicultural") != -1 || Category_prop.indexOf("urbanformat") != -1 || Category_prop.indexOf("grocery") != -1 || Category_prop.indexOf("gourmet") != -1 || Category_prop.indexOf("foodhall") != -1 || Category_prop.indexOf("convenience") != -1 || Category_prop.indexOf("homefurnishings") != -1 || Category_prop.indexOf("homeimprovement") != -1 || Category_prop.indexOf("garden") != -1 || Category_prop.indexOf("electronics") != -1 || Category_prop.indexOf("sport") != -1 || Category_prop.indexOf("mens") != -1 || Category_prop.indexOf("womens") != -1 || Category_prop.indexOf("kids") != -1 || Category_prop.indexOf("extendedsizes") != -1 || Category_prop.indexOf("shoes") != -1 || Category_prop.indexOf("accessories") != -1 || Category_prop.indexOf("active") != -1 || Category_prop.indexOf("drugstore") != -1 || Category_prop.indexOf("pharmacy") != -1 || Category_prop.indexOf("healthandbeauty") != -1 || Category_prop.indexOf("pet") != -1 || Category_prop.indexOf("stationary") != -1 || Category_prop.indexOf("diy") != -1 || Category_prop.indexOf("shoppingcenter") != -1 || Category_prop.indexOf("concept-store") != -1 || Category_prop.indexOf("c-store") != -1 || Category_prop.indexOf("newconcept") != -1 || Category_prop.indexOf("teststore") != -1 || Category_prop.indexOf("eventsinstore") != -1 || Category_prop.indexOf("local") != -1 || Category_prop.indexOf("evergreen") != -1 || Category_prop.indexOf("optical") != -1 || Category_prop.indexOf("cosperson") != -1 || Category_prop.indexOf("jewelry") != -1 || Category_prop.indexOf("specialsizes") != -1 || Category_prop.indexOf("coffeetea") != -1 || Category_prop.indexOf("candybakery") != -1 || Category_prop.indexOf("fastfastcasual") != -1 || Category_prop.indexOf("restaurant") != -1 || Category_prop.indexOf("bar") != -1)
 {
  types_prop.push("store");
 }
  
  if(types_prop.length == 0)
  {
    types_prop.push("restaurant");
    types_prop.push("cafe");
    types_prop.push("bar");
    types_prop.push("night_club");
  }
  
  if(types_prop.length == 0 && Category_prop.length ==0)
  {
    swal("Please select any Catagory");
    document.getElementById("selected_site_list").innerHTML = "";
    goToBackCat();
    return;
  }
  
  var radius_s = Math.round((document.getElementById('ex1').value) * 1609.34);
  var miles = parseFloat(document.getElementById('ex1').value);
  myLatLng = new google.maps.LatLng(mylat, mylong);
  //console.log(types_prop);
  service = new google.maps.places.PlacesService(map);
  service_d = new google.maps.DistanceMatrixService();
  Flag_For_Distance=false;
  List_Load();
  
}
//places function ends here.


function List_Load()
{
  document.getElementById("thread_").innerHTML='<a href="#" onclick="goToNearByPlace()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
  var gridList='';
  var results_ele=[];
  
  if(!(typeof res_list_direction.rows === "undefined"))
  {
    results_ele = res_list_direction.rows[0].elements;
  }
  
  var results = res_list_google;
  var servar_res = res_list_server;
  var flag=Flag_For_Distance;
  var miles = parseFloat(document.getElementById('ex1').value);
  var ser_flag="false";
  var st=0;
  
  for (var i = 0; i < results.length; i++)
  {
   
    for (var j = 0; j < servar_res.length; j++)
    {
      ser_flag="false";
      if (servar_res[j].PlaceIds == results[i].place_id) {
        ser_flag="true";
        break;
      }
    }
    if(ser_flag == "true")
    {
      ser_flag="false";
      continue;
    }
    var element   ='';
    var distance  ='';
    var duration  ='';
    
    if(!(typeof results_ele[i] === "undefined") && flag != false)
    {
      element = results_ele[i];
      if(!(typeof element.distance === "undefined"))
      {
        distance = element.distance.text;
        var D_str = distance.indexOf(' ');
        var str_d = distance.substr(0,D_str);
        var mil = parseFloat(str_d);
        
        if(mil > miles)
        {
          continue;
        }
      }
      if(!(typeof element.duration === "undefined"))
      {
        duration = element.duration.text;
      }
    }
    
    var abc ='';
    
    gridList = gridList + '<div class="single_library_container col-sm-12 col-xs-12 '+results[i].place_id+'" id="List_'+ results[i].place_id +'"><input type="hidden" name="Place_Id" value="'+results[i].place_id+'"/><input type="hidden" id="Lat_'+results[i].place_id+'"  value="'+results[i].geometry.location.lat()+'"/><input type="hidden" id="Log_'+results[i].place_id+'" value="'+results[i].geometry.location.lng()+'"/><div id="Add_'+results[i].place_id+'" style="display:none;">'+results[i].vicinity+'</div>';
    
    gridList = gridList + '<div class="listDescription col-sm-11 col-xs-11 paddingzero" id="'+ results[i].place_id +'" onClick="javascript:Detail(this,true); return false;"><a id="selectedSiteListImage_'+results[i].id+'">';
    
    if(!(typeof results[i].photos === "undefined"))
    {
      gridList = gridList + '<div class="listImage col-sm-6 col-xs-6 paddingzero"><img class="firstimage" id="Place_Image'+results[i].place_id+'" src="'+results[i].photos[0].getUrl({'maxWidth': 180, 'maxHeight': 160})+'" /></div>';
    }
    else
    {
      gridList = gridList + '<div class="listImage col-sm-6 col-xs-6 paddingzero"><img class="firstimage" id="Place_Image'+results[i].place_id+'" src="images/default.jpg" /></div>';
    }
    
    gridList = gridList + '<div class="listDescription col-sm-6 col-xs-6 paddingzero"><ul class="site-desc">';
    
    gridList = gridList + '<li class="title hotelName" id="Place_name'+results[i].place_id+'"> '+results[i].name+'';
    
    gridList = gridList + '<span id="Distance'+results[i].place_id+'"></span></li>';
    
    if(1 == 2)
    {
    //!(typeof results[i].rating === "undefined")
      gridList = gridList+ '<li class="title hotelRating">';
      st=parseInt(results[i].rating);
      var st1='';
      var jk=0;
      st=parseInt(results[i].rating);
      while(parseInt(jk)<parseInt(st))
      {
        jk++;
        st1=st1+'<img class="desimage img-responsive" src="images/Star.png" />';
      }
      if((parseFloat(results[i].rating)-st)>0.5)
      {
        st1=st1+'<img class="desimage img-responsive" src="images/Star.png" />';
      }
      else if((parseFloat(results[i].rating)-st)<0.5 && (parseFloat(results[i].rating)-st)>0.0)
      {
        st1=st1+'<img class="desimage img-responsive" src="images/Star-Half.png" />';
      }
      gridList = gridList+ '<div class="mainStars">'+st1+'</div><div class="reviews" id="Rev'+results[i].place_id+'">';
    }
    else
    {
      gridList = gridList + '<li class="title hotelRating"><div class="reviews" id="Rev'+results[i].place_id+'">';
    }
    
    if(!(typeof results[i].price_level === "undefined"))
    {
      for(var j=0;j<parseInt(results[i].price_level);j++)
      {
        abc = abc + '$';
      }
      gridList = gridList + '<div class="title hotelPrice"> </div>';
    }
    else
    {
      gridList = gridList + '<div class="title hotelPrice"> </div>';
    }
    
    gridList = gridList + '</div></li>';

    

    var arr_addr=results[i].vicinity.split(",");
    var index = '';  // Gets the first index where a space occours
    var id = ''; // Gets the first part
    var text = '';

    if(arr_addr.length >= 4)
    {
      id = arr_addr[0]; // Gets the first part
      text = arr_addr[1];
    }
    else
    {
      index = results[i].vicinity.lastIndexOf(',');  // Gets the first index where a space occours
      id = results[i].vicinity.substr(0, index); // Gets the first part
      index = id.lastIndexOf(',');
      id = id.substr(0, index);
      text = id.substr(index + 1);
    }
   
    gridList = gridList + '<li class="title hotelAdd" ><div>'+id+'</div></li>';
    gridList = gridList + '<li class="title hotelAdd" > <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+results[i].place_id+'">'+distance+'&nbsp;away</div></li>';
    if(!(typeof results[i].opening_hours === "undefined"))
    {
      if(results[i].opening_hours.open_now)
      {
        gridList = gridList + '<li class="title hotelstatus"></li>';
      }
      else
      {
        gridList = gridList + '<li class="title hotelstatus"></li>';
      }
    }
    
    gridList = gridList + '</ul></div></a></div>';
    
    gridList = gridList + '<div class="listImage col-sm-1 col-xs-1 paddingzero" id="'+i+'" onClick="javascript:itineraries(this); return false;"><div class="readMore"><button type="button" class="btn btn-primary btn-xs" >+</button></div></div></div>';
  }
  
  var Tabs_='';
  Tabs_ = Tabs_ + '<div class="mainCatagory List_cat container-fluid paddingzero">';
  Tabs_ = Tabs_ + '<div class="panel-group" id="accordion1">';
  Tabs_ = Tabs_ + '<div class="panel panel-default">';
  Tabs_ = Tabs_ + '<div class="panel-heading hed eatPanel">';
  Tabs_ = Tabs_ + '<div class="col-sm-12 col-xs-12 paddingzero paddingCattb">';
  Tabs_ = Tabs_ + '<h4 class="panel-title">';
  Tabs_ = Tabs_ + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion1" href="#Google_result">';
  //Tabs_ = Tabs_ + '<div class="col-sm-3 col-xs-3 catpadingicon"> </div>';
  Tabs_ = Tabs_ + '<div class="col-sm-10 col-xs-10 paddingzero center heading">';
  Tabs_ = Tabs_ + 'Click to see more';
  Tabs_ = Tabs_ + '</div>';
  Tabs_ = Tabs_ + '</a>';
  Tabs_ = Tabs_ + '</h4>';
  Tabs_ = Tabs_ + '</div>';
  Tabs_ = Tabs_ + '</div>';
  Tabs_ = Tabs_ +'<div id="Google_result" class="panel-collapse collapse">';
  Tabs_ = Tabs_ + '<div class="panel-body" id="GeneralTab">';
  var tabs_1='';
  tabs_1 = tabs_1 + '</div>';
  tabs_1 = tabs_1 + '</div>';
  tabs_1 = tabs_1 + '</div>';
  tabs_1 = tabs_1 + '</div>';
  tabs_1 = tabs_1 + '</div>';
  //alert(gridList);
  if(HasNextPage=="true")
  {
    if(interval<3)
    {
      document.getElementById("GeneralTab").innerHTML=document.getElementById("GeneralTab").innerHTML + gridList + '<div class="col-sm-12 col-xs-12 clickToMore" onClick="javascript:Load_More_tab(); return false;">Click To See More</div>';
    }
    else
    {
      document.getElementById("GeneralTab").innerHTML=document.getElementById("GeneralTab").innerHTML + gridList;
    }
  }
  else
  {
    //document.getElementById("selected_site_list").innerHTML= Tabs_ + gridList + '<div class="col-sm-12 col-xs-12 clickToMore" onClick="javascript:Load_More_tab(); return false;">Click To See More</div>' + tabs_1;
    document.getElementById("selected_site_list").innerHTML= "";
  }
 
  if(Category_prop.length <= 0)
  {
    $.LoadingOverlay("hide");
  }
 
  //console.log(servar_res);
  var place_id_array=[];
  var option="0";
 
    if(Category_prop.length != 0)
    {
      arr = new Array(Category_prop.length);
      for (var j = 0; j < Category_prop.length; j++)
      {
       
        var abc=categories[Category_prop[j].toLowerCase()];
        if(typeof abc == "undefined")
        {
          abc=Category_prop[j].toLowerCase();
        }
       	var catIndex=Category_prop[j].indexOf('/');
       	if(catIndex > 0)
       	{
       	  Category_prop[j]=Category_prop[j].replace("/", "_");
       	}

        var myElem = document.getElementById(Category_prop[j].toLowerCase());
        if (myElem != null) continue;

        Category_prop[j]=Category_prop[j].toLowerCase();
        category_In_Grid = category_In_Grid + '<div class="mainCatagory List_cat container-fluid paddingzero" id="accord_'+Category_prop[j]+'">';
        category_In_Grid = category_In_Grid + '<div class="panel-group" id="accordion">';
        category_In_Grid = category_In_Grid + '<div class="panel panel-default" id="'+Category_prop[j].toLowerCase()+'">';
        category_In_Grid = category_In_Grid + '<div class="panel-heading hed eatPanel">';
        category_In_Grid = category_In_Grid + '<div class="col-sm-12 col-xs-12 paddingzero paddingCattb">';
        category_In_Grid = category_In_Grid + '<h4 class="panel-title">';
        category_In_Grid = category_In_Grid + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#PanelCollapse_'+Category_prop[j]+'">';
        category_In_Grid = category_In_Grid + '<div class="col-sm-10 col-xs-10 paddingzero center heading">';
        category_In_Grid = category_In_Grid + abc;
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</a>';
        category_In_Grid = category_In_Grid + '</h4>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid +'<div id="PanelCollapse_'+Category_prop[j].toLowerCase()+'" class="panel-collapse collapse">';
        category_In_Grid = category_In_Grid + '<div class="panel-body panel_scroll_end" id="collapse_'+Category_prop[j]+'">';
        category_In_Grid = category_In_Grid + '<div class="col-sm-12 col-xs-12 paddingzero" style="display:none;"> <div class="col-sm-2 col-xs-2 paddingzero"></div> <div class="col-sm-8 col-xs-8 paddingzero paddingtb Seemore_tab_listing" id="SeeMore_'+Category_prop[j]+'" onclick="SeeMoreInfo('+Category_prop[j]+')">Click here to see more</div><div class="col-sm-2 col-xs-2 paddingzero"></div></div>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</div>';
        category_In_Grid = category_In_Grid + '</div>';
        var ind=arr.indexOf(Category_prop[j].toLowerCase());
        loop=1;
        if(ind == -1 && Category_prop[j] != "")
        {
          arr[j] =Category_prop[j].toLowerCase();
          document.getElementById("selected_site_list1").innerHTML= category_In_Grid+document.getElementById("selected_site_list1").innerHTML;
          
        }
        else
        {
          arr[j] =Category_prop[j].toLowerCase();
        }
        category_In_Grid='';
        $('.panel').on('show.bs.collapse', function (e) {
                   //alert(e.currentTarget.id);
                   $.LoadingOverlay("show");
                   if(e.currentTarget.id == "")
                   {
                    $.LoadingOverlay("hide");
                      return;
                   }
                   
                   //$.LoadingOverlay("show");
                   No=1;
                   var id=e.currentTarget.id; 
                   
                   var count = $('#collapse_'+id).children().length;
                   //alert(count);
                   if(count>2)
                   {
                      $.LoadingOverlay("hide");
                       return;
                    }   
                       
                   			//$("#SeeMore_"+id).parent().css('display', 'none');
                   			//$("#Loader"+id).show();
                   			var catIndex=id.indexOf('_');
                   			if(catIndex > 0)
                   			{
                          id=id.replace('_', '/');
                   			}
                       $.ajax({
                              type: 'GET',
                              url: site_url+'site/getSelectedPlace?',
                              contentType: "application/json",
                              dataType: 'jsonp',
                              jsonp: 'callback',
                              data: {
                                            Category : id.toString()
                              },
                              beforeSend : function(){
                                              //$("#loader_image").css("display","block");
                              },
                              crossDomain: true,
                              success: function(res) {
                                            console.log(res);
                                            if(res != "no-data")
                                            {
                                            	 //$("#SeeMore_"+id).parent().hide();
                                              for (var i=0; i < res.length; i++)
                                              {
                                          						if(place_id_list.indexOf(res[i].PlaceIds) < 0)
                                          						{
                                             					if(!(typeof res[i].LatLng === "undefined"))
                                             					{
                                            								var myObj = JSON.parse(res[i].LatLng);
                                            								if(i+1 == res.length)
                                            								{
                                             								Stored_On_server(res[i].PlaceIds,myObj.H,myObj.L,id,res[i].Detail,true);
                                            								}
                                            								else{
                                              							Stored_On_server(res[i].PlaceIds,myObj.H,myObj.L,id,res[i].Detail,false);
                                            								}
                                          								}
                                          						}
                                         							else if(i+1 >= res.length)
                                          						{
                                            						//$("#Loader"+id).hide();
                                                		   // $("#SeeMore_"+id).parent().hide();
                                          						}
                                              }
                                            }
                                            else
                                            {
                                								//$('#accord_'+id).hide();
                                								$.LoadingOverlay("hide");
                                								//$("#Loader"+id).hide();
                                								//$("#SeeMore_"+id).parent().html('<div class="col-sm-2 col-xs-2 paddingzero"></div> <div class="col-sm-8 col-xs-8 paddingzero paddingtb reset_tab_">Sorry no places found for this category.</div><div class="col-sm-2 col-xs-2 paddingzero"></div>');
                                     				}
                              },
                              error: function(e) {
                                            console.log(e.message);
                              },
                              complete: function(data) {
                                //$("#Loader"+id).hide();
                                //$.LoadingOverlay("hide");
                              }
                      });
        });
      }
            
    }else{$.LoadingOverlay("hide");}
 
    $('#selected_site_list1 .panel_scroll_end').bind('scroll', chk_scroll);
}

function SeeMoreInfo(abc)
{
  var id=abc;
 	var catIndex=id.indexOf('_');
  
 	if(catIndex > 0)
 	{
 	 var category=id.split("_");
   id = category[1];
 	}

  $.ajax({
        type: 'GET',
        url: site_url+'site/getSelectedPlace?',
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
          Category : id.toString()
        },
        beforeSend : function(){
          //$("#loader_image").css("display","block");
        },
        crossDomain: true,
        success: function(res) {
          if(res != "no-data")
          {
          	No=1;
            for (var i=0; i < res.length; i++)
            {
              if(place_id_list.indexOf(res[i].PlaceIds) < 0)
              {
                if(!(typeof res[i].LatLng === "undefined"))
                {
                  var myObj = JSON.parse(res[i].LatLng);
                  if(i+1 == res.length)
                  {
                      Stored_On_server(res[i].PlaceIds,myObj.H,myObj.L,id,res[i].Detail,true);
                  }
                  else
             					{
                      Stored_On_server(res[i].PlaceIds,myObj.H,myObj.L,id,res[i].Detail,false);
                  }
                }
              }
              else if(i+1 >= res.length)
              {
              		//$("#Loader"+id).hide();
                  //$("#SeeMore_"+id).parent().hide();
              }
            }
          }
          else
          {
              $.LoadingOverlay("hide");
          }
        },
        error: function(e) {
            console.log(e.message);
        },
        complete: function(data) {
            //$("#Loader"+id).hide();
            //$.LoadingOverlay("hide");
        }
   });
}

function Load_More_tab()
{
  if(types_prop.length >0)
  {
    if (pagination_.hasNextPage)
    {
      $(".clickToMore").remove();
      if(interval<3){
        interval=interval+1;
        HasNextPage="true";
        pagination_.nextPage();
      }
      else
      {
        $(".clickToMore").remove();
      }
    }
    else
    {
      $(".clickToMore").remove();
    }
  }
}




function Stored_On_server(Id_Places,LAT,LON,j_id,detaliObj,End_flag)
{
  var catIndex=j_id.indexOf('/');
  if(catIndex > 0)
  {
    j_id=j_id.replace("/", "_");
  }
 
  var current = new google.maps.LatLng(mylat,mylong);
  var destination = new google.maps.LatLng(LAT,LON);
  var miles = parseFloat(document.getElementById('ex1').value);
  service_d.getDistanceMatrix(
                              {
                              origins: [current], //LatLng Array
                              destinations: [destination], //LatLng Array
                              travelMode: google.maps.TravelMode.DRIVING,
                              unitSystem: google.maps.UnitSystem.IMPERIAL,
                              avoidHighways: false,
                              avoidTolls: false
                              }, callback_Dis);
 
  function callback_Dis(response, status)
  {
    if (status === google.maps.DistanceMatrixStatus.OK)
    {
      var results_ele = response.rows[0].elements;
     
      if(!(typeof results_ele[0] === "undefined"))
      {
        element = results_ele[0];
        if(!(typeof element.distance === "undefined"))
        {
          distance = element.distance.text;
          var D_str = distance.indexOf(' ');
          var str_d = distance.substr(0,D_str);
          var mil = parseFloat(str_d.replace(/,/g , ""));
          if(parseFloat(mil) <= parseFloat(miles))
          {
            if(No>30)
            {
              //$.LoadingOverlay("hide");
              Grid_Add('full',null,null,null,j_id,null,true);
              return;
            }
            place_id_list.push(Id_Places);
            loop=loop+2;
            No++;
            Delay(distance,Id_Places,LAT,LON,j_id,detaliObj,End_flag,loop);
          }
          else
          {
            if(End_flag == true)
            {
              setTimeout(function(){
                         //$("#Loader"+j_id).hide();
                         var count = $('#collapse_'+j_id).children().length;
                         Grid_Add(null,Id_Places,LAT,LON,j_id,detaliObj,End_flag);
                        }, 10);
            }
          }
        }
        else
        {
          Grid_Add(null,Id_Places,LAT,LON,j_id,detaliObj,End_flag);
        }
      }
      else
      {
        Grid_Add(null,Id_Places,LAT,LON,j_id,detaliObj,End_flag);
      }
    }
    else
    {
      distance="";
      loop=loop+2;
      No++;
      Delay(distance,Id_Places,LAT,LON,j_id,detaliObj,End_flag,loop);
    }
  }
  if(End_flag == true)
  {
    //("#Loader"+j_id).hide();
    //$("#SeeMore_"+j_id).parent().hide();
  }
}

function Delay(distance,Id_Places,LAT,LON,j_id,detaliObj,End_flag,loop)
{
  setTimeout(function(){
             Grid_Add(distance,Id_Places,LAT,LON,j_id,detaliObj,End_flag);
             }, 10);
}

function show_places(miles,j_id)
{
  var total = $('.single_library_container').length;
  var ct=1;
  $('.single_library_container').each(function()
  {
      $(this).fadeIn('slow',function(){}); 
      $(this).css('opacity','1');
      $(this).show();
      ct++;
      if(ct == total)
      {
        setTimeout(function(){
            if(miles == 'full')
            {
              //$("#SeeMore_"+j_id).parent().css('display', 'block');
            }
            $.LoadingOverlay("hide");
        },300);
      }
  });
}

function Grid_Add(miles,Id_Places,LAT,LON,j_id,detaliObj,End_flag)
{
  var display = 'style="display:none;"';
  if(End_flag == true || miles == null || miles == 'full')
  {
    if(End_flag == true)
    {    
      display="";	
      setTimeout(function(){
        show_places(miles,j_id);
      },2000);
    }
    if(miles == null || miles == 'full')
    {
      setTimeout(function(){
        show_places(miles,j_id);
      },2000);
      return;
    }
  }
 
  var gridList='';
 
  var abc ='';
  //console.log(detaliObj);
  var parse=JSON.parse(detaliObj);
 
 
  var detail=detaliObj;
  //console.log(detail);
  if(detail === 'undefined')
  {
    return;
  }
  //alert(parse.type);

  if(typeof miles === 'undefined' || miles == '')
  {
    return;
  }
  console.log(miles);
  var numb = miles.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); });
  //alert (numb);
 
  if(parse.type == "Events")
  {
    gridList = gridList + '<div class="single_library_container paddingzero col-sm-12 col-xs-12 dealsList '+Id_Places+'" id="List_'+ Id_Places +'" data-sort="'+numb+'" '+display+'><input type="hidden" name="Place_Id" value="'+Id_Places+'"/><input type="hidden" id="Lat_'+Id_Places+'"  value="'+LAT+'"/><input type="hidden" id="Log_'+Id_Places+'" value="'+LON+'"/>';
  
  if(!(typeof parse.profileimage === "undefined") && parse.profileimage.length > 0)
  { 
    var img=parse.profileimage;
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img);
    gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else if(!(typeof parse.Path === "undefined") && parse.Path.length > 0)
  {
    var img=parse.Path.split(",");
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[0]);
    gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else
  {
   gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" src="images/default.jpg" /></div>';
  }
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtop DandETitle"> '+parse.name+'</div>';
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12"> '+parse.address+'</div>';
  
  if(parse.price !='')
  {
   gridList = gridList +'<div class="col-sm-12 col-xs-12 bold font-size17">Only&nbsp;&nbsp; '+parse.price+'</div>';
  }
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingzero">';
  
  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
  if (base64Matcher.test(parse.about)) 
  {
    gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtb10 more"> '+ atob(parse.about) +'</div>';
  }
  else
  {
    gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtb10 more">'+parse.about+'</div>';
  }
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingb">';
  //gridList = gridList +'<div class="col-sm-2 col-xs-2 paddingzero dealDiscout paddingt9"> '+parse.discount+'%</div>';
  if(parse.price != '')
  {
    gridList = gridList +'<div class="col-sm-4 col-xs-4 paddingzero hourTime "><div class="btn btn-primary">Get Tickets</div></div>';
  }
  else
  {
    gridList = gridList +'<div class="col-sm-4 col-xs-4 paddingzero openClose hourTime "></div>';
  }
  
  gridList = gridList +'<div class="col-sm-8 col-xs-8 paddingzero paddingt9 DandETitle"></div>';
  gridList = gridList + '</div>';
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingb Lisdisclaimer">Prices subject to change at anytime.</div>';
   
  
  gridList = gridList + '</div>';
  
  gridList = gridList + '</div>';
 }
 else if(parse.type != "Deals")
 {
  gridList = gridList + '<div class="single_library_container col-sm-12 col-xs-12 '+Id_Places+'" id="List_'+ Id_Places +'" data-sort="'+numb+'" '+display+'><input type="hidden" name="Place_Id" value="'+Id_Places+'"/><input type="hidden" id="Lat_'+Id_Places+'"  value="'+LAT+'"/><input type="hidden" id="Log_'+Id_Places+'" value="'+LON+'"/><div id="Add_'+Id_Places+'" style="display:none;">'+parse.address+'</div><textarea id="DetailLog_'+Id_Places+'" style="display:none;">'+detaliObj+'</textarea>';
  
  gridList = gridList + '<div class="listDescription col-sm-11 col-xs-11 paddingzero" id="'+ Id_Places +'" onClick="javascript:Detail(this,true); return false;"><a id="selectedSiteListImage_'+Id_Places+'">';
  //console.log(parse.Path);
  if(!(typeof parse.profileimage === "undefined") && parse.profileimage.length > 0)
  {
    var img=parse.profileimage;
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img);
   
    gridList = gridList + '<div class="listImage col-sm-5 col-xs-5 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else if(!(typeof parse.Path === "undefined") && parse.Path.length > 0)
  {
    var img=parse.Path.split(",");
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[0]);
   
    gridList = gridList + '<div class="listImage col-sm-5 col-xs-5 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else
  {
   gridList = gridList + '<div class="listImage col-sm-5 col-xs-5 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="images/default.jpg" /></div>';
  }
  
  gridList = gridList + '<div class="listDescription col-sm-7 col-xs-7 paddingzero"><ul class="site-desc">';
  
  gridList = gridList + '<li class="title hotelName" id="Place_name'+Id_Places+'"> '+parse.name+'';
  
  gridList = gridList + '<span id="Distance'+Id_Places+'"></span></li>';
  
  if(1 == 2)
  {
    //!(typeof place.rating === "undefined")
    gridList = gridList+ '<li class="title hotelRating">';
    st=parseInt(0);
    var st1='';
    var jk=0;
    st=parseInt(0);
    while(parseInt(jk)<parseInt(st))
    {
      jk++;
      st1=st1+'<img class="desimage img-responsive" src="images/Star.png" />';
    }
    if((parseFloat(0)-st)>0.5)
    {
      st1=st1+'<img class="desimage img-responsive" src="images/Star.png" />';
    }
    else if((parseFloat(0)-st)<0.5 && (parseFloat(0)-st)>0.0)
    {
      st1=st1+'<img class="desimage img-responsive" src="images/Star-Half.png" />';
    }
    gridList = gridList+ '<div class="mainStars">'+st1+'</div><div class="reviews" id="Rev'+Id_Places+'">';
  }
  else
  {
   gridList = gridList + '<li class="title hotelRating"><div class="reviews" id="Rev'+Id_Places+'">';
  }
  
  if(!(typeof 1 === "undefined"))
  {
   for(var j=0;j<parseInt(1);j++)
   {
    abc = abc + '$';
   }
   gridList = gridList + '<div class="title hotelPrice"> </div>';
  }
  else
  {
   gridList = gridList + '<div class="title hotelPrice"> </div>';
  }
  
  gridList = gridList + '</div></li>';
  
  var arr_addr=parse.address.split(",");
  var index = '';  // Gets the first index where a space occours
  var id = ''; // Gets the first part
  var text = '';

    if(arr_addr.length >= 4)
    {
      id = arr_addr[0]; // Gets the first part
      text = arr_addr[1];
    }
    else
    {
      index = parse.address.lastIndexOf(',');  // Gets the first index where a space occours
      id = parse.address.substr(0, index); // Gets the first part
      index = id.lastIndexOf(',');

      text = id.substr(index + 1);
      
      var temp=id.indexOf(',');
      if(temp >= 0)
      {
       id = id.substr(temp + 1);
      }
    }
  
  gridList = gridList + '<li class="title hotelAdd"> <div>'+id+'</div></li>';
  
  gridList = gridList + '<li class="title hotelAdd"><div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+Id_Places+'">'+miles+'&nbsp;away</div></li>';
  
  gridList = gridList +  '</ul></div></a></div>';
  
  gridList = gridList + '<div class="listImage col-sm-1 col-xs-1 paddingzero" onClick="javascript:itineraries(this); return false;"><div class="readMore"><button type="button" class="btn btn-primary btn-xs" >+</button></div></div></div>';
 }
 else
 {
  gridList = gridList + '<div class="single_library_container paddingzero col-sm-12 col-xs-12 dealsList '+Id_Places+'" id="List_'+ Id_Places +'" data-sort="'+numb+'" '+display+'><input type="hidden" name="Place_Id" value="'+Id_Places+'"/><input type="hidden" id="Lat_'+Id_Places+'"  value="'+LAT+'"/><input type="hidden" id="Log_'+Id_Places+'" value="'+LON+'"/>';
  
  if(!(typeof parse.profileimage === "undefined") && parse.profileimage.length > 0)
  { 
    var img=parse.profileimage;
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img);
    gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else if(!(typeof parse.Path === "undefined") && parse.Path.length > 0)
  {
    var img=parse.Path.split(",");
    var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[0]);
    gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else
  {
   gridList = gridList + '<div class="listImage col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive Full" src="images/default.jpg" /></div>';
  }
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtop DandETitle"> '+parse.name+'</div>';
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12"> '+parse.address+'</div>';
  gridList = gridList +'<div class="col-sm-12 col-xs-12 bold font-size17">Only&nbsp;&nbsp;'+parse.price+'</div>';
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingzero">';
  
  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
  if (base64Matcher.test(parse.about)) 
  {
    gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtb10 more"> '+atob(parse.about)+'</div>';
  }
  else
  {
    gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingtb10 more"> '+parse.about+'</div>';
  } 
  
  gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingb">';
  //gridList = gridList +'<div class="col-sm-2 col-xs-2 paddingzero dealDiscout paddingt9"> '+parse.discount+'%</div>';
  if(parse.price != '')
  {
    gridList = gridList +'<div class="col-sm-4 col-xs-4 paddingzero hourTime "><div class="btn btn-primary">Buy Deals</div></div>';
  }
  else
  {
    gridList = gridList +'<div class="col-sm-4 col-xs-4 paddingzero openClose hourTime "></div>';
  }
  gridList = gridList +'<div class="col-sm-8 col-xs-8 paddingzero paddingt9 DandETitle"></div>';
  

  gridList = gridList + '</div>';
    if(parse.price != '')
  {
    gridList = gridList +'<div class="col-sm-12 col-xs-12 paddingb Lisdisclaimer">Prices subject to change at anytime.</div>';
  }
  gridList = gridList + '</div>';
  gridList = gridList + '</div>';
  
 }
 
 
 var id='collapse_'+j_id;
 //console.log(id);
 document.getElementById(id).innerHTML= gridList+document.getElementById(id).innerHTML;
 
 var list = $("#"+id);
 //var listItems = list.find('div').sort(function(a,b){ return $(a).attr('data-sort') - $(b).attr('data-sort'); });
 //list.find('div').remove();
 //list.append(listItems);
 id='#'+id;
 var mylist = $(id);
 
 var listitems = mylist.children('div').get();
 
 listitems.sort(function(a, b) {
                return  $(a).attr('data-sort') - $(b).attr('data-sort');
                });

 
 showMoreText();
 $.each(listitems, function(index, item) {
        mylist.append(item);
        });
 
 //mylist.append($("#SeeMore_"+j_id).parent());
 //alert(End_flag);
 if(End_flag == true)
 {
  setTimeout(function(){
             $.LoadingOverlay("hide");
             //
             }, 200*loop);
  $('.single_library_container').each(function(){
      $(this).show();
  });
  
 }
 
}

function Detail_EventCall(tthis,flag)
{

 var url = site_url+'site/getSelectedPlaceDetail?';
 PlaceId_Detail = tthis.previousSibling.innerHTML;
 Detail_event(tthis,true);
 return;
 alert(PlaceId_Detail);
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
        selected_places : PlaceId_Detail
        },
        beforeSend : function(){
        //$("#visited_site_list").html('');
        //$("#loader_image").css("display","block");
        },
        crossDomain: true,
        
        success: function(res) {
        alert(JSON.stringify(res));
        if(res[1]!= "no-data")
        {
        
        var parse=JSON.parse(res[1].Detail);
        var detail=[];
        
        detail.push(parse.about);
        detail.push(res[1].Category);
        
        Detail_event(tthis,detail);
        }
        else
        {
        //res_list_server=res;
        //List_Load();
        //swal("No data found on the server");
        }
        },
        error: function(e) {
        console.log(e.message);
        },
        complete: function(data) {
        //alert(data.message);
        //console.log(data.message);
        }
        });
}


function Detail_server(tthis,flag)
{
  var url = site_url+'site/getSelectedPlaceDetail?';
  PlaceId_Detail = tthis.id;
  $.ajax({
         type: 'GET',
         url: url,
         contentType: "application/json",
         dataType: 'jsonp',
         jsonp: 'callback',
         data: {
         selected_places : PlaceId_Detail
         },
         beforeSend : function(){
         //$("#visited_site_list").html('');
         //$("#loader_image").css("display","block");
         },
         crossDomain: true,
         
         success: function(res) {
         if(res['0']!= "no-data")
         {
         //alert(JSON.stringify(res));
         var parse=JSON.parse(res[0].Detail);
         var detail=[];
         
         detail.push(parse.about);
         detail.push(res[0].Category);
         
         Detail(tthis,detail);
         }
         else
         {
         res_list_server=res;
         List_Load();
         //swal("No data found on the server");
         }
         },
         error: function(e) {
         console.log(e.message);
         },
         complete: function(data) {
         //alert(data.message);
         //console.log(data.message);
         }
         });
}


function Detail_event(tthis,flag){
 
 
 //alert($(tthis).parent().attr('id'));
 //var Server_detail =[];
 var PlaceId_Detail='';
 if(flag == true)
 {
  PlaceId_Detail = tthis.id;
 }
 else if(flag == false)
 {
  var temp_val = $(tthis).parent().attr('id');
  var index_temp = temp_val.indexOf('_');
  PlaceId_Detail = temp_val.substr(index_temp+1);
 }
 else
 {
  PlaceId_Detail=tthis.id;
 // Server_detail=flag;
  flag = true;
 }
 //alert(PlaceId_Detail);
 //return;
 service = new google.maps.places.PlacesService(map);
 var text_img='';
 var diff;
 var no=-1;

                    
                    var d = new Date();
                    
                    
                    
                    var day='';
                    
                    
                    var Detail_event = JSON.parse(document.getElementById("DetailLog_"+PlaceId_Detail).value);
                    
                    
                    
                    detail_Id = PlaceId_Detail;
                    var Distance_Info = '';
                    
                    if(!(typeof document.getElementById("Distance"+detail_Id+"") === "undefined") && document.getElementById("Distance"+detail_Id+"") != null)
                    {
                    Distance_Info=document.getElementById("Distance"+detail_Id+"").innerHTML;
                    }
                    
                    var price='';
                    var abc='';
                    
                    abc=abc+ '<div class="ListdetailView">';
                    
                    // Slider code start here
                    abc=abc+ '<div id="myCarousel" class="carousel slide" data-ride="carousel">';
                    abc=abc+'<div class="carousel-inner" role="listbox">';
                    //console.log(Detail_event);
                    if(!(typeof Detail_event === "undefined"))
                    {
                        var img=Detail_event.Path.split(",");
                        for(var k=0;k<img.length;k++)
                        {
                          if(k==0)
                          {
                            abc=abc+'<div class="item active">';
                            var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" id="Place_Image'+place.place_id+'" src="'+path+'" /></div>';
                            abc=abc+ '</div>';
                          }
                          else
                          {
                            abc=abc+'<div class="item">';
                            var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" id="Place_Image'+place.place_id+'" src="'+path+'" /></div>';
                            abc=abc+ '</div>';
                          }
                        } 
                    }
                    else
                    {
                    abc=abc+'<div class="item active">';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
                    abc=abc+ '</div>';
                    }
                    abc=abc+ '</div>';
                    
                    // Left controls
                    abc=abc+'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
                    abc=abc+'<span class="fa fa-angle-left" aria-hidden="true"></span>';
                    abc=abc+'<span class="sr-only">Previous</span>';
                    abc=abc+'</a>';
                    // right controls
                    abc=abc+'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
                    abc=abc+'<span class="fa fa-angle-right" aria-hidden="true"></span>';
                    abc=abc+'<span class="sr-only">Next</span>';
                    abc=abc+'</a>';
                    
                    abc=abc+ '</div>';
                    // Slider code End here
                    //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero">';
                    //alert(Detail_event);
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero detailplaceName" id="Place_name_'+detail_Id +'"> '+Detail_event.name+'</div>';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+Detail_event.address+'</div>';
                    var dt=document.getElementById('DateTime_'+detail_Id).innerHTML;
                    
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">'+dt+'</div>';
                    //abc=abc+'</div>';
                    abc=abc+ '<div class="site-desc paddingzero container-fluid">';
                    
                    //Code for tabs start here
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero center paddingtb listDetailssocialCalls">';
                    abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero"> ';
                    
                    if(!(typeof Detail_event.phone === "undefined"))
                    {
                    //first= "("+first+") "+sec;
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+Detail_event.phone+'"><img src="images/technology.svg" height="21" width="21"/></a></div>';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+Detail_event.phone+'">'+Detail_event.phone+'</a></div>';
                    }
                    else
                    {
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a></a></div>';
                    }
                    abc=abc+ '</div>';
                    abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero">';
                    if(!(typeof Detail_event.Website === "undefined"))
                    {
                    WebLink=Detail_event.Website;
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();"><img src="images/connection.svg" height="21" width="21"/></div>';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();">Website</div>';
                    }
                    else
                    {
                    WebLink="";
                    abc=abc+ '';
                    }
                    abc=abc+ '</div>';
                    
                    abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero"> ';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="images/plus.svg" height="21" width="21"/></a></div>';
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Add to Tour</div>';
                    abc=abc+ '</div>';

                    abc=abc+ '</div>';
                    
                    if(Detail_event.about)
                    {
                      alert(Detail_event.about);
                        var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
                        if (base64Matcher.test(Detail_event.about)) 
                        {
                           abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary"> '+ atob(Detail_event.about) +'</div>';
                        }
                        else
                        {
                          abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary"> '+ Detail_event.about +'</div>';
                        }
                    }
                    else
                    {
                    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary"> Sorry, place details are not available. </div>';
                    }
                    //code for tabs end here
                    
                    //accordian for detaild section
                    //abc=abc+ '<div class="panel-group" id="accordionDetail"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse1"> Collapsible Group 1</a></h4></div><div id="collapse1" class="panel-collapse collapse in"><div class="panel-body PanelBody" ><div class="Paneldiv" style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse2"> Collapsible Group 2</a></h4></div><div id="collapse2" class="panel-collapse collapse"><div class="panel-body PanelBody"><div class="Paneldiv"  style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse3"> Collapsible Group 3</a></h4></div><div id="collapse3" class="panel-collapse collapse"><div class="panel-body PanelBody"><div class="Paneldiv"  style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div></div>';
                    
                    
                    abc=abc+ '</div>';
                    abc=abc+ '</div>';
                    document.getElementById("selected_site_Detail").innerHTML= abc;
                    
                    
                    if(Tour_List.length >1)
                    {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                    else
                    {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                    $('#ListDetail').show();
                    $('#nearByPlace').hide();
                    $('#mapCanvas').hide();
                    
                    if(flag == true)
                    {
                    $("#DetailBackButton").attr("onclick","goToNearByPlace()");
                    }
                    else
                    {
                    $("#DetailBackButton").attr("onclick","GoToItinerary()");
                    }
                    
                  
}



//function shows detil informtion about selected place also it contains structure of the details/profile sceen.
function Detail(tthis,flag){
  var dt;
  // var Server_detail =[];
  var PlaceId_Detail='';
  if(flag == true)
  {
    PlaceId_Detail = tthis.id;
  }
  else if(flag == false)
  {
    var temp_val = $(tthis).closest('.ALL_Places_Tour').attr('id');
    var index_temp = temp_val.indexOf('_');
    PlaceId_Detail = temp_val.substr(index_temp+1);
  }
  else if(flag='MAP'){
   var temp_val = $(tthis).parent().attr('id');
   var index_temp = temp_val.indexOf('_');
   PlaceId_Detail = temp_val.substr(index_temp+1);
   
  }
  else
  {
    PlaceId_Detail=tthis.id;
    // Server_detail=flag;
    flag = true;
  }
  //alert($("#DetailLog_"+PlaceId_Detail).val());
  //return;
  var myElem = document.getElementById("DetailLog_"+PlaceId_Detail);
  if (myElem === null)
  {
   dt='';
  }
  else
  {
    dt=JSON.parse($("#DetailLog_"+PlaceId_Detail).val());
  }

  service = new google.maps.places.PlacesService(map);
  var text_img='';
  var diff;
  var no=-1;
  
                     
                     var d = new Date();
                     
                     
                     
                     detail_Id = PlaceId_Detail;
                     var Distance_Info = '';
                     
                     if(!(typeof document.getElementById("Distance"+PlaceId_Detail+"") === "undefined") && document.getElementById("Distance"+PlaceId_Detail+"") != null)
                     {
                     Distance_Info=document.getElementById("Distance"+PlaceId_Detail+"").innerHTML;
                     }
                     
                     var price='';
                     var abc='';
                     
                     abc=abc+ '<div class="ListdetailView">';
                     
                     // Slider code start here
                     abc=abc+ '<div id="myCarousel" class="carousel slide" data-ride="carousel">';
                     abc=abc+'<div class="carousel-inner" role="listbox">';
                     if(typeof dt.Path != "undefined")
                     {
                      if(dt.Path.length > 0)
                      {
                        var img=dt.Path.split(",");
                        for(var k=0;k<img.length;k++)
                        {
                          if(k==0)
                          {
                            var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
                            abc=abc+'<div class="item active">';
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
                            abc=abc+ '</div>';
                          }
                          else
                          {
                            var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
                            abc=abc+'<div class="item">';
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
                            abc=abc+ '</div>';
                          }
                        }
                      }
                      else
                      {
                        abc=abc+'<div class="item active">';
                        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
                        abc=abc+ '</div>';
                      }
                     }
                     else
                     {
                       abc=abc+'<div class="item active">';
                       abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
                       abc=abc+ '</div>';
                     }
                     abc=abc+ '</div>';
                     
                     // Left controls
                     abc=abc+'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
                     abc=abc+'<span class="fa fa-angle-left" aria-hidden="true"></span>';
                     abc=abc+'<span class="sr-only">Previous</span>';
                     abc=abc+'</a>';
                     // right controls
                     abc=abc+'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
                     abc=abc+'<span class="fa fa-angle-right" aria-hidden="true"></span>';
                     abc=abc+'<span class="sr-only">Next</span>';
                     abc=abc+'</a>';
                     
                     abc=abc+ '</div>';
                     var index='',addr='';
                     // Slider code End here
                     if(!typeof dt.address === 'undefined')
                     {
                        var arr_addr=dt.address.split(",");
                        var index = '';  // Gets the first index where a space occours
                        var id = ''; // Gets the first part
                        var text = '';

                        if(arr_addr.length >= 4)
                        {
                          addr = arr_addr[0]; // Gets the first part
                          text = arr_addr[1];
                        }
                        else
                        {
                          index = dt.address.lastIndexOf(',');  // Gets the first index where a space occours
                          addr = dt.address.substr(0, index); // Gets the first part
                          index = addr.lastIndexOf(','); 
                          addr = addr.substr(0, index);
                          var temp=addr.indexOf(',');
                          if(temp >= 0)
                          {
                            addr = addr.substr(temp + 1);
                          }
                        }
                     }
                     //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero">';
                     abc=abc+'<div class="listDetailHeader">';
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero detailplaceName"> '+dt.name+'</div>';
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+addr+'</div>';
                     
            
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">Hours today : - </div>';
                     //abc=abc+'</div>';

                     
                     abc=abc+'</div>';
                     abc=abc+ '<div class="site-desc paddingzero container-fluid">';
                     
                     //Code for tabs start here
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero center paddingtb listDetailssocialCalls">';
                     abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero"> ';
                     if(!(typeof dt.phone === "undefined"))
                     {
                          var phone=dt.phone;
                          //first= "("+first+") "+sec;
                          abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'"><img src="images/technology.svg" height="21" width="21"/></a></div>';
                          abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'">Phone</a></div>';
                     }
                     else
                     {
                          abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a></a></div>';
                     }
                     abc=abc+ '</div>';
                     abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero">';
                     if(!(typeof dt.Website === "undefined"))
                     {
                        WebLink=dt.Website;
                        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();"><img src="images/connection.svg"  height="21" width="21"/></div>';
                        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();">Website</div>';
                     }
                     else
                     {
                        WebLink="";
                        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a ></a> </div>';
                     }
                     abc=abc+ '</div>';
                     
                     abc=abc+ '<div class="col-sm-4 col-xs-4 paddingzero"> ';
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="images/plus.svg" height="21" width="21"/></a></div>';
                     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Add to Tour</div>';
                     abc=abc+ '</div>';

                     abc=abc+ '</div>';
                     //code for tabs end here
                     //alert(JSON.stringify(dt));
                     if(typeof dt === 'object')
                     {
                      var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
                      if(dt.about.length > 0)
                      {
                          if (base64Matcher.test(dt.about)) 
                          {
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary"> '+ atob(dt.about) +'</div>';
                          }
                          else
                          {
                            abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary"> '+ dt.about +'</div>';
                          }
                      }
                      else
                      {
                          abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary">  Sorry, place details are not available. </div>';
                      }
                     }
                     else
                     {
                      abc=abc+ '<div class="col-sm-12 col-xs-12 paddingtb P_details listDetailSummary">  Sorry, place details are not available. </div>';
                     }
                     //accordian for detaild section
                     //abc=abc+ '<div class="panel-group" id="accordionDetail"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse1"> Collapsible Group 1</a></h4></div><div id="collapse1" class="panel-collapse collapse in"><div class="panel-body PanelBody" ><div class="Paneldiv" style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse2"> Collapsible Group 2</a></h4></div><div id="collapse2" class="panel-collapse collapse"><div class="panel-body PanelBody"><div class="Paneldiv"  style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title CollapseHead"><a data-toggle="collapse" data-parent="#accordion" href="#collapse3"> Collapsible Group 3</a></h4></div><div id="collapse3" class="panel-collapse collapse"><div class="panel-body PanelBody"><div class="Paneldiv"  style="font-weight: lighter; color: #ffffff!important; ">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></div></div></div>';
                     
                     
                     abc=abc+ '</div>';
                     abc=abc+ '</div>';
                     document.getElementById("selected_site_Detail").innerHTML= abc;
                     
                     if(Tour_List.length >1)
                     {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                     else
                     {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                     
                     
                     if(flag == true)
                     {
                       $('#mapCanvas').hide();
                        $("#DetailBackButton").attr("onclick","goToNearByPlace()");
                     }
                     else if(flag == 'MAP')
                     {
                       $.LoadingOverlay("hide");
                       $("#DetailBackButton").attr("onclick","goToNearByPlace()");
                        //$('#ListDetail').show("slow");
                        //$('#TourMapCanvas').hide("slow");
                        $('#ListDetail').show("slide", {direction: "down"},1150);
                      $('#mapCanvas').hide();
                        // Show from right / hide to right
                        $('#TourMapCanvas').hide("slide", {direction: "up"},1150);
                       return;
                     }
                     else
                     {
                        $("#DetailBackButton").attr("onclick","GoToItinerary()");
                     }
                     
                     $('#mapCanvas').hide();
                     $('#ListDetail').show();
                     $('#nearByPlace').hide();
                     $('#itinerary_Ui').hide();
                     $('#TourMapCanvas').hide();
                     
}
//function shows detil informtion about selected place also it contains structure of the details/profile sceen end here.
function WebsiteLink()
{
    if(WebLink!="")
    window.open(WebLink, '_system', 'location=yes');
}
// Go back to Near by place from detail list view start here
function goToNearByPlace()
{
	
  document.getElementById("thread_").innerHTML='<a href="#" onclick="goToNearByPlace()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
  document.getElementById("selected_site_Detail").innerHTML='';
  $('#ListDetail').hide();
  $('#itinerary_Ui').hide();
  $('#nearByPlace').hide();
  $('#BuildSearchUi').hide();
  $('#homepage').hide();
  $('#mapCanvas').show();
  $('#CatagoryPage').hide();
  $('#Detail').hide();
  $('#NotificationUi').hide();
  $('#Save_Ui').hide();
  $('#MyTrips').hide();
  // /$.LoadingOverlay("show");
 	Reset_map("nearBy");
}
// Go back to Near by place from detail list view end here

// Code for range slider start here
$(document).ready(function() {
                  $('#selected_site_list1').ScrollTo();
                  $('#map_canvas').on('click', 'a', function(e){
                                      e.preventDefault();
                                      window.open($(this).attr('href'), '_blank');
                                      });	
																		$("#radio2").bootstrapSwitch();
                  $("#radio2").on('switchChange.bootstrapSwitch', function(event, state) {
                                  //alert(state);
                                  //console.log(this); // DOM element
                                  //console.log(event); // jQuery event
                                  //console.log(state); // true | false
                                  if(state == true)
                                  {
                                  localStorage.removeItem("HelpToggle");
                                  localStorage.setItem("HelpToggle", true);
                                  $('.help').each(function() {
                                                  $(this).css("display","block");
                                                  });
                                  }
                                  else
                                  {
                                  localStorage.removeItem("HelpToggle");
                                  localStorage.setItem("HelpToggle", false);
                                  $('.help').each(function() {
                                                  $(this).css("display","none");
                                                  });
                                  }
                                  });
		
    $('#resetCategory').tinytooltip({message: function() {
                                                  //console.log(this);
                                                  return "Cleared successfully!";
                                    },
                                    hover: false
                                   });
    var slider = new Slider('#ex1',
                           {
                             formatter: function(value) {
                             document.getElementById('dis_text').value=value;
                             //document.getElementById('dis1_text').value=value;
                             $("#ex2").attr("value", value);
                            
                             if(timer == 0){
                             															reset_main();
                                            timer=1;
                             }
                             setTimeout(timer=0,5000);
                            
                             return 'Miles: ' + value;
                             }
                           });  
    $( '.TokenSearch' ).find( 'input' ).keyup(function() {
                                              AutoC = this.value;
                                              //alert("hi");
                                              var url = site_url+'site/AutocompleteTag?';
                                              $.ajax({
                                                     type: 'GET',
                                                     url: url,
                                                     contentType: "application/json",
                                                     dataType: 'jsonp',
                                                     jsonp: 'callback',
                                                     data: {
                                                     AutoC  :   AutoC
                                                     },
                                                     beforeSend : function(){
                                                     //$("#visited_site_list").html('');
                                                     //$("#loader_image").css("display","block");
                                                     },
                                                     crossDomain: true,
                                                     success: function(res) {
                                                     //alert(res[0].Category);
                                                     var availableTags = [];
                                                     
                                                     if(res[0]!= "no-data")
                                                     {
                                                     //var availableTags = [];
                                                     for(var i=0;i<res.length;i++)
                                                     {
                                                     var tags=JSON.stringify(res[i].Category);
                                                     if(tags.indexOf(','))
                                                     {
                                                     var arraytag = tags.split(',');
                                                     for(var JK=0; JK<arraytag.length; JK++)
                                                     {
                                                     var str=arraytag[JK].replace(/"/g,"");
                                                     
                                                     var index=availableTags.indexOf(str.toLowerCase());
                                                     if(index == -1 || availableTags.length==0)
                                                     {
                                                     //alert(availableTags);
                                                     availableTags.push(str.toLowerCase());
                                                     }
                                                     }
                                                     }
                                                     else
                                                     {
                                                     var str=tags.replace(/"/g,"");
                                                     var index=availableTags.indexOf(str.toLowerCase());
                                                     if(index == -1 || availableTags.length== 0)
                                                     {
                                                     //alert(tags)
                                                     availableTags.push(str.toLowerCase());
                                                     }
                                                     }
                                                     }
                                                     $('.Token').each(function(){
                                                         var phrase = '';
                                                         $(this).find('span').each(function(){
                                                             phrase=this.innerHTML;
                                                             phrase=phrase.replace(/"/g,"");
                                                             //alert(phrase);
                                                             var index=availableTags.indexOf(phrase.toLowerCase());
                                                             if(index != -1 )
                                                             {
                                                               availableTags.splice(index, 1);
                                                              }
                                                          });
                                                       });
                                                                          
                                                     //var abc = "<option value='1'>Store</option>";
                                                     var ct = 2;
                                                     var tex="<option value='1'>Store</option>";
                                                     for(ak=0;ak<availableTags.length;ak++)
                                                     {
                                                     availableTags[ak] = availableTags[ak].replace(/("|')/g, "");
                                                     tex=tex+"<option value='"+ct+"'>"+availableTags[ak]+"</option>";
                                                     ct=ct+1;
                                                     }
                                                     document.getElementById('tokenize').innerHTML='';
                                                     document.getElementById('tokenize').innerHTML=tex;
                                                     
                                                     $(this).focus();
                                                                                                     
                                                     }
                                                     else
                                                     {
                                                       $('.Token').each(function(){
                                                          var phrase = '';
                                                          $(this).find('span').each(function(){
                                                           phrase=this.innerHTML;
                                                           phrase=phrase.replace(/"/g,"");
                                                           //alert(phrase);
                                                           var index=availableTags.indexOf(phrase.toLowerCase());
                                                           if(index != -1 )
                                                           {
                                                            availableTags.splice(index, 1);
                                                           }
                                                          });
                                                        });
                                                                                                     
                                                     var tex="<option value='1'>Store</option>";
                                                     document.getElementById('tokenize').innerHTML='';
                                                     document.getElementById('tokenize').innerHTML=tex;
                                                     
                                                    
                                                     $( "#tokenize" ).focus();
                                                     }
                                                     },
                                                     error: function(e) {
                                                     console.log(e.message);
                                                     },
                                                     complete: function(data) {
                                                     }
                                                     });    });
        
});
// Code for range slider End here

//Itineraries starts here (this function adds places in tours ui)
function itineraries(thisobj)
{
//document.getElementById('Tour_List').innerHTML='';
// code to add and delete place from itinerary starts here 
if(!($('#List_'+thisobj.previousSibling.id).hasClass('addItinerary')))
{
  var ac=thisobj.previousSibling;
  var aaa="Add_"+thisobj.previousSibling.id;
  var p_address=document.getElementById(aaa).innerHTML;
  var name =document.getElementById('Place_name'+thisobj.previousSibling.id).innerHTML
  var index_=name.indexOf('<');
  name=name.substr(0,index_);

  var arr_addr=p_address.split(",");
  var index = '';  // Gets the first index where a space occours
  var id = ''; // Gets the first part
  var text = '';

  if(arr_addr.length >= 4)
  {
    id = arr_addr[0]; // Gets the first part
    text = arr_addr[1];
  }
  else
  {
    index = p_address.lastIndexOf(',');  // Gets the first index where a space occours
    id = p_address.substr(0, index); // Gets the first part
    index = id.lastIndexOf(',');
    text = id.substr(index + 1);
    
    var temp=id.indexOf(',');
    if(temp >= 0)
    {
      id = id.substr(temp + 1);
    }
  }

  var struct='<div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="'+document.getElementById('Place_Image'+thisobj.previousSibling.id).src+'" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName"> '+name+'</li> <li class="title hotelAdd" ><div class="Tours_Address_new">'+id+'</div></li><li class="title itinerarydes"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div >'+document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML+'&nbsp;</div></li></ul></div></div>';

  

  document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+thisobj.previousSibling.id+'"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-1 col-xs-1 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px;"/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div>';
  //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;

  Itineraries_list.push(thisobj.previousSibling.id);
  Itineraries_Ad.push(p_address);
  Tour_List.push('1');
  //$('#List_'+thisobj.previousSibling.id).addClass('addItinerary');
    var abcn="."+thisobj.previousSibling.id;
    $(abcn).each(function() {
                 $(this).addClass('addItinerary');
                 });

//    var latitude_p = document.getElementById('Lat_'+thisobj.previousSibling.id).value;
//    var Longitude_P = document.getElementById('Log_'+thisobj.previousSibling.id).value;
//    var position = new google.maps.LatLng(latitude_p, Longitude_P);
//    var bounds = new google.maps.LatLngBounds();
//    bounds.extend(myLatLng);
//     marker = new google.maps.Marker({
//                                       position: position,
//                                       map: map
//     });
//     Markers.push(marker);
//     map_place_list.push(thisobj.previousSibling.id);
//     var j=0;
//     google.maps.event.addListener(marker, 'click', (function(marker, j) {
//        return function() {
//                            marker.info.close();
//                            marker.info = new google.maps.InfoWindow({ content: ''+name + ' - ' +document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML });
//                            marker.info.open(map, marker);
//                            //Markers.push(marker);
//                            var TourTag = $('#Itinerari_'+thisobj.previousSibling.id).children('div:first');
//                            //console.log('In map marker on click'+ TourTag);
//                            $.LoadingOverlay("show");
//                            Detail(TourTag,'MAP');
//                           }
//    })(marker, j));
    // code to open markar by default
    //marker.info = new google.maps.InfoWindow({content: ''+name + ' - ' + document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML});
    //marker.info.open(map, marker);
    //map.fitBounds(bounds);

   var iti=document.getElementById('Itinerary').innerHTML;
   //document.getElementById('Tour_List').innerHTML=document.getElementById('Itinerary').innerHTML;
}
else
{
  //$('#List_'+thisobj.previousSibling.id).removeClass('addItinerary');
    var abcn="."+thisobj.previousSibling.id;
    $(abcn).each(function() {
                 $(this).removeClass('addItinerary');
                 });
    $('#Itinerari_'+thisobj.previousSibling.id).remove();
    var index=Itineraries_list.indexOf(thisobj.previousSibling.id);
    if(index != -1)
    {
        Itineraries_list.splice(index, 1);
        Itineraries_Ad.splice(index, 1);
        Tour_List.splice(0,1);
    }

    // index=map_place_list.indexOf(thisobj.previousSibling.id);
    // if(index != -1)
    // {
    //     map_place_list.splice(index, 1);
    //     Markers[index].setMap(null);
    // }

    var iti=document.getElementById('Itinerary').innerHTML;
    //document.getElementById('Tour_List').innerHTML=document.getElementById('Itinerary').innerHTML;
}
// code to add and delete place from itinerary ends here 
var i=1;

//code to add colore difference in the place tabs
    $(".YetToVisitedNode").each(function() {
                                
                                if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
                                {
                                if($(this).hasClass('oddItinerary'))
                                {
                                $(this).removeClass('oddItinerary');
                                }
                                $(this).addClass('evenItinerary');
                                }
                                else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
                                {
                                if($(this).hasClass('evenItinerary'))
                                {
                                $(this).removeClass('evenItinerary');
                                }
                                $(this).addClass('oddItinerary');
                                }
                                i++;
                                });

                i=1;

        $(".visitedNode").each(function() {
                               
                               if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
                               {
                               if($(this).hasClass('oddItinerary'))
                               {
                               $(this).removeClass('oddItinerary');
                               }
                               $(this).addClass('evenItinerary');
                               }
                               else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
                               {
                               if($(this).hasClass('evenItinerary'))
                               {
                               $(this).removeClass('evenItinerary');
                               }
                               $(this).addClass('oddItinerary');
                               }
                               i++;
                               });
//Adding colore difference code ends here

//code to hide edit mode if it is open.
 Editor();
//code end here
}
//itineraries ends here


//itinerary_Detail function will add/remove places to itinerary through details/Profile ui starts here
function itinerary_Detail()
{
if(detail_Id == '')
    return;
    
    var flag=true;
    if( $('#Itinerari_'+detail_Id).length )         // use this if you are using id to check
    {
        if(!($('#List_'+detail_Id).length))         // use this if you are using id to check
        {
            $('#Itinerari_'+detail_Id).remove();
            var index=Itineraries_list.indexOf(detail_Id);
            if(index != -1)
            {
                Itineraries_list.splice(index, 1);
                Itineraries_Ad.splice(index, 1);
                Tour_List.splice(0,1);
                if(Tour_List.length >1)
                {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                else
                {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
                
            }
            // index=map_place_list.indexOf(detail_Id);
            // if(index != -1)
            // {
            //     map_place_list.splice(index, 1);
            //     Markers[index].setMap(null);
            // }

            flag=false;
        }
    }
    
    if(flag == true)
    if(!($('#List_'+detail_Id).hasClass('addItinerary')))
    {
        
        var aaa="Add_"+detail_Id;
        var p_address=document.getElementById(aaa).innerHTML;
        var name =document.getElementById('Place_name'+detail_Id).innerHTML;
        var index_=name.indexOf('<');
        if(index_ != -1)
        name=name.substr(0,index_);
        
        var arr_addr=p_address.split(",");
        var index = '';  // Gets the first index where a space occours
        var id = ''; // Gets the first part
        var text = '';

        if(arr_addr.length >= 4)
        {
          id = arr_addr[0]; // Gets the first part
          text = arr_addr[1];
        }
        else
        {
          index = p_address.lastIndexOf(',');  // Gets the first index where a space occours
          id = p_address.substr(0, index); // Gets the first part
          index = id (',');
          text = id.substr(index + 1);
        }
        
        var struct='<div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="'+document.getElementById('Place_Image'+detail_Id).src+'" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName"> '+name+'</li> <li class="title itinerarydes"><div>'+id+'</div></li><li class="title itinerarydes"> <div style="float:left;">'+text+'&nbsp;&nbsp;</div><div>'+document.getElementById('Dista_'+detail_Id).innerHTML+'&nbsp;</div></li></ul></div></div>';
        
        
        
        document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+detail_Id+'"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-2 col-xs-2 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px; "/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div>';
        //document.getElementById('Tour_List').innerHTML =  document.getElementById('Itinerary').innerHTML ;

        Itineraries_list.push(detail_Id);
        Itineraries_Ad.push(p_address);
        Tour_List.push('1');
        if(Tour_List.length >1)
          {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 25px; width: 25px;">';}
        else
          {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 25px; width: 25px;">';}
        //$('#List_'+detail_Id).addClass('addItinerary');
        var abcn="."+detail_Id;
        $(abcn).each(function() {
                                    $(this).addClass('addItinerary');
                                    });

        
    }
    else
    {
       // $('#List_'+detail_Id).removeClass('addItinerary');
        var abcn="."+detail_Id;
        $(abcn).each(function() {
                                   $(this).removeClass('addItinerary');
                                   });

        $('#Itinerari_'+detail_Id).remove();
        var index=Itineraries_list.indexOf(detail_Id);
        if(index != -1)
        {
            Itineraries_list.splice(index, 1);
            Itineraries_Ad.splice(index, 1);
            Tour_List.splice(0,1);
            if(Tour_List.length >1)
            {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
            else
            {document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '  <img src="images/eye.svg" style="Height: 15px; width: 15px;">';}
        }
        $('#Itinerari_'+detail_Id).removeClass('YetToVisitedNode');
        // index=map_place_list.indexOf(detail_Id);
        // if(index != -1)
        // {
        //     map_place_list.splice(index, 1);
        //     Markers[index].setMap(null);
        // }
    }
    // code to add and delete place from itinerary ends here
    
    
    //code to add colore difference in the place tabs
    col_Diff();
    //Adding colore difference code ends here

}
//itinerary_Detail function will add/remove places to itinerary through details/Profile ui starts here

//code for editing itineraries from the Itinerary list
function Edit(thisObj)
{
//alert(document.getElementById('EDIT_a').innerHTML);
    if($('.vis').is(':visible'))
    {
     document.getElementById('EDIT_a').innerHTML = 'Done';
     $(".vis").css("display", "none");
     $(".Drag").css("display", "block");
     $(".Del").css("display", "block");
    }
    else
    {
    Editor();
    }
}
//edit function ends here.

//added editor function to avoid redundancy(used in multiple places)
function Editor()
{
   document.getElementById('EDIT_a').innerHTML = 'Edit';
     $(".vis").css("display", "block");
     $(".Drag").css("display", "none");
     $(".Del").css("display", "none");
}
//also this includes mainly in the edit function.

//code for deleting itineraries from the list
function delete_it(thes)
{
     $(thes).parent().remove();
     var id=$(thes).parent().attr('id');
     var index = id.indexOf('_');
     if(index != -1)
     {
         id= id.substr(index+1);
         var abcn="."+id;
         //$('#List_'+id).removeClass('addItinerary');
         $(abcn).each(function() {
                      $(this).removeClass('addItinerary');
                      });

         index=Itineraries_list.indexOf(id);
         if(index != -1)
         {
             Itineraries_list.splice(index, 1);
             Itineraries_Ad.splice(index, 1);
         }
             Tour_List.splice(0,1);
      }
}
//itinararies deletion function ends here

/* Drag itnorary Strat here */
$(document).bind('pageinit', function() {
    $( "#Itinerary" ).sortable({handle : '.handle'}).disableSelection();  
});
/* Drag itnorary End here */

//function adds Visited/unvisited class to the tag so that we can see the visited  places to visited tab and unvisited places in unvisited tab in itinerary (tours) ui
function visitsite(thisE)
{
    var id_list =$(thisE).closest('.ALL_Places_Tour').attr('id');
    var index = id_list.indexOf('_');
    $(thisE).closest('.ALL_Places_Tour').css("display","none");
    if ($(thisE).is(':checked')) 
    {
        $(thisE).addClass( "Check_node" );
        $(thisE).closest('.ALL_Places_Tour').addClass( "visitedNode" );
        $(thisE).closest('.ALL_Places_Tour').removeClass( "YetToVisitedNode" );

        if(index != -1)
        {
          id_list= id_list.substr(index+1);
          index=Itineraries_list.indexOf(id_list);
          if(index != -1)
          {
            Itineraries_list.splice(index, 1);
            Itineraries_Ad.splice(index, 1);
          }
        }
    } 
    else 
    {
        $(thisE).removeClass( "Check_node" );
        $(thisE).closest('.ALL_Places_Tour').removeClass( "visitedNode" );
        $(thisE).closest('.ALL_Places_Tour').addClass( "YetToVisitedNode" );

        if(index != -1)
        {
          id_list= id_list.substr(index+1);
          var address_id = 'Add_'+id_list;
          var PlaceAddress = document.getElementById(address_id).innerHTML;
          Itineraries_list.push(id_list);
          Itineraries_Ad.push(PlaceAddress);
        }
    }
}
//visited/unvisited function ends here


//function that toggels the visited and unvisited node starts here
function Visited_Tab_toggle(thisTb)
{
  if($(thisTb).hasClass('Unvisited'))
  {
    $('.YetToVisitedNode').each(function() 
    {
        $(this).css("display","block");
    });
    $('.visitedNode').each(function() 
    {
        $(this).css("display","none");
    });
    $(thisTb).next().css("display","block");
    $(thisTb).css("display","none");
  }
  else
  {
    $('.YetToVisitedNode').each(function() 
    {
        $(this).css("display","none");
    });
    $('.visitedNode').each(function() 
    {
        $(this).css("display","block");
    });
    $(thisTb).prev().css("display","block");
    $(thisTb).css("display","none");
  }
}
//function that toggels the visited and unvisited node ends here


//function that enables the tinerary ui starts here
function GoToItinerary()
{
//alert(Tour_List.length); 
Reset_map('tab');
$( "#yet_to_visit_sites" ).trigger( "click" );
Editor();
document.getElementById("selected_site_Detail").innerHTML='';
document.getElementById("MyTripList").innerHTML="";
detail_Id = '';

$('#mapCanvas').hide();
$('#ListDetail').hide();
$('#nearByPlace').hide();
$('#mapCanvas').show();
$('#Save_Ui').hide();
$('#MyTrips').hide();
$('#TourMapCanvas').hide();
$('#BuildSearchUi').hide();
clearWatch();
}
//function that enables the tinerary ui ends here

//function will take u to map for navigation
function Build(mode)
{
  if(Itineraries_list.length == 0)
  {
    swal("Please select a place first");
    return;
  }
  
  var CurrentLocationUser=document.getElementById('starting_location').value;
    
  $(".YetToVisitedNode").each(function() 
  {
    var Firt_Address=$(this).attr('id');
    var index = Firt_Address.indexOf('_');
    Firt_Address= Firt_Address.substr(index+1);
    index=Itineraries_list.indexOf(Firt_Address);
    if(index !=-1)
    {
      Destination_addr=Itineraries_Ad[index];
      //alert(Destination_addr);
      return false;
    }
  });
    
    
  if(Destination_addr == '')
  {
     swal('Tour list not found');
     return;
  }
  else
  {
     var rex = /(<([^>]+)>)/ig;
     Destination_addr =Destination_addr.replace(rex , "");
  }
    
  launchnavigator.isGoogleMapsAvailable(function(available)
  {
      if(available)
      {
        console.log("Google Maps is available");
      }
      else
      {
        console.log("Google Maps is NOT available");
      }
  });
    
  if(CurrentLocationUser != "")
  {
      //console.log(CurrentLocationUser +" destination -> "+ Destination_addr);
      launchnavigator.navigate(
                           Destination_addr,
                           CurrentLocationUser,
                           function(){
                           //alert("Plugin success");
                           },
                           function(error){
                           swal("Plugin error: "+ error);
                           },
                           {
                            preferGoogleMaps: true,
                            transportMode: mode,
                            urlScheme: "R_Safari://",
                            backButtonText: "R_Safari",
                            enableDebug: true
                           });
  }
  else
  {
      //console.log("Null current address" + Destination_addr);
      launchnavigator.navigate(
                                 Destination_addr,
                                 null,
                                 function(){
                                 //alert("Plugin success");
                                 },
                                 function(error){
                                 swal("Plugin error: "+ error);
                                 },
                                 {
                                 preferGoogleMaps: true,
                                 transportMode: mode,
                                 urlScheme: "R_Safari://",
                                 backButtonText: "R_Safari",
                                 enableDebug: true
                              });
    }
}

//function use to invoke the transport mode droupdown (empty function please dont delete).
function trial()
{}
//function use to invoke the transport mode droupdown ends here

//
function Save_Ui_function()
{
  swal({
        title: "Save Tour",
        text: "Now it is time to enter some information about your tour! Please click on 'Go on and save tour'.</br></br><input class=\"visibleInput\" onclick=\"swal.close()\" type=\"button\" name=\"cancel\" value=\"​Cancel and close window\">",
        html: true,
        type: "info",
        showCancelButton: false,
        confirmButtonText: "​​Go on to save tour",
        closeOnConfirm: true
        },
        function(isConfirm) {
        if (isConfirm) {
            $('#Save_Ui').show();
            $('#mapCanvas').hide();
            detail_Id = '';
            Edit_Description();
     
        } else {
            swal.close();
        }
    });
}
//

//Facebook login start from here
function FbLogin(Get_Info,extra)
{
    
    extra = typeof extra !== 'undefined' ? extra : "undefined";
    
    //alert(Get_Info);
    status = Get_Info;
    //alert(Get_Info);
    if(Get_Info == "Notification")
    {
        Notification();
        return;
    }
				    
    
    FbUserId_Log="181091708907027";
    if(Get_Info == "Save")
    {
        Save_Ui_function();
    }
    else if(Get_Info == "MyTrips")
    {
        Get_Tour();
    }
    else if(Get_Info == "Share")
    {
        //Share_trip(Save_id);
        if(Save_id != "0")
        {
            Share_trip(Save_id);
        }
        else
        {
            Save_Ui_function();
            process="share";
        }
    }
    else if(Get_Info == "Notification")
    {
        Notification();
    }
    else if(Get_Info == "Likes")
    {
        return userData.authResponse.userID;
    }
    else if(Get_Info=="Auto")
    {
        autocompletemain(extra)
    }
    else
    {
        Load_Trips(Get_Info);
    }
    return;
    
    facebookConnectPlugin.getLoginStatus(function (userData) {
                                           //alert(userData);
                                            if(userData.status == "connected")
                                            {
                                                FbUserId_Log=userData.authResponse.userID;
                                                //alert(FbUserId_Log);
                                                if(Get_Info == "Save")
                                                {
                                                    Save_Ui_function();
                                                }
                                                else if(Get_Info == "MyTrips")
                                                {
                                                    Get_Tour();
                                                }
                                                else if(Get_Info == "Share")
                                                {
                                                    //Share_trip(Save_id);
                                                    if(Save_id != "0")
                                                    {
                                                        Share_trip(Save_id);
                                                    }
                                                    else
                                                    {
                                                        Save_Ui_function();
                                                        process="share";
                                                    }
                                                }
                                                else if(Get_Info == "Notification")
                                                {
                                                    Notification();
                                                }
                                                else if(Get_Info == "Likes")
                                                {
                                                    return userData.authResponse.userID;
                                                }
                                                else if(Get_Info=="Auto")
                                                {
                                                    autocompletemain(extra)
                                                }
                                                else
                                                {
                                                    Load_Trips(Get_Info);
                                                }
                                            }
                                            else
                                            {
                                            facebookConnectPlugin.login(["public_profile"],
                                                                     function (userData_2) {
                                                                     
                                                                     if(userData_2.status == "connected")
                                                                     {
                                                                     //alert(userData.authResponse.userID)
                                                                     FbUserId_Log=userData_2.authResponse.userID;
                                                                        if(Get_Info == "Save")
                                                                        {
                                                                            Save_Ui_function();
                                                                        }
                                                                        else if(Get_Info == "MyTrips")
                                                                        {
                                                                            Get_Tour();
                                                                        }
                                                                        else if(Get_Info == "Share")
                                                                        {
                                                                            if(Save_id != "0")
                                                                            {
                                                                                Share_trip(Save_id);
                                                                            }
                                                                            else
                                                                            {
                                                                                Save_Ui_function();
                                                                                process="share";
                                                                            }
                                                                        }
                                                                        else if(Get_Info == "Notification")
                                                                        {
                                                                            Notification();
                                                                        }
                                                                        else if(Get_Info == "Auto")
                                                                        {
                                                                            autocompletemain(extra);
                                                                        }
                                                                        else
                                                                        {
                                                                            Load_Trips(Get_Info);
                                                                        }
                                                                     }
                                                                     else
                                                                     {
                                                                        alert("Login failed");
                                                                        return;
                                                                     }
                                                                    },
                                                                    function (error) {
                                                                        swal("" + error);
                                                                    });
                                            }
                                         },
                                         function (error) {
                                            alert("" + error);
                                         });
}
//Facebook login end here

//function to add calendar functionallaty starts here
function calendar(title,notes,startDate)
{
    var dta = startDate.split('T');
    var d =dta[0].split('-');
    var t =dta[1].split(':');
    
    var mon = parseInt(d[1])-1;
    var hour = parseInt(t[0])+1;
    
    var sD = new Date(d[0],mon.toString(),d[2],t[0],t[1],0,0,0);
    var eD = new Date(d[0],mon.toString(),d[2],hour.toString(),t[1],0,0,0);
    
    //alert (sD);
    //alert (eD);
    
    var calendarName="Retail Safari";
    //var startDate = new Date("September 24, 2013 13:00:00");
    var endDate = new Date(startDate);
    var StarDate = new Date(startDate);
    //var title = "My nice event";
    var location = "Home";
    //var notes = "Some notes about this event.";
    var success = function(message) {  };
    var error = function(message) {  };
    //return;

    window.plugins.calendar.createCalendar(calendarName,success,error);
    window.plugins.calendar.createEventInNamedCalendar(title,location,notes,sD,eD,calendarName,success,error);
}
//function to add calendar functionality ends here


// function will store the tour to the server starts here
//We have seperated this function from login to avoid the redundancy(unsed in multiple places)
function Save_Tour()
{
  if(document.getElementById("Tour_Owner_Status").value=="True")
  {
      swal({
       title: "Save",
       text: "Please select any one...</br></br><input class=\"visibleInput\" onclick=\"swal.close()\" type=\"button\" name=\"cancel\" value=\"​Cancel and close window\">",
       html: true,
       type: "info",
       showCancelButton: true,
       confirmButtonText: "Click to save as new tour.",
       cancelButtonText: "Click to save in existing tour.",
       closeOnConfirm: true,
       closeOnCancel: true
       },
       function(isConfirm) {
           if (isConfirm) {
           save_new_tour();
           } else {
           Edit_Trip_Call();
           }
      });
  }
  else if(T_Flag == "false")
  {
      save_new_tour();
  }
  else
  {
      Edit_Trip_Call();
  }
}
//function that stores the tour ends here

//save new tour
function save_new_tour()
{    
    var Places_List_all=[];
    var profile = '';
    
    $(".ALL_Places_Tour").each(function(){
                              var Places_List=$(this).attr('id');
                              var index = Places_List.indexOf('_');
                              Places_List_all.push(Places_List.substr(index+1));
    });

    $('.Place_custom_detail').each(function(){
            var selector = $(this).find('.selectpicker').val();
            var detail = $(this).find('.Custom_detail').val();

            for(var i=0;i<Places_List_all.length;i++)
            {
              if(Places_List_all[i] == selector)
              {
                Places_List_all[i] = Places_List_all[i] +':'+ btoa(detail);
              }
            }
    });
    console.log(Places_List_all);
    //return;
    var ProfileTour="Public";
    var Tour_description = document.getElementById("desc_t").value;
    var Tour_name = document.getElementById("name_t").value;
    var tag=document.getElementById("Tag_t").value;
    var date=document.getElementById("Date_t").value;
    
    if(FbUserId_Log == "")
    {
        swal("Please Login First");
        return;
    }
    
    if($('#Public').is(':checked'))
    {
        ProfileTour="Public";
    }
    else
    {
        ProfileTour="Private";
    }
    
    if(Tour_name == "")
    {
        swal("Please enter tour name");
        return;
    }
    
    if(Tour_description == "")
    {
        swal("Please enter tour description.");
        return;
    }
    
    if(tag == "")
    {
        swal("Please enter Tag for the tour.");
        return;
    }
          
    if (!date) {
        //console.log("No value!");
        date="";
    }
    else
    {
        calendar(Tour_name,Tour_description,date);
    }
    
    var detail = {
        "Places_List_all" : Places_List_all.toString(),
        "Description" : Tour_description,
    };
    
    var url = site_url+'site/add_save_tour?';
    
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           Tour_name : Tour_name,
           detail : JSON.stringify(detail),
           userid : FbUserId_Log,
           ProfileTour : ProfileTour.toString(),
           tag : tag
           },
           beforeSend : function(){},
           crossDomain: true,
           
           success: function(res) {
           var no=JSON.stringify(res);
           if(parseInt(no)>0)
           {
           swal("Stored successfully (Save tour function)");
           Save_id=no;
           GoToItinerary();
           if(process=="share")
           {
           Share_trip(Save_id);
           }
           else
           {
           
           }
           }
           else
           {
           swal("No tours found.");
           //document.getElementById("desc_t").value="";
           //document.getElementById("name_t").value="";
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           //alert(data.message);
           //console.log(data.message);
           }
           });
}
//save new tour ends here

//Get_Tour function that retrives saved tour from the server starts here.
function Get_Tour()
{
    if(FbUserId_Log == "")
    {
        alert("Please Login First");
        return;
    }
    
    $( "#PopUpClose" ).trigger( "click" );
    var url = site_url+'site/getAllTour?';
    
    var prefarance = "Names";
    
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           Userid : FbUserId_Log,
           Prefarance : prefarance.toString()
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           $.LoadingOverlay("show");
           },
           crossDomain: true,
           
           success: function(res) {
           
           if(res[0]!= "no-data")
           {
           document.getElementById("MyTripList").innerHTML='';
           var abc='';
           for(var i=0; i<res.length; i++)
           {
           var myObj = JSON.parse(res[i].Detail);
           var str_array = myObj.Places_List_all.split(',');
              var description_='';
           if(myObj.Description.length >150)
           {
           description_=myObj.Description.substr(0,150) + "...";
           }
           else
           {
           description_=myObj.Description;
           }
           //alert(myObj.Description);
           //break;
           
           var struct='<div class="col-sm-11 col-xs-11 paddingzero" onclick="Load_Trips('+res[i].SrNo+')"><div class="col-sm-2 col-xs-2 paddingzero"><img class="img-responsive" src="images/tourlogo.png" /></div><div class="col-sm-9 col-xs-9 paddingzero paddingleft"><ul><li class="title Name" id="Name_'+res[i].SrNo+'"> '+res[i].TourName+'</li> <li class="title itinerarydes generalStatus" id="Profile_'+res[i].SrNo+'"> '+res[i].Profile+'</li><li class="title itinerarydes tripDesc" id="Description_'+res[i].SrNo+'"> '+description_+'</li></ul></div></div><div class="col-sm-1 col-xs-1 paddingzero"><div class="edit" onclick="Edit_Trip('+res[i].SrNo+')"><img class="img-responsive" src="images/edit.png" style="Height: 20px; width: 20px;"/></div><div class="edit" onclick="Delete_Trip('+res[i].SrNo+')"><img class="img-responsive" src="images/remove.svg" style="Height: 20px; width: 20px;" /></div><div class="edit" onclick="Share_trip('+res[i].SrNo+')"><img class="img-responsive" src="images/share.svg" style="Height: 15px; width: 15px;"/></div></div>';
           
           abc = abc + '<div class="col-sm-12 col-xs-12 paddingtb myNewTour" id="TourList_'+res[i].SrNo+'"><input type="hidden" id="PlaceLog_'+res[i].SrNo+'" value="'+myObj.Places_List_all+'"/><input type="hidden" id="Tag_'+res[i].SrNo+'" value="'+res[i].Tags+'"/><input type="hidden" id="UserId_'+res[i].SrNo+'" value="'+res[i].FbUserId+'"/>' + struct + '</div>';
           
           } 
           document.getElementById("MyTripList").innerHTML=abc;
            $('#MyTrips').show();
            $('#BuildSearchUi').hide();
            $('#itinerary_Ui').hide();
            $('#homepage').hide();
            $('#mapCanvas').hide();
            $('#nearByPlace').hide();
            $('#CatagoryPage').hide();
            $('#Detail').hide();
            $('#NotificationUi').hide();
            $('#ListDetail').hide();
            $('#Save_Ui').hide();
           
            //swal("Retrived successfully");
           }
           else
           {
            swal("No tours found.");
            document.getElementById("MyTripList").innerHTML="";
            $('#MyTrips').hide();
            $('#BuildSearchUi').hide();
            $('#itinerary_Ui').hide();
            $('#homepage').hide();
            $('#mapCanvas').show();
            $('#nearByPlace').hide();
            $('#CatagoryPage').hide();
            $('#Detail').hide();
            $('#NotificationUi').hide();
            $('#ListDetail').hide();
            $('#Save_Ui').hide();
           
            return;
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           $.LoadingOverlay("hide");
           //console.log(data.message);
           }
           });

}
//Get_Tour function that retrives saved tour from the server ends here

//Load saved trips in itinarary view starts here
function Load_Trips(srno)
{
    //console.log("load tour " + srno);
    if(srno == "")
    {
        alert("Please Login First");
        return;
    }
    var T_owner="";
    if(FbUserId_Log == document.getElementById("UserId_"+srno).value)
    {
        T_owner = "Owner";
        //alert("Owner");
    }
    else
    {
        T_owner = "No_owner";
        //alert("No_Owner");
        T_Flag= "false";
    }
    Save_id=srno;
    var url = site_url+'site/getDetailTour?';
    //alert("load trips " +srno);
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           srno : srno
           }, 
           beforeSend : function(){
           //$("#visited_site_list").html('');
            $.LoadingOverlay("show");
           },
           crossDomain: true,
           
           success: function(res) {
           //alert("success" + JSON.stringify(res));
           if(res[0]!= "no-data")
           {
           $(".addItinerary").each(function()
           {
              $(this).removeClass('addItinerary');
           });
           Itineraries_list=[];
           Itineraries_Ad=[];
           Tour_List=[];
           var detail_list=[];
           document.getElementById('Itinerary').innerHTML='';
           //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;
           var myObj = JSON.parse(res[0].Detail);   
           var str_array = myObj.Places_List_all.split(',');

           for(k=0;k<str_array.length;k++)
           {
              if(str_array[k].indexOf(':') > 0)
              {
                var data =  str_array[k].split(':');
                str_array[k] = data[0];
                detail_list.push(data[1]);
              }
              else
              {
                detail_list.push('');
              }
           }

           var Tour_description = myObj.Description;
           var Tour_name = res[0].TourName;
           //return;
           
           if( T_owner == "Owner" )
           {
                T_Profile = res[0].Profile;
                T_name = Tour_name;
                T_des = Tour_description;
                T_Pl_Log = res[0].SrNo;
                T_tag = res[0].Tags;
                T_SrNo = res[0].SrNo;
               
                document.getElementById("Tour_Owner_Status").value="True";
                document.getElementById("name_t").value = T_name;
                document.getElementById("desc_t").value = T_des;
                document.getElementById("Tag_t").value = T_tag;
           }
           else
           {
              document.getElementById("Tour_Owner_Status").value="";
              document.getElementById("name_t").value = "";
              document.getElementById("desc_t").value = "";
              document.getElementById("Tag_t").value = "";
           }
           
           var abca='';
           document.getElementById('Itinerary').innerHTML = '<div class="col-sm-12 col-xs-12 enterMsg center Tname_t " id="Tour_name_header">'+Tour_name+'</div><div class="col-sm-12 col-xs-12 enterMsg center  P_details_t" id="Tour_detail_header">'+Tour_description+'</div><input type="hidden" id="UserId_'+res[0].SrNo+'" value="'+res[0].FbUserId+'"/>';
           //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;

           service = new google.maps.places.PlacesService(map);
           var url = site_url+'site/getPlacesList?';
           //alert(str_array);
           $.ajax({
              type: 'GET',
              url: url,
              contentType: "application/json",
              dataType: 'jsonp',
              jsonp: 'callback',
              data: {
                  placeId : str_array.toString()
              },
              beforeSend : function(){},
              crossDomain: true,
              success: function(res) {
                  if(res[0] != 'no-data')
                  {
                    //alert("!no data");
                    for(var i=0;i<res.length;i++)
                    {
                      (function(res,i){
                              var distance='';
                              var current = new google.maps.LatLng(mylat,mylong);
                                                      
                              if(typeof service_d === "undefined")
                              {
                                    service_d = new google.maps.DistanceMatrixService();
                              }
                              var myObj = JSON.parse(res[i].LatLng);

                              var destination = new google.maps.LatLng(myObj.H,myObj.L);
                              service_d.getDistanceMatrix({
                                                            origins: [current], //LatLng Array
                                                            destinations: [destination], //LatLng Array
                                                            travelMode: google.maps.TravelMode.DRIVING,
                                                            unitSystem: google.maps.UnitSystem.IMPERIAL,
                                                            avoidHighways: false,
                                                            avoidTolls: false
                                                            }, callback_Dis);
                                                                                    
                              function callback_Dis(response, status)
                              {
                                  if (status === google.maps.DistanceMatrixStatus.OK)
                                  {
                                      var results_ele = response.rows[0].elements;
                                      if(!(typeof results_ele[0] === "undefined"))
                                      {
                                          element = results_ele[0];
                                          if(!(typeof element.distance === "undefined"))
                                          {
                                              distance = element.distance.text;
                                          }
                                          else
                                          {
                                              distance = "";
                                          }
                                      }
                                      else
                                      {
                                          distance="";
                                      }
                                  }
                                  else
                                  {
                                      distance="";
                                  }
                              
                                  var struct='';
                                  var detail=res[i].Detail;
                                  var parse=JSON.parse(detail);
                                  if(!(typeof parse.Path === "undefined"))
                                  {
                                     if(!(typeof parse.Path === "undefined"))
                                     {                                       
                                        var p_address=parse.address;
                                        var arr_addr=p_address.split(",");
                                        var index = '';  // Gets the first index where a space occours
                                        var Address = ''; // Gets the first part
                                        var text = '';

                                        if(arr_addr.length >= 4)
                                        {
                                          Address = arr_addr[0]; // Gets the first part
                                          text = arr_addr[1];
                                        }
                                        else
                                        {
                                           index = parse.address.lastIndexOf(',');  // Gets the last index where a space occours
                                           Address = parse.address.substr(0, index); // Gets the first part
                                           index = Address.lastIndexOf(',');
                                           
                                           text = Address.substr(index + 1); // Gets the second part
                                           Address = Address.substr(0, index);

                                           var temp=Address.indexOf(',');
                                           if(temp >= 0)
                                           {
                                             Address = Address.substr(temp + 1);
                                           }
                                        }

                                        var detailinfo='';
                                        var index_detail = str_array.indexOf(res[i].PlaceIds);
                                        if(index_detail >= 0)
                                        {
                                          detailinfo = detail_list[index_detail];
                                        }

                                        struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+res[i].PlaceIds+'"  value="'+myObj.H+'"/><input type="hidden" id="Log_'+res[i].PlaceIds+'" value="'+myObj.L+'"/><textarea id="DetailLog_'+res[i].PlaceIds+'" style="display:none;">'+res[i].Detail+'</textarea><div class="col-sm-4 col-xs-4 paddingright">';
                                       
                                      
                                        if(!(typeof parse.profileimage === "undefined") && parse.profileimage.length > 0)
                                        {
                                          var img=parse.profileimage;
                                          var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img);
                                          struct=struct+'<img class="img-circle itineraryImg" id="Place_Image'+res[i].PlaceIds+'" src="'+path+'" />';
                                        }
                                        else if(!(typeof parse.Path === "undefined"))
                                        {
                                         var img=parse.Path.split(",");
                                         var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[0]);
                                         struct=struct+'<img class="img-circle itineraryImg" id="Place_Image'+res[i].PlaceIds+'" src="'+path+'" />';
                                         
                                        }
                                        else
                                        {
                                          struct=struct+'<img class="img-circle itineraryImg"  id="Place_Image'+res[i].PlaceIds+'" src="images/default.jpg" />';
                                         
                                        }
                                        struct=struct+'</div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+res[i].PlaceIds+'"> '+parse.name+' </li> <li class="title hotelAdd" ><div id="Add_'+res[i].PlaceIds+'">'+Address+'</div> </li><li class="title hotelAdd"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+res[i].PlaceIds+'">'+ distance +'&nbsp;away</div></li></ul></div></div>';
                                     }
                                    }
                                    else
                                    {
                                        var p_address=parse.address;
                                        var arr_addr=p_address.split(",");
                                        var index = '';  // Gets the first index where a space occours
                                        var Address = ''; // Gets the first part
                                        var text = '';

                                        if(arr_addr.length >= 4)
                                        {
                                          Address = arr_addr[0]; // Gets the first part
                                          text = arr_addr[1];
                                        }
                                        else
                                        {
                                           index = parse.address.lastIndexOf(',');  // Gets the last index where a space occours
                                           Address = parse.address.substr(0, index); // Gets the first part
                                           index = Address.lastIndexOf(',');
                                           
                                           text = Address.substr(index + 1); // Gets the second part
                                           Address = Address.substr(0, index);

                                           var temp=Address.indexOf(',');
                                           if(temp >= 0)
                                           {
                                             Address = Address.substr(temp + 1);
                                           }
                                        }

                                        var detailinfo='';
                                        var index_detail = str_array.indexOf(res[i].PlaceIds);
                                        if(index_detail >= 0)
                                        {
                                          detailinfo = detail_list[index_detail];
                                        }
                       
                                        struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+res[i].PlaceIds+'"  value="'+myObj.H+'"/><input type="hidden" id="Log_'+res[i].PlaceIds+'" value="'+myObj.L+'"/><textarea id="DetailLog_'+res[i].PlaceIds+'" style="display:none;">'+detail+'</textarea><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="images/default.jpg" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+res[i].PlaceIds+'"> '+parse.name+' </li> <li class="title hotelAdd" ><div id="Add_'+res[i].PlaceIds+'">'+Address+'</div></li><li class="title hotelAdd"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+res[i].PlaceIds+'">'+ distance +'&nbsp;away</div></li></ul></div></div>';
                                     }
                                  var numb=distance.split(' ');
                       
                                  if(detailinfo!='')
                       						{
                                  		document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+res[i].PlaceIds+'" data-sort="'+parseFloat(numb[0])+'"><div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-1 col-xs-1 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px; "/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div><div class="col-sm-12 col-xs-12 paddingzero"><div class="accordion center white" id="accordion2"> <div class="accordion-group"> <div id="collapseTwo'+res[i].PlaceIds+'" class="accordion-body collapse">'+ atob(detailinfo) +'</div></div><div class="SeeMore2 center" data-toggle="collapse" href="#collapseTwo'+res[i].PlaceIds+'">More details</div></div></div></div>';
                       						}
                                  else
                       						{
                       								document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+res[i].PlaceIds+'" data-sort="'+parseFloat(numb[0])+'"><div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-1 col-xs-1 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px; "/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div></div>';
                                  }
                                  //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;
                                  struct='';
                                  Itineraries_list.push(res[i].PlaceIds);
                                  Itineraries_Ad.push(parse.address);
                                  Tour_List.push('1');
                                  $("#ADD_New").val("");
                                  
                                  var mylist = $('#Itinerary');
                                     
                                  var listitems = mylist.children('div').get();
                                     
                                  listitems.sort(function(a, b) {
                                                    return  $(a).attr('data-sort') - $(b).attr('data-sort');
                                                  });
                                  $.each(listitems, function(index, item) {
                                            mylist.append(item);
                                          });
                                  mylist.prepend($("#Tour_detail_header"));
                                  mylist.prepend($("#Tour_name_header"));
  
                                  if($('#List_'+res[i].PlaceIds).length)    // use this if you are using id to check
                                  { 
                                    var abcn="."+res[i].PlaceIds;
                                    $(abcn).each(function() 
                                    {
                                        $(this).addClass('addItinerary');
                                    });
                                  }
                              }
                            
                      })(res,i);
                    }
                  }
                  else
                  {
                    for(var i=0;i<str_array.length;i++)
                    {
                      (function(str_array,i){
                          service.getDetails({
                                   placeId:str_array[i]
                                 },
                                 function(place, status) {
                                            
                                    if (status === google.maps.places.PlacesServiceStatus.OK)
                                    {
                                            var distance='';
                                            var current = new google.maps.LatLng(mylat,mylong);
                                                                    
                                            if(typeof service_d === "undefined")
                                            {
                                                  service_d = new google.maps.DistanceMatrixService();
                                            }
                                                                                                  
                                            var destination = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                                            service_d.getDistanceMatrix({
                                                                          origins: [current], //LatLng Array
                                                                          destinations: [destination], //LatLng Array
                                                                          travelMode: google.maps.TravelMode.DRIVING,
                                                                          unitSystem: google.maps.UnitSystem.IMPERIAL,
                                                                          avoidHighways: false,
                                                                          avoidTolls: false
                                                                          }, callback_Dis);

                                            function callback_Dis(response, status)
                                            {
                                                if (status === google.maps.DistanceMatrixStatus.OK)
                                                {
                                                    var results_ele = response.rows[0].elements;
                                                    if(!(typeof results_ele[0] === "undefined"))
                                                    {
                                                        element = results_ele[0];
                                                        if(!(typeof element.distance === "undefined"))
                                                        {
                                                            distance = element.distance.text;
                                                        }
                                                        else
                                                        {
                                                            distance = "";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        distance="";
                                                    }
                                                }
                                                else
                                                {
                                                    distance="";
                                                }
                                                var struct='';

                                                if(!(typeof place.photos === "undefined"))
                                                  {
                                                    if(!(typeof place.photos[0] === "undefined"))
                                                    {
                                                        var p_address=place.vicinity;

                                                        var arr_addr=p_address.split(",");
                                                        var index = '';  // Gets the first index where a space occours
                                                        var Address = ''; // Gets the first part
                                                        var text = '';

                                                        if(arr_addr.length >= 4)
                                                        {
                                                          Address = arr_addr[0]; // Gets the first part
                                                          text = arr_addr[1];
                                                        }
                                                        else
                                                        {
                                                          index = place.vicinity.lastIndexOf(',');  // Gets the last index where a space occours
                                                          Address = place.vicinity.substr(0, index); // Gets the first part
                                                          text = place.vicinity.substr(index + 1); // Gets the second part
                                                          var temp=text.indexOf(',');
                                                          if(temp >= 0)
                                                          {
                                                              text = text.substr(temp + 1);
                                                          }
                                                        }

                                                        struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="'+place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 350})+'" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title hotelAdd" ><div id="Add_'+place.place_id+'">'+Address+'</div></li><li class="title hotelAdd"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+place.place_id+'">'+ distance +'&nbsp;away</div></li></ul></div></div>';
                                                      }
                                                    }
                                                    else
                                                    {
                                                        var p_address=place.vicinity;
                                                        

                                                        var arr_addr=p_address.split(",");
                                                        var index = '';  // Gets the first index where a space occours
                                                        var Address = ''; // Gets the first part
                                                        var text = '';

                                                        if(arr_addr.length >= 4)
                                                        {
                                                          Address = arr_addr[0]; // Gets the first part
                                                          text = arr_addr[1];
                                                        }
                                                        else
                                                        {
                                                          index = place.vicinity.lastIndexOf(',');  // Gets the last index where a space occours
                                                          Address = place.vicinity.substr(0, index); // Gets the first part
                                                          text = place.vicinity.substr(index + 1); // Gets the second part
                                                          var temp=text.indexOf(',');
                                                          if(temp >= 0)
                                                          {
                                                                text = text.substr(temp + 1);
                                                          }
                                                        }

                                                        struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingright"><img class="img-circle itineraryImg" src="images/default.jpg" /></div><div class="col-sm-4 col-xs-4 paddingzero"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title hotelAdd" > <div id="Add_'+place.place_id+'">'+Address+'</div></li><li class="title hotelAdd"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+place.place_id+'">'+ distance +'&nbsp;away</div></li></ul></div></div>';
                                                    }
                                                    
                                                  document.getElementById('Itinerary').innerHTML = document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+place.place_id+'"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-1 col-xs-1 paddingzero Del" style="display:none"><img class="img-responsive" src="images/trash.svg" style="Height: 35px; width: 35px;" /></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px;"/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div>';
                                                  //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;

                                                  struct='';
                                                  Itineraries_list.push(place.place_id);
                                                  Itineraries_Ad.push(place.vicinity);
                                                  Tour_List.push('1');
                                                  $("#ADD_New").val("");
                                                
                                                  if($('#List_'+place.place_id).length)    // use this if you are using id to check
                                                  { 
                                                    var abcn="."+place.place_id;
                                                    $(abcn).each(function() {
                                                        $(this).addClass('addItinerary');
                                                    });
                                                  }
                                            }
                                    }
                                    else
                                    {
                                      //swal(status);
                                    }
                                });
                          })(str_array,i);
                        
                    }
                  }
              },
              error: function(e) {
                console.log(e.message);
              },
              complete: function(data) {
                // $.LoadingOverlay("hide");
              }
           });

           $('#mapCanvas').show();
           $('#MyTrips').hide();
           $('#BuildSearchUi').hide();
           }
           else
           {
           swal("No tours found.");
           return;
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           											setTimeout(function() {
                                 $.LoadingOverlay("hide");
           											},3000);
           											//console.log(data.message);
           }
           });
}
//load trips in itinerary view ends here



//Share_trip function that share the trip over social networking site starts here
function Share_trip(Share_id)
{
    swal({
         title: "Share",
         text: "Please select any one...</br></br><input class=\"visibleInput\" onclick=\"swal.close()\" type=\"button\" name=\"cancel\" value=\"​Cancel and close window\">",
         html: true,
         type: "info",
         showCancelButton: true,
         confirmButtonText: "Share via Sms.",
         cancelButtonText: "Share Via Facebook.",
         closeOnConfirm: true,
         closeOnCancel: true
         },
         function(isConfirm) {
         if (isConfirm) {
         var link ="http://52.87.180.150/xplore/index.php/site/Shared?Tour_Id=";
         if(typeof Share_id !== 'undefined')
         {
         link =link + Share_id;
         }
         else
         {
         return;
         }
         
         link=encodeURI(link);
         
         var message = link;
         window.plugins.socialsharing.shareViaSMS(link, null /* see the note below */, function(msg) {console.log('ok: ' + msg)}, function(msg) {alert('error: ' + msg)});
         } else {
         var link ="http://52.87.180.150/xplore/index.php/site/Shared?Tour_Id=";
         
         if(typeof Share_id !== 'undefined')
         {
         link =link + Share_id;
         }
         else
         {
         return;
         }
         
         link=encodeURI(link);
         //alert(link);
         facebookConnectPlugin.showDialog(
                                          {
                                          method: "feed",
                                          link: link,
                                          caption: 'Check This Out'
                                          },
                                          function (userData_2) {
                                          //console.log(userData_2);
                                          },
                                          function (error) {
                                          swal("" + error);
                                          });

         }
         });
    
    //console.log("share tour");
    //alert("share");
}
//Share_trip function that share the trip over social networking site ends here


//Edit_Trip function that edit the trip over server starts here
function Edit_Trip(srno)
{
    T_Profile = document.getElementById('Profile_'+srno).innerHTML;
    T_name = document.getElementById('Name_'+srno).innerHTML;
    T_des = document.getElementById('Description_'+srno).innerHTML;
    T_Pl_Log = document.getElementById('PlaceLog_'+srno).value;
    T_tag = document.getElementById('Tag_'+srno).value;
    
    document.getElementById("Tour_Owner_Status").value="True";
    document.getElementById("name_t").value = T_name;
    document.getElementById("desc_t").value = T_des;
    document.getElementById("Tag_t").value = T_tag;
   
    
    T_Flag = "true";
    T_SrNo = srno;
    Load_Trips(srno);
    //swal("share tour");
}
//Edit_Trip function that edit the trip over server ends here

function Edit_Trip_Call()
{
    var ProfileTour= T_Profile;
    
    if($('#Public').is(':checked'))
    {
        ProfileTour="Public";
    }
    else
    {
        ProfileTour="Private";
    }

    
    //console.log("in Edit tour function");
    if(FbUserId_Log == "")
    {
        alert("Please Login First");
        return;
    }

    
    var Tour_description = document.getElementById("desc_t").value;
    var Tour_name = document.getElementById("name_t").value;
    var tag = document.getElementById("Tag_t").value;
    var Id = T_SrNo;
    var date=document.getElementById("Date_t").value;
    

    var Places_List_all=[];
    var profile = '';
    
    $(".ALL_Places_Tour").each(function()
                               {
                               var Places_List=$(this).attr('id');
                               var index = Places_List.indexOf('_');
                               Places_List_all.push(Places_List.substr(index+1));
                               });
    
    $('.Place_custom_detail').each(function(){
            var selector = $(this).find('.selectpicker').val();
            var detail = $(this).find('.Custom_detail').val();

            for(var i=0;i<Places_List_all.length;i++)
            {
              if(Places_List_all[i] == selector)
              {
                Places_List_all[i] = Places_List_all[i] +':'+ btoa(detail);
              }
            }
    });

    if(Tour_name == "")
    {
        alert("Please enter tour name");
        return;
    }
    
    if(Tour_description == "")
    {
        alert("Please enter tour description.");
        return;
    }
    
    if (!date) {
        //console.log("No value!");
    }
    else
    {
        calendar(Tour_name,Tour_description,date);
    }
    
    var detail = {
        "Places_List_all" : Places_List_all.toString(),
        "Description" : Tour_description,
    };
    
    var url = site_url+'site/EditTour?';
    
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
            srno : Id,
            Tour_name : Tour_name,
            detail : JSON.stringify(detail),
            userid : FbUserId_Log,
            ProfileTour : ProfileTour.toString()
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           //$("#loader_image").css("display","block");
           },
           crossDomain: true,
           
           success: function(res) {
           //alert()
           if(JSON.stringify(res))
           {
           Save_id="0";
           process="";
           swal("Stored successfully (Edit trip call)");
           //T_Flag = false;
           GoToItinerary();
           }
           else
           {
           swal("No tours found.");
           
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           //alert(data.message);
           //console.log(data.message);
           }
           });
    }

//Delete function that delete the trip over server starts here
function Delete_Trip(srno)
{
    //alert("load tour" + srno);
    if(FbUserId_Log == "")
    {
        alert("Please Login First");
        return;
    }
    
    var url = site_url+'site/DeleteTour?';
    
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           srno : srno
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           //$("#loader_image").css("display","block");
           },
           crossDomain: true,
           
           success: function(res) {
           //alert("success" + JSON.stringify(res));
           if(res[0]!= "no-data Updated")
           {
            //console.log(res);
            Get_Tour();
           }
           else
           {
            swal("No tours found.");
            document.getElementById("MyTripList").innerHTML="";
            $('#MyTrips').hide();
            $('#TourMapCanvas').show();
            return;
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           //alert(data.message);
           //console.log(data.message);
           }
           });

}
//Delete function that delete the trip over server ends here

// function Tour_Map_Canvas()
// {
// 	$("#DetailBackButton").attr("onclick","goToNearByPlace()");
//  Markers=[];
//  //console.log("Tour Map");

//  if($('#ListDetail').is(":visible"))
//  {
//  		$('#ListDetail').hide("slide", {direction: "down"},1150);
//  		// Show from right / hide to right
//    $('#TourMapCanvas').show("slide", {direction: "up"},1150);
//    return;
//  }
//  else
//  {
//    $('#itinerary_Ui').hide();
//    $('#TourMapCanvas').show();
//    $.LoadingOverlay("show");
//  }
//  var useragent = navigator.userAgent;
//  //alert(useragent);
//  var mapdiv = document.getElementById("Tour_map_canvas");
//  var mapitem = document.getElementById("Tour_map_item");
                                                                      
//  if ((useragent.indexOf('Android 3.') != -1) && (screen.width >= 800) && (screen.height >= 800)) {
//      mapdiv.style.height = '450px';
//      //mapdiv.style.margin = '0.8em';
//  } else if ((useragent.indexOf('Android 2.') != -1 ) || (useragent.indexOf('Android 3.') != -1 )) {
//      mapitem.style.maxWidth = '490px';
//      mapdiv.style.height = '270px';
//      //mapdiv.style.margin = '0.4em';
//  } else {
//      mapdiv.style.height = '420px';
//      //mapdiv.style.margin = '1em';
//  }
  
//  var mapOptions = {
//                    zoom: 15,
//                    center: myLatLng,
//                    mapTypeId: google.maps.MapTypeId.ROADMAP
//                   };
//  map = new google.maps.Map(document.getElementById("Tour_map_canvas"), mapOptions);
//  marker = new google.maps.Marker({
//  position: myLatLng,
//  map: map,
//  icon: 'images/map_marker.gif',
//  optimized: false
//  });
//  Markers.push(marker);
//  marker.info = new google.maps.InfoWindow({content: 'My location.'});
//  marker.info.open(map, marker);
                                                                      
//  var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
//  watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);//whatch the current position of the user to stop set watchId - to null.
                                                                      
//  var no = '';
//  var name_p = [];
//  var lat_P = [];
//  var placeId_P=[];
//  var long_P = [];
//  var Dista_P = [];
//  var bounds = new google.maps.LatLngBounds();
//  $(".YetToVisitedNode").each(function() {
//     var ID_Place=$(this).attr('id');
//     var index = ID_Place.indexOf('_');
//     ID_Place= ID_Place.substr(index+1);
//     var name = document.getElementById('Place_name'+ID_Place).innerHTML;
//     var Dista_ = document.getElementById('Dista_'+ID_Place).innerHTML;
//     var latitude_p = document.getElementById('Lat_'+ID_Place).value;
//     var Longitude_P = document.getElementById('Log_'+ID_Place).value;
//     name=name+" - "+Dista_;
//     name_p.push(name);
//     placeId_P.push(ID_Place);
//     lat_P.push(latitude_p);
//     long_P.push(Longitude_P);
//  });
//  bounds.extend(myLatLng);
//  for(var j=0; j<name_p.length;j++)
//  {
//    var position = new google.maps.LatLng(lat_P[j], long_P[j]);
//    bounds.extend(position);
//    marker = new google.maps.Marker({
//    position: position,
//    map: map
//    });
//    Markers.push(marker);
//    google.maps.event.addListener(marker, 'click', (function(marker, j) {
//        return function() {
//                            marker.info.close();
//                            marker.info = new google.maps.InfoWindow({ content: ''+name_p[j] + '' });
//                            marker.info.open(map, marker);
//                            var TourTag = $('#Itinerari_'+placeId_P[j]).children('div:first');
//                            console.log('In map marker on click'+ TourTag);
//                            $.LoadingOverlay("show");
//                            Detail(TourTag,'MAP');
//                           }
//    })(marker, j));
//    // code to open markar by default
//    marker.info = new google.maps.InfoWindow({content: ''+name_p[j] + ''});
//    marker.info.open(map, marker);
//   }
//   map.fitBounds(bounds);
//   setTimeout(function(){
//                        $.LoadingOverlay("hide");
//                       }, 2000);
// }
//show the tour on the map with all the places start here
                                                                      
// function onSuccess(position) {
//      latLngSetMarker(Markers[0],Markers[0].position.lat(),Markers[0].position.lng(),position.coords.latitude,position.coords.longitude,0);
// }//show the tour on the map with current place start here
                                                                      
// function latLngSetMarker(marker,fromLat,fromLng,toLat,toLng,index)
// {
//  //alert('latLngSetMarker');
// if($('#ListDetail').is(":visible"))
// {
//   $('#ListDetail').hide("slide", {direction: "down"},1150);
//                                                                       // Show from right / hide to right
//   $('#TourMapCanvas').show("slide", {direction: "up"},1150);
//   return;
// }
 
//  var curLat,curLng;
//  frames = [];
//  // FORK // Increase percent * speed
//  for (var percent = 0; percent < 1; percent += (0.050 * 0.5))
//  {
//    curLat = fromLat + percent * (toLat - fromLat);
//    curLng = fromLng + percent * (toLng - fromLng);
//    frames.push(new google.maps.LatLng(curLat, curLng));
//  }
//  //alert(frames.length);
                                                                      
//  move = function(marker, latlngs, index1, wait, newDestination) {
//                    marker.setPosition(latlngs[index1]);
//                    Markers[index]= marker;
//                    if(index1 != latlngs.length-1) {
//                              // call the next "frame" of the animation
//                             setTimeout(function() {
//                                         move(marker, latlngs, index1+1, wait, newDestination);
//                             }, wait);
//                    }
//  }
                                                                      
//  // begin animation, stop after completion
//  move(marker, frames, 0, 10, marker.position);
// }

// function onError(error) {
//     //console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
//     if(error.code==1)
//     {
//     console.log("Please allow retail safari to access the location.")
//     }
//     else
//     {
//     //setTimeout(
//         //Tour_Map_Canvas(),500);
//     }
// }


// function clearWatch() {
//     if (watchID != null) {
//                    navigator.geolocation.clearWatch(watchID);
//                    watchID = null;
//     }
// }

function help(Page)
{
  var helpstatus=localStorage.getItem("HelpToggle");
                                                                      
  if(helpstatus == 'false')
  {
    return;
  }
  
  var page_ = {
        "Get_current" : "Get_current",
        "Map" : "Map",
        "Category" : "Category",
        "Listing" : "Listing",
        "Detail" : "Detail",
        "Tour" : "Tour",
        "save" : "save",
        "Map" : "Map",
        "Mytrips" : "Mytrips",
        "Settings" : "Settings"
   };
   swal(page_[Page]);
}

function Tour_Clear(Select)
{
        swal({
              title: "Are you sure?",
             text: "You are about to clear your tour list.",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes, clear it!",
             closeOnConfirm: false
         },
         function()
         {
                    if(Select == "Build" && (Itineraries_list.length >0 || Itineraries_Ad.length >0))
                    {
                      Ui_Name="PublicTours";
                      document.getElementById("thread_").innerHTML='<a href="#" onclick="Build_SearchTours()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
                      GoToItinerary();
                      document.getElementById("desc_t").value="";
                      document.getElementById("Tag_t").value="";
                      document.getElementById("Tour_Owner_Status").value="";
                      document.getElementById("name_t").value="";
                      T_SrNo = '';
                      swal.close();
                      return;
                    }
         
         
                    Itineraries_list=[];
                    Itineraries_Ad=[];
                    Tour_List=[];
                    T_Flag="false";
                    document.getElementById("desc_t").value="";
                    document.getElementById("Tag_t").value="";
                    document.getElementById("Tour_Owner_Status").value="";
                    document.getElementById("name_t").value="";
                    T_SrNo = '';
                    document.getElementById('Itinerary').innerHTML='';
                    //document.getElementById('Tour_List').innerHTML='';
                    
                                        $(".addItinerary").each(function()
                      {
                            $(this).removeClass('addItinerary');
                      });
                    Save_id="0";
                    process="";
            swal.close();
         
            if(Select != 'Clear_list' )
                    GoToItinerary();
    });
}

function List_Clear(Select)
{
        swal({
              title: "Are you sure?",
             text: "You are clearing your selections.",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes, clear it!",
             closeOnConfirm: false
         },
         function()
         {
            $('.addItinerary').each(function()
            {
              $(this).find('.readMore').parent().trigger( "click" );
            });
            swal.close();
         });
}

function Notification()
{
    var ref = window.open('https://www.facebook.com/Xplore1Notification/','_system','location=yes');
    ref.addEventListener('loadstart', function() { alert('start: ' + event.url); });
    ref.addEventListener('loadstop', function() { alert('stop: ' + event.url); });
    ref.addEventListener('exit', function() { alert(event.type); });
    return;
}



function Build_SearchTours()
{
    Ui_Name="PublicTours";
    $('#BuildSearchUi').show();
    $('#NotificationUi').hide();
    $('#homepage').hide();
    $('#mapCanvas').hide();
    $('#nearByPlace').hide();
    $('#CatagoryPage').hide();
    $('#Detail').hide();
    $('#itinerary_Ui').hide();
    $('#ListDetail').hide();
    $('#Save_Ui').hide();
    $('#MyTrips').hide();
    //$('#Build_ui').hide();
    //PublicTours();
    document.getElementById("thread_").innerHTML='<a href="#" onclick="Build_SearchTours()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
    autocompleteBox("undefined");
    //alert($('#visitedButton1').hasClass('active'));
    if($('#visitedButton1').hasClass('active'))
    {
     $('#visitedButton1').removeClass('active');
     if(!($('#visitedButton2').hasClass('active')))
     {
      $('#visitedButton2').addClass('active');
     }
    }
}

function PublicTours()
{
    var url = site_url+'site/getPublicTour?';
    
    var prefarance = "Public";
    Ui_Name="PublicTours";
    //$('#Build_ui').hide();
    $('#Search_ui').show();
}


function Like_trip(SrNo,countlike)
{
    //alert(SrNo+" "+countlike+" "+FbUserId);
    
    var like =document.getElementById("like_"+SrNo).innerHTML;
    var id = like.split('L');
    //alert(parseInt(id[0]));
    
    if(FbUserId_Log == '')
    {
        FbUserId_Log = FbLogin("Likes");
        //FbLogin("Like");
        if(FbUserId_Log == '')
        {
        alert("Please login first");
        return;
        }
    }
  var url = site_url+'site/set_like?';
  $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           SRno :   SrNo,
           U_id :   FbUserId_Log
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           //$("#loader_image").css("display","block");
           },
           crossDomain: true,
           
           success: function(res) {
          
           if(res[0]!= "no-data")
           {
            if(JSON.stringify(res) == "true")
            {
                var count1=parseInt(id[0])-1;
                if(parseInt(id[0]) == 1)
                count1="0";
           
                document.getElementById("like_"+SrNo).innerHTML= count1+" Likes" ;
            }
            else
            {
                //alert(JSON.stringify(res));
                var count1=parseInt(id[0])+1;
                document.getElementById("like_"+SrNo).innerHTML= count1+" Likes" ;
            }
           }
           else
           {
           swal("No tours found.");
           document.getElementById("Search_ui_Data").innerHTML="";
           return;
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           //alert(data.message);
           //console.log(data.message);
           }
           })
}

function autocompleteBox(thisKey)
{
   // alert(thisKey);
    FbLogin("Auto",thisKey);
}


function autocompletecat(thisKey)
{
    AutoC = $(thisKey).val();
    //alert("hi");
    var url = site_url+'site/AutocompleteTag?';
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           AutoC  :   AutoC
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           //$("#loader_image").css("display","block");
           },
           crossDomain: true,
           success: function(res) {
           //alert(res[0].Category);
           var availableTags = [];
           
           if(res[0]!= "no-data")
           {
           //var availableTags = [];
           for(var i=0;i<res.length;i++)
           {
           var tags=JSON.stringify(res[i].Category);
           if(tags.indexOf(','))
           {
           var arraytag = tags.split(',');
           for(var JK=0; JK<arraytag.length; JK++)
           {
           var index=availableTags.indexOf(arraytag[JK]);
           if(index == -1 || availableTags.length==0)
           {
           availableTags.push(arraytag[JK]);
           }
           }
           }
           else
           {
           var index=availableTags.indexOf(tags);
           if(index == -1 || availableTags.length==0)
           {
           availableTags.push(tags);
           }
           }
           }
           
           availableTags=unique(availableTags);
           
           $('#tokenize').autocomplete({
                                          datas: availableTags
                                          });
           $( "#tokenize" ).focus();
           }
           else
           {
           availableTags.push("error");
           
           
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           }
           });
}

function unique(list)
{
           var result = [];
           $.each(list, function(i, e) {
                  if ($.inArray(e, result) == -1) result.push(e);
           });
           return result;
 }

                                              
                                              
function autocompletemain(thisKey)
{
    if(FbUserId_Log == "")
    {
        alert("Please login first");
        return;
    }
    
    
    var AutoC="";
    if(thisKey != "undefined")
    {
        AutoC = $(thisKey).val();
    }
    
    var url = site_url+'site/AutocompleteBox?';
    $.ajax({
           type: 'GET',
           url: url,
           contentType: "application/json",
           dataType: 'jsonp',
           jsonp: 'callback',
           data: {
           AutoC  :   AutoC
           },
           beforeSend : function(){
           //$("#visited_site_list").html('');
           //$("#loader_image").css("display","block");
           },
           crossDomain: true,
           
           success: function(res) {
           
           if(res[0]!= "no-data")
           {
           //alert(JSON.stringify(res));
           document.getElementById("Search_ui_Data").innerHTML='';
           var abc='';
           for(var i=0; i<res.length; i++)
           {
           var myObj = JSON.parse(res[i].Detail);
           var str_array = myObj.Places_List_all.split(',');
           var description_='';
           if(myObj.Description.length >150)
           {
              description_=myObj.Description.substr(0,150) + "...";
           }
           else
           {
              description_=myObj.Description;
           }

           var ind=res[i].Last_Update.indexOf(' ');
           var upd=res[i].Last_Update.slice(0,ind);
           var date= upd.split("-");

           upd= date[2]+'/'+date[1]+'/'+date[0];
           
           var struct='<div class="col-sm-8 col-xs-8 paddingzero" onclick="Load_Trips('+res[i].SrNo+')"><div class="col-sm-2 col-xs-2 paddingzero"><img class="img-responsive profileImage" src="https://graph.facebook.com/'+res[i].FbUserId+'/picture?type=large" /></div><div class="col-sm-8 col-xs-8 paddingzero paddingleft"><ul><li class="title Name" id="Name_'+res[i].SrNo+'"> '+res[i].TourName+'</li><li class="title itinerarydes tripDesc" id="Description_'+res[i].SrNo+'"> '+description_+'</li><li class="title itinerarydes tripDesc" id="Last_updated'+res[i].SrNo+'"> '+upd+'</li><li class="generalStatus" id="like_'+res[i].SrNo+'">No of likes '+res[i].countlike+'</li></ul></div></div><div class="col-sm-2 col-xs-2 paddingzero"><div class="edit" onclick="Share_trip('+res[i].SrNo+')"><img class="img-responsive" src="images/share.svg" style="Height: 15px; width: 15px;"/>Share</div></div><div class="col-sm-2 col-xs-2 paddingzero"><div class="edit" onclick="Like_trip('+res[i].SrNo+','+res[i].countlike+')"><img class="img-responsive" src="images/ThumbUp.svg" style="Height: 15px; width: 15px;"/>Like</div></div>';
           
           abc = abc + '<div class="col-sm-12 col-xs-12 paddingtb myNewTour" id="TourList_'+res[i].SrNo+'"><input type="hidden" id="PlaceLog_'+res[i].SrNo+'" value="'+myObj.Places_List_all+'"/><input type="hidden" id="UserId_'+res[i].SrNo+'" value="'+res[i].FbUserId+'"/>' + struct + '</div>';
           
           }
           document.getElementById("Search_ui_Data").innerHTML=abc;
           }
           else
           {
            document.getElementById("Search_ui_Data").innerHTML="No Data available";
            return;
           }
           },
           error: function(e) {
           console.log(e.message);
           },
           complete: function(data) {
           //alert(data.message);
           //console.log(data.message);
           }
           });
}

function show_categories()
{
  if($("#mapCanvas").hasClass( "Small_class" ))
  {
     $('#Cat1').hide("slide", {direction: "down"},400);
     $('#Cat2').hide("slide", {direction: "down"},400);
     $('#Cat3').hide("slide", {direction: "down"},400);
     $('#Cat4').hide("slide", {direction: "down"},400);
     $('#Cat5').hide("slide", {direction: "down"},400);
     $('#Cat7').hide("slide", {direction: "down"},400);
     $('#myNewListing').hide();
     $('#myNewTour').hide();
     $('#mainCatagoryUi').show("slide", {direction: "down"},400);
  }
  else
  {
    $("#mapCanvas").addClass("Small_class");
    $("#mapCanvas .mapCanvasFull").animate({height:'68px'},400);
    $("#mapCanvas #map_canvas").animate({height:'0%'},400);
    $('#Cat1').hide("slide", {direction: "down"},400);
    $('#Cat2').hide("slide", {direction: "down"},400);
    $('#Cat3').hide("slide", {direction: "down"},400);
    $('#Cat4').hide("slide", {direction: "down"},400);
    $('#Cat5').hide("slide", {direction: "down"},400);
    $('#Cat7').hide("slide", {direction: "down"},400);
    $('#myNewListing').hide();
    $('#myNewTour').hide();
    $('#mainCatagoryUi').show("slide", {direction: "down"},400);
  }
}

function showSubCatagory(abc)
{
  $('#'+abc).show("slide", {direction: "up"},400);
  $('#mainCatagoryUi').hide("slide", {direction: "down"},400);
}

function closeTab()
{
  $('#mainCatagoryUi').show("slide", {direction: "down"},400);
  $('#Cat1').hide("slide", {direction: "down"},400);
  $('#Cat2').hide("slide", {direction: "down"},400);
  $('#Cat3').hide("slide", {direction: "down"},400);
  $('#Cat4').hide("slide", {direction: "down"},400);
  $('#Cat5').hide("slide", {direction: "down"},400);
  $('#Cat7').hide("slide", {direction: "down"},400);
  $('#myNewListing').hide();
  $('#myNewTour').hide();
}

function show_Listings()
{
  if($("#mapCanvas").hasClass( "Small_class" ))
  {
    $('#Cat1').hide("slide", {direction: "down"},400);
    $('#Cat2').hide("slide", {direction: "down"},400);
    $('#Cat3').hide("slide", {direction: "down"},400);
    $('#Cat4').hide("slide", {direction: "down"},400);
    $('#Cat5').hide("slide", {direction: "down"},400);
    $('#Cat7').hide("slide", {direction: "down"},400);
    $('#mainCatagoryUi').hide("slide", {direction: "down"},400);
    $('#myNewTour').hide();
				$('#myNewListing').show();
    Places();
  }
  else
  {
    $("#mapCanvas").addClass("Small_class");
    $("#mapCanvas .mapCanvasFull").animate({height:'68px'},400);
    $("#mapCanvas #map_canvas").animate({height:'0%'},400);
    $('#Cat1').hide();
    $('#Cat2').hide();
    $('#Cat3').hide();
    $('#Cat4').hide();
    $('#Cat5').hide();
    $('#Cat6').hide();
    $('#Cat7').hide();
    $('#mainCatagoryUi').hide();
				$('#myNewTour').hide();
				$('#myNewListing').show();
  		Places();
  }
  var panelSubsCount = $('.Listing .panel-group .panel-body');
  if(panelSubsCount.length > 	1)
  {
  	$('.Listing .panel-group .panel-body').addClass('ListingTabsHeight');
  }
  else
  {
   $('.Listing .panel-group .panel-body').removeClass('ListingTabsHeight');
  }
}


function show_Tour()
{
if($("#mapCanvas").hasClass( "Small_class" ))
{
    $('#Cat1').hide("slide", {direction: "down"},400);
    $('#Cat2').hide("slide", {direction: "down"},400);
    $('#Cat3').hide("slide", {direction: "down"},400);
    $('#Cat4').hide("slide", {direction: "down"},400);
    $('#Cat5').hide("slide", {direction: "down"},400);
    $('#Cat7').hide("slide", {direction: "down"},400);
    $('#mainCatagoryUi').hide("slide", {direction: "down"},400);
	  	$('#myNewListing').hide();
				$('#myNewTour').show();
}
else
{
    $("#mapCanvas").addClass("Small_class");
    $("#mapCanvas .mapCanvasFull").animate({height:'68px'},400);
    $("#mapCanvas #map_canvas").animate({height:'0%'},400);
    $('#Cat1').hide();
    $('#Cat2').hide();
    $('#Cat3').hide();
    $('#Cat4').hide();
    $('#Cat5').hide();
    $('#Cat6').hide();
    $('#Cat7').hide();
    $('#mainCatagoryUi').hide();
  	 $('#myNewListing').hide();
  	 $('#myNewTour').show();
 }
}

function Show_Map()
{
  if(parseInt($(window).width()) <= 320)
  {
     $("#mapCanvas .mapCanvasFull").animate({height:'85%'},400);
     $("#mapCanvas #map_canvas").animate({height:'71%'},400); 
    // #mapCanvas .mapCanvasFull{height: 85%;}  #mapCanvas #map_canvas{height: 71%;}
  }
  else
  {
     $("#mapCanvas .mapCanvasFull").animate({height:'94%'},400);
     $("#mapCanvas #map_canvas").animate({height:'78%'},400);
    // #mapCanvas .mapCanvasFull{height: 85%;}  #mapCanvas #map_canvas{height: 71%;}
  }

  window.setTimeout(function(){ google.maps.event.trigger(map, 'resize'); Reset_map('tab');}, 1000);
  $("#mapCanvas").removeClass("Small_class");
  $('#Cat1').hide();
  $('#Cat2').hide();
  $('#Cat3').hide();
  $('#Cat4').hide();
  $('#Cat5').hide();
  $('#Cat7').hide();
  $('#mainCatagoryUi').hide();
  $('#myNewListing').hide();
  $('#myNewTour').hide();
  Map_places_suggestion();
}

function Markers_reset()
{

}

$(document).ready(function()
{
      mylat  = 41.8818; //Chicago
      
      mylong = -87.6633;  //Chicago
      
      myLatLng = new google.maps.LatLng(mylat, mylong);
      
      var mapOptions = {
                zoom: 15,
                center: myLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
               };
      
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

      google.maps.event.addListener(map, "idle", function(){
            google.maps.event.trigger(map, 'resize');
           
      });
})

$(document).ready(function()
{

});

function Edit_Description()
{
    $('#add_tour_place_detail').html('');
    var Places_List_all=[];
    var place_name_list=[];

    $(".ALL_Places_Tour").each(function()
    {

      var Places_List = $(this).attr('id');
      var index = Places_List.indexOf('_');
      Places_List_all.push(Places_List.substr(index+1));

      var name_span = document.getElementById('Place_name'+Places_List.substr(index+1)).innerHTML;
      var name = name_span.split('<');
      place_name_list.push(name[0]);

    });

		$('.ALL_Places_Tour .accordion-body').each(function()
    {
          var Places_List = $(this).closest( ".ALL_Places_Tour" ).attr('id');
          var index = Places_List.indexOf('_');
          var id = Places_List.substr(index+1);

          var data = '<div class="form-group col-sm-12 col-xs-12 paddingzero Place_custom_detail"><div class="form-group col-sm-12 col-xs-12 paddingzero"><div class="form-group col-sm-9 col-xs-9 paddingzero selectDes"><select class="selectpicker" data-style="btn-danger"><option value="">Choose one of the following...</option>';
          for(var i=0;i<Places_List_all.length;i++)
          {
            if(id == Places_List_all[i])
            {
              data=data+'<option value="'+Places_List_all[i]+'" selected>'+place_name_list[i]+'</option>';
            }
            else
            {
              data=data+'<option value="'+Places_List_all[i]+'" >'+place_name_list[i]+'</option>';
            }
          }
          data = data + '</select></div><div class="form-group col-sm-3 col-xs-3 txtright" onclick="Delete_description(this);"><img src="images/minus.png"></div></div><div class="saveTextdesc form-group col-sm-12 col-xs-12 paddingzero"><textarea class="form-control Custom_detail" rows="3" placeholder="Add More Description" required="">'+$(this).html()+'</textarea></div></div>';
          
          //var data_ = $('#add_tour_place_detail').html();
          $('#add_tour_place_detail').append(data);  
    });
}

function Addmore_description()
{
    var Places_List_all=[];
    var place_name_list=[];

    $(".ALL_Places_Tour").each(function()
    {

      var Places_List = $(this).attr('id');
      var index = Places_List.indexOf('_');
      Places_List_all.push(Places_List.substr(index+1));

      var name_span = document.getElementById('Place_name'+Places_List.substr(index+1)).innerHTML;
      var name = name_span.split('<');
      place_name_list.push(name[0]);

    });
    
    var data = '<div class="form-group col-sm-12 col-xs-12 paddingzero Place_custom_detail"><div class="form-group col-sm-12 col-xs-12 paddingzero"><div class="form-group col-sm-9 col-xs-9 paddingzero selectDes"><select class="selectpicker" data-style="btn-danger"><option value="">Choose one of the following...</option>';
    for(var i=0;i<Places_List_all.length;i++)
    {
      data=data+'<option value="'+Places_List_all[i]+'" >'+place_name_list[i]+'</option>';
    }
    data = data + '</select></div><div class="form-group col-sm-3 col-xs-3 txtright" onclick="Delete_description(this);"><img src="images/minus.png"></div></div><div class="saveTextdesc form-group col-sm-12 col-xs-12 paddingzero"><textarea class="form-control Custom_detail" rows="3" placeholder="Add More Description" required=""></textarea></div></div>';
    
    //var data_ = $('#add_tour_place_detail').html();
    $('#add_tour_place_detail').append(data);
}

function Delete_description(This)
{
  $(This).closest('.Place_custom_detail').remove();
}

function chk_scroll(e) {
    var elem = $(e.currentTarget);
    if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
        SeeMoreInfo(e.currentTarget.id);
    }
}

function Reset_map(abc)
{
 $.LoadingOverlay("show");
 if(abc == "nearBy")
 {
    map_place_list=[];
    var m=Markers[0];
    for(var i=1;i<Markers.length;i++)
    {
      Markers[i].info.close();
      Markers[i].setMap(null);
    }
     Markers=[];
    Markers.push(m)
    var no = '';
    var name_p = [];
    var lat_P = [];
    var placeId_P=[];
    var long_P = [];
    var Dista_P = [];
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
    marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >You are at..  <br/>'+Location_info+'</div>'});
    
    if(Location_info.length <= 50)
    {
      $('#User_location_bar').html(Location_info);
    }
    else
    {
      $('#User_location_bar').html(Location_info.substr(0, 50));
    }
    marker.info.open(map, marker);
    Markers.push(marker);
    console.log('push'+Markers.length);
    $(".YetToVisitedNode").each(function() {
                                var ID_Place=$(this).attr('id');
                                var index = ID_Place.indexOf('_');
                                ID_Place= ID_Place.substr(index+1);
                                var name = document.getElementById('Place_name'+ID_Place).innerHTML;
                                var Dista_ = document.getElementById('Dista_'+ID_Place).innerHTML;
                                var latitude_p = document.getElementById('Lat_'+ID_Place).value;
                                var Longitude_P = document.getElementById('Log_'+ID_Place).value;
                                name=name+" - "+Dista_;
                                name_p.push(name);
                                placeId_P.push(ID_Place);
                                lat_P.push(latitude_p);
                                long_P.push(Longitude_P);
                                });
    
    bounds.extend(myLatLng);
    for(var j=0; j<name_p.length;j++)
    {
    var position = new google.maps.LatLng(lat_P[j], long_P[j]);
    bounds.extend(position);
    marker = new google.maps.Marker({
                                    position: position,
                                    map: map
                                    });
    Markers.push(marker);
    console.log('push');
    map_place_list.push(placeId_P[j]);
    google.maps.event.addListener(marker, 'click', (function(marker, j) {
                                                    return function() {
                                                    marker.info.close();
                                                    marker.info = new google.maps.InfoWindow({ content: '<div class="InfoWindo" >'+name_p[j] + '</div>' });
                                                    marker.info.open(map, marker);
                                                    var TourTag = $('#Itinerari_'+placeId_P[j]).children('div:first');
                                                    Detail(TourTag,'MAP');
                                                    }
                                                    })(marker, j));
    // code to open markar by default
    marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >'+name_p[j] + '</div>'});
    marker.info.open(map, marker);
    }
    if(Markers.length>1)
    {
      map.fitBounds(bounds);
    }
    //$.LoadingOverlay("hide");
 }
 else
 {
    map_place_list=[];
    var m=Markers[0];
    
    for(var i=1;i<Markers.length;i++)
    {
      Markers[i].info.close();
      Markers[i].setMap(null);
    }
    Markers=[];
    Markers.push(m)
    console.log('push');
    var no = '';
    var name_p = [];
    var lat_P = [];
    var placeId_P=[];
    var long_P = [];
    var Dista_P = [];
    var bounds = new google.maps.LatLngBounds();
    
    $(".YetToVisitedNode").each(function() {
                                var ID_Place=$(this).attr('id');
                                var index = ID_Place.indexOf('_');
                                ID_Place= ID_Place.substr(index+1);
                                var name = document.getElementById('Place_name'+ID_Place).innerHTML;
                                var Dista_ = document.getElementById('Dista_'+ID_Place).innerHTML;
                                var latitude_p = document.getElementById('Lat_'+ID_Place).value;
                                var Longitude_P = document.getElementById('Log_'+ID_Place).value;
                                name=name+" - "+Dista_;
                                name_p.push(name);
                                placeId_P.push(ID_Place);
                                lat_P.push(latitude_p);
                                long_P.push(Longitude_P);
                                });
    
    bounds.extend(new google.maps.LatLng(m.position.lat(),m.position.lng()));
    bounds.extend(myLatLng);
    for(var j=0; j<name_p.length;j++)
    {
    console.log('in for ' +name_p.length)
    var position = new google.maps.LatLng(lat_P[j], long_P[j]);
    bounds.extend(position);
    marker = new google.maps.Marker({
                                    position: position,
                                    map: map
                                    });
    Markers.push(marker);
    map_place_list.push(placeId_P[j]);
    google.maps.event.addListener(marker, 'click', (function(marker, j) {
                                                    return function() {
                                                    marker.info.close();
                                                    marker.info = new google.maps.InfoWindow({ content: '<div class="InfoWindo" >'+name_p[j] + '</div>' });
                                                    marker.info.open(map, marker);
                                                    var TourTag = $('#Itinerari_'+placeId_P[j]).children('div:first');
                                                    Detail(TourTag,'MAP');
                                                    }
                                                    })(marker, j));
    // code to open markar by default
    marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >'+name_p[j] + '</div>'});
    marker.info.open(map, marker);
    }
    if(Markers.length>1)
    {
      map.fitBounds(bounds);
    }
    $.LoadingOverlay("hide");
 }
                                                                      
 $.LoadingOverlay("hide");
 infoWindow_custom();
}


function Map_places_suggestion()
{
  // setTimeout(function(){
  //   if($("#mapCanvas #map_canvas").height() != 0)
  //   {
  //     var numItems = $('.YetToVisitedNode').length;
  //     if(numItems == 0)
  //     {
  //       swal({
  //             title: "No places have been selected",
  //             text: "Browse through our categories to discover places.",
  //             type: "warning",
  //             showCancelButton: true,
  //             confirmButtonColor: "#DD6B55",
  //             confirmButtonText: "Show categories.",
  //             closeOnConfirm: false
  //             },
  //             function()
  //             {
  //               show_categories()
  //               swal.close();
  //             });
  //     }
  //   }
  // },4000);
}

function infoWindow_custom()
{
 // / $('.gm-style-iw').prev().css({'display' : 'none'});
}

$('document').ready(function(){

  $(".check").change(function() 
  {
    if (!$(this).is(':checked')) 
    {
      var val=$(this).val();
      $('#'+val).find('.addItinerary').each(function()
      {
        $(this).find('.readMore').parent().trigger( "click" );
      });
      $('#'+val).remove();
    }
  });
  
  jQuery(function($) {
    $('.panel_scroll_end').on('scroll', function() {
           if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
           alert('end reached');
    							}
    })
  });

});

// show more button for view details view
function showMoreText() {
	//alert('Hi');
	var showChar = 200;
	var ellipsestext = "...";
	var moretext = "more";
	var lesstext = "less";
	$('.more').each(function() 
  {
    if(!$(this).hasClass("doneMore"))
    {
      $(this).addClass("doneMore");
  		var content = $(this).html();

  		if(content.length > showChar) {
        //alert('hi')
  			var c = content.substr(0, showChar);
  			var h = content.substr(showChar-1, content.length - showChar);

  			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

  			$(this).html(html);
  		}
    }
	});

	// $(".morelink").click(function()
 //  {
	// 	if($(this).hasClass("less")) 
 //    {
	// 		$(this).removeClass("less");
	// 		$(this).html(moretext);
	// 	} 
 //    else 
 //    {
	// 		$(this).addClass("less");
	// 		$(this).html(lesstext);
	// 	}
	// 	$(this).parent().prev().toggle();
	// 	$(this).prev().toggle();
	// 	return false;
	// });
}

$(document).on('click', '.morelink', function()
{
  if($(this).hasClass("less")) 
  {
    $(this).removeClass("less");
    $(this).html("more");
  } 
  else 
  {
    $(this).addClass("less");
    $(this).html("less");
  }
  $(this).parent().prev().toggle();
  $(this).prev().toggle();
  return false;
});


app.initialize();