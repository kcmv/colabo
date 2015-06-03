// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
// pollyfil for missing Object.getPrototypeOf
// http://stackoverflow.com/questions/7662147/how-to-access-object-prototype-in-javascript
if(!Object.getPrototypeOf) {
	if( ({}).__proto__ === Object.prototype && ([]).__proto__ === Array.prototype ) {
		Object.getPrototypeOf = function getPrototypeOf(object) {
			return object.__proto__;
		};
	} else {
		Object.getPrototypeOf=function getPrototypeOf(object) {
			// May break if the constructor has been changed or removed
			return object.constructor ? object.constructor.prototype : void 0;
		};
	}
}

var A = function(){
	this.name = "a";
};

A.prototype.hello = function(){
	console.log("Hello A");
};

var  B = function(){
	this.name = "b";
}
B.prototype = Object.create(A.prototype);

B.prototype._super = function(){
	var thisP = Object.getPrototypeOf(this);
	var parentP = Object.getPrototypeOf(thisP);
	return parentP;
};

B.prototype.hello = function(){
	console.log("Hello B");
}
A.prototype.zdravo = function(){
	console.log("Zdravo A");
};
B.prototype.bz = function(){
	console.log("B bz");
}

A.prototype.ab = function(){
	this.bz();
};

A.prototype.hab = function(){
	this.hello();
};

b = new B();
b.hello();
a = new A();
a.zdravo();
b.zdravo();
b.bz();
// a.bz();
b.ab();
// a.ab();
a.hab();
b.hello();
b.hab();
b.__proto__.hello();

bP = Object.getPrototypeOf(b);
bP.hello();
bPP = Object.getPrototypeOf(bP);
bPP.hello();
b._super().hello();
debugger;