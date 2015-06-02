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

b = new B();
b.hello();
a = new A();
a.zdravo();
b.zdravo();
b.bz();
// a.bz();
b.ab();
// a.ab();
