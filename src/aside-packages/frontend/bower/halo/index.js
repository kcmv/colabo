// declare namespace
if(typeof interaction === 'undefined'){
	interaction = {};
}

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';


var halo =  interaction.Halo = function(){
};

/**
 * @ngdoc object
 * @name initializeManipulation
 * @function
 *
 * @description
 * Initializes support for manipulation of objects of specified class
 * reference: // http://stackoverflow.com/questions/4679785/graphael-bar-chart-with-text-x-axis
 * @param {Object} config contains all parameters relevant for the initialization
**/

halo.HALO_VIEW_ID = "halo_view_id";

halo.prototype.init = function (config, callback) {
	/**
	 * Configuration object for halo
	 * ```js
	 * {
	 * 	exclusive: false,
	 * 	createAt: 'sibling'
	 * }
	 * ```
	 * @type {[type]}
	 */
	this.config = config;
	this.callback = callback;

	var staticPlaceholder = null;
	var movingPlaceholder = null;

	console.log("[init]");
};

halo.prototype.destroy = function () {
	d3.select("#"+interaction.Halo.HALO_VIEW_ID).remove();
};

/**
 * Creates halo with icons
 *
 * Example:
 * ```js
 * {
 * 	icons: [
 *  	{
 *    	 	position: "n",
 *    	 	iconClass: "fa-bar-chart",
 *    	 	action: "analysis"
 *       },
 *  	{
 *    	 	position: "ne",
 *    	 	action: "help",
 *    	 	iconText: "H"
 *       }
 * 	]
 * }
 * ```
 * @param  {[type]} objectDom - object around which we are creating halo
 * @param  {Object} options   halo creation options
 * @return {interaction.Halo}
 */
halo.prototype.create = function (objectDom, options) {
	var objectView = d3.select(objectDom);
	var haloView = null;

	if(this.config.exclusive){
		this.destroy();
	}

	switch(this.config.createAt){
	case "sibling":
		haloView = d3.select(objectView.node().parentNode).append("div");
		break;
	}

	if(this.config.exclusive){
		haloView.attr("id", interaction.Halo.HALO_VIEW_ID);
	}

	haloView
		.classed({
			halo: true})
		.style("top", objectView.style("top"))
		.style("left", objectView.style("left"))
		.style("width", objectView.style("width"))
		.style("height", objectView.style("height"))
		.style("margin-top", objectView.style("margin-top"))
		.style("margin-left", objectView.style("margin-left"))
		.style("position", "absolute")
		.style("z-index", 1001);
	// haloView.text("Hello Halo!");

	for(var i in options.icons){
		var iconOptions = options.icons[i];
		this._createIcon(haloView, objectView, iconOptions);
	}

	return this;
};

/**
 * Creates a particular icon in halo
 * @param  {[type]} haloView    - d3 element of the main halo component in which we are adding icon
 * @param  {[type]} objectView  - d3 element of the original object around which we are creating the halo and icons
 * @param  {[type]} iconOptions - options for the icon to be created
 */
halo.prototype._createIcon = function(haloView, objectView, iconOptions){
	var that = this;

	var iconBgView = haloView.append("div");
	var classes = {
		icon: true
	};
	classes[iconOptions.position] = true;
	iconBgView
		.classed(classes);

	if(iconOptions.iconClass){
		var classes = {
			fa: true
		};
		classes[iconOptions.iconClass] = true;
		iconBgView
			.append("i")
				.style("margin", "0.2em")
				.classed(classes);
	}
	if(iconOptions.iconText){
		var classes = {
			'icon-text': true
		};
		iconBgView
			.classed(classes)
			.text(iconOptions.iconText);
	}
	iconBgView.on("click", function(){
		d3.event.cancelBubble = true;

		if(typeof that.callback == 'function') {
			var event = {
				action: iconOptions.action,
				source: objectView.node()
			};
			that.callback(event);
		}
	});
};

}()); // end of 'use strict';
