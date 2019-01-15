// import Observable .....

enum MapTemplateTypes{
    ACTIONS = 'actions',
    INSERT = 'insert'
}

enum MapTemplateCollections{
    NODES = 'knodes',
    EDGES = 'kedges'
}

class TemplateNode{
    name: string;
    type: MapTemplateTypes;
    collection: MapTemplateCollections;
    data:any[] | any;
    //TODO: support `consts` or `declarations`
}

export class MapTemplateProcessor{
    protected map:any;
    protected template:TemplateNode;
    protected KEdgeModel:any;
    protected KNodeModel:any;

    constructor(map:any, template:TemplateNode, KEdgeModel:any, KNodeModel:any){
        this.map = map;
        this.template = template;
        this.KEdgeModel = KEdgeModel;
        this.KNodeModel = KNodeModel;
    }

    onInsert(err:any):void{
        if (err) {
            console.error("[onInsert]", err);
            throw err;
        } else {
            console.log("[onInsert] finished");
            // if (--insertsLeft == 0) {
            //     nodesEdgesSaved();
            // }
        }
    }

    /**
     * creating all the DB objects according to the loaded template
     * 
     * @param map map being creaated
     * 
     * @param template map template
     */
    processTemplateNode(map:any, template:TemplateNode):boolean { //Observable should be used or Promise ...
        switch(template.type){
            case MapTemplateTypes.ACTIONS:
                console.log('template', template);
                console.log('template.data', template.data);
                //TODO: force and ensure is it in the TemplateNode format; 
                // maybe to call some `TemplateNode.fill(obj)` for each node or for the whole template in the `processTemplate()`
                let actions:TemplateNode[] = (template.data as TemplateNode[]);
                //TODO check if it is Array
                for(let a:number = 0; a<actions.length;a++){ //Deal with error: `TypeError: Cannot read property 'length' of undefined` caused by not having parameter 'actions
                    //TODO: return and merge success results of all recursive calls
                    this.processTemplateNode(map, actions[a]);
                }
            break;
            case MapTemplateTypes.INSERT:
                console.log('Inserting %s into %s', template.name, template.collection);
                //TODO: insert
                let collection:any;
                if(template.collection == MapTemplateCollections.NODES){
                    collection = this.KNodeModel.collection;
                }else if(template.collection == MapTemplateCollections.EDGES){
                    collection = this.KEdgeModel.collection;
                }
                else{
                    console.error('[processTemplateNode] Unknown Collection');
                    return false;
                }
                collection.insert([template.data], this.onInsert.bind(this)); //.exec();// onInsert); // call to underlying MongoDb driver
            break;
            default:
                console.error('TYPE Not Recognized');
        }
        return true;
    }

    public processTemplate():boolean { //Observable should be used or Promise ...
        return this.processTemplateNode(this.map, this.template);
    }
}