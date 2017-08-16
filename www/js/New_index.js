var site_url ='http://34.231.31.72/xplore/index.php/';
var c_address='';
var map;
var marker;
var infowindows=[];
var map_place_list=[];
var Location_info='';
var Markers=[];
var infowindow;
var service;
var myLatLng;
var mylat ='';
var mylong ='';
var service_d;
var place_id_list=[];
var destination_list = [];
var Itineraries_list = [];
var Itineraries_Ad = [];
var Tour_List = [];
var Category_prop=[];
var category_In_Grid = "";
var res_list_direction= {}; // response list from distance matrix
var FbUserId_Log='';
var T_Flag="false"; //where T stands for trip.
var T_Profile = ""; //this stores trip details that were loaded in the tours section.
var T_name = "";    //ª
var T_SrNo = "";
var T_des =  "";
var T_tag = "";
var arr=[]; //listings for listings UI
var categories={};
var Save_id="0";
var WebLink="";

var watchID=null;

var categories = {
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

//this function is use to handle open urls from the websites
function handleOpenURL(url)
{
 // This function is triggered by Plugin
 setTimeout(function()
            {
            process="load_tour";
            var url_ = "" + url;
            var index=url_.indexOf('=');
            FbUserId_Log="_";
            url_ = url_.slice(index+1);
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
            // GoToItinerary();
            // FbLogin(url_); //do not delete
            }, 400);
}

$( document ).ready(function()
                    {
                    getAllNews();
                    getAllExperiance();
                    getTenEvent();
                    getAllDeals();
                    Grid_Add();
//                    getTenEvent();
//                    getTenDeals();
//                    GetExperiances();
                    getUnfeaturedEvent();
                    $("#mapCanvas").hide();
                    $("#homepage").show();
                    
                    var slider = new Slider('#ex1',
                                            {
                                            formatter: function(value)
                                            {
                                            document.getElementById('dis_text').value=value;
                                            return 'Miles: ' + value;
                                            }
                                            });
                    });

google.maps.event.addDomListener(window, 'load', function ()
                                 {
                                 var places1 = new google.maps.places.Autocomplete(document.getElementById('starting_location1'));
                                 var places2 = new google.maps.places.Autocomplete(document.getElementById('starting_location2'));
                                 var places3 = new google.maps.places.Autocomplete(document.getElementById('starting_location3'));
                                 var places4 = new google.maps.places.Autocomplete(document.getElementById('starting_location4'));
                                 
                                 //                                 google.maps.event.addListener(places1, 'place_changed', function () {
                                 //                                                               var numItems = $('.YetToVisitedNode').length;
                                 //                                                               alert(numItems);
                                 //                                                               c_address=places1;
                                 //                                                               if(numItems != 0)
                                 //                                                               {
                                 //                                                               confirn_remove(places1);
                                 //                                                               }
                                 //                                                               else
                                 //                                                               {
                                 //                                                               getCurrentLocation_auto(places1);
                                 //                                                               }
                                 //
                                 //                                                               });
                                 google.maps.event.addListener(places1, 'place_changed', function () {
                                                               var numItems = $('.YetToVisitedNode').length;
                                                               c_address=places1;
                                                               if(numItems != 0)
                                                               {
                                                               confirn_remove(places1);
                                                               }
                                                               else
                                                               {
                                                               getCurrentLocation_auto(places1);
                                                               }
                                                               
                                                               });
                                 
                                 google.maps.event.addListener(places2, 'place_changed', function () {
                                                               var numItems = $('.YetToVisitedNode').length;
                                                               //alert(numItems);
                                                               c_address=places2;
                                                               if(numItems != 0)
                                                               {
                                                               confirn_remove(places2);
                                                               }
                                                               else
                                                               {
                                                               getCurrentLocation_auto(places2);
                                                               }
                                                               
                                                               });
                                 
                                 google.maps.event.addListener(places3, 'place_changed', function () {
                                                               var numItems = $('.YetToVisitedNode').length;
                                                               //alert(numItems);
                                                               c_address=places3;
                                                               if(numItems != 0)
                                                               {
                                                               confirn_remove(places3);
                                                               }
                                                               else
                                                               {
                                                               getCurrentLocation_auto(places3);
                                                               }
                                                               
                                                               });
                                 
                                 google.maps.event.addListener(places4, 'place_changed', function () {
                                                               var numItems = $('.YetToVisitedNode').length;
                                                               // alert(numItems);
                                                               c_address=places4;
                                                               if(numItems != 0)
                                                               {
                                                               confirn_remove(places4);
                                                               }
                                                               else
                                                               {
                                                               getCurrentLocation_auto(places4);
                                                               }
                                                               
                                                               });
                                 
                                 var new_place = new google.maps.places.Autocomplete(document.getElementById('ADD_New'));
                                 google.maps.event.addListener(new_place, 'place_changed', function ()
                                                               {
                                                               var place = new_place.getPlace();
                                                               if (!place.geometry)
                                                               {
                                                               return;
                                                               }
                                                               
                                                               var flag=false;
                                                               $(".visitedNode").each(function()
                                                                                      {
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
                                                               
                                                               $(".YetToVisitedNode").each(function()
                                                                                           {
                                                                                           var id = this.id;
                                                                                           var index = id.indexOf('_');
                                                                                           if(index != -1)
                                                                                           {
                                                                                           id= id.substr(index+1);
                                                                                           }
                                                                                           if(id==place.place_id)
                                                                                           {
                                                                                           flag=true;
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
                                                               var $attrib = $('<div id="attributions"></div>');
                                                               $('#map_node').append($attrib);
                                                               service = new google.maps.places.PlacesService($attrib[0]);
                                                               service.getDetails({
                                                                                  placeId:place.place_id
                                                                                  },
                                                                                  function(place, status)
                                                                                  {
                                                                                  if (status === google.maps.places.PlacesServiceStatus.OK)
                                                                                  {
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

function getGuideList(){
// $(#mainCatagoryUi).hide();
// var url = site_url+'site/getGuideList?';
// $.ajax({
//        type: 'GET',
//        url: url,
//        contentType: "application/json",
//        dataType: 'jsonp',
//        jsonp: 'callback',
//        data: {},
//        beforeSend : function(){},
//        crossDomain: true,
//        success: function(res) {
//        var guide='';
//								guide=guide+'<h1>OK</h1>';
//        $('#guide_container').append(guide);
//        },
//        error: function(e) {
//        },
//        complete: function(data) {
//        
//        }
//        });
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
   struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingright"><img class="itineraryImg" src="'+place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 350})+'" /></div><div class="col-sm-8 col-xs-8 paddingzero" onclick="Detail(this,false)"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title itinerarydes customadd_desc" style="display:inherit;" id="Add_'+place.place_id+'"><img style="width:10px;margin-right:5px;" src="./assets/experiences/location_pin_icon.svg">'+id+'</li><li class="title itinerarydes dk" id="Distaaa_'+place.place_id+'"><!--<div style="float:left;">'+text+'</div>--><div class="flex" id="Dista_'+place.place_id+'">'+Dis+'&nbsp;away &nbsp&nbsp•&nbsp&nbsp<div class="green">OPEN</div></div></li></ul></div></div>';
  }
 }
 else
 {
  struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+place.place_id+'"  value="'+place.geometry.location.lat()+'"/><input type="hidden" id="Log_'+place.place_id+'" value="'+place.geometry.location.lng()+'"/><div class="col-sm-4 col-xs-4 paddingzero"><img class="itineraryImg" src="images/default.jpg" /></div><div class="col-sm-8 col-xs-8 paddingleft" onclick="Detail(this,false)"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+place.place_id+'"> '+place.name+' </li> <li class="title itinerarydes customadd_desc" id="Add_'+place.place_id+'"> '+id+'- <span id="Distance'+place.place_id+'">'+Dis+'</span></li><li class="title itinerarydes" id="Dista_'+place.place_id+'"><div style="float:left;">&nbsp;&nbsp;</div><div id="Di"></div></li></ul></div></div>';
 }
 
 // var struct1='<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+place.place_id+'"><div class="col-sm-10 col-xs-10 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-2 col-xs-2  paddingzero Del" style="display:none"><div class="markasvisited">Remove from list</div><img class="img-responsive pb3" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/></div><!--<div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px;"/></div>--><div class="markasvisited vis col-sm-2 col-xs-2 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+place.place_id+'" value="visited"><label for="Visited_'+place.place_id+'"></label></div></div></div>';
 
 var struct1=' <div class="col-sm-12 col-xs-12 borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode moveleft" id="Itinerari_'+place.place_id+'"><div class="col-sm-12 col-xs-12 paddingzero leftshift paddingtb" id="moveleft'+place.place_id+'" >' + struct + '</div><div class="visitOption col-sm-7 col-xs-7 markhidden paddingzero flex"><div class="col-sm-4 col-xs-4 img-responsive vis paddingzero handle Drag" ><img class="img-responsive" src="shift_position_icon.svg" style="Height: 25px; width: 25px;margin:6px 20px;"/> <div class="markasvisited">Shift</div></div><div class="markasvisited vis col-sm-4 col-xs-4 paddingzero" ><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+place.place_id+'" value="visited"><label for="Visited_'+place.place_id+'"></label><div class="markAsVisit">Mark visited</div></div><div onClick="delete_it(this)" class="col-sm-4 col-xs-4  paddingzero Del"><img class="img-responsive pb3" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/><div class="markasvisited">Delete</div></div>  </div></div>';
 
 
 
 document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + struct1;
 
 
 //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;
 $(".moveleft").on("swipeleft", "div.leftshift", function(){
                   var div_id = $(this).attr("id");
                   $(this).parents("div.moveleft").find(".visitOption").show("slide",{direction: "right"},500);
                   $(this).animate({"left": "-20%"}, 500);
                   });
 $(".moveleft").on("swiperight", "div.leftshift", function(){
                   var div_id = $(this).attr("id");
                   $(this).parents("div.moveleft").find(".visitOption").hide("slide",{direction: "right"},500);
                   $(this).animate({"left": "0%"},500);
                   });
 
 Itineraries_list.push(place.place_id);
 Itineraries_Ad.push(addr);
 Tour_List.push('1');
 $("#ADD_New").val("");
 var abcn="."+place.place_id;
 
 var latitude_p = place.geometry.location.lat();
 var Longitude_P = place.geometry.location.lng();
 
 
 const GOOGLE = new plugin.google.maps.LatLng(latitude_p,Longitude_P);
 map.addMarker({
               'position': GOOGLE,
               'title': place.name+'  '+Dis,
               disableAutoPan: true,
               'snippet': 'Click here to view place profile.',
               'styles' : {
               'text-align': 'center',
               'font-size': '8px',
               'width':'50px'
               //'font-weight':'bold'
               }
               },
               function(marker)
               {
               marker.showInfoWindow();
               Markers.push(marker);
               marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function()
                                       {
                                       var TourTag = $('#Itinerari_'+place.place_id).children('div:first');
                                       Detail(TourTag,"MAP");
                                       });
               });
 
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


function confirn_remove(places)
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
      $('#mapCanvas').hide();
      getCurrentLocation_auto(places);
      }else
      {
      swal.close();
      $('#mapCanvas').hide();
      $("#starting_location").val("");
      }
      });
}



function getCurrentLocation_auto(places)
{
 reset_main();
 map_place_list=[];
 var place = places.getPlace();
 var address = place.formatted_address;
 mylat= place.geometry.location.lat();
 mylong=place.geometry.location.lng();
 c_address = place.formatted_address;
 setAddress(Location_info,address);
 
 var latlng = new google.maps.LatLng(mylat, mylong);
 
// if(mylat != '' && mylong !='')
// {
// Mapbox.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
// Mapbox.show(
//             {
//             container: 'map',
//             style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
//             margins: {
//             left: 0, // default 0
//             right: 0, // default 0
//             top: 83, // default 0
//             bottom: 0 // default 0
//             },
//             center: { // optional, without a default
//             lat: mylat,
//             lng: mylong
//             },
//             zoomLevel: 12, // 0 (the entire world) to 20, default 10
//             showUserLocation: false, // your app will ask permission to the user, default false
//             hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
//             hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
//             hideCompass: false, // default false
//             disableRotation: false, // default false
//             disableScroll: false, // default false
//             disableZoom: false, // default false
//             disablePitch: false, // disable the two-finger perspective gesture, default false
//             markers: [
//                       {
//                       lat: mylat,
//                       lng: mylong,
//                       title: 'Nice location',
//                       subtitle: 'Really really nice location'
//                       }
//                       ]
//             
//             
//             })
// }
 if(mylat != '' && mylong !='')
 {
  mapboxgl.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
  
  var monument_ll = [mylong, mylat];
  var map = new mapboxgl.Map({
                             container: 'map',
                             style: 'mapbox://styles/mapbox/streets-v9',
                             center: monument_ll,
                             zoom: 15
                             });
  
  var popup;
  var latlng = new google.maps.LatLng(mylat, mylong);
  
  var geocoder = geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {
                   if (results[1]) {
                   popup = new mapboxgl.Popup({offset: 25})
                   .setText(results[1].formatted_address);
                   
                   var el = document.createElement('div');
                   el.id = 'marker';
                   
                   new mapboxgl.Marker(el, {offset:[-25, -25]})
                   .setLngLat(monument_ll)
                   .setPopup(popup) // sets a popup on this marker
                   .addTo(map);
                   
                   }
                   }
                   });
 }
 }
//  var geocoder = new google.maps.Geocoder();
//  var ad='';
//  if (geocoder)
//  {
//   geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
//                    {
//                    if (status == google.maps.GeocoderStatus.OK)
//                    {
//                    ad=(results[0].formatted_address);
//                    }
//                    setAddress(Location_info,ad);
//                    // if(Markers.length>=1)
//                    // {
//                    //   map.clear();
//                    //   map.off();
//                    //   Markers[0].remove();
//                    // }
//                    map.clear();
//                    map.off();
//                    
//                    //setInterval(function(){
//                    map.addMarker({
//                                  'position':GOOGLE,
//                                  disableAutoPan: true,
//                                  // new plugin.google.maps.LatLng(mylat,mylong),
//                                  'title': ad,
//                                  icon:'blue',
//                                  'styles' : {
//                                  'text-align': 'center',
//                                  'font-size': '8px',
//                                  'width':'50px'
//                                  // 'font-weight':'bold'
//                                  } },function(marker)
//                                  {
//
//                                  
//                                  marker.showInfoWindow();
//                                  Tour_List.push('1');
//                                  if(Markers.length>=1)
//                                  {
//                                  Markers[0]=marker;
//                                  }
//                                  else
//                                  {
//                                  Markers.push(marker);
//                                  }
//                                  });
//                    map.addCircle({
//                                  'center': GOOGLE,
//                                  'radius': 300,
//                                  'strokeColor' :'#d3dceb',
//                                  'strokeWidth': 5,
//                                  'fillColor' : '#d3dceb'
//                                  }, function(circle) {
//                                  
//                                  setTimeout(function() {
//                                             circle.setRadius(600);
//                                             }, 3000);
//                                  });
//                    map.setCenter(GOOGLE);
//                    //new plugin.google.maps.LatLng(mylat,mylong)
//                    
//                    });
//  }
// }




function getCurrentLocation_auto1(places)
{
 return;
 reset_main();
 Markers=[];
 map_place_list=[];
 var place = places.getPlace();
 var address = place.formatted_address;
 mylat= place.geometry.location.lat();
 mylong=place.geometry.location.lng();
 
 show_map();
 
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
                    if (status == google.maps.GeocoderStatus.OK)
                    {
                    ad=(results[0].formatted_address);
                    }
                    Location_info = ad;
                    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                    marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
                    marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo">You are at..  <br/>'+ad+'</div>'});
                    
                    setAddress(Location_info,ad);
                    
                    marker.info.open(map, marker);
                    });
  }
 }
}

document.addEventListener("deviceready", function()
                          {
                          navigator.geolocation.getCurrentPosition(success_1, fail_1, { enableHighAccuracy: true });
                          });


function success_1(position)
{
 var physicalScreenHeight = (window.screen.height * window.devicePixelRatio);
 var header = 80;
 var footer = $('#mapCanvas .footer').outerHeight(true);
 var height = physicalScreenHeight+' px';
 //physicalScreenHeight = physicalScreenHeight +' px'
 
 // $("#mapCanvas").attr({height:physicalScreenHeight});
 $("#mapCanvas").height(physicalScreenHeight);
 // $("#uio").attr({height:height});
 $("#uio").height(physicalScreenHeight);
 // $("#map_canvas").attr({height:height});
 $("#map").height(physicalScreenHeight);
 // document.getElementById('chartdiv').style.height = '200px';
 
 //var mapDiv = document.getElementById("map");
 mylat = position.coords.latitude;
 mylong = position.coords.longitude;

 var latlng = new google.maps.LatLng(mylat, mylong);
 
 var geocoder = geocoder = new google.maps.Geocoder();
 
 geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                  if (results[1]) {
                  ad_=results[1].formatted_address;
                   $('#User_location_bar1').html(ad_.substr(0, 50));
                   $('#User_location_bar2').html(ad_.substr(0, 50));
                   $('#User_location_bar3').html(ad_.substr(0, 50));
                   $('#User_location_bar4').html(ad_.substr(0, 50));
           							}
                  }
                  });

}

function fail_1(position)
{

 var physicalScreenHeight = (window.screen.height * window.devicePixelRatio);
 var header = 80;
 var footer = $('#mapCanvas .footer').outerHeight(true);
 var height = physicalScreenHeight +' px';
 
 physicalScreenHeight = physicalScreenHeight +' px'
 // alert(physicalScreenHeight);
 // $("#mapCanvas").attr({height:physicalScreenHeight});
 // $("#uio").attr({height:height});
 // $("#map_canvas").attr({height:height});
 
 //var mapDiv = document.getElementById("map_canvas");
 mylat = 37.422476;
 mylong = -122.08425;
 
 mylat = position.coords.latitude;
 mylong = position.coords.longitude;
 
 mapboxgl.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
 
 var monument_ll_fail = [mylong, mylat];
 
 var map = new mapboxgl.Map({
                            container: 'map',
                            style: 'mapbox://styles/mapbox/streets-v9',
                            center: monument_ll_fail,
                            zoom: 4
                            });
 
 var popup;
 var latlng = new google.maps.LatLng(mylat, mylong);

  var geocoder = geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {
                   if (results[1]) {
                  
                   popup = new mapboxgl.Popup({offset: 25})
                   .setText(results[1].formatted_address);
                   
                   var el = document.createElement('div');
                   el.id = 'marker';
                   
                   new mapboxgl.Marker(el, {offset:[-25, -25]})
                   .setLngLat(monument_ll)
                   .setPopup(popup) // sets a popup on this marker
                   .addTo(map);
                   
                   }
                   }
                   });
  
 
 
// myLatLng = new google.maps.LatLng(mylat,mylong);
// const GOOGLE = new plugin.google.maps.LatLng(mylat,mylong);
// map = plugin.google.maps.Map.getMap(mapDiv, {
//                                     'controls': {
//                                     'zoom': true
//                                     },
//                                     'camera': {
//                                     'latLng': GOOGLE,
//                                     'zoom': 14
//                                     }
//                                     });
// 
// 
// 
// var geocoder = new google.maps.Geocoder();
// var ad='';
// if (geocoder)
// {
//  geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
//                   {
//                   if (status == google.maps.GeocoderStatus.OK)
//                   {
//                   ad=(results[0].formatted_address);
//                   }
//                   setAddress(Location_info,ad);
//                   map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
//                                        map.addMarker({
//                                                      'position': GOOGLE,
//                                                      'title': ad,
//                                                      disableAutoPan: true,
//                                                      'styles' : {
//                                                      'text-align': 'center',
//                                                      'font-size': '8px',
//                                                      'width':'50px'
//                                                      // 'font-weight':'bold'
//                                                      }
//                                                      }, function(marker)
//                                                      {
//                                                      Tour_List.push('1');
//                                                      marker.showInfoWindow();
//                                                      Markers.push(marker);
//                                                      });
//                                        
//                                        map.addCircle({
//                                                      'center': GOOGLE,
//                                                      'radius': 300,
//                                                      'strokeColor' : '#d3dceb',
//                                                      'strokeWidth': 5,
//                                                      'fillColor' : '#d3dceb'
//                                                      }, function(circle) {
//                                                      setTimeout(function() {
//                                                                 circle.setRadius(600);
//                                                                 }, 3000);
//                                                      });
//                                        
//                                        });
//                   });
// }
}

// function success_2(position) // for js, remove if running in emulator
// {
//     var physicalScreenHeight = (window.screen.height * window.devicePixelRatio);
//     var header = 80;
//     var footer = $('#mapCanvas .footer').outerHeight(true);
//     var height = (physicalScreenHeight - (header + footer))+' px';

//     physicalScreenHeight = physicalScreenHeight +' px'

//     $("#mapCanvas").attr({height:physicalScreenHeight});
//     $("#uio").attr({height:height});
//     $("#map_canvas").attr({height:height});

//     Markers=[];
//     map_place_list=[];
//     mylat = position.coords.latitude;
//     mylong = position.coords.longitude;
//     myLatLng = new google.maps.LatLng(mylat,mylong);
//     var mapOptions = {
//     zoom: 15,
//     center: myLatLng,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     var geocoder = new google.maps.Geocoder();
//     var ad='';
//     if (geocoder)
//     {
//       geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
//                        {
//                        if (status == google.maps.GeocoderStatus.OK) {
//                        ad=(results[0].formatted_address);
//                        }
//                        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
//                        marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
//                        Markers.push(marker);
//                        map_place_list.push('1');
//                        Location_info=ad;
//                        marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >You are at.. </br>'+ad+'</div>'});

//                        setAddress(Location_info,ad);

//                        marker.info.open(map, marker);
//                       });
//     }
// }

// function fail_2(position) // for js, remove if running in emulator
// {
//     swal(" Current location is not found ... Showing the default location.");
//     Markers = [];
//     map_place_list = [];
//     mylat  = 41.8818; //Chicago
//     mylong = -87.6633;  //Chicago
//     myLatLng = new google.maps.LatLng(mylat, mylong);
//     var mapOptions = {
//     zoom: 15,
//     center: myLatLng,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     var geocoder = new google.maps.Geocoder();
//     var ad='';
//     if (geocoder)
//     {
//       geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
//                        {
//                        if (status == google.maps.GeocoderStatus.OK) {
//                        ad=(results[0].formatted_address);
//                        }
//                        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
//                        marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});
//                        Markers.push(marker);
//                        console.log('push'+Markers.length);
//                        map_place_list.push('1');
//                        Location_info=ad;
//                        marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo">You are at.. </br>'+ad+'</div>'});
//                        //$('#User_location_bar').html(ad);
//                        setAddress(Location_info,ad);

//                        marker.info.open(map, marker);
//                        google.maps.event.addListener(map, "idle", function() {
//                                                      google.maps.event.trigger(map, 'resize');
//                                                      });
//                        });
//     }
// }

function setAddress(Location_info,ad)
{
 c_address=ad;
 if(Location_info.length <= 50)
 {
  $('#User_location_bar1').html(ad);
  $('#User_location_bar2').html(ad);
  $('#User_location_bar3').html(ad);
  $('#User_location_bar4').html(ad);
 }
 else
 {
  $('#User_location_bar1').html(ad.substr(0, 50));
  $('#User_location_bar2').html(ad.substr(0, 50));
  $('#User_location_bar3').html(ad.substr(0, 50));
  $('#User_location_bar4').html(ad.substr(0, 50));
 }
}

function getTenEvent()
{
 $("#homeSTARTProfile").hide();
 $("#homeFeaturedProfile").hide();
 $("#homeSTART").show();
 
 var url = site_url+'site/Events_list?';
 var activeclass='';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        $('#Events_slide_list').html('');
        
        if(res[0]!= "no-data")
        {
        var abc='';
        
        
        abc=abc+'<div id="event_carousel-example-generic" class="carousel slide scroll" data-interval="false">';
        abc=abc+'<div class="carousel-inner add_active" >';
        for(var i=0; i<res.length; i++)
        {
        if((res[i].Event_Type)==0){
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        if(IsJsonString(res[i].LatLng))
        {
        var LatLng = JSON.parse(res[i].LatLng);
        }
        
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        
        var addr='';
        var text = '';
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        if(cleanText.length > 100)
        {
        str_desc = cleanText.substring(0,100);
        }
        else
        {
        str_desc=cleanText;
        }
        
        var split_date=Detail.date.split("-");
        
        
        
        abc=abc+'<div class="item '+activeclass+' paddingzero  col-sm-12 col-xs-12 '+PlaceIds+'" id="'+PlaceIds+'" onClick="FeaturedEventProfile(this,true)" data-sort="0.5">';
        abc=abc+'<input type="hidden" name="Place_Id" value="'+PlaceIds+'">';
        //abc=abc+'<input type="hidden" id="Lat_'+PlaceIds+'" value="'+LatLng.H+'">';
        //abc=abc+'<input type="hidden" id="Log_'+PlaceIds+'" value="'+LatLng.L+'">';
        abc=abc+'<div class="listImage col-sm-12 col-xs-12 paddingzero">';
        if(Detail.profileimage != '')
        {
        abc=abc+'<img class="eventimage" src=';
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        abc=abc+'<img class="eventimage" src="images/default.jpg" >';
        }
        abc=abc+'</div>';
        abc=abc+'<div class="eventinfo col-sm-12 col-xs-12 paddingzero">';
        abc=abc+'<div class="col-sm-12 col-xs-12 placenamebackground paddingzero">';
        abc=abc+'<div class="col-sm-12 col-xs-12 detailplaceName"><div class="newstitle">'+Event_Deal_name+'</div></div>';
        abc=abc+'</div>';
        abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero">';
        //abc=abc+'<div class="col-sm-12 col-xs-12 Abt read-more-wrap">'+atob(Detail.about)+'</div>';
        
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+addr+'</div>';
        abc=abc+'<div class="flex col-sm-12 col-xs-12 paddingzero">';
        abc=abc+'<div class="col-sm-9 col-xs-9 Abt"><img class="clock" style="margin-right:5px;" class="clock" src="assets/general/wall-clock.svg">'+split_date[1]+'&nbsp'+split_date[0]+',&nbsp'+split_date[2]+' at '+Detail.startTime+' to at '+Detail.e_time+'</div>';
        abc=abc+'<div class="col-sm-3 col-xs-3 paddingzero Abt"><img class="clock" style="margin-right:5px;" src="assets/general/badge.svg">'+Detail.price+'</div>';
        abc=abc+'</div>';
        
        
        abc=abc+'<div class="col-sm-12 col-xs-12 Abt descAbt">'+str_desc+'...</div>';
        
        abc=abc+'</div>';
        /*abc=abc+'<div id="#hide-show" class="col-sm-12 col-xs-12 paddingzero Abt collapse"> '+atob(Detail.about)+'</div>';*/
        //abc=abc+'<div id="collapseOne'+PlaceIds+'" class="panel-collapse collapse collapseOne">';
        /*abc=abc+'<div class="col-sm-12 col-xs-12 panel-body contact-icons">';
         abc=abc+'<ul class="nav">';
         abc=abc+'<li class="hotelinfo hotelNo col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/call_icon.png">Call now</a></li>';
         abc=abc+'<li class="hotelinfo hotelBuy col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/buy_now_icon.png">Buy Now</a></li></li>';
         abc=abc+'<li class="hotelinfo hotelWebsite col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/website_icon.png">Website</a></li></li>';
         abc=abc+'<li class="hotelinfo hotelAddtour col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/add_to_tour_icon.png">Add to Tour</a></li></li>';
         abc=abc+'</ul>'
         abc=abc+'</div>';*/
        abc=abc+'</div>';
        
        //abc=abc+'</div>';
        
        /*abc=abc+'<div href="#hide-show" class="accordion-toggle" data-toggle="collapse">Show</div>';*/
        //abc=abc+'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne'+PlaceIds+'"></a>';
        //abc=abc+'<div class="col-sm-6 col-xs-6 openClose hourTime ">';
        /*                      abc=abc+'<div class="btn btn-primary">View Events</div>';
         */                      abc=abc+'</div>';
        //abc=abc+'</div>';
        }
        }
        abc=abc+'</div>';
        abc=abc+'</div>';
        
        $('#Events_slide_list').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        showMoreText();
        checkslide();
        }
        });
 }

function FeaturedEventProfile(tthis,flag)
{
 $('#homeFeaturedProfile').show();
 $('#homeSTART').hide();
 $('#homeSTARTProfile').hide();
 
 /*var options = {
  "duration"       :  400, // in milliseconds (ms), default 400
  "iosdelay"       :   50
 };
 window.plugins.nativepagetransitions.fade(
                                           options,
                                           function (msg) {
                                           console.log("success: " + msg);
                                           },
                                           function (msg) {alert("error: " + msg)} // called in case you pass in weird values
                                           );*/
 
 var url = site_url+'site/Events_list?';
 var activeclass='';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        
        $('#viewFeaturedEventProfile').html('');
        
        if(res[0]!= "no-data")
        {
        var abc='';
        
        for(var i=0; i<res.length; i++)
        {
        
        if((res[i].Event_Type)!=1){
        
        if((res[i].PlaceIds)==tthis.id){
        
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        if(IsJsonString(res[i].LatLng))
        {
        var LatLng = JSON.parse(res[i].LatLng);
        }
        
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        
        Place_Event_List(tthis.id,res[i].Identifier);
        //  Place_Related_List(tthis.id,res[i].Identifier);
        //        var FeatureRelated=res[i].Identifier.split("_");
        
        //        if(FeatureRelated[2]=='F')
        //        {
        //        alert('hi');
        //        Place_Event_List(tthis.id,res[i].Identifier);
        //        }
        //        else{
        //        alert('bye');
        //        }
        var addr='';
        var text = '';
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        
        if(cleanText.length > 60)
        {
        str_desc = cleanText.substring(0,60);
        }
        else
        {
        str_desc=cleanText;
        }
        var address = (Detail.address).split(",");
        
        
        abc=abc+ '<div class="ListdetailView">';
        
        // Slider code start here
        abc=abc+ '<div id="myCarousel" class="carousel slide" data-interval="false">';
        abc=abc+'<div class="carousel-inner" role="listbox">';
        
        var split_date=Detail.date.split("-");
        
        if(typeof Detail.Path != "undefined")
        {
        if(Detail.Path.length > 0)
        {
        var img=(Detail.Path).split(",");
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
        abc=abc+ '</div>';
        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero newdetailsPlace paddingtb">';
        
        abc=abc+ '<div class="col-sm-12 col-xs-12 detailplaceName">';
        
        abc=abc+ '<div class="placeprofileNameHeading">'+Detail.name+'</div>';
        
        abc=abc+ '</div>';
        
        abc=abc+ '<div class="col-sm-12 col-xs-12" style="display:none;">';
        abc=abc+ '<div class="detailplacestar paddingtb placeprofileName">Star</div>';
        abc=abc+ '</div>';
        if(res!=''){
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+address[0]+'</div>';
        }
        else{
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+Detail.address+'</div>';
        }
        
        abc=abc+'<div class="flex col-sm-12 col-xs-12 paddingzero">';
        abc=abc+'<div class="col-sm-8 col-xs-8 Abt"><img class="clock" style="margin-right:5px;" class="clock" src="assets/general/wall-clock.svg">'+split_date[1]+'&nbsp'+split_date[0]+',&nbsp'+split_date[2]+' at '+Detail.startTime+' to '+Detail.e_time+'</div>';
        abc=abc+'<div class="col-sm-4 col-xs-4 Abt"><img class="clock" style="margin-right:5px;" src="assets/general/badge.svg">'+Detail.price+'</div>';
        abc=abc+'</div>';
        
        
        
        abc=abc+ '</div> ';
        
        abc=abc+ '<div class="site-desc paddingzero container-fluid">';
        
        if(typeof Detail === 'object')
        {
        var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
        if((Detail.about).length > 0)
        {
        
        if (base64Matcher.test(Detail.about))
        {
        var desc_data=atob(Detail.about);
        //var data_info_desc=desc_data.replace(/<(?:.|\n)*?>/gm, '');
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details moretext listDetailSummary"> '+ desc_data +'</div>';
        }
        else
        {
        var info_desc=Detail.about
        var data_info_desc=info_desc.replace(/<(?:.|\n)*?>/gm, '');
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details moretext listDetailSummary"> '+ info_desc +'</div>';
        }
        }
        else
        {
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
        }
        }
        else
        {
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
        }
        
        
        abc=abc+ '</div>';
        abc=abc+ '</div>';
        }
        }
        }
        //  $('#viewEventProfileshow').append(abc);
        document.getElementById("viewFeaturedEventProfile").innerHTML= abc;
        
        }
        else
        {
        
        }
        },
        error: function(e) {
        //console.log(e.message);
        },
        complete: function(data) {
        //        show_slide_experiance();
        showMoreText2();
        
        }
        });
 
 $("#DetailBackButtonShow").attr("onclick","getTenEvent()");
 
 
}

function Place_Event_List(id,identifier)
{
 var related="";
 var more="";
 var feattured="";
 
 var identifier_list=identifier.split(",");
 if(identifier_list.length>0){
  if(identifier_list.length==3){
   if(identifier_list[0].indexOf("-F")>=0 || identifier_list[0].indexOf("-f")>=0){
    feattured=identifier_list[0];
   }
   else if(identifier_list[0].indexOf("-M")>=0 || identifier_list[0].indexOf("-m")>=0){
    more=identifier_list[0];
   }
   else{
    related=identifier_list[0];
   }
   if(identifier_list[1].indexOf("-F")>=0 || identifier_list[1].indexOf("-f")>=0){
    feattured=identifier_list[1];
   }
   else if(identifier_list[1].indexOf("-M")>=0 || identifier_list[1].indexOf("-m")>=0){
    more=identifier_list[1];
   }
   else {
    related=identifier_list[1];
    
   }
   if(identifier_list[2].indexOf("-F")>=0 || identifier_list[1].indexOf("-f")>=0){
    feattured=identifier_list[2];
   }
   else if(identifier_list[2].indexOf("-M")>=0 || identifier_list[2].indexOf("-m")>=0){
    more=identifier_list[2];
   }
   else {
    related=identifier_list[3];
    
   }
  }
  if(identifier_list.length==2){
   if(identifier_list[0].indexOf("-F")>=0 || identifier_list[0].indexOf("-f")>=0){
    feattured=identifier_list[0];
   }
   else if(identifier_list[0].indexOf("-M")>=0 || identifier_list[0].indexOf("-m")>=0){
    more=identifier_list[0];
   }
   else{
    related=identifier_list[0];
   }
   if(identifier_list[1].indexOf("-F")>=0 || identifier_list[1].indexOf("-f")>=0){
    feattured=identifier_list[1];
   }
   else if(identifier_list[1].indexOf("-M")>=0 || identifier_list[1].indexOf("-m")>=0){
    more=identifier_list[1];
   }
   else {
    related=identifier_list[1];
    
   }
  }
  else{
   if(identifier_list[0].indexOf("-F")>=0 || identifier_list[0].indexOf("-f")>=0){
    feattured=identifier_list[0];
   }
   else if(identifier_list[0].indexOf("-M")>=0 || identifier_list[0].indexOf("-m")>=0){
    more=identifier_list[1];
   }
   else{
    related=identifier_list[1];
   }
  }
 }
 else{
  return;
 }
 
 var abc='';
 var abc_='';
 var abc_realted='';
 var url = site_url+'site/Events_FeaturedRelated_places?';
 $.ajax({
        type: 'get',
        async:false,
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
        id:id,
        featured:feattured,
        more:more,
        related:related
        },
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        if(res[0] != "")
        {
        
        abc=abc+'<div class="col-sm-12 col-xs-12 profletitle featured-events"><p class="ruler"><span>FEATURED</span></p>';
        //abc=abc+'<div class="col-sm-12 col-xs-12 line3"></div>';
        abc=abc+'<div class="owl-carousel" id="owl-carousel">';
        for (var i=0; i < res[0].length; i++)
        {
        var SrNumber = res[0][i].SrNumber;
        var PlaceIds = res[0][i].PlaceIds;
        var Venueid = res[0][i].Venueid;
        var LatLng = res[0][i].LatLng;
        var Foresquare_lat_lng = res[0][i].Foresquare_lat_lng;
        var Category = res[0][i].Category;
        
        var Detail = JSON.parse(res[0][i].Detail);
        var DateOfEstablishment = res[0][i].DateOfEstablishment;
        
        var Place_Type = res[0][i].Place_Type;
        
        var addr='';
        var text = '';
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        if(cleanText.length > 40)
        {
        str_desc = cleanText.substring(0,40);
        }
        else
        {
        str_desc=cleanText;
        }
        abc= abc + '<div class="col-sm-11 col-xs-11 item profilepage '+activeclass+'" id="'+SrNumber+'">';
        
        abc = abc + '<div class="single_library_container paddingzero col-sm-12 col-xs-12 '+PlaceIds+'" id="eve_'+ PlaceIds +'"><input type="hidden" name="Place_Id" value="'+PlaceIds+'"/><div id="Add_'+PlaceIds+'" style="display:none;">'+addr+'</div><textarea id="DetailLog_'+PlaceIds+'" style="display:none;">'+res[0][i].Detail+'</textarea>';
        abc = abc + '<div class=" listDescription col-sm-12 col-xs-12" id="'+ PlaceIds +'" onClick="EventPlaceFeaturedRelatedProfile(this,true)">';
        abc = abc + '<div class="content-image" >';
        if(Detail.profileimage != '' && Detail.profileimage != 'undefined')
        {
        abc=abc+'<img class="image" src=';
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        
        //  abc=abc+'<img class="eventimage" src="images/default.jpg" >';
        abc=abc+'<img class="eventimage"   src="images/default.jpg" />';
        }
        abc= abc +'</div>';
        
        abc= abc + '<div class="col-sm-12 col-xs-12 content paddingzero paddingtb">';
        abc= abc + '<div class="title">'+Detail.name+'</div>';
        abc= abc + '<div class="addressPlace">'+addr+'</div>';
        //abc= abc + '<div class="address">'+str_desc+'</div>';
        
        abc= abc + '</div>';
        
        
        abc= abc + '</div>';
        abc=abc+'</div>';
        abc=abc+'</div>';
        
        }
        abc=abc+'</div>';
        abc= abc + '</div>';
        }
        else{
        abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 profletitle"><h3>FEATURED</h3></div>';
        abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 line3"></div>';
        }
        
        if(res[1] != "")
        {
        
        abc_=abc_+'<div class="col-sm-12 col-xs-12 profletitle"><p class="ruler"><span>MORE GALLERIES</span></p>';
        //abc_=abc_+'<div class="col-sm-12 col-xs-12 line3"></div>';
        //abc_=abc_+'<div id="eventprofile-carousel-example-generic" class="carousel slide scroll" data-interval="false">';
        abc_=abc_+'<div class="owl-carousel-more" id="owl-carousel-more">';
        for (var i=0; i < res[1].length; i++)
        {
        
        var SrNumber = res[1][i].SrNumber;
        var PlaceIds = res[1][i].PlaceIds;
        var Venueid = res[1][i].Venueid;
        var LatLng = res[1][i].LatLng;
        var Foresquare_lat_lng = res[1][i].Foresquare_lat_lng;
        var Category = res[1][i].Category;
        
        var Detail = JSON.parse(res[1][i].Detail);
        var DateOfEstablishment = res[1][i].DateOfEstablishment;
        
        var Place_Type = res[1][i].Place_Type;
        
        var addr='';
        var text = '';
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        if(cleanText.length > 40)
        {
        str_desc = cleanText.substring(0,40);
        }
        else
        {
        str_desc=cleanText;
        }
        abc_= abc_ + '<div class="col-sm-11 col-xs-11 item profilepage '+activeclass+'" id="'+SrNumber+'">';
        
        abc_ = abc_ + '<div class="single_library_container paddingzero col-sm-12 col-xs-12 '+PlaceIds+'" id="eve_'+ PlaceIds +'"><input type="hidden" name="Place_Id" value="'+PlaceIds+'"/><div id="Add_'+PlaceIds+'" style="display:none;">'+addr+'</div><textarea id="DetailLog_'+PlaceIds+'" style="display:none;">'+res[1][i].Detail+'</textarea>';
        abc_ = abc_ + '<div class=" listDescription col-sm-12 col-xs-12" id="'+ PlaceIds +'" onClick="EventPlaceFeaturedRelatedProfile(this,true)">';
        
        
        abc_ = abc_ + '<div class="content-image" >';
        if(Detail.profileimage != '')
        {
        abc_=abc_+'<img class="image" src=';
        abc_= abc_ + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        abc_=abc_+'<img class="eventimage" src="images/default.jpg" >';
        }
        abc_= abc_ +'</div>';
        
        abc_= abc_ + '<div class="col-sm-12 col-xs-12 content paddingzero paddingtb">';
        abc_= abc_ + '<div class="title">'+Detail.name+'</div>';
        abc_= abc_ + '<div class="addressPlace">'+addr+'</div>';
        //abc_= abc_ + '<div class="address">'+str_desc+'</div>';
        
        
        abc_= abc_ + '</div>';
        abc_= abc_ + '</div>';
        abc_=abc_+'</div>';
        abc_=abc_+'</div>';
        
        }
        abc_= abc_ + '</div>';
        
        
        }
        else{
        abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 profletitle"><p class="ruler"><span>MORE GALLERIES</span></p></div>';
        //abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 line3"></div>';
        }
        
        if(res[2] != "")
        {
        
        abc_realted=abc_realted+'<div class="col-sm-12 col-xs-12 profletitle paddingbottom paddingzero"><h3>Related</h3></div>';
        abc_realted=abc_realted+'<div class="col-sm-12 col-xs-12 line3"></div>';
        abc_realted=abc_realted+'<div class="clear"></div>';
        abc_realted=abc_realted+'<div class="slick-carousel-related" id="owl-carousel-related">';
        for (var i=0; i < res[2].length; i++)
        {
        var SrNumber = res[2][i].SrNumber;
        var PlaceIds = res[2][i].PlaceIds;
        var Venueid = res[2][i].Venueid;
        var LatLng = res[2][i].LatLng;
        var Foresquare_lat_lng = res[2][i].Foresquare_lat_lng;
        var Category = res[2][i].Category;
        
        var Detail = JSON.parse(res[2][i].Detail);
        var DateOfEstablishment = res[2][i].DateOfEstablishment;
        
        var Place_Type = res[2][i].Place_Type;
        
        var addr='';
        var text = '';
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        if(cleanText.length > 40)
        {
        str_desc = cleanText.substring(0,40);
        }
        else
        {
        str_desc=cleanText;
        }
        abc_realted= abc_realted + '<div class="col-sm-11 col-xs-11 profilepage" id="'+SrNumber+'">';
    
        abc_realted = abc_realted + '<div class="single_library_container paddingzero col-sm-12 col-xs-12 '+PlaceIds+'" id="eve_'+ PlaceIds +'"><input type="hidden" name="Place_Id" value="'+PlaceIds+'"/><div id="Add_'+PlaceIds+'" style="display:none;">'+addr+'</div><textarea id="DetailLog_'+PlaceIds+'" style="display:none;">'+res[2][i].Detail+'</textarea>';
        abc_realted = abc_realted + '<div class=" listDescription col-sm-12 col-xs-12" id="'+ PlaceIds +'" onClick="EventPlaceFeaturedRelatedProfile(this,true)">';
        
        abc_realted = abc_realted + '<div class="content-image" >';
        if(Detail.profileimage != '' && Detail.profileimage != 'undefined')
        {
        abc_realted=abc_realted+'<img class="image" src=';
        abc_realted= abc_realted + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        //  abc_realted=abc_realted+'<img class="eventimage" src="images/default.jpg" >';
        abc_realted=abc_realted+'<img class="eventimage"   src="images/default.jpg" />';
        }
        abc_realted= abc_realted +'</div>';
        
        abc_realted= abc_realted + '<div class="col-sm-12 col-xs-12 content paddingzero paddingtb">';
        abc_realted= abc_realted + '<div class="title">'+Detail.name+'</div>';
        abc_realted= abc_realted + '<div class="addressPlace">'+addr+'</div>';
        //abc_realted= abc_realted + '<div class="address">'+str_desc+'</div>';
        
        
        abc_realted= abc_realted + '</div>';
        abc_realted= abc_realted + '</div>';
        abc_realted=abc_realted+'</div>';
        abc_realted=abc_realted+'</div>';
        
        }
        abc_realted= abc_realted + '</div>';
        }
        else{
        abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 profletitle"><h3>RELATED PLACES</h3></div>';
        abc=abc+'<div style="display:none;" class="col-sm-12 col-xs-12 line3"></div>';
        }
        
        
        
        var data_show=document.getElementById("viewFeaturedEventProfile").innerHTML;
        
        data_show=data_show+abc+abc_+abc_realted;
        
        
        document.getElementById("viewFeaturedEventProfile").innerHTML=data_show;
        },
        error: function(e) {
        },
        complete: function(data) {
        slickscroll();
        checkslideEventProfile();
        }
        
        
        });
 
}

function slickscroll()
{
 $('#owl-carousel-related').slick({
                                  //infinite: true,
                                  slidesToShow: 2,
                                  slidesToScroll: 2
                                  });
 $('#owl-carousel').slick({
                          //infinite: true,
                          slidesToShow: 2,
                          slidesToScroll: 2
                          });
 $('#owl-carousel-more').slick({
                               //infinite: true,
                               slidesToShow: 2,
                               slidesToScroll: 2,
                               
                               });
}


//
//function owlcarousel(){
// 
// $('#owl-carousel').owlCarousel({
//                                //loop:true,
//                                stagePadding: 20,
//                                margin:10,
//                                nav:false,
//                                dots:false,
//                                responsive:{
//                                0:{
//                                items:2
//                                },
//                                600:{
//                                items:2
//                                },
//                                1000:{
//                                items:5
//                                }
//                                }
//                                });
// 
// $('#owl-carousel-more').owlCarousel({
//                                     //loop:true,
//                                     stagePadding: 20,
//                                     margin:10,
//                                     nav:false,
//                                     dots:false,
//                                     responsive:{
//                                     0:{
//                                     items:2
//                                     },
//                                     600:{
//                                     items:2
//                                     },
//                                     1000:{
//                                     items:5
//                                     }
//                                     }
//                                     });
// 
// $('#owl-carousel-related').owlCarousel({
//                                        //loop:true,
//                                        stagePadding: 20,
//                                        margin:10,
//                                        nav:false,
//                                        dots:false,
//                                        responsive:{
//                                        0:{
//                                        items:2
//                                        },
//                                        600:{
//                                        items:2
//                                        },
//                                        1000:{
//                                        items:5
//                                        }
//                                        }
//                                        });
// 
//}



function getUnfeaturedEvent()
{
 var url = site_url+'site/UnfeaturedEvents_list?';
 var activeclass='';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
       
        $('#Events_unfeature_list').html('');
        
        if(res[0]!= "no-data")
        {
        var abc='';
        
        abc=abc+'<div class="col-sm-12 col-xs-12 bottomsection paddingzero">';
        abc=abc+'<div class="col-sm-12 col-xs-12 center paddingzero">';
        abc=abc+'<h4 class="backgroundline"><span>MORE LIKE THIS</span></h4>';
        abc=abc+'</div>'
        abc=abc+'<div class="col-sm-12 col-xs-12 eventlist">';
        for(var i=0; i<res.length; i++)
        {
        if((res[i].Event_Type)==1){
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        if(IsJsonString(res[i].LatLng))
        {
        var LatLng = JSON.parse(res[i].LatLng);
        }
        
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        
        var addr='';
        var text = '';
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        
        if(cleanText.length > 40)
        {
        str_desc = cleanText.substring(0,40);
        }
        else
        {
        str_desc=cleanText;
        }
        
        
        
        abc=abc+'<a class="eventprofilepage" href="#homeSTARTProfile" data-transition="pop" data-inverse="'+ PlaceIds +'" data-target="'+ PlaceIds +'"><div class="col-sm-6 col-xs-6 eventdesc">';
        abc = abc + '<div class="content-image" id="'+ PlaceIds +'" onclick="calleventprofile(this,true)">';
        //abc=abc+'<div class="content-image" onclick="EventProfile(this,true)">';
        if(Detail.profileimage != '')
        {
        abc=abc+'<img class="image" src=';
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        abc=abc+'<img class="eventimage" src="images/default.jpg" >';
        }
        //        abc=abc+'<img src="assets/all_photos/photo1.jpg" class="image"/>';
        
        abc=abc+'</div>';
        abc=abc+'<div class="content-desc">';
        abc=abc+'<label>'+Event_Deal_name+'</label>';
        abc=abc+'<div class="Abt">'+str_desc+'</div>';
        abc=abc+'</div>';
        abc=abc+'</div></a>';
        
        }
        }
        abc=abc+'</div>';
        abc=abc+'</div>';
        $('#Events_unfeature_list').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        showMoreText();
        
        }
        });
}

function checkslide(){
 $("#event_carousel-example-generic").swiperight(function() {
                                                 $(this).carousel('prev');
                                                 });
 $("#event_carousel-example-generic").swipeleft(function() {
                                                $(this).carousel('next');
                                                });
}

function checkslideEventProfile(){
 $("#eventprofile-carousel-example-generic").swiperight(function() {
                                                        $(this).carousel('prev');
                                                        });
 $("#eventprofile-carousel-example-generic").swipeleft(function() {
                                                       $(this).carousel('next');
                                                       });
}

function EventProfile(tthis,flag)
{
 window.scrollTo(0, 0);
 $('#homeSTART').hide();
 $('#homeSTARTProfile').show();
 
 
 var url = site_url+'site/UnfeaturedEvents_list?';
 var activeclass='';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        
        $('#viewEventProfileshow').html('');
       
        if(res[0]!= "no-data")
        {
        var abc='';
        
        for(var i=0; i<res.length; i++)
        {
        
        if((res[i].Event_Type)==1){
        if((res[i].PlaceIds)==tthis.id){
        
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        if(IsJsonString(res[i].LatLng))
        {
        var LatLng = JSON.parse(res[i].LatLng);
        }
        
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        
        var addr='';
        var text = '';
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
       
        if(cleanText.length > 60)
        {
        str_desc = cleanText.substring(0,60);
        }
        else
        {
        str_desc=cleanText;
        }
        var address = (Detail.address).split(",");
        
        
        abc=abc+ '<div class="ListdetailView">';
        
        // Slider code start here
        abc=abc+ '<div id="myCarousel" class="carousel slide" data-interval="false">';
        abc=abc+'<div class="carousel-inner" role="listbox">';
        
        
        if(typeof Detail.Path != "undefined")
        {
        if(Detail.Path.length > 0)
        {
        var img=(Detail.Path).split(",");
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
        
        
        /* // Left arrow controls
         abc=abc+'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
         abc=abc+'<span class="fa fa-angle-left" aria-hidden="true"></span>';
         abc=abc+'<span class="sr-only">Previous</span>';
         abc=abc+'</a>';
         // right arrowcontrols
         abc=abc+'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
         abc=abc+'<span class="fa fa-angle-right" aria-hidden="true"></span>';
         abc=abc+'<span class="sr-only">Next</span>';
         abc=abc+'</a>';*/
        
        abc=abc+ '</div>';
        
        
        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero newdetailsPlace paddingtb">';
        
        abc=abc+ '<div class="col-sm-12 col-xs-12 detailplaceName">';
        
        abc=abc+ '<div class="placeprofileNameHeading">'+Detail.name+'</div>';
        //        if(!(typeof document.getElementById("Place_name"+PlaceId_Detail+"") === "undefined") && document.getElementById("Place_name"+PlaceId_Detail+"") != null)
        //        {
        //        var name= document.getElementById('Place_name'+PlaceId_Detail).innerHTML;
        //        abc=abc+ '<div class="placeprofileNameHeading">'+name+'</div>';
        //        }
        //        else
        //        {
        //        abc=abc+ '<div class="placeprofileNameHeading">'+dt.name+'</div>';
        //        }
        
        abc=abc+ '</div>';
        
        abc=abc+ '<div class="col-sm-12 col-xs-12" style="display:none;">';
        abc=abc+ '<div class="detailplacestar paddingtb placeprofileName">Star</div>';
        abc=abc+ '</div>';
        if(res!=''){
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+address[0]+'</div>';
        }
        else{
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+Detail.address+'</div>';
        }
        //abc=abc+'<div class="col-sm-12 col-xs-12 adr">&nbsp'+Detail.address+'</div>';
        abc=abc+'<div class="flex col-sm-12 col-xs-12 paddingzero">';
        abc=abc+'<div class="col-sm-8 col-xs-8 Abt"><img class="clock" style="margin-right:5px;" class="clock" src="assets/general/wall-clock.svg">'+Detail.date+' at '+Detail.startTime+'</div>';
        abc=abc+'<div class="col-sm-4 col-xs-4 Abt"><img class="clock" style="margin-right:5px;" src="assets/general/badge.svg">'+Detail.price+'</div>';
        abc=abc+'</div>';
        
        //        abc=abc+ '<div class="col-sm-12 col-xs-12 " >';
        //        if(Distance_Info === 'undefined' || Distance_Info == '')
        //        {
        //        if(!(typeof document.getElementById("Dista_"+PlaceId_Detail+"") === "undefined") && document.getElementById("Dista_"+PlaceId_Detail+"") != null)
        //        {
        //        var Distance = document.getElementById('Dista_'+PlaceId_Detail).innerHTML;
        //        abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new one flex">&nbsp;&nbsp;'+Distance+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
        //        }
        //        }
        //        else
        //        {
        //        abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new two flex">&nbsp;&nbsp;'+Distance_Info+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
        //        }
        //        abc=abc+ '</div>';
        
        //abc=abc+ '<div class="col-sm-12 col-xs-12">';
        //abc=abc+ '<div class="placeprofileName">'+addr+'</div>';
        //abc=abc+ '</div>';
        
        abc=abc+ '</div> ';
        
        //        abc=abc+'<div class="listDetailHeader" >';
        ////        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero placeprofileName"> '+Detail.name+'</div>';
        //        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+Detail.address+'</div>';
        //
        //
        ////        abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">Hours today : - </div>';
        //
        //        abc=abc+'</div>';
        abc=abc+ '<div class="site-desc paddingzero container-fluid">';
        
        if(typeof Detail === 'object')
        {
        var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
        if((Detail.about).length > 0)
        {
        
        if (base64Matcher.test(Detail.about))
        {
        var desc_data=atob(Detail.about);
        var data_info_desc=desc_data.replace(/<(?:.|\n)*?>/gm, '');
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ desc_data +'</div>';
        }
        else
        {
        var info_desc=Detail.about
        var data_info_desc=info_desc.replace(/<(?:.|\n)*?>/gm, '');
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ info_desc +'</div>';
        }
        }
        else
        {
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
        }
        }
        else
        {
        abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
        }
        
        
        abc=abc+ '</div>';
        abc=abc+ '</div>';
        }
        }
        }
        //  $('#viewEventProfileshow').append(abc);
        document.getElementById("viewEventProfileshow").innerHTML= abc;
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        //        show_slide_experiance();
        //        showMoreText();
        
        }
        });
 $("#DetailBackButton1").attr("onclick","getTenEvent()");
}

function getTenDeals()
{
	var site_url ='http://34.231.31.72/xplore/index.php/';
 $.ajax({
        type: 'GET',
        url: site_url+'site/TopTenDeal?',
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        crossDomain: true,
        success: function(res)
        {
        if(res != "no-data")
        {
        for (var i=0; i < res.length; i++)
        {
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        var LatLng = res[i].LatLng;
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        // Detail.name
        // Detail.address
        // Detail.discount
        // Detail.price
        // Detail.date
        // Detail.startTime
        // Detail.endTime
        // Detail.about
        // Detail.Path
        // Detail.profileimage
        var addr='';
        var text = '';
        
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        //  index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        //  if(index >= 0)
        //  {
        //    addr = Detail.address.substr(0, index); // Gets the first part
        //    text = Detail.address.substr(index+1);
        //    index = addr.lastIndexOf(',');
        //    if(index >= 0)
        //    {
        //     addr = addr.substr(0, index);
        //     text = addr.substr(index+1);
        //     var temp = addr.indexOf(',');
        //     if(temp >= 0)
        //     {
        //       addr = addr.substr(temp + 1);
        //     }
        //    }
        //  }
        // else
        // {
        //  addr = Detail.address;
        // }
        if(arr_addr.length > 0)
        {
        if(arr_addr.length >= 4)
        {
        addr = arr_addr[0];
        text = arr_addr[1] +" "+arr_addr[2] +" "+arr_addr[3];
        }
        else if(arr_addr.length == 3)
        {
        addr = arr_addr[0];
        text = arr_addr[1] +" "+arr_addr[2];
        }
        else if(arr_addr.length == 2)
        {
        addr = arr_addr[0];
        text = arr_addr[1];
        }
        else
        {
        addr = arr_addr[0];
        text = '';
        }
        }
        else
        {
        addr = '';
        text = '';
        }
        }
        }
        
        abc='';
        abc= abc + '<li class="SlidingList" id="'+SrNumber+'">';
        abc= abc + '<div class="image"><img src=';
        if(Detail.profileimage != '')
        {
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'"';
        }
        abc= abc +'></div>';
        abc= abc + '<div class="content">';
        abc= abc + '<div class="title">'+Event_Deal_name+'</div>';
        abc= abc + '<div class="address">'+addr+'</div>';
        abc= abc + '<div class="addressPlace">'+text+'</div>';
        abc= abc + '<div class="des">'+atob(Detail.about)+'</div>';
        abc= abc + '</div>';
        abc= abc + '</li>';
        
        $('#Deals_slide_list').append(abc);
        }
        }
        },
        error: function(e)
        {
        },
        complete: function(data)
        {
        show_slide_Deals();
        }
        });
}

function GetExperiances()
{
 var AutoC="";
 
 var url = site_url+'site/AutocompleteBox ?';
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
        },
        crossDomain: true,
        success: function(res) {
        if(res[0]!= "no-data")
        {
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
        
        
        abc= abc + '<li class="SlidingList" id="'+res[i].SrNo+'">';
        abc= abc + '<div class="image"><img src=';
        if(res[i].FbUserId != '')
        {
        abc= abc + '"https://graph.facebook.com/'+res[i].FbUserId+'/picture?type=large"';
        }
        abc= abc +'></div>';
        abc= abc + '<div class="content">';
        abc= abc + '<div class="title">'+res[i].TourName+'</div>';
        abc= abc + '<div class="address">'+upd+'</div>';
        abc= abc + '<div class="addressPlace">No of likes '+res[i].countlike+'</div>';
        abc= abc + '<div class="des">'+description_+'</div>';
        abc= abc + '</div>';
        abc= abc + '</li>';
        }
        $('#Experiance_slide_list').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        }
        });
}

function Event_detail()
{
 var options = {
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.slide(
                                           options,
                                           function (msg) {
                                           console.log(JSON.stringify(msg));
                                           },
                                           function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                           );
 $("#homepage").show();
 $("#homeSTARTProfile").hide();
 $("#homeFeaturedProfile").hide();
 $("#DealAll").hide();
 $("#NewsAll").hide();
 $('#mainCatagoryNew').hide();
 $("#Place_list_new").hide();
 $("#ExperianceAll").hide();
 $('#mapCanvas').hide();
 window.scrollTo(0, 0);
}

function Deals_detail(data)
{
 var options = {
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "slowdownfactor"   :    3,
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
  };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );
 $("#DealAll").show();
 $("#homepage").hide();
 $("#homeSTARTProfile").hide();
 $("#EventAll").hide();
 $("#NewsAll").hide();
 $('#mainCatagoryNew').hide();
 $("#Place_list_new").hide();
 $("#ExperianceAll").hide();
 $('#mapCanvas').hide();
 window.scrollTo(0, 0);
}

function News_detail()
{
 var options = {
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       : 250, // in milliseconds (ms), default 400
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
   };
 window.plugins.nativepagetransitions.slide(
                                           options,
                                           function (msg) {
                                           //alert("SUCCESS: " + JSON.stringify(msg))
                                           console.log(JSON.stringify(msg));
                                           },
                                           function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                           );
 $("#NewsAll").show();
 $("#homepage").hide();
 $("#homeSTARTProfile").hide();
 $("#EventAll").hide();
 $("#DealAll").hide();
 $('#mainCatagoryNew').hide();
 $("#Place_list_new").hide();
 $("#ExperianceAll").hide();
 $('#mapCanvas').hide();
 window.scrollTo(0, 0);
}

function SeeAll_Experience_details(data)
{
 var options = {
  "duration"       :  600, // in milliseconds (ms), default 400
  "iosdelay"       :   50, // ms to wait for the iOS webview to update before animation kicks in, default 60
  "androiddelay"   :  100
 };
 window.plugins.nativepagetransitions.fade(
                                           options,
                                           function (msg) {console.log("success: " + msg)}, // called when the animation has finished
                                           function (msg) {alert("error: " + msg)} // called in case you pass in weird values
                                           );
 $("#homeSTARTProfile").hide();
 $("#homepage").hide();
 if(data == 'Experiance')
 {
  $("#ExperianceAll").show();
  $("#EventAll").hide();
  $("#DealAll").hide();
  $("#NewsAll").hide();
  $('#mainCatagoryNew').hide();
  $("#Place_list_new").hide();
  $('#Save_Ui').hide();
  $('#Place_Tour_new').hide();
  $('#mapCanvas').hide();
 }
 
 window.scrollTo(0, 0);
}

function Show_slide()
{
 var $frame = $('#basic');
 $frame.sly({
            horizontal: 1,
            itemNav: 'basic',
            smart: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            activatePageOn: 'click',
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            dragHandle: 1,
            dynamicHandle: 1
            });
}

function show_slide_Deals()
{
 var $frame2 = $('#basic2');
 $frame2.sly({
             horizontal: 1,
             itemNav: 'basic',
             smart: 1,
             activateOn: 'click',
             mouseDragging: 1,
             touchDragging: 1,
             releaseSwing: 1,
             startAt: 0,
             activatePageOn: 'click',
             speed: 300,
             elasticBounds: 1,
             easing: 'easeOutExpo',
             dragHandle: 1,
             dynamicHandle: 1
             });
}

function show_slide_experiance()
{
 var $frame3 = $('#basic3');// Home Slider 3
 $frame3.sly({
             horizontal: 1,
             itemNav: 'basic',
             smart: 1,
             activateOn: 'click',
             mouseDragging: 1,
             touchDragging: 1,
             releaseSwing: 1,
             startAt: 0,
             activatePageOn: 'click',
             speed: 300,
             elasticBounds: 1,
             easing: 'easeOutExpo',
             dragHandle: 1,
             dynamicHandle: 1
             });
}

function getAllExperiance()
{
 var AutoC="";
 
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
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        $('#experiance_container').html('');
        if(res[0]!= "no-data")
        {
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
        
        
        abc=abc+'<div class="col-sm-12 col-xs-12 single_library_container paddingtb catButton" onclick="Load_Trips('+res[i].SrNo+')">';
        abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero" id="TourList_'+res[i].SrNo+'">';
        abc=abc+'<input type="hidden" id="PlaceLog_'+res[i].SrNo+'" value="'+myObj.Places_List_all+'"/>';
        abc=abc+'<input type="hidden" id="UserId_'+res[i].SrNo+'" value="'+res[i].FbUserId+'"/>';
        abc=abc+'<div class="col-sm-4 col-xs-4 expImg">';
        
        if(res[i].FbUserId != '')
        {
        abc=abc+'<img class="firstimage" src=';
        abc= abc + '"https://graph.facebook.com/'+res[i].FbUserId+'/picture?type=large">';
        }
        else
        {
        abc=abc+'<img class="firstimage" src="" >';
        }
        
        abc=abc+'</div>';
        abc=abc+'<div class="col-sm-8 col-xs-8 paddingzero white">';
        abc=abc+'<ul class="site-desc">';
        abc=abc+'<li class="title hotelName" id="Name_'+res[i].SrNo+'">'+res[i].TourName+'</li>';
        abc=abc+'<li class="title hotelAdd" id="Description_'+res[i].SrNo+'"><div class="comment more">'+description_+'</div></li>';
        //abc=abc+'<li class="title hotelAdd" id="Last_updated'+res[i].SrNo+'">'+upd+'</li>';
        //        abc=abc+'<li class="title hotelAdd hotelLike" id="like_'+res[i].SrNo+'"><img style="height:15px;"src="assets/experiences/likes_icon.svg"> '+res[i].countlike+'&nbsp;&nbsp;&nbsp;<img style="height:15px;"src="assets/experiences/shares_icon.svg">4</li>';
        abc=abc+'<li class="title hotelAdd hotelLike" id="like_'+res[i].SrNo+'"><img style="height:15px;"src="assets/experiences/likes_icon.svg">&nbsp;&nbsp;'+res[i].countlike+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img style="height:15px;"src="assets/experiences/shares_icon.svg">&nbsp;&nbsp;4</li>';
        abc=abc+'</ul>' ;
        abc=abc+'</div>';
        abc=abc+'</div>';
        // abc=abc+'<div class="listImage col-sm-1 col-xs-1 paddingzero">';
        // abc=abc+'<div class="readMore">';
        // abc=abc+'<button type="button" class="btn btn-primary btn-xs">+</button>';
        // abc=abc+'</div>';
        // abc=abc+'</div>';
        abc=abc+'</div>';
        }
        $('#experiance_container').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        }
        });
}

// function getAllEvents()
// {
//  var url = site_url+'site/Events_list?';
//  $.ajax({
//         type: 'GET',
//         url: url,
//         contentType: "application/json",
//         dataType: 'jsonp',
//         jsonp: 'callback',
//         data: {},
//         beforeSend : function(){},
//         crossDomain: true,
//         success: function(res) {
//         // zres);
//         //return;
//         $('#events_container').html('');
//         if(res[0]!= "no-data")
//         {
//         var abc='';
//         for(var i=0; i<res.length; i++)
//         {
//         var SrNumber = res[i].SrNumber;
//         var PlaceIds = res[i].PlaceIds;
//         var Venueid = res[i].Venueid;

//         if(IsJsonString(res[i].LatLng)){
//         var LatLng = JSON.parse(res[i].LatLng);
//         }
//         var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
//         var Category = res[i].Category;
//         var Detail = JSON.parse(res[i].Detail);
//         var DateOfEstablishment = res[i].DateOfEstablishment;
//         var Event_Deal_name = res[i].Event_Deal_name;
//         var Place_Type = res[i].Place_Type;
//         // Detail.name
//         // Detail.address
//         // Detail.discount
//         // Detail.price
//         // Detail.date
//         // Detail.startTime
//         // Detail.endTime
//         // Detail.about
//         // Detail.Path
//         // Detail.profileimage
//         var addr='';
//         var text = '';

//         if(typeof Detail.address === 'string')
//         {
//         var arr_addr=Detail.address.split(",");
//         var index = '';  // Gets the first index where a space occours
//         var id = ''; // Gets the first part
//         var text = '';

//         if(arr_addr.length >= 4)
//         {
//         addr = arr_addr[0]; // Gets the first part
//         text = arr_addr[1];
//         }
//         else
//         {
//         index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
//         if(index >= 0)
//         {
//         addr = Detail.address.substr(0, index); // Gets the first part
//         text = Detail.address.substr(index+1);
//         index = addr.lastIndexOf(',');
//         if(index >= 0)
//         {
//         addr = addr.substr(0, index);
//         text = addr.substr(index+1);
//         var temp = addr.indexOf(',');
//         if(temp >= 0)
//         {
//         addr = addr.substr(temp + 1);
//         }
//         }
//         }
//         else
//         {
//         addr = Detail.address;
//         }
//         }
//         }

//         //      abc=abc+'<div class="col-sm-12 col-xs-12 single_library_container paddingtb catButton">';
//         // abc=abc+'<div class="col-sm-11 col-xs-11 paddingzero">';
//         // abc=abc+'<div class="col-sm-6 col-xs-6 paddingzero">';
//         // if(Detail.profileimage != '')
//         // {
//         //  abc=abc+'<img class="firstimage" src=';
//         //  abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
//         // }
//         // else
//         // {
//         //  abc=abc+'<img class="firstimage" src="" >';
//         // }
//         // abc=abc+'</div>';
//         // abc=abc+'<div class="col-sm-6 col-xs-6 paddingzero white">';
//         // abc=abc+'<ul class="site-desc">';
//         // abc=abc+'<li class="title hotelName">'+Event_Deal_name+'</li>';
//         // abc=abc+'<li class="title hotelAdd">'+addr+'</li>';
//         // abc=abc+'<li class="title hotelAdd">'+text+'</li>';
//         // abc=abc+'<li class="title hotelAdd">'+atob(Detail.about)+'</li>';
//         // abc=abc+'</ul>'  ;
//         // abc=abc+'</div>';
//         // abc=abc+'</div>';
//         // abc=abc+'<div class="listImage col-sm-1 col-xs-1 paddingzero">';
//         // abc=abc+'<div class="readMore">';
//         // abc=abc+'<button type="button" class="btn btn-primary btn-xs">+</button>';
//         // abc=abc+'</div>';
//         // abc=abc+'</div>';
//         // abc=abc+'</div>';

//         abc=abc+'<div class="single_library_container paddingzero col-sm-12 col-xs-12 '+PlaceIds+'" id="'+PlaceIds+'" data-sort="0.5">';
//         abc=abc+'<input type="hidden" name="Place_Id" value="'+PlaceIds+'">';
// //        abc=abc+'<input type="hidden" id="Lat_'+PlaceIds+'" value="'+LatLng.H+'">';
// //        abc=abc+'<input type="hidden" id="Log_'+PlaceIds+'" value="'+LatLng.L+'">';
//         abc=abc+'<div class="listImage col-sm-12 col-xs-12 paddingzero">';
//         if(Detail.profileimage != '')
//         {
//         abc=abc+'<img class="firstimage" src=';
//         abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
//         }
//         else
//         {
//         abc=abc+'<img class="firstimage" src="" >';
//         }
//         abc=abc+'</div>';
//         abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero detailplaceName">'+Event_Deal_name+'</div>';
//         abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero adr"> '+addr+'</div>';
//         /*abc=abc+'<div id="#hide-show" class="col-sm-12 col-xs-12 paddingzero Abt collapse"> '+atob(Detail.about)+'</div>';*/
//         abc=abc+'<div id="collapseOne'+PlaceIds+'" class="panel-collapse collapse collapseOne">';
//         abc=abc+'<div class="panel-body Abt">'+atob(Detail.about)+'</div>';
//         abc=abc+'<div class="col-sm-12 col-xs-12 panel-body contact-icons">';
//         abc=abc+'<ul class="nav">';
//         abc=abc+'<li class="hotelinfo hotelNo col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/call_icon.png">Call Now</a></li>';
//         abc=abc+'<li class="hotelinfo hotelBuy col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/buy_now_icon.png">Buy Now</a></li></li>';
//         abc=abc+'<li class="hotelinfo hotelWebsite col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/website_icon.png">Website</a></li></li>';
//         abc=abc+'<li class="hotelinfo hotelAddtour col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/add_to_tour_icon.png">Add to Tour</a></li></li>';
//         abc=abc+'</ul>'
//         abc=abc+'</div>';
//         abc=abc+'</div>';

//         /*abc=abc+'<div href="#hide-show" class="accordion-toggle" data-toggle="collapse">Show</div>';*/
//         abc=abc+'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne'+PlaceIds+'"></a>';
//         abc=abc+'<div class="col-sm-6 col-xs-6 openClose hourTime ">';
//         /*                      abc=abc+'<div class="btn btn-primary">View Events</div>';
//          */                      abc=abc+'</div>';
//         abc=abc+'</div>';
//         }
//         $('#events_container').append(abc);
//         }
//         else
//         {

//         }
//         },
//         error: function(e) {
//         },
//         complete: function(data) {
//         show_slide_experiance();
//         }
//         });
// }

function IsJsonString(str) {
 try {
  JSON.parse(str);
 } catch (e) {
  return false;
 }
 return true;
}

//function getAllNews()
//{
// var url = site_url+'site/News_list?';
// $.ajax({
//        type: 'GET',
//        url: url,
//        contentType: "application/json",
//        dataType: 'jsonp',
//        jsonp: 'callback',
//        data: {},
//        beforeSend : function(){},
//        crossDomain: true,
//        success: function(res) {
//        $('#news_container').html('');
//        if(res[0]!= "no-data")
//        {
//        var abc='';
//        for(var i=0; i<res.length; i++)
//        {
//        var sr_no = res[i].sr_no;
//        var Detail = res[i].Excerpt;
//        var img = res[i].Image;
//        var DateOfEstablishment = res[i].Date;
//        var NewsTitle = res[i].Title;
//        var Link = res[i].Link;
//
//
//        abc=abc+'<div class="single_library_container paddingzero col-sm-12 col-xs-12 '+sr_no+'" id="'+sr_no+'" data-sort="0.5">';
//        abc=abc+'<input type="hidden" name="sr_no" value="'+sr_no+'">';
//
//        abc=abc+'<div class="listImage col-sm-12 col-xs-12 paddingzero">';
//        if(img != '')
//        {
//        abc=abc+'<img class="firstimage" src=';
//        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+img+'">';
//        }
//        else
//        {
//        abc=abc+'<img class="firstimage" src="" >';
//        }
//        abc=abc+'</div>';
//        abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero detailplaceName">'+NewsTitle+'</div>';
//        abc=abc+'<div class="col-sm-12 col-xs-12 paddingzero adr"> '+Link+'</div>';
//        abc=abc+'<div id="collapseDeals'+sr_no+'" class="panel-collapse collapse collapseDeals">';
//        abc=abc+'<div class="panel-body Abt">'+Detail+'</div>';
//        abc=abc+'<div class="col-sm-12 col-xs-12 panel-body contact-icons">';
//        //        abc=abc+'<ul class="nav">';
//        //        abc=abc+'<li class="hotelinfo hotelNo col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/call_icon.png">Call Now</a></li>';
//        //        abc=abc+'<li class="hotelinfo hotelBuy col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/buy_now_icon.png">Buy Now</a></li></li>';
//        //        abc=abc+'<li class="hotelinfo hotelWebsite col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/website_icon.png">Website</a></li></li>';
//        //        abc=abc+'<li class="hotelinfo hotelAddtour col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/add_to_tour_icon.png">Add to Tour</a></li></li>';
//        //        abc=abc+'</ul>'
//        abc=abc+'</div>';
//        abc=abc+'</div>';
//        abc=abc+'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseDeals'+sr_no+'"></a>';
//
//        abc=abc+'</div>';
//        }
//        $('#news_container').append(abc);
//        }
//        else
//        {
//
//        }
//        },
//        error: function(e) {
//        },
//        complete: function(data) {
//        show_slide_experiance();
//        }
//        });
//}

function getAllNews()
{
 var url = site_url+'site/News_list?';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        $('#news_container').html('');
        if(res[0]!= "no-data")
        {
        var abc='';
        abc=abc+'<div id="news-carousel-example-generic" class="carousel slide" data-interval="false">';
        abc=abc+'<div class="carousel-inner add_active" >';
        for(var i=0; i<res.length; i++)
        {
        var sr_no = res[i].sr_no;
        var Detail = res[i].Excerpt;
        var img = res[i].Image;
        var DateOfEstablishment = res[i].Date;
        var NewsTitle = res[i].Title;
        var Link = res[i].Link;
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        
        abc=abc+'<div class="item '+activeclass+'  paddingzero col-sm-12 col-xs-12 '+sr_no+'" id="'+sr_no+'" data-sort="0.5">';
        abc=abc+'<input type="hidden" name="sr_no" value="'+sr_no+'">';
        
        abc=abc+'<div class="listImage col-sm-12 col-xs-12 paddingzero">';
        if(img != '')
        {
        abc=abc+'<img class="firstimage" src=';
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+img+'">';
        }
        else
        {
        abc=abc+'<img class="firstimage" src="" >';
        }
        abc=abc+'</div>';
        abc=abc+'<div class="col-sm-12 col-xs-12 newsinfo paddingzero">';
        abc=abc+'<div class="backgorundcolor">';
        abc=abc+'<div class="col-sm-12 col-xs-12 detailplaceName"><div class="newstitle">'+NewsTitle+'</div></div>';
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"> '+Link+'</div>';
        abc=abc+'</div>';
        abc=abc+'<div class="newsdetails">';
        //abc=abc+'<div id="collapseDeals'+sr_no+'" class="panel-collapse collapse collapseDeals">';
        
        abc=abc+'<div class="col-sm-12 col-xs-12 Abt">'+Detail+'</div>';
        // abc=abc+'</div>';
        abc=abc+'</div>';
        //abc=abc+'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseDeals'+sr_no+'"></a>';
        abc=abc+'</div>';
        abc=abc+'</div>';
        }
        
        abc=abc+'</div>';
        abc=abc+'</div>';
        
        
        
        $('#news_container').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        showMoreText('newsdata');
        }
        });
}

function getAllDeals()
{
 var url = site_url+'site/Deals_list?';
 $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {},
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        $('#deals_container').html('');
        if(res[0]!= "no-data")
        {
        var abc='';
        abc=abc+'<div id="deals-carousel-example-generic" class="carousel slide scroll" data-interval="false">';
        abc=abc+'<div class="carousel-inner add_active" >';
        for(var i=0; i<res.length; i++)
        {
        var SrNumber = res[i].SrNumber;
        var PlaceIds = res[i].PlaceIds;
        var Venueid = res[i].Venueid;
        var LatLng = JSON.parse(res[i].LatLng);
        var Foresquare_lat_lng = res[i].Foresquare_lat_lng;
        var Category = res[i].Category;
        var Detail = JSON.parse(res[i].Detail);
        
        var DateOfEstablishment = res[i].DateOfEstablishment;
        var Event_Deal_name = res[i].Event_Deal_name;
        var Place_Type = res[i].Place_Type;
        // Detail.name
        // Detail.address
        // Detail.discount
        // Detail.price
        // Detail.date
        // Detail.startTime
        // Detail.endTime
        // Detail.about
        // Detail.Path
        // Detail.profileimage
        var addr='';
        var text = '';
        
        var activeclass="";
        if(i==0)
        {
        activeclass="active";
        }
        if(typeof Detail.address === 'string')
        {
        var arr_addr=Detail.address.split(",");
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
        index = Detail.address.lastIndexOf(',');  // Gets the first index where a space occours
        if(index >= 0)
        {
        addr = Detail.address.substr(0, index); // Gets the first part
        text = Detail.address.substr(index+1);
        index = addr.lastIndexOf(',');
        if(index >= 0)
        {
        addr = addr.substr(0, index);
        text = addr.substr(index+1);
        var temp = addr.indexOf(',');
        if(temp >= 0)
        {
        addr = addr.substr(temp + 1);
        }
        }
        }
        else
        {
        addr = Detail.address;
        }
        }
        }
        var detail_desc=atob(Detail.about);
        cleanText = detail_desc.replace(/<\/?[^>]+(>|$)/g, "");
        if(cleanText.length > 100)
        {
        str_desc = cleanText.substring(0,100);
        }
        else
        {
        str_desc=cleanText;
        }
        
        abc=abc+'<div class="item '+activeclass+' paddingzero col-sm-12 col-xs-12 '+PlaceIds+'" id="'+PlaceIds+'" data-sort="0.5">';
        abc=abc+'<input type="hidden" name="Place_Id" value="'+PlaceIds+'">';
        abc=abc+'<input type="hidden" id="Lat_'+PlaceIds+'" value="'+LatLng.H+'">';
        abc=abc+'<input type="hidden" id="Log_'+PlaceIds+'" value="'+LatLng.L+'">';
        abc=abc+'<div class="listImage col-sm-12 col-xs-12 paddingzero">';
        if(Detail.profileimage != '')
        {
        abc=abc+'<img class="firstimage" src=';
        abc= abc + '"https://s3.amazonaws.com/retail-safari/'+Detail.profileimage+'">';
        }
        else
        {
        abc=abc+'<img class="firstimage" src="" >';
        }
        abc=abc+'</div>';
        abc=abc+'<div class="eventinfo col-sm-12 col-xs-12 paddingzero">';
        
        abc=abc+'<div class="col-sm-12 col-xs-12 detailplaceName"><div class="newstitle">'+Event_Deal_name+'</div></div>';
        //abc=abc+'<div id="collapseDeals'+PlaceIds+'" class="panel-collapse collapse collapseDeals">';
        abc=abc+'<div class="col-sm-12 col-xs-12 adr"><img class="clock" src="./assets/general/location_point_white.svg">'+addr+'</div>';
        abc=abc+'<div class="flex col-sm-12 col-xs-12 paddingzero">';
        abc=abc+'<div class="col-sm-8 col-xs-8 Abt"><img class="clock" style="margin-right:5px;" class="clock" src="assets/general/wall-clock.svg">26 Jan 2017 at 2:00 PM</div>';
        abc=abc+'<div class="col-sm-4 col-xs-4 Abt"><img class="clock" style="margin-right:5px;" src="assets/general/badge.svg">'+Detail.price+'</div>';
        abc=abc+'</div>';
        abc=abc+'<div class="col-sm-12 col-xs-12 Abt descAbt">'+str_desc+'...</div>';
        
        /*      abc=abc+'<div class="col-sm-12 col-xs-12 panel-body contact-icons">';
         abc=abc+'<ul class="nav">';
         abc=abc+'<li class="hotelinfo hotelNo col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/call_icon.png">Call Now</a></li>';
         abc=abc+'<li class="hotelinfo hotelBuy col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/buy_now_icon.png">Buy Now</a></li></li>';
         abc=abc+'<li class="hotelinfo hotelWebsite col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/website_icon.png">Website</a></li></li>';
         abc=abc+'<li class="hotelinfo hotelAddtour col-sm-3 col-xs-3"><a href="#"><img src="./assets/events/add_to_tour_icon.png">Add to Tour</a></li></li>';
         abc=abc+'</ul>'
         abc=abc+'</div>';*/
        abc=abc+'</div>';
        //abc=abc+'</div>';
        //abc=abc+'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseDeals'+PlaceIds+'"></a>';
        abc=abc+'</div>';
        }
        abc=abc+'</div>';
        abc=abc+'</div>';
        $('#deals_container').append(abc);
        }
        else
        {
        
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        show_slide_experiance();
        //showMoreText();
        }
        });
}

function showHome()
{
 var options = {
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "slowdownfactor"   :    3,
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );
document.getElementById('DetailBackButton').style.display = "block";
document.getElementById('DetailBackButton5').style.display = "none";
$("#homeSTARTProfile").hide();
$("#EventAll").hide();
$("#NewsAll").hide();
$("#DealAll").hide();
$("#ExperianceAll").hide();
$('#mapCanvas').hide();
$('#mainCatagoryNew').hide();
$('#Place_list_new').hide();
$('#Place_Tour_new').hide();
$('#ListDetail').hide();
$("#homepage").show();
$("#uploadPlace").hide();
$('#Save_Ui').hide();

 window.scrollTo(0, 0);
}

function add_new_place()
{
 $("#homeSTARTProfile").hide();
 $("#EventAll").hide();
 $("#NewsAll").hide();
 $("#DealAll").hide();
 $("#ExperianceAll").hide();
 $('#mapCanvas').hide();
 $('#mainCatagoryNew').hide();
 $('#Place_list_new').hide();
 $('#Place_Tour_new').hide();
 $('#ListDetail').hide();
 $("#homepage").hide();
 $("#uploadPlace").show();
}

function show_map()
{
// var options = {
//  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
//  "duration"       :  400, // in milliseconds (ms), default 400
//  "iosdelay"       :   50 // same as above but for Windows Phone, default 200
// };
// window.plugins.nativepagetransitions.flip(
//                                           options,
//                                           function (msg) {console.log("success: " + msg)}, // called when the animation has finished
//                                           function (msg) {alert("error: " + msg)} // called in case you pass in weird values
//                                           );
	
 var options = {
  "direction"      : "up", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       : 250, // in milliseconds (ms), default 400
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            //alert("SUCCESS: " + JSON.stringify(msg))
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );

 $("#homeSTARTProfile").hide();
 $("#EventAll").hide();
 $("#NewsAll").hide();
 $("#DealAll").hide();
 $("#ExperianceAll").hide();
 $('#homepage').hide();
 $('#mapCanvas').show();
 $('#mainCatagoryNew').hide();
 $('#Place_list_new').hide();
 $('#Place_Tour_new').hide();
 $('#ListDetail').hide();
 $('#Save_Ui').hide();
 // $('#myNewTour').hide();
 $("#uploadPlace").hide();
	
 if(Itineraries_list.length!=0)
 {
 Mapbox.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
 
 Mapbox.show(
             {
             container: 'map',
             style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
             margins: {
             left: 0, // default 0
             right: 0, // default 0
             top: 83, // default 0
             bottom: 0 // default 0
             },
             center: { // optional, without a default
             lat: mylat,
             lng: mylong
             },
             zoomLevel: 12, // 0 (the entire world) to 20, default 10
             showUserLocation: true, // your app will ask permission to the user, default false
             hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
             hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
             hideCompass: false, // default false
             disableRotation: false, // default false
             disableScroll: false, // default false
             disableZoom: false, // default false
             disablePitch: false, // disable the two-finger perspective gesture, default false
             styles : {
                        'text-align': 'center',
                        'font-size': '8px',
                        'width':'50px'
                       }
             })
 
	for(var i=0;i<Itineraries_list.length;i++)
 {
  var TourTag=$('#Itinerari_'+Itineraries_list[i]);//.children('div:first');
  //console
  var latitude_p = document.getElementById('Lat_'+Itineraries_list[i]).value;
  var Longitude_P = document.getElementById('Log_'+Itineraries_list[i]).value;
  
  var name =document.getElementById('Place_name'+Itineraries_list[i]).innerHTML
  
  var index_=name.indexOf('<');
  name_=name.substr(0,index_);
  
  var dis_ = document.getElementById('Dista_'+Itineraries_list[i]).innerHTML
  
  dis_index = dis_.indexOf('&');
  if(dis_index >= 0 )
  {
   dis_ = dis_.substring(0,dis_index);
   dis_ = dis_ +' away';
  }
 
 
  Mapbox.addMarkers(
                    [
                     {
                     'lat': latitude_p, // mandatory
                     'lng': Longitude_P, // mandatory
                     'title': name_+' : '+dis_, // no popup unless set
                     'subtitle': ' See more information of this place!                                                                                                          '+' '+name, // can't span multiple lines, so keep it short and sweet
                     }
                     ]
                    );
  
  
  //list.push(new plugin.google.maps.LatLng(latitude_p,Longitude_P));
 }
  Mapbox.addMarkerCallback(function (selectedMarker) {
  																								//alert("Marker selected: " + JSON.stringify(selectedMarker));
                           Detail(selectedMarker,'MAP');
                           });
 }
 else{
  Mapbox.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';

  Mapbox.show(
              {
              container: 'map',
              style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
              margins: {
              left: 0, // default 0
              right: 0, // default 0
              top: 83, // default 0
              bottom: 0 // default 0
              },
              center: { // optional, without a default
              lat: mylat,
              lng: mylong
              },
              zoomLevel: 12, // 0 (the entire world) to 20, default 10
              showUserLocation: true, // your app will ask permission to the user, default false
              hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
              hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
              hideCompass: false, // default false
              disableRotation: false, // default false
              disableScroll: false, // default false
              disableZoom: false, // default false
              disablePitch: false, // disable the two-finger perspective gesture, default false
              styles : {
              'text-align': 'center',
              'font-size': '8px',
              'width':'50px'
              }
             })
 }

}

function onSuccess(position)
{
 var mapDiv = document.getElementById("map_canvas");
 mylat = position.coords.latitude;
 mylong = position.coords.longitude;
 myLatLng = new google.maps.LatLng(mylat,mylong);
 const GOOGLE = new plugin.google.maps.LatLng(mylat,mylong);
 map = plugin.google.maps.Map.getMap(mapDiv, {
                                     'controls': {
                                     'zoom': true
                                     },
                                     'camera': {
                                     'latLng': GOOGLE,
                                     'zoom': 14
                                     }
                                     });
 var geocoder = new google.maps.Geocoder();
 var ad='';
 if (geocoder)
 {
  geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
                   {
                   if (status == google.maps.GeocoderStatus.OK)
                   {
                   ad=(results[0].formatted_address);
                   }
                   setAddress(Location_info,ad);
                   });
 }
}

function onError(error)
{
 
 console.log(error);
 //alert('code: '    + error.code    + '\n' +
   //    'message: ' + error.message + '\n');
}


function show_category_slide()
{
$("#mainCatagoryNew").show();
$("#homeSTARTProfile").hide();
$("#NewsAll").hide();
$("#DealAll").hide();
$("#EventAll").hide();
$('#homepage').hide();
$('#mapCanvas').hide();
$('#Place_list_new').hide();
$('#Place_Tour_new').hide();
$('#ListDetail').hide();
$('#Save_Ui').hide();
$("#uploadPlace").hide();
$("#ExperianceAll").hide();
 var options = {
  //"href" : "#mainCatagoryNew",
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "slowdownfactor"   :    3,
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
   };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );
 window.scrollTo(0, 0);
 
}

function show_place_list()
{
 $("#homeSTARTProfile").hide();
 $('#Place_list_new').show();
 $('#Place_Tour_new').hide();
 $('#mapCanvas').hide();
 $('#mainCatagoryNew').hide();
 $("#homepage").hide();
 $('#ListDetail').hide();
 $('#Save_Ui').hide();
 $("#uploadPlace").hide();
 var options = {
  "direction"      : "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            //alert('hi');
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );
 closeTab();
 Places();
 

}

function show_tour_list()
{
	var options = {
  "direction"      : "down", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
  "duration"       :  250, // in milliseconds (ms), default 400
  "slowdownfactor"   :    3,
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.slide(
                                            options,
                                            function (msg) {
                                            console.log(JSON.stringify(msg));
                                            },
                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                            );
 window.scrollTo(0, 0);
 $("#homeSTARTProfile").hide();
 $('#Place_list_new').hide();
 $('#Place_Tour_new').show();
 $('#mapCanvas').hide();
 $('#mainCatagoryNew').hide();
 $("#homepage").hide();
 $('#ListDetail').hide();
 $('#Save_Ui').hide();
 $("#uploadPlace").hide();
 $("#ExperianceAll").hide();
 $("#EventAll").hide();
 $("#NewsAll").hide();
 $("#DealAll").hide();
 Mapbox.hide(
             {},
             function(msg) {
             console.log("Mapbox successfully hidden");
             }
             );
 calculatehight();
}
/*function showStartExplore(){
 $("#exp-options").show();
 $('#myNewTour').addClass('overlay-blur');
 $('.expheader').addClass('overlay-blur');
 $('.exphide').addClass('exphidden');
 }*/
function hideStartExplore()
{
 //$("#exp-options").hide();
 $('#myNewTour').removeClass('overlay-blur');
 $('.expheader').removeClass('overlay-blur');
 $('.exphide').removeClass('exphidden');
 //$("#exp-options").removeClass('collapse');
 $("#exp-options").removeClass('in');
 //$("#exp-options").addClass('collapse');
 $("#exp-options").attr({
                        "aria-expanded" : "false"
                        });
}

function show_save_ui()
{
 $("#homeSTARTProfile").hide();
 $('#Place_list_new').hide();
 $('#Place_Tour_new').hide();
 $('#mapCanvas').hide();
 $('#mainCatagoryNew').hide();
 $("#homepage").hide();
 $('#ListDetail').hide();
 $('#Save_Ui').show();
 $("#uploadPlace").hide();
 $("#ExperianceAll").hide();
 
}

function Show_Detail()
{
 $("#homeSTARTProfile").hide();
 $('#Place_list_new').hide();
 $('#Place_Tour_new').hide();
 $('#mapCanvas').hide();
 $('#mainCatagoryNew').hide();
 $("#homepage").hide();
 $('#Save_Ui').hide();
 $('#ListDetail').show();
 $("#uploadPlace").hide();
}

function show_categories()
{
 $("#homeSTARTProfile").hide();
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
 //$('#myNewListing').show("slide", {direction: "down"},400);
}
function closeListing()
{
 $('#mainCatagoryNew').show("slide", {direction: "left"},400);
 /* $('#Cat1').hide("slide", {direction: "down"},400);
  $('#Cat2').hide("slide", {direction: "down"},400);
  $('#Cat3').hide("slide", {direction: "down"},400);
  $('#Cat4').hide("slide", {direction: "down"},400);
  $('#Cat5').hide("slide", {direction: "down"},400);
  $('#Cat7').hide("slide", {direction: "down"},400);*/
 $('#Place_list_new').hide("slide", {direction: "right"},400);
}

function Places()
{
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
 
 if(Category_prop.length ==0)
 {
  swal({
       title: "Select",
       html:'true',
       text: "Please select any category",
       type: "info",
       confirmButtonText: "Ok",
       closeOnConfirm: true
       },
       function(isConfirm) {
       show_category_slide();
       document.getElementById("selected_site_list1").innerHTML = "";
       return;
       });
  //swal("Please select any Catagory");
  
 }
 
 // var radius_s = Math.round((document.getElementById('ex1').value) * 1609.34);
 var miles = parseFloat(document.getElementById('ex1').value);
 myLatLng = new google.maps.LatLng(mylat, mylong);
 service_d = new google.maps.DistanceMatrixService();
 
 //document.getElementById("thread_").innerHTML='<a href="#" onclick="goToNearByPlace()"><img src="images/back.svg" style="Height: 25px; width: 25px;"><span class="back">Back</span></a>';
 var gridList='';
 var results_ele=[];
 
 if(!(typeof res_list_direction.rows === "undefined"))
 {
  results_ele = res_list_direction.rows[0].elements;
 }
 var flag=false;
 var miles = parseFloat(document.getElementById('ex1').value);
 var ser_flag="false";
 var st=0;
 
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
   category_In_Grid = category_In_Grid + '<div class="col-sm-12 col-xs-12 paddingzero paddingtb">';
   category_In_Grid = category_In_Grid + '<h4 class="panel-title">';
   category_In_Grid = category_In_Grid + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#PanelCollapse_'+Category_prop[j]+'">';
   category_In_Grid = category_In_Grid + '<div class="col-sm-10 col-xs-10 paddingzero heading">';
   category_In_Grid = category_In_Grid + abc;
   category_In_Grid = category_In_Grid + '</div>';
   category_In_Grid = category_In_Grid + '</a>';
   category_In_Grid = category_In_Grid + '</h4>';
   category_In_Grid = category_In_Grid + '</div>';
   category_In_Grid = category_In_Grid + '</div>';
   category_In_Grid = category_In_Grid +'<div id="PanelCollapse_'+Category_prop[j].toLowerCase()+'" class="panel-collapse collapse">';
   category_In_Grid = category_In_Grid + '<div class="panel-body panel_scroll_end overflowX" id="collapse_'+Category_prop[j]+'">';
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
                  if(count>1)
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
                         
                         if(res != "no-data")
                         {
                         for (var i=0; i < res.length; i++)
                         {
                         if(place_id_list.indexOf(res[i].PlaceIds) < 0)
                         {
                         
                         if(!(typeof res[i].LatLng === "undefined"))
                         {
                         if(IsJsonString(res[i].LatLng)){
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
                         }
                         }
                         }
                         else
                         {
                         $.LoadingOverlay("hide");
                         }
                         },
                         error: function(e) {
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

function IsJsonString(str) {
 try {
  JSON.parse(str);
 } catch (e) {
  return false;
 }
 return true;
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
        },
        crossDomain: true,
        success: function(res)
        {
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
        }
        }
        }
        else
        {
        $.LoadingOverlay("hide");
        }
        },
        error: function(e) {
        },
        complete: function(data) {
        }
        });
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
       setTimeout(function()
                  {
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
 var parse=JSON.parse(detaliObj);
 var detail=detaliObj;
 
 if(detail === 'undefined')
 {
  return;
 }
 
 if(typeof miles === 'undefined' || miles == '')
 {
  return;
 }
 
 var numb = miles.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); });
 
 
 if(parse.type != "Deals" && parse.type != "Events")
 {
  gridList = gridList + '<div class="single_library_container col-sm-12 col-xs-12 '+Id_Places+'" id="List_'+ Id_Places +'" data-sort="'+numb+'" '+display+'><input type="hidden" name="Place_Id" value="'+Id_Places+'"/><input type="hidden" id="Lat_'+Id_Places+'"  value="'+LAT+'"/><input type="hidden" id="Log_'+Id_Places+'" value="'+LON+'"/><div id="Add_'+Id_Places+'" style="display:none;">'+parse.address+'</div><textarea id="DetailLog_'+Id_Places+'" style="display:none;">'+detaliObj+'</textarea>';
  gridList = gridList + '<div class="listpb listDescription col-sm-11 col-xs-11" id="'+ Id_Places +'" onClick="Detail(this,true)"><a id="selectedSiteListImage_'+Id_Places+'">';
  
  if(!(typeof parse.profileimage === "undefined") && parse.profileimage.length > 0)
  {
   var img=parse.profileimage;
   var path=encodeURI('https://s3.amazonaws.com/retail-safari/resize_image/'+img);
   
   gridList = gridList + '<div class="listImage col-sm-4 col-xs-4 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else if(!(typeof parse.Path === "undefined") && parse.Path.length > 0)
  {
   var img=parse.Path.split(",");
   var path=encodeURI('https://s3.amazonaws.com/retail-safari/resize_image/'+img[0]);
   
   gridList = gridList + '<div class="listImage col-sm-4 col-xs-4 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="'+path+'" /></div>';
  }
  else
  {
   gridList = gridList + '<div class="listImage col-sm-4 col-xs-4 paddingzero"><img class="firstimage" id="Place_Image'+Id_Places+'" src="images/default.jpg" /></div>';
  }
  
  gridList = gridList + '<div class="listdetails col-sm-8 col-xs-8"><ul class="site-desc">';
  gridList = gridList + '<li class="title hotelName" id="Place_name'+Id_Places+'"> '+parse.name+'';
  gridList = gridList + '<span id="Distance'+Id_Places+'"></span></li>';
  gridList = gridList + '<li class="title hotelRating"><div class="reviews" id="Rev'+Id_Places+'">';
  
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
  
  gridList = gridList + '<li class="title hotelAdd"> <div class="customadd_desc"><i class="fa fa-map-marker" aria-hidden="true"></i> '+id+'</div></li>';
  gridList = gridList + '<li class="title hotelAdd"><div class="flex" id="Dista_'+Id_Places+'">'+miles+'&nbsp;away&nbsp;&nbsp;&#8226;&nbsp;<div class="green">OPEN</div></div></li>';
  gridList = gridList +  '</ul></div></a></div>';
  gridList = gridList + '<div class="expplacelist addtoexp listImage col-sm-1 col-xs-1 paddingzero" onClick="itineraries(this);"><div class="readMore"><button type="button" class="btn btn-primary btn-xs" ></button></div></div></div>';
 }
 
 var id='collapse_'+j_id;
 document.getElementById(id).innerHTML= gridList+document.getElementById(id).innerHTML;
 var list = $("#"+id);
 id='#'+id;
 var mylist = $(id);
 var listitems = mylist.children('div').get();
 
 listitems.sort(function(a, b)
                {
                return  $(a).attr('data-sort') - $(b).attr('data-sort');
                });
 
 
 showMoreText();
 $.each(listitems, function(index, item)
        {
        mylist.append(item);
        });
 
 if(End_flag == true)
 {
  $.LoadingOverlay("hide");
  $('.single_library_container').each(function(){
                                      $(this).show();
                                      });
 }
}

// show more button for view details view
function showMoreText(data)
{
 // if(data=='newsdata')
 // {
 //  var showChar = 160;
 // }
 // else{
 //  var showChar=80;
 // }
 var showChar = 160;  // How many characters are shown by default
 var ellipsestext = "...";
 var moretext = "Read more >";
 var lesstext = "Show less";
 
 
 $('.more').each(function() {
                 var content = $(this).text();
                 
                 if(content.length > showChar) {
                 
                 var c = content.substr(0, showChar);
                 var h = content.substr(showChar, content.length - showChar);
                 
                 var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
                 
                 $(this).html(html);
                 }
                 
                 });
 
}
$(document).on('click', '.morelink', function()
               {
               if($(this).hasClass("less"))
               {
               $(this).removeClass("less");
               $(this).html("Read more >");
               }
               else
               {
               $(this).addClass("less");
               $(this).html("Show less");
               }
               $(this).parent().prev().toggle();
               $(this).prev().toggle();
               return false;
               });
function showMoreText2(data)
{
 
 var showChar = 160;  // How many characters are shown by default
 var ellipsestext = "...";
 var moretext = "Read more >";
 var lesstext = "Show less";
 
 
 $('.moretext').each(function() {
                     var content = $(this).text();
                     
                     if(content.length > showChar) {
                     
                     var c = content.substr(0, showChar);
                     var h = content.substr(showChar, content.length - showChar);
                     
                     var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent2"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink2">' + moretext + '</a></span>';
                     
                     $(this).html(html);
                     }
                     
                     });
 
}
$(document).on('click', '.morelink2', function()
               {
               if($(this).hasClass("lesstext"))
               {
               $(this).removeClass("lesstext");
               $(this).html("Read more >");
               }
               else
               {
               $(this).addClass("lesstext");
               $(this).html("Show less");
               }
               $(this).parent().prev().toggle();
               $(this).prev().toggle();
               return false;
               });

function chk_scroll(e)
{
 var elem = $(e.currentTarget);
 if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
 {
  SeeMoreInfo(e.currentTarget.id);
 }
}



function itineraries(thisobj)
{
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
  var latitude_p = document.getElementById('Lat_'+thisobj.previousSibling.id).value;
  var Longitude_P = document.getElementById('Log_'+thisobj.previousSibling.id).value;
  
  
  var struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+thisobj.previousSibling.id+'"  value="'+latitude_p+'"/><input type="hidden" id="Log_'+thisobj.previousSibling.id+'" value="'+Longitude_P+'"/><div class="col-sm-4 col-xs-4 paddingzero"><img class="itineraryImg" src="'+document.getElementById('Place_Image'+thisobj.previousSibling.id).src+'" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit" onclick="Detail(this,false)"><li class="title hotelName"> '+name+'</li> <li class="title hotelAdd" ><div class="Tours_Address_new"><img style="width:10px;margin-right:5px;"src="./assets/experiences/location_pin_icon.svg"/>'+id+ '</div></li><li class="title itinerarydes"> <!--<div style="float:left;">'+text+'&nbsp;-&nbsp;</div>--><div class="flex" style="margin-left:10px;" >'+document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML+'&nbsp;</div></li><div class="exp-comment"></div></ul></div></div>';
  
  document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+thisobj.previousSibling.id+'"><div class="col-sm-12 col-xs-12 moveleft paddingzero"><div class="col-sm-12 col-xs-12 paddingzero leftshift paddingtb" id="moveleft_'+thisobj.previousSibling.id+'" >' + struct + '</div><div class="visitOption col-sm-7 col-xs-7 markhidden paddingzero"><div class="col-sm-4 col-xs-4 img-responsive paddingzero handle vis Drag"><img class="img-responsive" src="images/shift_position_icon.svg" style="Height: 25px; width: 25px;margin:6px 20px;"/><div class="markasvisited">Shift</div></div><div class="markasvisited vis col-sm-4 col-xs-4 paddingzero" ><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+thisobj.previousSibling.id+'" value="visited"><label for="Visited_'+thisobj.previousSibling.id+'"></label><div class="markasvisited">Mark visited</div></div><div onClick="delete_it(this)" class="col-sm-4 col-xs-4  paddingzero Del"><img class="img-responsive pb4" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/><div class="markasvisited">Delete</div></div></div></div></div>';
  
  $(".moveleft").on("swipeleft", "div.leftshift", function(){
                    var div_id = $(this).attr("id");
                    $(this).parents("div.moveleft").find(".visitOption").show("slide",{direction: "right"},500);
                    $(this).animate({"left": "-20%"}, 500);
                    });
  $(".moveleft").on("swiperight", "div.leftshift", function(){
                    var div_id = $(this).attr("id");
                    $(this).parents("div.moveleft").find(".visitOption").hide("slide",{direction: "right"},500);
                    $(this).animate({"left": "0%"},500);
                    });
  
  
  Itineraries_list.push(thisobj.previousSibling.id);
  Itineraries_Ad.push(p_address);
  Tour_List.push('1');

 // const GOOGLE = new plugin.google.maps.LatLng(latitude_p,Longitude_P);

  var dis_ = document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML;
  
  
  dis_index = dis_.indexOf('&');
  if(dis_index >= 0 )
  {
   dis_ = dis_.substring(0,dis_index);
   dis_ = dis_ +' away';
  }

  var abcn="."+thisobj.previousSibling.id;
  $(abcn).each(function() {
               $(this).addClass('addItinerary');
               });
  var iti=document.getElementById('Itinerary').innerHTML;
 }
 else
 {
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
   Markers[index+1].remove();
   Markers.splice(index+1, 1);
  }
  
  
  var iti=document.getElementById('Itinerary').innerHTML;
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
 //Editor();
}

function mapboxOptimization()
{
 var ItinaryLatLng=[];
 for(var i=0;i<Itineraries_list.length;i++)
 {
  var l_lat = document.getElementById('Lat_'+Itineraries_list[i]).value;
  var l_long = document.getElementById('Log_'+Itineraries_list[i]).value;
  var latLngItin=l_long+","+l_lat;
  ItinaryLatLng.push(latLngItin);
 }
 
 var data=ItinaryLatLng.join(";");
 
 if ((!$("input[name='route']:checked").val()) || (!$("input[name='roundTrip']:checked").val()))
 {
  swal({
       title: "Save",
       text: "Please select any of the optimization.",
       type: "info",
       confirmButtonText: "Ok",
       closeOnConfirm: true
       },
       function(isConfirm) {
       return;
       });
 }
 else if(document.getElementById('roundTrip_yes').checked){
  if(data.length==""){
   swal({
        title: "Info",
        text: "Please select a place first.",
        type: "info",
        confirmButtonText: "Ok",
        closeOnConfirm: true
        },
        function(isConfirm) {
        return;
        });
  }else{
   var data1='https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';
   var data2='?source=first&destination=last&roundtrip=true&access_token=pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
   var url_=data1+""+data+""+data2;
 		$.ajax({
               url:url_,
               beforeSend: function(xhr) {
               },
               success: function(data){
               swal({
                    title: "Congrats",
                    text: "Experience is successfully updated using optimize route roundtrip.",
                    html: true,
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                    },
                    function(isConfirm) {
               var waypoints = data.waypoints;
               for(var j=0;j<waypoints.length;j++)
               {
               var wayPoint_index = waypoints[j].waypoint_index;
               var ExpId=Itineraries_list[j];
               $("#Itinerari_"+ExpId).attr("data-sort",wayPoint_index);
               console.log(wayPoint_index+"--"+ExpId);
               }
               var mylist=$("#Itinerary");
               var listitems = mylist.children('div').get();
               listitems.sort(function(a, b) {
                              return  $(a).attr('data-sort') - $(b).attr('data-sort');
                              });
               $.each(listitems, function(index, item) {
                      mylist.append(item);
                      });
                });
               }
               
               });
        hideStartExplore();
  }
  
 }
 else if(document.getElementById('walking').checked){
  if(data.length==""){
   swal({
        title: "Info",
        text: "Please select a place first.",
        type: "info",
        confirmButtonText: "Ok",
        closeOnConfirm: true
        },
        function(isConfirm) {
        return;
        });
  }else{
   var data1='https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';
   var data2='?access_token=pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
   var url_=data1+""+data+""+data2;
      $.ajax({
               url:url_,
               beforeSend: function(xhr) {
               },
               success: function(data){
             swal({
                  title: "Congrats",
                  text: "Experience is successfully updated according to walking optimization.",
                  html: true,
                  type: "info",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Ok",
                  closeOnConfirm: true
                  },
                  function(isConfirm) {
               console.log(data);
               var waypoints = data.waypoints;
               console.log(waypoints);
               for(var j=0;j<waypoints.length;j++)
               {
               var wayPoint_index = waypoints[j].waypoint_index;
               var ExpId=Itineraries_list[j];
               $("#Itinerari_"+ExpId).attr("data-sort",wayPoint_index);
               console.log(wayPoint_index+"--"+ExpId);
               }
               var mylist=$("#Itinerary");
               var listitems = mylist.children('div').get();
               listitems.sort(function(a, b) {
                              return  $(a).attr('data-sort') - $(b).attr('data-sort');
                              });
               $.each(listitems, function(index, item) {
                      mylist.append(item);
                      });
               });
               }
               });
        hideStartExplore();
      
  }
 }
 else if(document.getElementById('bicycle').checked){
  if(data.length==""){
   swal({
        title: "Info",
        text: "Please select a place first.",
        type: "info",
        confirmButtonText: "Ok",
        closeOnConfirm: true
        },
        function(isConfirm) {
        return;
        });
  }else{
   var data1='https://api.mapbox.com/optimized-trips/v1/mapbox/cycling/';
   var data2='?access_token=pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
   var url_=data1+""+data+""+data2;
        $.ajax({
               url:url_,
               beforeSend: function(xhr) {
               },
               success: function(data){
               swal({
                    title: "Congrats",
                    text: "Experience is successfully updated according to bicycle optimization.",
                    html: true,
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                    },
                    function(isConfirm) {
               var waypoints = data.waypoints;
               for(var j=0;j<waypoints.length;j++)
               {
               var wayPoint_index = waypoints[j].waypoint_index;
               var ExpId=Itineraries_list[j];
               $("#Itinerari_"+ExpId).attr("data-sort",wayPoint_index);
               console.log(wayPoint_index+"--"+ExpId);
               }
               var mylist=$("#Itinerary");
               var listitems = mylist.children('div').get();
               listitems.sort(function(a, b) {
                              return  $(a).attr('data-sort') - $(b).attr('data-sort');
                              });
               $.each(listitems, function(index, item) {
                      mylist.append(item);
                      });
                    });
               }
               })
        hideStartExplore();
   
  }
 }
 else if(document.getElementById('car').checked){
  if(data.length==""){
   swal({
        title: "Info",
        text: "Please select a place first.",
        type: "info",
        confirmButtonText: "Ok",
        closeOnConfirm: true
        },
        function(isConfirm) {
        return;
        });
  }else{
   var data1='https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';
   var data2='?access_token=pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
   var url_=data1+""+data+""+data2;
        $.ajax({
               url:url_,
               beforeSend: function(xhr) {
               },
               success: function(data){
               swal({
                    title: "Congrats",
                    text: "Experience is successfully updated according to car driving optimization.",
                    html: true,
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                    },
                    function(isConfirm) {
               console.log(data);
               var waypoints = data.waypoints;
               console.log(waypoints);
               for(var j=0;j<waypoints.length;j++)
               {
               var wayPoint_index = waypoints[j].waypoint_index;
               var ExpId=Itineraries_list[j];
               $("#Itinerari_"+ExpId).attr("data-sort",wayPoint_index);
               console.log(wayPoint_index+"--"+ExpId);
               }
               var mylist=$("#Itinerary");
               var listitems = mylist.children('div').get();
               listitems.sort(function(a, b) {
                              return  $(a).attr('data-sort') - $(b).attr('data-sort');
                              });
               $.each(listitems, function(index, item) {
                      mylist.append(item);
                      });
                    });
               }
               })
        hideStartExplore();
     }
 }
}

//function itineraries(thisobj)
//{
// //document.getElementById('Tour_List').innerHTML='';
// // code to add and delete place from itinerary starts here
// if(!($('#List_'+thisobj.previousSibling.id).hasClass('addItinerary')))
// {
//  var ac=thisobj.previousSibling;
//  var aaa="Add_"+thisobj.previousSibling.id;
//  var p_address=document.getElementById(aaa).innerHTML;
//  var name =document.getElementById('Place_name'+thisobj.previousSibling.id).innerHTML
//  var index_=name.indexOf('<');
//  name=name.substr(0,index_);
//
//  var arr_addr=p_address.split(",");
//  var index = '';  // Gets the first index where a space occours
//  var id = ''; // Gets the first part
//  var text = '';
//
//  if(arr_addr.length >= 4)
//  {
//   id = arr_addr[0]; // Gets the first part
//   text = arr_addr[1];
//  }
//  else
//  {
//   index = p_address.lastIndexOf(',');  // Gets the first index where a space occours
//   id = p_address.substr(0, index); // Gets the first part
//   index = id.lastIndexOf(',');
//   text = id.substr(index + 1);
//
//   var temp=id.indexOf(',');
//   if(temp >= 0)
//   {
//    id = id.substr(temp + 1);
//   }
//  }
//
//  var struct='<div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-4 col-xs-4 paddingzero"><img class="itineraryImg" src="'+document.getElementById('Place_Image'+thisobj.previousSibling.id).src+'" /></div><div class="col-sm-8 col-xs-8 paddingleft"><ul class="yetToVisit"><li class="title hotelName"> '+name+'</li> <li class="title hotelAdd" ><div class="Tours_Address_new"><img style="width:10px;margin-right:5px;"src="./assets/experiences/location_pin_icon.svg"/>'+id+ '</div></li><li class="title itinerarydes"> <!--<div style="float:left;">'+text+'&nbsp;-&nbsp;</div>--><div style="margin-left:10px;" >'+document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML+'&nbsp;</div><div class="green">OPEN</div></li><div class="exp-comment"></div></ul></div></div>';
//
//
//
//  document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+thisobj.previousSibling.id+'"><div class="col-sm-10 col-xs-10 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class=" col-sm-2 col-xs-2  paddingzero Del" style="display:none"><div class="markasvisited">Remove from list</div><img class="img-responsive pb4" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/></div><!--<div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px;"/></div>--><div class="markasvisited vis col-sm-2 col-xs-2 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+thisobj.previousSibling.id+'" value="visited"><label for="Visited_'+thisobj.previousSibling.id+'"></label></div></div></div>';
//  //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;
//
//  Itineraries_list.push(thisobj.previousSibling.id);
//  Itineraries_Ad.push(p_address);
//  Tour_List.push('1');
//  //$('#List_'+thisobj.previousSibling.id).addClass('addItinerary');
//  var abcn="."+thisobj.previousSibling.id;
//  $(abcn).each(function() {
//               $(this).addClass('addItinerary');
//               });
//
//  //    var latitude_p = document.getElementById('Lat_'+thisobj.previousSibling.id).value;
//  //    var Longitude_P = document.getElementById('Log_'+thisobj.previousSibling.id).value;
//  //    var position = new google.maps.LatLng(latitude_p, Longitude_P);
//  //    var bounds = new google.maps.LatLngBounds();
//  //    bounds.extend(myLatLng);
//  //     marker = new google.maps.Marker({
//  //                                       position: position,
//  //                                       map: map
//  //     });
//  //     Markers.push(marker);
//  //     map_place_list.push(thisobj.previousSibling.id);
//  //     var j=0;
//  //     google.maps.event.addListener(marker, 'click', (function(marker, j) {
//  //        return function() {
//  //                            marker.info.close();
//  //                            marker.info = new google.maps.InfoWindow({ content: ''+name + ' - ' +document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML });
//  //                            marker.info.open(map, marker);
//  //                            //Markers.push(marker);
//  //                            var TourTag = $('#Itinerari_'+thisobj.previousSibling.id).children('div:first');
//  //                            //console.log('In map marker on click'+ TourTag);
//  //                            $.LoadingOverlay("show");
//  //                            Detail(TourTag,'MAP');
//  //                           }
//  //    })(marker, j));
//  // code to open markar by default
//  //marker.info = new google.maps.InfoWindow({content: ''+name + ' - ' + document.getElementById('Dista_'+thisobj.previousSibling.id).innerHTML});
//  //marker.info.open(map, marker);
//  //map.fitBounds(bounds);
//
//  var iti=document.getElementById('Itinerary').innerHTML;
//  //document.getElementById('Tour_List').innerHTML=document.getElementById('Itinerary').innerHTML;
// }
// else
// {
//  //$('#List_'+thisobj.previousSibling.id).removeClass('addItinerary');
//  var abcn="."+thisobj.previousSibling.id;
//  $(abcn).each(function() {
//               $(this).removeClass('addItinerary');
//               });
//  $('#Itinerari_'+thisobj.previousSibling.id).remove();
//  var index=Itineraries_list.indexOf(thisobj.previousSibling.id);
//  if(index != -1)
//  {
//   Itineraries_list.splice(index, 1);
//   Itineraries_Ad.splice(index, 1);
//   Tour_List.splice(0,1);
//  }
//
//  // index=map_place_list.indexOf(thisobj.previousSibling.id);
//  // if(index != -1)
//  // {
//  //     map_place_list.splice(index, 1);
//  //     Markers[index].setMap(null);
//  // }
//
//  var iti=document.getElementById('Itinerary').innerHTML;
//  //document.getElementById('Tour_List').innerHTML=document.getElementById('Itinerary').innerHTML;
// }
// // code to add and delete place from itinerary ends here
// var i=1;
//
// //code to add colore difference in the place tabs
// $(".YetToVisitedNode").each(function() {
//
//                             if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
//                             {
//                             if($(this).hasClass('oddItinerary'))
//                             {
//                             $(this).removeClass('oddItinerary');
//                             }
//                             $(this).addClass('evenItinerary');
//                             }
//                             else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
//                             {
//                             if($(this).hasClass('evenItinerary'))
//                             {
//                             $(this).removeClass('evenItinerary');
//                             }
//                             $(this).addClass('oddItinerary');
//                             }
//                             i++;
//                             });
//
// i=1;
//
// $(".visitedNode").each(function() {
//
//                        if(i%2 == 0 && !$(this).hasClass('evenItinerary'))
//                        {
//                        if($(this).hasClass('oddItinerary'))
//                        {
//                        $(this).removeClass('oddItinerary');
//                        }
//                        $(this).addClass('evenItinerary');
//                        }
//                        else if(i%2 != 0 && !$(this).hasClass('oddItinerary'))
//                        {
//                        if($(this).hasClass('evenItinerary'))
//                        {
//                        $(this).removeClass('evenItinerary');
//                        }
//                        $(this).addClass('oddItinerary');
//                        }
//                        i++;
//                        });
// //Adding colore difference code ends here
//
// //code to hide edit mode if it is open.
// Editor();
// //code end here
//}

function itinerary_Detail_()
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
   
   var struct='<div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-4 col-xs-4 paddingzero"><img class="img-circle itineraryImg" src="'+document.getElementById('Place_Image'+detail_Id).src+'" /></div><div class="col-sm-8 col-xs-8 paddingleft"><ul class="yetToVisit"><li class="title hotelName"> '+name+'</li> <li class="title itinerarydes"><div>'+id+'</div></li><li class="title itinerarydes"> <div style="float:left;">'+text+'&nbsp;&nbsp;</div><div>'+document.getElementById('Dista_'+detail_Id).innerHTML+'&nbsp;</div></li></ul></div></div>';
   
   
   
   document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode" id="Itinerari_'+detail_Id+'"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-sm-2 col-xs-2 paddingzero Del" style="display:none"><img class="img-responsive pb" src="images/trash.svg" style="Height: 35px; width: 35px;"/></div><div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/shift_position_icon.svg" style="Height: 25px; width: 25px; "/></div><div class="markasvisited vis col-sm-3 col-xs-3 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited"></div></div>';
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


//added editor function to avoid redundancy(used in multiple places)
function Editor()
{
 document.getElementById('EDIT_a').innerHTML = 'EDIT';
 $(".vis").css("display", "block");
 $(".Drag").css("display", "none");
 $(".Del").css("display", "none");
}
//also this includes mainly in the edit function.

//code for editing itineraries from the Itinerary list
function Edit(thisObj)
{
 if($('.vis').is(':visible'))
 {
  document.getElementById('EDIT_a').innerHTML = 'DONE';
  $(".vis").css("display", "none");
  //$(".Drag").css("display", "block");
  $(".Del").css("display", "block");
 }
 else
 {
  Editor();
 }
}
//edit function ends here.

//function use to invoke the transport mode dropdown (empty function please do not delete).
function trial()
{}
//function use to invoke the transport mode dropdown ends here

//code for deleting itineraries from the list
function delete_it(thes)
{
 $(thes).parent().parent().parent().remove();
 var id=$(thes).parent().parent().parent().attr('id');
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
   Markers[index+1].remove();
   Markers.splice(index+1,1);
  }
  Tour_List.splice(0,1);
 }
}
//itinararies deletion function ends here

/* Drag itnorary Strat here */
$(document).bind('pageinit', function()
                 {
                 $( "#Itinerary" ).sortable({handle : '.handle'}).disableSelection();
                 });
/* Drag itnorary End here */

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

//function will take u to map for navigation
function Build(mode)
{
 if(Itineraries_list.length == 0)
 {
  swal("Please select a place first");
  return;
 }
 
 var CurrentLocationUser=c_address;
 
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
      show_tour_list();
      document.getElementById("desc_t").value="";
      document.getElementById("Tag_t").value="";
      document.getElementById("Tour_Owner_Status").value="";
      document.getElementById("name_t").value="";
      T_SrNo = '';
      swal.close();
      return;
      }
      //alert('by');
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
      document.getElementById('myexp-description').innerHTML='';
      //document.getElementById('Tour_List').innerHTML='';
      
      $(".addItinerary").each(function()
                              {
                              $(this).removeClass('addItinerary');
                              });
      Save_id="0";
      process="";
      swal.close();
      
      if(Select != 'Clear_list' )
      {}
      });
}

//Facebook login start from here
function FbLogin(Get_Info,extra)
{
 
 extra = typeof extra !== 'undefined' ? extra : "undefined";
 
 status = Get_Info;
 if(Get_Info == "Notification")
 {
  Notification();
  return;
 }
 
 
 // FbUserId_Log="181091708907027";
 // FbUserId_Log="132584620424403";
 // if(Get_Info == "Save")
 // {
 //     Save_Ui_function();
 // }
 // else if(Get_Info == "MyTrips")
 // {
 //     Get_Tour();
 // }
 // else if(Get_Info == "Share")
 // {
 //     //Share_trip(Save_id);
 //     if(Save_id != "0")
 //     {
 //         Share_trip(Save_id);
 //     }
 //     else
 //     {
 //         Save_Ui_function();
 //         process="share";
 //     }
 // }
 // else if(Get_Info == "Notification")
 // {
 //     Notification();
 // }
 // else if(Get_Info == "Likes")
 // {
 //     return userData.authResponse.userID;
 // }
 // else if(Get_Info=="Auto")
 // {
 //     autocompletemain(extra)
 // }
 // else
 // {
 //     Load_Trips(Get_Info);
 // }
 // return;
 
 facebookConnectPlugin.getLoginStatus(function (userData) {
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
      function(isConfirm)
      {
      if (isConfirm)
      {
      show_save_ui();
      detail_Id = '';
      Edit_Description();
      }
      else
      {
      swal.close();
      }
      });
}

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

 var ProfileTour="Public";
 var Tour_description = document.getElementById("desc_t").value;
 var Tour_name = document.getElementById("name_t").value;
 var tag=document.getElementById("Tag_t").value;
 var identifier=document.getElementById("Identifier").value;
 alert(identifier);
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
        tag : tag,
        identifier:identifier
        },
        beforeSend : function(){},
        crossDomain: true,
        success: function(res) {
        alert(res);
        console.log(res);
        var no=JSON.stringify(res);
        if(parseInt(no)>0)
        {
        swal({
             title: "Congrats",
             text: "Experience is successfully updated.",
             html: true,
             type: "info",
             confirmButtonText: "Ok",
             closeOnConfirm: true
             },
             function(isConfirm) {
             Save_id=no;
             show_tour_list()
             if(process=="share")
             {
             Share_trip(Save_id);
             }
             else
             {
             
             }
             });
        // swal("Stored successfully (Save tour function)");
        
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
        // document.getElementById('Itinerary').innerHTML = '<div class="col-sm-12 col-xs-12 enterMsg center  P_details_t" id="Tour_detail_header">'+Tour_description+'</div>'
        
        var abca='';
        //document.getElementById('Itinerary').innerHTML = '<div class="col-sm-12 col-xs-12 enterMsg center Tname_t " id="Tour_name_header">'+Tour_name+'</div><div class="col-sm-12 col-xs-12 enterMsg center  P_details_t" id="Tour_detail_header">'+Tour_description+'</div><input type="hidden" id="UserId_'+res[0].SrNo+'" value="'+res[0].FbUserId+'"/>';
        //document.getElementById('Tour_List').innerHTML = document.getElementById('Itinerary').innerHTML ;
        document.getElementById('myexp-description').innerHTML = Tour_description;
        var $attrib = $('<div id="attributions"></div>');
        $('#map_node').append($attrib);
        service = new google.maps.places.PlacesService($attrib[0]);
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
                struct=struct+'<img class="itineraryImg" id="Place_Image'+res[i].PlaceIds+'" src="'+path+'" />';
                }
                else if(!(typeof parse.Path === "undefined"))
                {
                var img=parse.Path.split(",");
                var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[0]);
                struct=struct+'<img class="itineraryImg" id="Place_Image'+res[i].PlaceIds+'" src="'+path+'" />';
                
                }
                else
                {
                struct=struct+'<img class="itineraryImg"  id="Place_Image'+res[i].PlaceIds+'" src="images/default.jpg" />';
                
                }
                struct=struct+'</div><div class="col-sm-8 col-xs-8 paddingzero myexplist" onclick="Detail(this,false)"><ul class="yetToVisit"><li class="title hotelName" id="Place_name'+res[i].PlaceIds+'"> '+parse.name+' </li> <li class="title hotelAdd" ><div class="customadd_desc" id="Add_'+res[i].PlaceIds+'"><img class="loc-pin" src="./assets/experiences/location_pin_icon.svg">'+Address+'</div> </li><li class="title hotelAdd"><!-- <div style="float:left;">'+text+'&nbsp;-&nbsp;</div>--><div class="flex" id="Dista_'+res[i].PlaceIds+'">'+ distance +'&nbsp;away&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;<div class="green">OPEN</div></div></li></ul></div></div>';
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
                //experience public trips
                struct='<div class="col-sm-12 col-xs-12 paddingzero"><input type="hidden" id="Lat_'+res[i].PlaceIds+'"  value="'+myObj.H+'"/><input type="hidden" id="Log_'+res[i].PlaceIds+'" value="'+myObj.L+'"/><textarea id="DetailLog_'+res[i].PlaceIds+'" style="display:none;">'+detail+'</textarea><div class="col-sm-4 col-xs-4 paddingright"><img class="itineraryImg" src="images/default.jpg" /></div><div class="col-sm-8 col-xs-8 paddingzero"><ul class="yetToVisit pbExp"><li class="title hotelName" id="Place_name'+res[i].PlaceIds+'"> '+parse.name+' </li> <li class="title hotelAdd" ><div id="Add_'+res[i].PlaceIds+'"><img style="width:10px;margin-right:5px;"src="./assets/experiences/location_pin_icon.svg"/>'+Address+'</div></li><li class="title hotelAdd"> <div style="float:left;">'+text+'&nbsp;-&nbsp;</div><div id="Dista_'+res[i].PlaceIds+'">'+ distance +'&nbsp;away</div></li></ul></div></div>';
                }
                var numb=distance.split(' ');
                
                if(detailinfo!='')
                {
                document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+res[i].PlaceIds+'" data-sort="'+parseFloat(numb[0])+'"><div class="col-sm-12 col-xs-12 paddingzero moveleft"><div class="col-sm-12 col-xs-12 paddingzero leftshift paddingtb" id="moveleft'+res[i].PlaceIds+'">' + struct + '</div><div class="visitOption col-sm-7 col-xs-7 markhidden paddingzero"><div class="col-sm-4 col-xs-4 img-responsive vis paddingzero handle Drag" ><img class="img-responsive" src="images/shift_position_icon.svg" style="Height: 25px; width: 25px;margin:6px 20px; "/></div><div class="markasvisited">Shift</div><div class="markasvisited vis col-sm-2 col-xs-2 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+res[i].PlaceIds+'" value="visited"><label for="Visited_'+res[i].PlaceIds+'"></label></div> <div onClick="delete_it(this)" class="col-sm-4 col-xs-4 paddingzero Del"><div class="markasvisited">Delete</div><img class="img-responsive pb2" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/></div></div></div></div><div class="col-sm-12 col-xs-12 paddingzero"><div class="accordion center white" id="accordion2"> <div class="accordion-group"> <div id="collapseTwo'+res[i].PlaceIds+'" class="accordion-body collapse">'+ atob(detailinfo) +'</div></div></div></div></div>';
                //                <div class="SeeMore2 center" data-toggle="collapse" href="#collapseTwo'+res[i].PlaceIds+'">More details</div>
                }
                else
                {
                //                document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 paddingtb borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+res[i].PlaceIds+'" data-sort="'+parseFloat(numb[0])+'"><div class="col-sm-12 col-xs-12 paddingzero"><div class="col-sm-9 col-xs-9 paddingzero" onclick="Detail(this,false)">' + struct + '</div> <div onClick="delete_it(this)" class="col-xs-offset-1 col-sm-2 col-xs-2  paddingzero Del" style="display:none"><div class="markasvisited">Remove from list</div><img class="img-responsive pb2" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/></div><!--<div class="col-sm-2 col-xs-2 img- responsive paddingzero handle Drag" style="display:none"><img class="img-responsive" src="images/circle.svg" style="Height: 25px; width: 25px; "/></div>--><div class="markasvisited vis col-xs-offset-1 col-sm-2 col-xs-2 paddingleft" ><div class="markAsVisit">Mark visited</div><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+res[i].PlaceIds+'" value="visited"><label for="Visited_'+res[i].PlaceIds+'"></label></div></div></div>';
                document.getElementById('Itinerary').innerHTML =  document.getElementById('Itinerary').innerHTML + '<div class="col-sm-12 col-xs-12 borderbottom ui-state-default ALL_Places_Tour YetToVisitedNode oddItinerary" id="Itinerari_'+res[i].PlaceIds+'" data-sort="'+parseFloat(numb[0])+'"><div class="col-sm-12 col-xs-12 paddingzero moveleft"><div class="col-sm-12 col-xs-12 paddingzero leftshift paddingtb" id="moveleft'+res[i].PlaceIds+'" >' + struct + '</div> <div class="visitOption col-sm-7 col-xs-7 markhidden paddingzero"><div class="col-sm-4 col-xs-4 img-responsive vis paddingzero handle Drag" ><img class="img-responsive" src="images/shift_position_icon.svg" style="Height: 25px; width: 25px;margin:6px 20px;"/><div class="markasvisited">Shift</div></div><div class="markasvisited vis col-sm-4 col-xs-4 paddingzero" ><input onclick="visitsite(this)" class="visitedcheck" type="checkbox" name="visited" id="Visited_'+res[i].PlaceIds+'" value="visited"><label for="Visited_'+res[i].PlaceIds+'"></label><div class="markasvisited">Mark visited</div></div><div onClick="delete_it(this)" class="col-sm-4 col-xs-4  paddingzero Del"><img class="img-responsive pb2" src="assets/experience/remove_from_list_icon.svg" style="Height: 22px; width: 22px;"/><div class="markasvisited">Delete</div></div></div></div></div>';
                }
                
                $(".moveleft").on("swipeleft", "div.leftshift", function(){
                                  var div_id = $(this).attr("id");
                                  $(this).parents("div.moveleft").find(".visitOption").show("slide",{direction: "right"},500);
                                  $(this).animate({"left": "-20%"}, 500);
                                  });
                $(".moveleft").on("swiperight", "div.leftshift", function(){
                                  var div_id = $(this).attr("id");
                                  $(this).parents("div.moveleft").find(".visitOption").hide("slide",{direction: "right"},500);
                                  $(this).animate({"left": "0%"},500);
                                  });
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
               },
               error: function(e) {
               console.log(e.message);
               },
               complete: function(data) {
               // $.LoadingOverlay("hide");
               }
               });
        
        $("#ExperianceAll").hide();
        show_tour_list();
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
        calculatehight();
        }
        });
}

function calculatehight(){
 var height=$('#myexp-description').height();
 //var height=$("#myexp-description").height() ;
 var offsetHeight1 = document.getElementById('myexp-description').offsetHeight;
 if ( offsetHeight1>=5) {
  document.getElementById('nearByPlaceMainDiv2').style.paddingTop=(offsetHeight1+36)+"px";
 }
 else{
  document.getElementById('nearByPlaceMainDiv2').style.paddingTop=(0)+"px";
 }
 
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
     
      var link ="http://34.231.31.72/xplore/index.php/site/Shared?Tour_Id=";
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
     
      var link ="http://34.231.31.72/xplore/index.php/site/Shared?Tour_Id=";
      
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
                                       },
                                       function (error) {
                                       swal("" + error);
                                       });
      
      }
      });
 
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
        swal({
             title: "Congrats",
             html: true,
             text: "Experience is successfully updated.",
             type: "info",
             confirmButtonText: "Ok",
             closeOnConfirm: true
             },
             function(isConfirm) {
             Save_id="0";
             process="";
             //swal("Stored successfully (Edit trip call)");
             show_tour_list()
             
             });
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
        }
        });
}

//Delete function that delete the trip over server starts here
function Delete_Trip(srno)
{
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
        },
        crossDomain: true,
        
        success: function(res)
        {
        if(res[0]!= "no-data Updated")
        {
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
        error: function(e)
        {
        console.log(e.message);
        },
        complete: function(data) {
        }
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

function Like_trip(SrNo,countlike)
{
 var like =document.getElementById("like_"+SrNo).innerHTML;
 var id = like.split('L');
 
 if(FbUserId_Log == '')
 {
  FbUserId_Log = FbLogin("Likes");
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
        },
        crossDomain: true,
        success: function(res)
        {
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
        error: function(e)
        {
        console.log(e.message);
        },
        complete: function(data) {
        
        }
        })
}

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
                                            
                                            var data = '<div class="form-group col-sm-12 col-xs-12 paddingzero Place_custom_detail"><div class="form-group col-sm-12 col-xs-12 paddingzero"><div class="form-group col-sm-8 col-xs-8 paddingzero selectDes"><select class="selectpicker Exp_Custom_detail" data-style="btn-danger"><option value="">Choose one of the following...</option>';
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
                                            data = data + '</select></div><div class="form-group col-sm-3 col-xs-3 txtright paddingzero" onclick="Delete_description(this);"><img src="images/minus.png"></div></div><div class="saveTextdesc form-group col-sm-12 col-xs-12 paddingzero"><textarea class="form-control Exp_Custom_detail" rows="3" placeholder="Add More Description" required="">'+$(this).html()+'</textarea></div></div>';
                                            
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
 
 var data = '<div class="form-group col-sm-12 col-xs-12 paddingzero Place_custom_detail"><div class="form-group col-sm-12 col-xs-12 paddingzero"><div class="form-group col-sm-8 col-xs-8 selectDes"><select class="selectpicker Exp_Custom_detail_select" data-style="btn-danger"><option value="">Choose one of the following...</option>';
 for(var i=0;i<Places_List_all.length;i++)
 {
  data=data+'<option value="'+Places_List_all[i]+'" >'+place_name_list[i]+'</option>';
 }
 data = data + '</select></div><div class="form-group paddingzero col-sm-3 col-xs-3 txtright" onclick="Delete_description(this);"><img src="images/minus.png"></div></div><div class="saveTextdesc form-group col-sm-12 col-xs-12 paddingzero"><textarea class="form-control Exp_Custom_detail" rows="3" placeholder="Add More Description" required=""></textarea></div></div>';
 
 $('#add_tour_place_detail').append(data);
}

function Delete_description(This)
{
 $(This).closest('.Place_custom_detail').remove();
}

function EventPlaceFeaturedRelatedProfile(tthis,flag)
{
	var options = {
  "duration"       :  600, // in milliseconds (ms), default 400
  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
 };
 window.plugins.nativepagetransitions.fade(
                                           options,
                                           function (msg) {console.log("success: " + msg)}, // called when the animation has finished
                                           function (msg) {alert("error: " + msg)} // called in case you pass in weird values
                                           );
 
 var dt;
 var PlaceId_Detail='';
 
 if(flag == true)
 {
  PlaceId_Detail = tthis.id;
 }
 else
 {
  PlaceId_Detail=tthis.id;
  flag = true;
 }
 
 var myElem = document.getElementById("DetailLog_"+PlaceId_Detail);
 
 if (myElem === null)
 {
  dt='';
 }
 else
 {
  dt=JSON.parse($("#DetailLog_"+PlaceId_Detail).val());
 }
 
 
 var address=dt.address.split(",");
 
 var d = new Date();
 detail_Id = PlaceId_Detail;
 var Distance_Info = '';
 
 if(!(typeof document.getElementById("Distance"+PlaceId_Detail+"") === "undefined") && document.getElementById("Distance"+PlaceId_Detail+"") != null)
 {
  Distance_Info=document.getElementById("Distance"+PlaceId_Detail+"").innerHTML;
 }
 
 var price='';
 var abc='';
 
 var index='',addr='';
 // Slider code End here
 
 
 abc=abc+ '<div class="ListdetailView feature_event">';
 
 // Slider code start here
 abc=abc+ '<div id="myCarousel" class="carousel slide" data-interval="false">';
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
 
 
 abc=abc+ '</div>';
 
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero newdetailsPlace paddingtb">';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 detailplaceName">';
 if(typeof dt.name === 'undefined')
 {
  if(!(typeof document.getElementById("Place_name"+PlaceId_Detail+"") === "undefined") && document.getElementById("Place_name"+PlaceId_Detail+"") != null)
  {
   var name= document.getElementById('Place_name'+PlaceId_Detail).innerHTML;
   abc=abc+ '<div class="placeprofileNameHeading">'+name+'</div>';
  }
 }
 else
 {
  abc=abc+ '<div class="placeprofileNameHeading">'+dt.name+'</div>';
 }
 
 abc=abc+ '</div>';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12" style="display:none;">';
 abc=abc+ '<div class="detailplacestar paddingtb placeprofileName">Star</div>';
 abc=abc+ '</div>';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 " >';
 if(address[0]!=''){
  abc=abc+'<div class="col-sm-12 col-xs-12 adr paddingzero"><img class="clock" src="./assets/general/location_point_white.svg">'+address[0]+'</div>';
 }
 else{
  abc=abc+'<div class="col-sm-12 col-xs-12 adr paddingzero"><img class="clock" src="./assets/general/location_point_white.svg">'+dt.address+'</div>';
 }
 abc=abc+ '</div>';
 
 
 abc=abc+ '</div> ';
 
 abc=abc+'<div class="listDetailHeader" style="display:none;">';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero placeprofileName"> '+dt.name+'</div>';
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+addr+'</div>';
 
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">Hours today : - </div>';
 
 abc=abc+'</div>';
 abc=abc+ '<div class="site-desc paddingzero container-fluid">';
 
 if(typeof dt === 'object')
 {
  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
  if(dt.about.length > 0)
  {
   
   if (base64Matcher.test(dt.about))
   {
    //var desc_data=atob(dt.about);
    //var data_info_desc=desc_data.replace(/<(?:.|\n)*?>/gm, '');
    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details  listDetailSummary"> '+atob(dt.about)+'</div>';
   }
   else
   {
   // var info_desc=dt.about
   // var data_info_desc=info_desc.replace(/<(?:.|\n)*?>/gm, '');
    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+dt.about+'</div>';
   }
  }
  else
  {
   abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
  }
 }
 else
 {
  abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
 }
 
 
 abc=abc+ '</div>';
 abc=abc+ '</div>';
 document.getElementById("selected_site_Detail").innerHTML= abc;
 
 $("#DetailBackButton5").attr("onclick","showHome()");
 document.getElementById('DetailBackButton').style.display = "none";
 document.getElementById('DetailBackButton5').style.display = "block";
 Show_Detail();
 showMoreText();
 
}

function Detail(tthis,flag)
{
  var options = {
   "duration"       :  500, // in milliseconds (ms), default 400
   "slowdownfactor"   : 3,
   "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
  };
  window.plugins.nativepagetransitions.fade(
                                             options,
                                             function (msg) {
 
                                             console.log(JSON.stringify(msg));
                                             },
                                             function (msg) {alert("ERROR: " + JSON.stringify(msg))}
                                             );
  Mapbox.hide(
              {},
              function(msg) {
              console.log("Mapbox successfully hidden");
              }
              );
 var dt;
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
 else if(flag=='MAP')
 {
  var spanId=tthis.subtitle.split("<span id=");
  var PlaceID_=spanId[1].split("\"");
  var PlaceID_=PlaceID_[1].split("Distance");
  PlaceId_Detail=PlaceID_[1];
 }
 else
 {
  PlaceId_Detail=tthis.id;
  flag = true;
 }
 
 var myElem = document.getElementById("DetailLog_"+PlaceId_Detail);
 console.log(myElem);
 if (myElem === null)
 {
  dt='';
 }
 else
 {
  dt=JSON.parse($("#DetailLog_"+PlaceId_Detail).val());
 }
 
 var $attrib = $('<div id="attributions"></div>');
 $('#map_node').append($attrib);
 service = new google.maps.places.PlacesService($attrib[0]);
 var text_img='';
 var diff;
 var no=-1;
 
 var d = new Date();
 detail_Id = PlaceId_Detail;
 var Distance_Info = '';
 
 if(!(typeof document.getElementById("Distance"+PlaceId_Detail+"") === "undefined") && document.getElementById("Distance"+PlaceId_Detail+"") != null)
 {
  Distance_Info=document.getElementById("Distance"+PlaceId_Detail+"").innerHTML;
  console.log(Distance_Info);
 }
 
 var price='';
 var abc='';
 
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
 else
 {
  var dtaddress='';
  if(!(typeof document.getElementById("Add_"+PlaceId_Detail+"") === "undefined") && document.getElementById("Add_"+PlaceId_Detail+"") != null)
  {
   dtaddress=document.getElementById("Add_"+PlaceId_Detail+"").innerHTML;
  }
  var arr_addr=dtaddress.split(",");
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
   index = dtaddress.lastIndexOf(',');  // Gets the first index where a space occours
   addr = dtaddress.substr(0, index); // Gets the first part
   index = addr.lastIndexOf(',');
   addr = addr.substr(0, index);
   var temp=addr.indexOf(',');
   if(temp >= 0)
   {
    addr = addr.substr(temp + 1);
   }
  }
 }

 abc=abc+ '<div class="ListdetailView">';
 
 // Slider code start here
 abc=abc+ '<div id="myCarousel" class="carousel slide" data-interval="false">';
 abc=abc+'<div class="carousel-inner" role="listbox">';
 
 
 if(typeof dt.Path != "undefined" || typeof dt.profileimage != "undefined")
 {
  if(dt.Path.length > 0)
  {
   var img=dt.Path.split(",");
   
   
   for(var k=0;k<img.length;k++)
   {
    if(k==0)
    {
     var path=encodeURI('https://s3.amazonaws.com/retail-safari/resize_image/'+img[k]);
     abc=abc+'<div class="item active">';
     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
     abc=abc+ '</div>';
    }
    else
    {
     var path=encodeURI('https://s3.amazonaws.com/retail-safari/resize_image/'+img[k]);
     abc=abc+'<div class="item">';
     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
     abc=abc+ '</div>';
    }
   }
  }
  else
  {
   if(dt.profileimage.length > 0)
   {
    var img_p=dt.profileimage.split(",");
    for(var i=0;i<img_p.length;i++)
    {
     var path_p=encodeURI('https://s3.amazonaws.com/retail-safari/resize_image/'+img_p[i]);
     abc=abc+'<div class="item active">';
     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path_p+'" /></div>';
     abc=abc+ '</div>';
    }
   }
   else{
    abc=abc+'<div class="item active">';
    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
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
 
 
 /* // Left arrow controls
  abc=abc+'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
  abc=abc+'<span class="fa fa-angle-left" aria-hidden="true"></span>';
  abc=abc+'<span class="sr-only">Previous</span>';
  abc=abc+'</a>';
  // right arrowcontrols
  abc=abc+'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
  abc=abc+'<span class="fa fa-angle-right" aria-hidden="true"></span>';
  abc=abc+'<span class="sr-only">Next</span>';
  abc=abc+'</a>';*/
 
 abc=abc+ '</div>';
 
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero newdetailsPlace paddingtb">';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 detailplaceName">';
 if(typeof dt.name === 'undefined')
 {
  if(!(typeof document.getElementById("Place_name"+PlaceId_Detail+"") === "undefined") && document.getElementById("Place_name"+PlaceId_Detail+"") != null)
  {
   var name= document.getElementById('Place_name'+PlaceId_Detail).innerHTML;
   abc=abc+ '<div class="placeprofileNameHeading">'+name+'</div>';
  }
 }
 else
 {
  abc=abc+ '<div class="placeprofileNameHeading">'+dt.name+'</div>';
 }
 
 abc=abc+ '</div>';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12" style="display:none;">';
 abc=abc+ '<div class="detailplacestar paddingtb placeprofileName">Star</div>';
 abc=abc+ '</div>';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 " >';
 if(Distance_Info === 'undefined' || Distance_Info == '')
 {
  if(!(typeof document.getElementById("Dista_"+PlaceId_Detail+"") === "undefined") && document.getElementById("Dista_"+PlaceId_Detail+"") != null)
  {
   var Distance = document.getElementById('Dista_'+PlaceId_Detail).innerHTML;
   abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new one flex">&nbsp;&nbsp;'+Distance+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
  }
 }
 else
 {
  abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new two flex">&nbsp;&nbsp;'+Distance_Info+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
 }
 abc=abc+ '</div>';
 
 //abc=abc+ '<div class="col-sm-12 col-xs-12">';
 //abc=abc+ '<div class="placeprofileName">'+addr+'</div>';
 //abc=abc+ '</div>';
 
 abc=abc+ '</div> ';
 
 abc=abc+'<div class="listDetailHeader" style="display:none;">';
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero placeprofileName"> '+dt.name+'</div>';
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+addr+'</div>';
 
 
 abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">Hours today : - </div>';
 
 abc=abc+'</div>';
 abc=abc+ '<div class="site-desc paddingzero container-fluid">';
 
 if(typeof dt === 'object')
 {
  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
  if(dt.about.length > 0)
  {
   
   if (base64Matcher.test(dt.about))
   {
    console.log('hi');
    var desc_data=atob(dt.about);
    var data_info_desc=desc_data.replace(/<(?:.|\n)*?>/gm, '');
    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ desc_data +'</div>';
   }
   else
   {
    var info_desc=dt.about
    var data_info_desc=info_desc.replace(/<(?:.|\n)*?>/gm, '');
    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ info_desc +'</div>';
   }
  }
  else
  {
   abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
  }
 }
 else
 {
  abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
 }
 
 //Code for tabs start here
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero center paddingtb listDetailssocialCalls">';
 // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
 // if(!(typeof dt.phone === "undefined"))
 // {
 // var phone=dt.phone;
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'"><img src="images/technology.svg" height="21" width="21"/></a></div>';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'">Phone</a></div>';
 // }
 // else
 // {
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a></a></div>';
 // }
 // //var phone=dt.phone;
 // //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'"><img src="./assets/events/call_icon.png" height="21" width="21"/></a></div>';
 // //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'">Call</a></div>';
 // abc=abc+ '</div>';
 
 
 
 // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero">';
 // if(!(typeof dt.Website === "undefined"))
 // {
 // WebLink=dt.Website;
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();"><img src="./assets/events/website_icon.png"  height="21" width="21"/></div>';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();">Website</div>';
 // }
 // else
 // {
 // WebLink="";
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a ></a> </div>';
 // }
 // abc=abc+ '</div>';
 
 // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="./assets/events/buy_now_icon.png" height="21" width="21"/></a></div>';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Buy Now</div>';
 // abc=abc+ '</div>';
 
 
 // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="./assets/events/add_to_tour_icon.png" height="21" width="21"/></a></div>';
 // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Add to Tour</div>';
 // abc=abc+ '</div>';
 
 // abc=abc+ '</div>';
 abc=abc+ '</div>';
 abc=abc+ '</div>';
 
 
 document.getElementById("selected_site_Detail").innerHTML= abc;
 
 /* if(Tour_List.length >1)
  {
  document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';
  }
  else
  {
  document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';
  }*/
 
 if(flag == true)
 {
  $('#mapCanvas').hide();
  $("#DetailBackButton").attr("onclick","show_place_list()");
 }
 else if(flag == 'MAP')
 {
  $.LoadingOverlay("hide");
  $("#DetailBackButton").attr("onclick","show_map()");
  
 }
 else
 {
  $("#DetailBackButton").attr("onclick","show_tour_list()");
 }
 
 Show_Detail();
 document.getElementById('DetailBackButton5').style.display = "none";
}

//function shows detil informtion about selected place also it contains structure of the details/profile sceen.
//function Detail(tthis,flag)
//{
//
// var options = {
//  "duration"       :  500, // in milliseconds (ms), default 400
//  "slowdownfactor"   : 3,
//  "iosdelay"       :   50 // ms to wait for the iOS webview to update before animation kicks in, default 60
// };
// window.plugins.nativepagetransitions.fade(
//                                            options,
//                                            function (msg) {
//                                            
//                                            console.log(JSON.stringify(msg));
//                                            },
//                                            function (msg) {alert("ERROR: " + JSON.stringify(msg))}
//                                            );
//
// Mapbox.hide(
//             {},
//             function(msg) {
//             console.log("Mapbox successfully hidden");
//             }
//             );
// var dt;
// var PlaceId_Detail='';
// 
// if(flag == true)
// {
//  PlaceId_Detail = tthis.id;
// }
// else if(flag == false)
// {
//  var temp_val = $(tthis).closest('.ALL_Places_Tour').attr('id');
//  var index_temp = temp_val.indexOf('_');
//  PlaceId_Detail = temp_val.substr(index_temp+1);
//
// }
// else if(flag=='MAP')
// {
// var spanId=tthis.subtitle.split("<span id=");
// var PlaceID_=spanId[1].split("\"");
// var PlaceID_=PlaceID_[1].split("Distance");
// PlaceId_Detail=PlaceID_[1];
// }
// else
// {
//  PlaceId_Detail=tthis.id;
//  flag = true;
// }
// 
// var myElem = document.getElementById("DetailLog_"+PlaceId_Detail);
// if (myElem === null)
// {
//  dt='';
// }
// else
// {
//  dt=JSON.parse($("#DetailLog_"+PlaceId_Detail).val());
// }
// 
// var $attrib = $('<div id="attributions"></div>');
// $('#map_node').append($attrib);
// service = new google.maps.places.PlacesService($attrib[0]);
// var text_img='';
// var diff;
// var no=-1;
// 
// var d = new Date();
// detail_Id = PlaceId_Detail;
// var Distance_Info = '';
// 
// if(!(typeof document.getElementById("Distance"+PlaceId_Detail+"") === "undefined") && document.getElementById("Distance"+PlaceId_Detail+"") != null)
// {
//  Distance_Info=document.getElementById("Distance"+PlaceId_Detail+"").innerHTML;
// }
// 
// var price='';
// var abc='';
// 
// var index='',addr='';
// // Slider code End here
// if(!typeof dt.address === 'undefined')
// {
//  var arr_addr=dt.address.split(",");
//  var index = '';  // Gets the first index where a space occours
//  var id = ''; // Gets the first part
//  var text = '';
//  
//  if(arr_addr.length >= 4)
//  {
//   addr = arr_addr[0]; // Gets the first part
//   text = arr_addr[1];
//  }
//  else
//  {
//   index = dt.address.lastIndexOf(',');  // Gets the first index where a space occours
//   addr = dt.address.substr(0, index); // Gets the first part
//   index = addr.lastIndexOf(',');
//   addr = addr.substr(0, index);
//   var temp=addr.indexOf(',');
//   if(temp >= 0)
//   {
//    addr = addr.substr(temp + 1);
//   }
//  }
// }
// else
// {
//  var dtaddress='';
//  if(!(typeof document.getElementById("Add_"+PlaceId_Detail+"") === "undefined") && document.getElementById("Add_"+PlaceId_Detail+"") != null)
//  {
//   dtaddress=document.getElementById("Add_"+PlaceId_Detail+"").innerHTML;
//  }
//  var arr_addr=dtaddress.split(",");
//  var index = '';  // Gets the first index where a space occours
//  var id = ''; // Gets the first part
//  var text = '';
//  
//  if(arr_addr.length >= 4)
//  {
//   addr = arr_addr[0]; // Gets the first part
//   text = arr_addr[1];
//  }
//  else
//  {
//   index = dtaddress.lastIndexOf(',');  // Gets the first index where a space occours
//   addr = dtaddress.substr(0, index); // Gets the first part
//   index = addr.lastIndexOf(',');
//   addr = addr.substr(0, index);
//   var temp=addr.indexOf(',');
//   if(temp >= 0)
//   {
//    addr = addr.substr(temp + 1);
//   }
//  }
// }
// 
// abc=abc+ '<div class="ListdetailView">';
// 
// // Slider code start here
// abc=abc+ '<div id="myCarousel" class="carousel slide" data-interval="false">';
// abc=abc+'<div class="carousel-inner" role="listbox">';
// 
// 
// if(typeof dt.Path != "undefined" || typeof dt.profileimage != "undefined")
// {
//  if(dt.Path.length > 0)
//  {
//   var img=dt.Path.split(",");
//   
//   
//   for(var k=0;k<img.length;k++)
//   {
//    if(k==0)
//    {
//     var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
//     abc=abc+'<div class="item active">';
//     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
//     abc=abc+ '</div>';
//    }
//    else
//    {
//     var path=encodeURI('https://s3.amazonaws.com/retail-safari/'+img[k]);
//     abc=abc+'<div class="item">';
//     abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path+'" /></div>';
//     abc=abc+ '</div>';
//    }
//   }
//  }
//  else
//  {
//   if(dt.profileimage.length > 0)
//   {
//  var img_p=dt.profileimage.split(",");
//   for(var i=0;i<img_p.length;i++)
//   {
//   var path_p=encodeURI('https://s3.amazonaws.com/retail-safari/'+img_p[i]);
//   abc=abc+'<div class="item active">';
//   abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="'+path_p+'" /></div>';
//   abc=abc+ '</div>';
//   }
//   }
//   else{
//    abc=abc+'<div class="item active">';
//    abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
//    abc=abc+ '</div>';
//   }
//  }
// }
// else
// {
//  abc=abc+'<div class="item active">';
//  abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><img class="desimage img-responsive" src="images/default.jpg" /></div>';
//  abc=abc+ '</div>';
// }
// abc=abc+ '</div>';
// 
// 
// /* // Left arrow controls
//  abc=abc+'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
//  abc=abc+'<span class="fa fa-angle-left" aria-hidden="true"></span>';
//  abc=abc+'<span class="sr-only">Previous</span>';
//  abc=abc+'</a>';
//  // right arrowcontrols
//  abc=abc+'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
//  abc=abc+'<span class="fa fa-angle-right" aria-hidden="true"></span>';
//  abc=abc+'<span class="sr-only">Next</span>';
//  abc=abc+'</a>';*/
// 
// abc=abc+ '</div>';
// 
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero newdetailsPlace paddingtb">';
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12 detailplaceName">';
// if(typeof dt.name === 'undefined')
// {
//  if(!(typeof document.getElementById("Place_name"+PlaceId_Detail+"") === "undefined") && document.getElementById("Place_name"+PlaceId_Detail+"") != null)
//  {
//   var name= document.getElementById('Place_name'+PlaceId_Detail).innerHTML;
//   abc=abc+ '<div class="placeprofileNameHeading">'+name+'</div>';
//  }
// }
// else
// {
//  abc=abc+ '<div class="placeprofileNameHeading">'+dt.name+'</div>';
// }
// 
// abc=abc+ '</div>';
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12" style="display:none;">';
// abc=abc+ '<div class="detailplacestar paddingtb placeprofileName">Star</div>';
// abc=abc+ '</div>';
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12 " >';
// if(Distance_Info === 'undefined' || Distance_Info == '')
// {
//  if(!(typeof document.getElementById("Dista_"+PlaceId_Detail+"") === "undefined") && document.getElementById("Dista_"+PlaceId_Detail+"") != null)
//  {
//   var Distance = document.getElementById('Dista_'+PlaceId_Detail).innerHTML;
//   abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new one flex">&nbsp;&nbsp;'+Distance+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
//  }
// }
// else
// {
//  abc=abc+ '<div class="detailplacekm paddingb placeprofileName"><div class="placeprofileAddress flex"><i class="fa fa-map-marker" aria-hidden="true"></i>'+addr+'<b><div class="miles_new two flex">&nbsp;&nbsp;'+Distance_Info+'&nbsp;&nbsp;</div></b><!--<div class="detailplaceOpen green">OPEN</div>--></div></div>';
// }
// abc=abc+ '</div>';
// 
// //abc=abc+ '<div class="col-sm-12 col-xs-12">';
// //abc=abc+ '<div class="placeprofileName">'+addr+'</div>';
// //abc=abc+ '</div>';
// 
// abc=abc+ '</div> ';
// 
// abc=abc+'<div class="listDetailHeader" style="display:none;">';
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero placeprofileName"> '+dt.name+'</div>';
// abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero hourTime"> '+addr+'</div>';
// 
// 
// abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero openClose hourTime">Hours today : - </div>';
// 
// abc=abc+'</div>';
// abc=abc+ '<div class="site-desc paddingzero container-fluid">';
// 
// if(typeof dt === 'object')
// {
//  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
//  if(dt.about.length > 0)
//  {
//   
//   if (base64Matcher.test(dt.about))
//   {
//    var desc_data=atob(dt.about);
//    var data_info_desc=desc_data.replace(/<(?:.|\n)*?>/gm, '');
//    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ desc_data +'</div>';
//   }
//   else
//   {
//    var info_desc=dt.about
//    var data_info_desc=info_desc.replace(/<(?:.|\n)*?>/gm, '');
//    abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary"> '+ info_desc +'</div>';
//   }
//  }
//  else
//  {
//   abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
//  }
// }
// else
// {
//  abc=abc+ '<div class="col-sm-12 col-xs-12 P_details listDetailSummary">  Sorry, place details are not available. </div>';
// }
// 
// //Code for tabs start here
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero center paddingtb listDetailssocialCalls">';
// // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
// // if(!(typeof dt.phone === "undefined"))
// // {
// // var phone=dt.phone;
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'"><img src="images/technology.svg" height="21" width="21"/></a></div>';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'">Phone</a></div>';
// // }
// // else
// // {
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a></a></div>';
// // }
// // //var phone=dt.phone;
// // //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'"><img src="./assets/events/call_icon.png" height="21" width="21"/></a></div>';
// // //abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a href="tel:'+dt.phone+'">Call</a></div>';
// // abc=abc+ '</div>';
// 
// 
// 
// // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero">';
// // if(!(typeof dt.Website === "undefined"))
// // {
// // WebLink=dt.Website;
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();"><img src="./assets/events/website_icon.png"  height="21" width="21"/></div>';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="WebsiteLink();">Website</div>';
// // }
// // else
// // {
// // WebLink="";
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero"><a ></a> </div>';
// // }
// // abc=abc+ '</div>';
// 
// // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="./assets/events/buy_now_icon.png" height="21" width="21"/></a></div>';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Buy Now</div>';
// // abc=abc+ '</div>';
// 
// 
// // abc=abc+ '<div class="col-sm-3 col-xs-3 paddingzero"> ';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();"><a><img src="./assets/events/add_to_tour_icon.png" height="21" width="21"/></a></div>';
// // abc=abc+ '<div class="col-sm-12 col-xs-12 paddingzero" onclick="itinerary_Detail();">Add to Tour</div>';
// // abc=abc+ '</div>';
// 
// // abc=abc+ '</div>';
// abc=abc+ '</div>';
// abc=abc+ '</div>';
// 
// 
// document.getElementById("selected_site_Detail").innerHTML= abc;
// 
// /* if(Tour_List.length >1)
//  {
//  document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';
//  }
//  else
//  {
//  document.getElementById("Tour_Listings").innerHTML = 'Places added ' + Tour_List.length + '   <img src="images/eye.svg" style="Height: 15px; width: 15px;">';
//  }*/
// 
// if(flag == true)
// {
//  $('#mapCanvas').hide();
//  $("#DetailBackButton").attr("onclick","show_place_list()");
// }
// else if(flag == 'MAP')
// {
//  $.LoadingOverlay("hide");
//  $("#DetailBackButton").attr("onclick","show_map()");
//  
// }
// else
// {
//  $("#DetailBackButton").attr("onclick","show_tour_list()");
// }
// 
// Show_Detail();
// document.getElementById('DetailBackButton5').style.display = "none";
//}
//function shows detil informtion about selected place also it contains structure of the details/profile sceen end here.

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
 
 // map.clear();
 // map.off();
 
 Itineraries_list=[];
 Itineraries_Ad=[];
 Tour_List=[];
 T_Flag="false";
 
 if(Markers.length>0)
 {
  var mark = Markers[0];
  for(var i=1;i<Markers.length;i++)
  {
   Markers[i].remove();
  }
  Markers=[];
  Markers.push(mark);
 }
 
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

//function to open place website link starts here
function WebsiteLink()
{
 if(WebLink!="")
  window.open(WebLink, '_system', 'location=yes');
}
//function to open place website link ends here
// show map function start here
// function showMap()
// {
//   reset_main();

//   if (watchID != null)
//   {
//       navigator.geolocation.clearWatch(watchID);
//       watchID = null;
//   }
//   MapFlag=0;
//   show_map();

//   $("#starting_location").val("");
//   var options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
//   watchID = navigator.geolocation.watchPosition(success1, fail1, options);

//   function success1(position)
//   {
//     if(MapFlag == 1 && Markers.length>0)
//     {
//       latLngSetMarker1(Markers[0],Markers[0].position.lat(),Markers[0].position.lng(),position.coords.latitude,position.coords.longitude,0);
//       return;
//     }
//     MapFlag=1;
//     Markers=[];
//     map_place_list=[];
//     mylat = position.coords.latitude;
//     mylong = position.coords.longitude;
//     myLatLng = new google.maps.LatLng(mylat,mylong);

//     var mapOptions =
//     {
//         zoom: 15,
//         center: myLatLng,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };

//     var geocoder = new google.maps.Geocoder();
//     var ad='';

//     if (geocoder)
//     {
//         geocoder.geocode({ 'latLng': myLatLng},
//         function (results, status)
//         {
//             if (status == google.maps.GeocoderStatus.OK)
//             {
//                 ad=(results[0].formatted_address);
//             }
//             Markers=[];
//             map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

//             marker = new google.maps.Marker({position: myLatLng,map: map, icon: 'images/map_marker.gif', optimized: false});

//             Markers.push(marker);
//             console.log('push'+Markers.length);
//             map_place_list.push('1');
//             Location_info=ad;

//             marker.info = new google.maps.InfoWindow({content: '<div class="InfoWindo" >You are at.. </br>'+ad+'</div>'});

//             if(Location_info.length <= 50)
//             {
//                $('#User_location_bar').html(ad);
//             }
//             else
//             {
//               $('#User_location_bar').html(ad.substr(0, 50));
//             }
//             marker.info.open(map, marker);

//             infoWindow_custom();
//         });
//     }

//   }

//   function latLngSetMarker1(marker,fromLat,fromLng,toLat,toLng,index)
//   {
//       var curLat,curLng;
//       frames = [];
//       for (var percent = 0; percent < 1; percent += (0.050 * 0.5))
//       {
//       curLat = fromLat + percent * (toLat - fromLat);
//       curLng = fromLng + percent * (toLng - fromLng);
//       frames.push(new google.maps.LatLng(curLat, curLng));
//       }

//       move = function(marker, latlngs, index1, wait, newDestination)
//       {
//         marker.setPosition(latlngs[index1]);
//         Markers[index]= marker;
//         if(index1 != latlngs.length-1) {
//             setTimeout(function() {
//                move(marker, latlngs, index1+1, wait, newDestination);
//                }, wait);
//         }
//       }

//       move(marker, frames, 0, 10, marker.position);
//   }

//   function fail1(position)
//   {
//   }

//   setTimeout(function(){
//              $.LoadingOverlay("hide");
//   }, 2000);
// }
//show map function end here

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

function showMap()
{
 //reset_main();
 var options = {
 enableHighAccuracy: true,
 timeout: 5000,
 maximumAge: 0
 };
navigator.geolocation.getCurrentPosition(success_2, fail_2, options);
//watchID = navigator.geolocation.watchPosition(success_2, fail_2,{timeout:30000,enableHighAccuracy: true});
}

function clearWatch_(){
 navigator.geolocation.clearWatch(watchID);
}


function success_2(pos)
{

 var crd = pos.coords;
 mylat = crd.latitude;
 mylong = crd.longitude;
 
 //var mapDiv = document.getElementById("map");
 
 
 Mapbox.accessToken = 'pk.eyJ1IjoibmhlbW1hZHkiLCJhIjoiY2ozZDNtZjlmMDA0NTMxcWxqcm1qN2xoMCJ9.O3TLqQSOyIadDbjNpM4zlA';
 
 Mapbox.hide(
             {},
             function(msg) {
             console.log("Mapbox successfully hidden");
             }
             );
 
 Mapbox.show(
             {
             container: 'map',
             style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
             margins: {
             left: 0, // default 0
             right: 0, // default 0
             top: 83, // default 0
             bottom: 0 // default 0
             },
             center: { // optional, without a default
             lat: mylat,
             lng: mylong
             },
             zoomLevel: 12, // 0 (the entire world) to 20, default 10
             showUserLocation: true, // your app will ask permission to the user, default false
             hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
             hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
             hideCompass: false, // default false
             disableRotation: false, // default false
             disableScroll: false, // default false
             disableZoom: false, // default false
             disablePitch: false, // disable the two-finger perspective gesture, default false
             })
}
//
// var monument = [mylong, mylat];
// var map = new mapboxgl.Map({
//                            container: 'map',
//                            style: 'mapbox://styles/mapbox/streets-v9',
//                            center: monument,
//                            zoom: 15
//                            });
//
// 
//// var geocoder = new MapboxGeocoder();
//var popup;
//var latlng = new google.maps.LatLng(mylat, mylong);
//
// var geocoder = geocoder = new google.maps.Geocoder();
// geocoder.geocode({ 'latLng': latlng }, function (results, status) {
//                  if (status == google.maps.GeocoderStatus.OK) {
//                  if (results[1]) {
//                  popup = new mapboxgl.Popup({offset: 25})
//                  .setText(results[1].formatted_address);
//                  
//                  var el = document.createElement('div');
//                  el.id = 'marker';
//                  
//                  new mapboxgl.Marker(el, {offset:[-25, -25]})
//                  .setLngLat(monument)
//                  .setPopup(popup) // sets a popup on this marker
//                  .addTo(map);
//
//                  }
//                  }
//                  });
 
 // create the popup
// var popup = new mapboxgl.Popup({offset: 25})
// .setText('Construction on the Washington Monument began in 1848.');
 
 // create DOM element for the marker
 
 
 // create the marker
 
 
 
// map.clear();
 //map.off();
 
 //var mapDiv = document.getElementById("map_canvas");
// mylat = pos.coords.latitude;
// mylong = pos.coords.longitude;
// myLatLng = new google.maps.LatLng(mylat,mylong);
//var ll = new mapboxgl.LngLat(mylat, mylong);
// var el = document.createElement('div');
// el.id = 'marker';

 

 //var marker=new mapboxgl.Marker(el, {offset:[-25, -25]}).setLngLat([mylat, mylong]).addTo(mapDiv);
 
 //const GOOGLE = new plugin.google.maps.LatLng(mylat,mylong);
 
// map = plugin.google.maps.Map.getMap(mapDiv, {
//                                     'controls': {
//                                     'zoom': true
//                                     },
//                                     'camera': {
//                                     'latLng': GOOGLE,
//                                     'zoom': 14
//                                     }
//                                     });
// // clearWatch();
// var geocoder = new google.maps.Geocoder();
// var ad='';
// if (geocoder)
// {
//  geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
//                   {
//                   //console.log(results);
//                   if (status == google.maps.GeocoderStatus.OK)
//                   {
//                   ad=(results[0].formatted_address);
//                   }
//                   setAddress(Location_info,ad);
//                   // map.clear();
//                   // map.off();
//                   map.addMarker({
//                                 'position': GOOGLE,
//                                 'title': ad,
//                                 disableAutoPan: true,
//                                 icon:'blue',
//                                 'styles' : {
//                                 'text-align': 'center',
//                                 'font-size': '8px',
//                                 'width':'50px'
//                                 //'font-weight':'bold'
//                                 }
//                                 },
//                                 function(marker)
//                                 {
//                                 marker.showInfoWindow();
//                                 if(Markers.length>=1)
//                                 {
//                                 Markers[0]=marker;
//                                 }
//                                 else
//                                 {
//                                 Markers.push(marker);
//                                 }
//                                 });
//                   map.addCircle({
//                                 'center': GOOGLE,
//                                 'radius': 300,
//                                 'strokeColor' : '#d3dceb',
//                                 'strokeWidth': 5,
//                                 'fillColor' : '#d3dceb'
//                                 },
//                                 function(circle) {
//                                 setTimeout(function() {
//                                            circle.setRadius(600);
//                                            }, 3000);
//                                 });
//                   
//                   map.setCenter(GOOGLE);
//                   //map.setCenter(new plugin.google.maps.LatLng(mylat,mylong));
//                   });
// }


function fail_2(err)
{
	console.warn(`ERROR(${err.code}): ${err.message}`);
 //alert('code: '    + err.code    + '\n' +
  //      'message: ' + err.message + '\n');
}

//function testrun()
//{
// map.setClickable(false);
//}
//
//function out_focus_()
//{
// map.setClickable(true);
//}

function add_Place()
{
 navigator.geolocation.getCurrentPosition(success_1, fail_1, { enableHighAccuracy: true });
}

//function getImage()
//{
// //alert('In get Image');
// navigator.camera.getPicture(uploadPhoto,
//                             function(message) { alert('get picture failed'); },
//                             {
//                             quality: 50,
//                             destinationType: navigator.camera.DestinationType.DATA_URL,
//                             sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
//                             });
//}
function getImage()
{
 //alert(' upload photo');
 navigator.camera.getPicture(uploadPhotoCamera,
                             function(message) { alert('get picture failed'); },
                             {
                             quality: 50,
                             destinationType: navigator.camera.DestinationType.DATA_URL,
                             sourceType: navigator.camera.PictureSourceType.CAMERA
                             });
}

function getPhoto()
{
 //alert(' upload photo');
 navigator.camera.getPicture(uploadPhoto,
                             function(message) { alert('get picture failed'); },
                             {
                             quality: 50,
                             destinationType: navigator.camera.DestinationType.DATA_URL,
                             sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                             });
}

function uploadPhotoCamera(imageURI)
{
 
 var image = document.getElementById('smallImage');
 image.src = 'data:img/jpeg;base64,'+imageURI;
 image.style.display = "block";
 //Up_load_photo(image.src);
}

function uploadPhoto(imageURI)
{
 //alert('In upload photo');
 var image = document.getElementById('smallImage');
 image.src = 'data:img/jpeg;base64,'+imageURI;
 image.style.display = "block";
 //Up_load_photo(image.src);
}
function getImageCustomPlace()
{
 
 navigator.camera.getPicture(uploadPhotoCustomPlace,
                             function(message) { alert('get picture failed'); },
                             {
                             quality: 50,
                             destinationType: navigator.camera.DestinationType.DATA_URL,
                             sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                             });
}

function uploadPhotoCustomPlace(imageURI)
{
 
 var image = document.getElementById('smallImageCustomPlace');
 image.src = 'data:img/jpeg;base64,'+imageURI;
 image.style.display = "block";
}

//function uploadPhoto(imageURI)
//{
// // alert('In upload photo');
// var image = document.getElementById('smallImage');
// //alert(image);
// console.log(image)
// image.src = 'data:img/jpeg;base64,'+imageURI;
// image.style.display = "block";
// Up_load_photo(image.src);
//}

function Up_load_photo()
{
	if(document.getElementById('smallImage').src == '' || document.getElementById("inputNamePlaceUpload").value == '' || document.getElementById("inputDescriptionPlaceUpload").value == '' )
 {
    swal({
       title: "Save",
       text: "Please fill all the fields before submitting (Except phone and website).",
       type: "info",
       confirmButtonText: "Ok",
       closeOnConfirm: true
       },
       function(isConfirm) {
       return;
       });
 }
 else
 {
  $.LoadingOverlay("show");
  
  var imageURI =  document.getElementById('smallImage').src;
  var site_url ='http://34.231.31.72/xplore/index.php/places_n/places_save?';
  
  var params = new Object();
  params.Name = btoa(document.getElementById("inputNamePlaceUpload").value);
  //newly added-->
  params.Address = btoa(document.getElementById("place_location").value);
  //params.LatLng = btoa(document.getElementById("F_Lat_Long").value);
   //newly added close
  params.Latitude = btoa(document.getElementById("LatitudePlaceUpload").value);
  params.Longitude = btoa(document.getElementById("LongitudePlaceUpload").value);
  params.Web = btoa(document.getElementById("WebsitePlaceUpload").value);
  params.Phone = btoa(document.getElementById("PhonePlaceUpload").value);
  params.Description = btoa(document.getElementById("inputDescriptionPlaceUpload").value);
		
  var ft = new FileTransfer();
  var options = new FileUploadOptions();
  
  options.fileKey = "photoPath";
  options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
  
  options.mimeType = "image/jpeg";
  options.chunkedMode = false;
  options.params = params;
  
  
  
  ft.upload(imageURI, encodeURI(site_url), win, fail, options,true);
 }
}


function win(r) {
 $.LoadingOverlay("hide");
 swal({
      title: "Congrats",
      text: "Place is successfully updated.",
      type: "info",
      confirmButtonText: "Ok",
      closeOnConfirm: true
      },
      function(isConfirm) {
      document.getElementById('smallImage').src = "";
      document.getElementById("inputNamePlaceUpload").value = "";
      document.getElementById("place_location").value = "";
      //  document.getElementById("F_Lat_Long").value = "";
      document.getElementById("LatitudePlaceUpload").value = "";
      document.getElementById("LongitudePlaceUpload").value = "";
      document.getElementById("WebsitePlaceUpload").value = "";
      document.getElementById("PhonePlaceUpload").value = "";
      document.getElementById("inputDescriptionPlaceUpload").value = "";
      });
}

function fail(error) {
 $.LoadingOverlay("hide");
 console.log("upload error source " + error.source);
 console.log("upload error target " + error.target);
}

function get_latlong()
{
 if(mylat != '' && mylong != '')
 {
  navigator.geolocation.getCurrentPosition(success_Location, fail_Location, { enableHighAccuracy: true });
 }
 else
 {
 	
  
  $('#LatitudePlaceUpload').val(mylat);
  $('#LongitudePlaceUpload').val(mylong);
 }
}

function success_Location(position)
{
 
 mylat = position.coords.latitude;
 mylong = position.coords.longitude;
 myLatLng = new google.maps.LatLng(mylat,mylong);
 var geocoder = new google.maps.Geocoder();
 
 geocoder.geocode({ 'latLng': myLatLng}, function (results, status)
                  {
                  if (status == google.maps.GeocoderStatus.OK)
                  {
                  $('#place_location').val(results[0].formatted_address);
                  }
                  });
 
 
 $('#LatitudePlaceUpload').val(mylat);
 $('#LongitudePlaceUpload').val(mylong);
}

function fail_Location(position)
{
 mylat = 37.422476;
 mylong = -122.08425;
 myLatLng = new google.maps.LatLng(mylat,mylong);
 
 $('#LatitudePlaceUpload').val(mylat);
 $('#LongitudePlaceUpload').val(mylong);
}

//function shiftright(){
// $(function(){
//   $(".moveleft").on("swipeleft", "div.leftshift", function(){
//                     var div_id = $(this).attr("id");
//                     $(this).parents("div.moveleft").find(".visitOption").show("slide",{direction: "right"},500);
//                     $(this).animate({"left": "-10%"}, 100);
//                     });
//   $(".moveleft").on("swiperight", "div.leftshift", function(){
//                     var div_id = $(this).attr("id");
//                     $(this).parents("div.moveleft").find(".visitOption").hide("slide",{direction: "right"},500);
//                     $(this).animate({"left": "0%"},100);
//                     });
//   });
//}


function calleventprofile(This,Status){
 
 EventProfile(This,Status,This.id);
}

$(document).ready(function(){
                  $(".remove_image_").click(function(){
                                            document.getElementById('smallImage').src = "#";
                                            });
                  $(".reset_loc").click(function(){
                                        $('#place_location').val('');
                                        $('#LatitudePlaceUpload').val('');
                                        $('#LongitudePlaceUpload').val('');
                                        //document.getElementById("Location").disabled = false;
                                        //document.getElementById("place_location").disabled = false;
                                        });
                  $(".remove_image_experience").click(function(){
                                                      document.getElementById('smallImageCustomPlace').src = "#";
                                                      });
                  $( '#place_location' ).keyup(function() {
                                               // document.getElementById("F_Lat_Long").value = "";
                                               if($(this).val() == '')
                                               {
                                               return;
                                               }
                                               query=$(this).val();
                                               near_by=$("#Location").val();
                                               limit="10";
                                               redius="10,000";
                                               client_id="QHDBKQ2HEW2STOTBCXKTMHIVU25BKO1AIMLDYJK2KPI1YYBO";
                                               client_secret="JPWCA14UFZZNO2NRTKDWWPN1PX23SKMX4EY4ZGHEKSUFPMBX";
                                               var url="https://api.foursquare.com/v2/venues/suggestcompletion?";
                                               url=url+"near="+near_by;
                                               url=url+"&query="+query;
                                               url=url+"&limit="+limit;
                                               url=url+"&redius="+redius;
                                               url=url+"&client_id="+client_id;
                                               url=url+"&client_secret="+client_secret;
                                               var dateObj = new Date();
                                               
                                               var month="",date="";
                                               if(dateObj.getUTCMonth()+1 < 10)
                                               {
                                               month="0"+dateObj.getUTCMonth()+1;
                                               }
                                               else
                                               {
                                               month=dateObj.getUTCMonth()+1;
                                               }
                                               
                                               if(dateObj.getUTCDate() < 10)
                                               {
                                               date=dateObj.getUTCDate();
                                               }
                                               else
                                               {
                                               date=dateObj.getUTCDate();
                                               }
                                               
                                               newdate = dateObj.getUTCFullYear() + 1 + "" + month + "" + date;
                                               url=url+"&v="+newdate;
                                               $.get(url,function (data)
                                                     {
                                                     
                                                     var res=data.response.minivenues;
                                                     var availableTags = [];
                                                     for(i=0;i<res.length;i++)
                                                     {
                                                     var id=""+res[i].id+"_"+res[i].location.lat+"_"+res[i].location.lng;
                                                     var name='';
                                                     if(!(typeof res[i].location.address == "undefined")){
                                                     var name = res[i].name+" - "+res[i].location.address;
                                                     }
                                                     else
                                                     {
                                                     var name = res[i].name;
                                                     }
                                                     var arr={
                                                     id : id,
                                                     label : name
                                                     };
                                                     availableTags.push(arr);
                                                     }
                                                     $("#place_location" ).autocomplete({
                                                                                        source: availableTags,
                                                                                        select: function (event, ui) {
                                                                                        
                                                                                        $("#place_location").val(ui.item.value);
                                                                                        
                                                                                        var label = ui.item.label;
                                                                                        var value = ui.item.id;
                                                                                        var data = value.split("_");
                                                                                        document.getElementById("LongitudePlaceUpload").value = data[2];
                                                                                        document.getElementById("LatitudePlaceUpload").value = data[1];
                                                                                        
                                                                                        fetch(data[0]);
                                                                                        }
                                                                                        });
                                                     });
                                               });
                  });

//$(document).on('pagecreate', '#NewsAll', function(){
//               getAllNews();
//               });
//$(document).on('pagecreate', '#EventAll', function(){
//               getTenEvent();
//               });
//$(document).on('pagecreate', '#DealAll', function(){
//               getAllDeals();
//               });
//$(document).on('pagecreate', '#mainCatagoryNew', function(){
//               //getAllDeals();
//               });


$(document).ready(function() {
                  
                  jQuery.each(jQuery('textarea[data-autoresize]'), function() {
                              var offset = this.offsetHeight - this.clientHeight;
                              
                              var resizeTextarea = function(el) {
                              jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
                              };
                              jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
                              });
                  

                  
                  /*---DISCOVER SHOW N HIDE Location selection---*/
                  $(".data1").hide();
                  $(".data2").hide();
                  $("#d1").click(function(){
                                 $(".data1").show("blind");
                                 $(".data2").hide();
                                 $('#d1').addClass('active-btn');
                                 });
                  $("#d2").click(function(){
                                 $(".data2").show("blind");
                                 $(".data1").hide();
                                 //$('#d2').addClass('active');
                                 
                                 });
                  $("#close_choose_your_position").click(function(){
                                                         $(".data1").hide("blind");
                                                         $('#d1').removeClass('active-btn');
                                                         });
                  
                  $("#How_far_do_you_want_to_go").click(function(){
                                                        $(".data2").hide("blind");
                                                        $('#d2').removeClass('active-btn');
                                                        });
                  
                  
                  $('.discover-btns .location-btn').on('click',function(){
                                                       $('.location-btn').removeClass('active-btn');
                                                       $(this).addClass('active-btn');
                                                       });
                  
                  //Experience choose location button show-hide
                  $(".data3").hide();
                  $("#experience-d1").click(function(){
                                            $(".data3").show("blind");
                                            $('#experience-d1').addClass('active-btn');
                                            });
                  $("#exp_close_choose_your_position").click(function(){
                                                             $(".data3").hide("blind");
                                                             $('#experience-d1').removeClass('active-btn');
                                                             $('html, body').scrollTop($('#output').offset().top);
                                                             return false;
                                                             });
                  
                  
                  $(".startXploring").click(function(){
                                            $('#myNewTour').toggleClass('overlay-blur');
                                            $('.expheader').toggleClass('overlay-blur');
                                            $('.exphide').toggleClass('exphidden');
                                            
                                            });
                  
                  $(function(){
                    $(".FooterEvents").load("footer.html");
                    });
                  
                  $(function(){
                    $(".HeaderEvents").load("header.html");
                    });
                  
                  
                  //show less show more description
                  var showChar = 100;
                  var ellipsestext = "...";
                  var moretext = "more";
                  var lesstext = "less";
                  $('.more').each(function() {
                                  
                                  var content = $(this).html();
                                  
                                  if(content.length > showChar) {
                                  
                                  var c = content.substr(0, showChar);
                                  var h = content.substr(showChar-1, content.length - showChar);
                                  
                                  var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
                                  
                                  $(this).html(html);
                                  }
                                  
                                  });
                  
                  $(".morelink").click(function(){
                                       if($(this).hasClass("less")) {
                                       $(this).removeClass("less");
                                       $(this).html(moretext);
                                       } else {
                                       $(this).addClass("less");
                                       $(this).html(lesstext);
                                       }
                                       $(this).parent().prev().toggle();
                                       $(this).prev().toggle();
                                       return false;
                                       });
                  });
