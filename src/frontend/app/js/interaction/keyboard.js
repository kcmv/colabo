(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

//http://robertwhurst.github.io/KeyboardJS/
//	https://github.com/RobertWHurst/KeyboardJS
var Keyboard =  interaction.Keyboard = function(clientApi){
	this.clientApi = clientApi;
	this.editingNodeHtml = null;
	this.status = Keyboard.STATUS_MAP;
};

Keyboard.STATUS_EDITOR = "STATUS_EDITOR";
Keyboard.STATUS_MAP = "STATUS_MAP";

Keyboard.prototype.setStatus = function(status){
	this.status = status;
};

Keyboard.prototype.getStatus = function(){
	return this.status;
};

Keyboard.prototype.init = function(){
	this.initializeKeyboard();

	var editor = d3.select(".knalledge_map_list"); // .ta-bind
	var map = d3.select(".knalledge_map");

	editor.on("click", function(){
		this.setStatus(Keyboard.STATUS_EDITOR);
		console.info("Switching to the editor");
	}.bind(this));

	map.on("click", function(){
		this.setStatus(Keyboard.STATUS_MAP);
		console.info("Switching to the map");
	}.bind(this));
};

Keyboard.prototype.createCaretPlacer = function(el, atStart){
	// http://www.w3schools.com/jsref/met_html_focus.asp
	// http://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element
	// http://stackoverflow.com/questions/12203086/how-to-set-focus-back-to-contenteditable-div
	// http://stackoverflow.com/questions/2871081/jquery-setting-cursor-position-in-contenteditable-div
	// http://stackoverflow.com/questions/7699825/how-do-i-set-focus-on-a-div-with-contenteditable
	// https://gist.github.com/shimondoodkin/1081133
	el.focus();

	// http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
	// http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
	// http://stackoverflow.com/questions/2871081/jquery-setting-cursor-position-in-contenteditable-div
	// http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
	if(typeof window.getSelection != "undefined" && typeof window.document.createRange != "undefined"){
		// https://developer.mozilla.org/en-US/docs/Web/API/range
		// https://developer.mozilla.org/en-US/docs/Web/API/Document/createRange
		var range = window.document.createRange();
		// https://developer.mozilla.org/en-US/docs/Web/API/range/selectNodeContents
		// https://developer.mozilla.org/en-US/docs/Web/API/Node
		range.selectNodeContents(el);
		// https://developer.mozilla.org/en-US/docs/Web/API/range/collapse
		range.collapse(atStart);
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection
		// https://developer.mozilla.org/en-US/docs/Web/API/window/getSelection
		var sel = window.getSelection();
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeRange
		// https://msdn.microsoft.com/en-us/library/ie/ff975178(v=vs.85).aspx
		sel.removeAllRanges();
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
		sel.addRange(range);
	}else if(typeof window.document.body.createTextRange != "undefined"){
		// https://msdn.microsoft.com/en-us/library/ie/ms536401%28v=vs.85%29.aspx
		// https://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
		var textRange = window.document.body.createTextRange();
		// https://msdn.microsoft.com/en-us/library/ie/ms536630(v=vs.85).aspx
		textRange.moveToElementText(el);
		// http://help.dottoro.com/ljuobwme.php
		// http://www.ssicom.org/js/x415055.htm
		if(typeof textRange.collapse != "undefined"){
			textRange.collapse(atStart);
		}
		if(typeof textRange.collapse != "undefined"){
			// https://msdn.microsoft.com/en-us/library/ie/ms536616(v=vs.85).aspx
			textRange.move("textedit", (atStart ? -1 : 1));
		}
		// https://msdn.microsoft.com/en-us/library/ie/ms536735(v=vs.85).aspx
		textRange.select();
	}
};

Keyboard.prototype.switchToProperties = function(){
	var editor = d3.select(".ta-bind");
	var map = d3.select(".knalledge_map_container");
	// editor.remove();
	map.node().blur();
	editor.node().focus();
	$(editor.node()).click();
};

Keyboard.prototype.switchToMap = function(){
	var editor = d3.select(".ta-bind");
	var map = d3.select(".knalledge_map_container");
	editor.node().blur();
	map.node().focus();
	$(map.node()).click();
};

Keyboard.prototype.setEditing = function(node){
	if(!node) return;
	var that = this;

	console.log("editing starting");
	this.editingNodeHtml = this.clientApi.getDomFromDatum(this.clientApi.getSelectedNode());
	var nodeSpan = this.editingNodeHtml.select("span");

	// http://www.w3.org/TR/html5/editing.html#editing-0
	// http://www.w3.org/TR/html5/editing.html#contenteditable
	// http://www.w3.org/TR/html5/editing.html#making-entire-documents-editable:-the-designmode-idl-attribute
	nodeSpan.attr("contenteditable", true);

	this.createCaretPlacer(nodeSpan.node(), false);

	// http://www.w3schools.com/js/js_htmldom_eventlistener.asp
	nodeSpan.node().addEventListener("blur", function onblur(){
		console.log("editing bluring");
		// http://www.w3schools.com/jsref/met_element_removeeventlistener.asp
		if(nodeSpan.node().removeEventListener){// For all major browsers, except IE 8 and earlier
			nodeSpan.node().removeEventListener("blur", onblur);
		}else if(nodeSpan.node().detachEvent){ // For IE 8 and earlier versions
			nodeSpan.node().detachEvent("blur", onblur);
		}
		that.exitEditingNode();
	});
};

Keyboard.prototype.exitEditingNode = function(){
	console.log("exitEditingNode");
	if(this.editingNodeHtml){
		var nodeSpan = this.editingNodeHtml.select("span");
		nodeSpan.attr("contenteditable", false);
		this.clientApi.updateName(this.editingNodeHtml);
		nodeSpan.node().blur();
		this.editingNodeHtml = null;
		this.clientApi.update(this.clientApi.getSelectedNode(), function(){
			// that.clientApi.setSelectedNode(null); //TODO: set to parent
		});
	}
};

// http://robertwhurst.github.io/KeyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	//var that = this;
	this.editingNodeHtml = null;

	KeyboardJS.on("right", function(){
		if(this.editingNodeHtml || !this.clientApi.getSelectedNode()) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		if(this.clientApi.getSelectedNode().children){
			this.clientApi.clickNode(this.clientApi.getSelectedNode().children[0]);
		}
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("left", function(){
		if(this.editingNodeHtml || !this.clientApi.getSelectedNode()) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		if(this.clientApi.getSelectedNode().parent){
			this.clientApi.clickNode(this.clientApi.getSelectedNode().parent);
		}
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("down", function(){
		if(this.editingNodeHtml || !this.clientApi.getSelectedNode()) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		if(this.clientApi.getSelectedNode().parent && this.clientApi.getSelectedNode().parent.children){
			for(var i=0; i<this.clientApi.getSelectedNode().parent.children.length; i++){
				if(this.clientApi.getSelectedNode().parent.children[i] == this.clientApi.getSelectedNode()){
					if(i+1<this.clientApi.getSelectedNode().parent.children.length){
						this.clientApi.clickNode(this.clientApi.getSelectedNode().parent.children[i+1]);
					}
				}
			}
		}
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("up", function(){
		if(this.editingNodeHtml || !this.clientApi.getSelectedNode()) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		if(this.clientApi.getSelectedNode().parent && this.clientApi.getSelectedNode().parent.children){
			for(var i=0; i<this.clientApi.getSelectedNode().parent.children.length; i++){
				if(this.clientApi.getSelectedNode().parent.children[i] == this.clientApi.getSelectedNode()){
					if(i-1>=0){
						this.clientApi.clickNode(this.clientApi.getSelectedNode().parent.children[i-1]);
					}
				}
			}
		}
	}.bind(this), function(){}.bind(this));

	/**
	 * opening node
	 */

	KeyboardJS.on("alt + 1", function(){
		console.log("alt + 1");
		this.switchToMap();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("alt + 2", function(){
		console.log("alt + 2");
		this.switchToProperties();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("ctrl + enter", function(){
		console.log("ctrl + enter");
		if(this.editingNodeHtml) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		this.clientApi.getSelectedNode().isOpen = !this.clientApi.getSelectedNode().isOpen;
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));

	/**
	 * starting node editing
	 */
	KeyboardJS.on("ctrl + space",
		function(){
			if(this.editingNodeHtml){
				return;
			}
			if(this.getStatus() !== Keyboard.STATUS_MAP) return;
			return false;
		}.bind(this),
		function(){
			if(this.editingNodeHtml) return;
			if(this.getStatus() !== Keyboard.STATUS_MAP) return;
			this.setEditing(this.clientApi.getSelectedNode());
		}.bind(this),
		function(){
			
		}.bind(this)
	);

	/**
	 * starting node editing
	 */

	KeyboardJS.on("ctrl + f", function(){
		if(this.editingNodeHtml) return;
		// if(this.getStatus() !== Keyboard.STATUS_MAP) return;

		this.clientApi.searchNodeByName();
	}.bind(this), function(){}.bind(this));	

	/**
	 * finishing node editing
	 */
	KeyboardJS.on("ctrl + escape", function(){
		console.log("editing escaping");
		if(this.editingNodeHtml){
			this.exitEditingNode();
		}
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
	}.bind(this), function(){}.bind(this));	

	// IBIS
	// Vote up
	KeyboardJS.on("ctrl + command + up", function(){
		if(this.editingNodeHtml) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		var node = this.clientApi.getSelectedNode();
		if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
		if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
		if(!('voteUp' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteUp = 1;
		else node.kNode.dataContent.ibis.voteUp += 1;
		this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));

	// Vote up
	KeyboardJS.on("ctrl + command + down", function(){
		if(this.editingNodeHtml) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		var node = this.clientApi.getSelectedNode();
		if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
		if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
		if(!('voteDown' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteDown = 1;
		else node.kNode.dataContent.ibis.voteDown += 1;
		this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));
	
	// Add Image
	KeyboardJS.on("ctrl + i", function(){
		window.prompt("Kmek");
		if(this.editingNodeHtml) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		var node = this.clientApi.getSelectedNode();

		this.clientApi.addImage(node);
	}.bind(this), function(){}.bind(this));	
	
	// Remove Image
	KeyboardJS.on("shift + ctrl + i", function(){
		if(this.editingNodeHtml) return;
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		console.log("Removing image");
		this.clientApi.removeImage();
	}.bind(this), function(){}.bind(this));	
	
	// Add Link
	KeyboardJS.on("ctrl + l", function(){
		if(this.editingNodeHtml) return;
		var node = this.clientApi.getSelectedNode();
		if(node){ // if source node is selected
			this.clientApi.knalledgeState.addingLinkFrom = node;
		}
	}.bind(this), function(){}.bind(this));	

	Keyboard.prototype.addNode = function(nodeType, edgeType){
		console.log("exitEditingNode");
		nsDebug.d.cnTb("KeyboardJS.on('tab'): this.editingNodeHtml: " + this.editingNodeHtml);
		if(this.editingNodeHtml) return; // in typing mode
		nsDebug.d.cnTb("KeyboardJS.on('tab'): this.clientApi.getSelectedNode(): " + this.clientApi.getSelectedNode());
		
		if(!this.clientApi.getSelectedNode()) return; // no parent node selected
		var that = this;
		var newNode = this.clientApi.createNode(null, nodeType);
	//		newNode.kNode.$promise.then(function(kNodeFromServer){ // TODO: we should remove this promise when we implement KnalledgeMapQueue that will solve these kind of dependencies
	//			console.log("KeyboardJS.on('tab': in promised fn after createNode");

		var newEdge = this.clientApi.createEdgeBetweenNodes(that.clientApi.getSelectedNode(), newNode, edgeType);
		newEdge.kEdge.$promise.then(function(kEdgeFromServer){
			var parentNode = that.clientApi.getSelectedNode();
			if(!parentNode.isOpen){
				parentNode.isOpen = true;
				that.clientApi.expandNode(parentNode, function(){
				});
			}

			that.clientApi.update(parentNode, function(){
				that.clientApi.setSelectedNode(newNode); // TODO: that is not defined?
				that.clientApi.clickNode(newNode);
				that.clientApi.update(parentNode, function(){
					that.setEditing(newNode);
					// we need to position explicitly here again even though that.clientApi.clickNode(newNode) is doing it
					// since that.setEditing(newNode); is destroying positioning
					that.clientApi.positionToDatum(newNode);
				});
			});
		});

		// var newEdge = that.clientApi.createEdge(that.clientApi.getSelectedNode(), newNode);
		// newEdge.kEdge.$promise.then(function(kEdgeFromServer){
		// 	if(!that.clientApi.getSelectedNode().isOpen){
		// 		that.clientApi.getSelectedNode().isOpen = true;
		// 		that.clientApi.update(that.clientApi.getSelectedNode(), function(){
					
		// 		});
		// 	}

		// 	that.clientApi.update(that.clientApi.getSelectedNode(), function(){
		// 		that.clientApi.setSelectedNode(newNode);//TODO: that is not defined?
		// 		that.setEditing(newNode);
		// 	});
		// });

	//});
};

	// Add new node
	KeyboardJS.on("ctrl + n", function(){
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		var type = this.clientApi.getActiveIbisType();
		if(!type) type = knalledge.KNode.TYPE_KNOWLEDGE;
		this.addNode(type, type);
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("ctrl + alt + 1", function(){
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		this.addNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this), function(){}.bind(this));	

	KeyboardJS.on("ctrl + alt + 2", function(){
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		this.addNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this), function(){}.bind(this));	

	KeyboardJS.on("ctrl + alt + 3", function(){
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		this.addNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this), function(){}.bind(this));	

	KeyboardJS.on("ctrl + alt + 4", function(){
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		this.addNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this), function(){}.bind(this));	
	
	// Delete node:
	KeyboardJS.on("ctrl + delete", function(){
		console.log("ctrl + delete");
		if(this.editingNodeHtml) return; // in typing mode
		if(this.getStatus() !== Keyboard.STATUS_MAP) return;
		if(!this.clientApi.getSelectedNode()) return; // no parent node selected
		//var that = this;
		//if(confirm("Are you sure you want to delete this node od KnAllEdge?")){
			var parentNodes = this.clientApi.getParentNodes(this.clientApi.getSelectedNode());
			this.clientApi.deleteNode(this.clientApi.getSelectedNode());
			if(parentNodes.length > 0 && parentNodes[0]){
				this.clientApi.clickNode(parentNodes[0]);
			}

			this.clientApi.update(this.clientApi.getSelectedNode(), function(){
				// that.clientApi.setSelectedNode(null); //TODO: set to parent
			});
		//}
	}.bind(this), function(){}.bind(this));
	
	//TODO: Delete edge
};

}()); // end of 'use strict';