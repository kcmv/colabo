import {utils} from './index';



// TODO: requires more testing, usage, still beta

/**
 * @classdesc An array of Injectant instances
 * @class Injectants
 * @memberof utils
 */
export class Injectants extends Array<Injectant> {
    get(path:string):any {
        for(let i=0; i<this.length; i++) {
            let injectant:Injectant = this[i];
            if(injectant.path === path) return injectant.value;
        }
        return undefined;
    }

    has(path:string):boolean {
        for(let i=0; i<this.length; i++) {
            let injectant:Injectant = this[i];
            if(injectant.path === path) return true;
        }
        return false;
    }
};

/**
 * @classdesc a value that is possible to be injected. It contains uniquely addressable path and value that stands behind the path
 * @class Injectant
 * @memberof utils
 */
export class Injectant {
    path:string;
    value:any;

    constructor(path:string, value:any) {
        this.path = path;
        this.value = value;
    };

    clone():Injectant {
        let newInjectant:Injectant = new Injectant(this.path, this.value);
        return newInjectant;
    };
};

/**
 * @classdesc It holds a set(s) of Injectant(s) that can be asked for or injected new ones
 * The scenario is that an encapsulation parent creates an Injector instance and
 * populates it with injectants. The injector instance is then provided to
 * an encapsulated object and the encapsulated object can ask the injector
 * for any needed item it has by asking through its path (name)
 * @class Injector
 * @memberof utils
 */
export class Injector {
    private items:Array<Injector|Injectant> = [];

    constructor() {
        // console.log('[Injector]');
    };

    add(item: Injector|Injectant):Injector {
        this.items.push(item);
        return this;
    };

    addPath(path:string, value:any):Injector {
        var i = this.indexOf(path);
        if(i<0){
            this.items.push(new Injectant(path, value));
        }else{
          if(this.items[i] instanceof Injectant) {
            this.items[i] = new Injectant(path, value);
          }else {
            this.items[i].addPath(path, value);
          }
        }
        return this;
    };

    prepare(requiredItems:Array<string>, results:Injectants = new Injectants()):Injectants {
        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                let injectant:Injectant = <Injectant> this.items[i];
                if(requiredItems.indexOf(injectant.path)) {
                    results.push(injectant);
                }
            }else {
                let injectant:Injector = <Injector> this.items[i];
                injectant.prepare(requiredItems, results);
            }
        }
        return results;
    }

    clone():Injector {
        let newInjector:Injector = new Injector();

        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                let injectant:Injectant = (<Injectant> this.items[i]).clone();
                newInjector.add(injectant);
            }else {
                let injectant:Injector = (<Injector> this.items[i]).clone();
                newInjector.add(injectant);
            }
        }
        return newInjector;
    }

    indexOf(path:string) {
      var i:Number;
        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                if((<Injectant> this.items[i]).path === path) {
                    return i;
                }
            }else {
                let injector:Injector = <Injector> this.items[i];
                let result = injector.indexOf(path);
                if(result>=0) return i;
            }
        }
        return -1;
    }

    has(path:string) {
        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                if((<Injectant> this.items[i]).path === path) {
                    return true;
                }
            }else {
                let injector:Injector = <Injector> this.items[i];
                let result = injector.has(path);
                if(result) return true;
            }
        }
        return false;
    }

    get(path:string) {
        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                if((<Injectant> this.items[i]).path === path) {
                    return (<Injectant> this.items[i]).value;
                }
            }else {
                let injector:Injector = <Injector> this.items[i];
                let result = injector.get(path);
                if(result) return result;
            }
        }
        return undefined;
    }
}

if(typeof utils !== 'undefined') utils.Injector = Injector;
