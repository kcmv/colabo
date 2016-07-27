// declare namespace
if(typeof interaction === 'undefined'){
	interaction = {};
}

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';


var halo =  interaction.Halo = function(){
};

halo.HALO_VIEW_ID = "halo_view_id";

/**
 * @ngdoc object
 * @name init
 * @function
 *
 * @description
 * Initializes halo object
 * @param {Object} config contains all parameters relevant for the initialization
 * @param {Function} callback - callback called when user clicks on halo's icon
**/
halo.prototype.init = function (config, callback) {
	/**
	 * Configuration object for halo
	 * ```js
	 * {
	 * 	exclusive: false,
	 * 	createAt: 'sibling'
	 * }
	 * ```
	 * @type {Object}
	 */
	this.config = config;
	/**
	 * Configuration object for halo
	 * @type {Function}
	 */
	this.callback = callback;

	var staticPlaceholder = null;
	var movingPlaceholder = null;

	console.log("[init]");
};

halo.prototype.destroy = function () {
	d3.select("#"+interaction.Halo.HALO_VIEW_ID).remove();
};

/**
 * @name updatePosition
 * @function
 *
 * @description
 * Updates position of the created halo
 * @param {jQuery node} objectDom object that halo should align to
 * @param {D3 node} [haloView] created halo object
 */
halo.prototype.updatePosition = function (objectDom, haloView) {
	if(typeof haloView === 'undefined'){
		haloView = this.getHaloView();
	}
	if(!haloView || !objectDom) return;

	var objectView = d3.select(objectDom);
	if(!objectView) return;

	haloView
		.style("top", objectView.style("top"))
		.style("left", objectView.style("left"))
		.style("width", objectView.style("width"))
		.style("height", objectView.style("height"))
		.style("margin-top", objectView.style("margin-top"))
		.style("margin-left", objectView.style("margin-left"))
};

/**
 * @name getHaloView
 * @function
 *
 * @description
 * Returns halo D3 object if it exists
 * @return {D3 node}
 */
halo.prototype.getHaloView = function () {
	var haloView = d3.select("#"+interaction.Halo.HALO_VIEW_ID);
	return haloView;
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
