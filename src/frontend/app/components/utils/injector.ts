import {utils} from './index';

// TODO: requires more testing, usage, still beta
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
        this.items.push(new Injectant(path, value));
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

    has(path:string) {
        for(let i in this.items) {
            if(this.items[i] instanceof Injectant) {
                if((<Injectant> this.items[i]).path === path) {
                    return true;
                }
            }else {
                let injectant:Injector = <Injector> this.items[i];
                let result = injectant.has(path);
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
                let injectant:Injector = <Injector> this.items[i];
                let result = injectant.get(path);
                if(result) return result;
            }
        }
        return undefined;
    }
}

if(typeof utils !== 'undefined') utils.Injector = Injector;
