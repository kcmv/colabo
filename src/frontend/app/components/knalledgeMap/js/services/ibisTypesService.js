/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var Plugins = window.Config.Plugins;

var knalledgeMapServices = angular.module('knalledgeMapServices');

/**
* @class IbisTypesService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/

knalledgeMapServices.provider('IbisTypesService', {
 // privateData: "privatno",
 $get: [/*'$q', 'ENV', '$rootScope', */
 function(/*$q , ENV, $rootScope*/) {
   var items = [
     // {
     // 	_id: 0,
     // 	name: "Unknown",
     // 	user: "unknown"
     // },
     {
       _id: 1,
       name: "knowledge",
       type: "type_knowledge"
     },
     {
       _id: 2,
       name: "question",
       type: "type_ibis_question"
     },
     {
       _id: 3,
       name: "idea",
       type: "type_ibis_idea"
     },
     {
       _id: 4,
       name: "argument",
       type: "type_ibis_argument"
     },
     {
       _id: 5,
       name: "comment",
       type: "type_ibis_comment"
     }
   ];

   var selectedItem = (items && items.length) ? items[0] : null;

   // var that = this;
   return {
     getTypes: function(){
       return items;
     },

     getTypeById: function(id){
       var item = null;
       for(var i in items){
         if(items[i]._id == id){
           item = items[i];
         }
       }
       return item;
     },

     selectActiveType: function(item){
       selectedItem = item;
     },

     getActiveType: function(){
       return selectedItem;
     },

     getActiveTypeId: function(){
       return selectedItem ? selectedItem._id : undefined;
     },

     getActiveTypeName: function(){
       return selectedItem ? selectedItem.name : undefined;
     },

     getMaxUserNum: function(){
       var gridMaxNum = 0;
       var items = this.items();
       for(var i in items){
         var grid = items[i];
         var gridId = parseInt(grid.name.substring(2));
         if(gridId > gridMaxNum){
           gridMaxNum = gridId;
         }
       }
       return gridMaxNum;
     },

     getUsersByName: function(nameSubStr){
       var returnedGrids = [];
       var items = this.items();
       for(var i in items){
         var grid = items[i];
         if(grid.name.indexOf(nameSubStr) > -1){
           returnedGrids.push(grid);
         }
       }
       return returnedGrids;
     }
   };
 }]
})

}()); // end of 'use strict';
