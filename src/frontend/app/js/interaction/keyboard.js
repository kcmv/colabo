(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Keyboard =  interaction.Keyboard = function(clientApi){
	this.clientApi = clientApi;
	this.editingNodeHtml = null;
};

Keyboard.prototype.init = function(){
	this.initializeKeyboard();
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
	}
};

// http://robertwhurst.github.io/KeyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	var that = this;
	this.editingNodeHtml = null;

	KeyboardJS.on("right", function(){
		if(this.editingNodeHtml) return;

		if(this.clientApi.getSelectedNode().children){
			this.clientApi.clickNode(this.clientApi.getSelectedNode().children[0]);
		}
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("left", function(){
		if(this.editingNodeHtml) return;

		if(this.clientApi.getSelectedNode().parent){
			this.clientApi.clickNode(this.clientApi.getSelectedNode().parent);
		}
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("down", function(){
		if(this.editingNodeHtml) return;

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
		if(this.editingNodeHtml) return;

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

	KeyboardJS.on("enter", function(){
		if(this.editingNodeHtml) return;

		this.clientApi.getSelectedNode().isOpen = !this.clientApi.getSelectedNode().isOpen;
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));

	// EDIT
	KeyboardJS.on("space",
		function(){
			if(this.editingNodeHtml){
				return;
			}
			return false;
		}.bind(this),
		function(){
			if(this.editingNodeHtml) return;
			this.setEditing(this.clientApi.getSelectedNode());
		}.bind(this),
		function(){
			
		}.bind(this)
	);

	// STOP-EDITING
	KeyboardJS.on("escape", function(){
		console.log("editing escaping");
		if(this.editingNodeHtml){
			this.exitEditingNode();
		}
	}.bind(this), function(){}.bind(this));	

	// IBIS
	// Vote up
	KeyboardJS.on("ctrl+command+up", function(){
		if(this.editingNodeHtml) return;
		var node = this.clientApi.getSelectedNode();
		if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
		if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
		if(!('voteUp' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteUp = 1;
		else node.kNode.dataContent.ibis.voteUp += 1;
		this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));

	// Vote up
	KeyboardJS.on("ctrl+command+down", function(){
		if(this.editingNodeHtml) return;
		var node = this.clientApi.getSelectedNode();
		if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
		if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
		if(!('voteDown' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteDown = 1;
		else node.kNode.dataContent.ibis.voteDown += 1;
		this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
		this.clientApi.update(this.clientApi.getSelectedNode());
	}.bind(this), function(){}.bind(this));
	
	// Add Image
	KeyboardJS.on("i", function(){
		if(this.editingNodeHtml) return;
		var node = this.clientApi.getSelectedNode();
		this.clientApi.addImage(node);
	}.bind(this), function(){}.bind(this));	
	
	// Add Link
	KeyboardJS.on("l", function(){
		if(this.editingNodeHtml) return;
		var node = this.clientApi.getSelectedNode();
		if(node){ // if source node is selected
			this.clientApi.knalledgeState.addingLinkFrom = node;
		}
	}.bind(this), function(){}.bind(this));	

	// Remove Image
	KeyboardJS.on("shift+i", function(){
		if(this.editingNodeHtml) return;
		console.log("Removing image");
		this.clientApi.removeImage();
	}.bind(this), function(){}.bind(this));	

	// Add new node
	KeyboardJS.on("n", function(){
		nsDebug.d.cnTb("KeyboardJS.on('tab'): this.editingNodeHtml: " + this.editingNodeHtml);
		if(this.editingNodeHtml) return; // in typing mode
		nsDebug.d.cnTb("KeyboardJS.on('tab'): this.clientApi.getSelectedNode(): " + this.clientApi.getSelectedNode());
		
		if(!this.clientApi.getSelectedNode()) return; // no parent node selected
		that = this;
		var newNode = this.clientApi.createNode();
//		newNode.kNode.$promise.then(function(kNodeFromServer){ // TODO: we should remove this promise when we implement KnalledgeMapQueue that will solve these kind of dependencies
//			console.log("KeyboardJS.on('tab': in promised fn after createNode");
			var newEdge = that.clientApi.createEdge(that.clientApi.getSelectedNode(), newNode);
			newEdge.kEdge.$promise.then(function(kEdgeFromServer){
				if(!that.clientApi.getSelectedNode().isOpen){
					that.clientApi.getSelectedNode().isOpen = true;
					that.clientApi.update(that.clientApi.getSelectedNode(), function(){
						
					});
				}

				that.clientApi.update(that.clientApi.getSelectedNode(), function(){
					that.clientApi.setSelectedNode(newNode);//TODO: that is not defined?
					that.setEditing(newNode);
				});
			});
		//});
	}.bind(this), function(){}.bind(this));	
	
	// Delete node:
	KeyboardJS.on("delete", function(){
		if(this.editingNodeHtml) return; // in typing mode
		if(!this.clientApi.getSelectedNode()) return; // no parent node selected
		that = this;
		if(confirm("Are you sure you want to delete this node od KnAllEdge?")){
			this.clientApi.deleteNode(this.clientApi.getSelectedNode());		
	
			this.clientApi.update(this.clientApi.getSelectedNode(), function(){
				that.clientApi.setSelectedNode(null); //TODO: set to parent
			});
		}
	}.bind(this), function(){}.bind(this));
	
	//TODO: Delete edge
};

}()); // end of 'use strict';