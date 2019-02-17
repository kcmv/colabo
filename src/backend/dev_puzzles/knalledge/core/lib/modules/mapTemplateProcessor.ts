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
    outputVariables:any = {};
    inputVariables:any = {};
}

/**
 * Description:
 * 
 * output variables:
 * marked with the beginning '$>'
 * Examplein the template:
 * "_id" : "$>rootNodeId",
 * 
 * input variables:
 * marked with the beginning '$'
 * Example in the template:
    "name" : "$mapName",
    "mapId" : "$mapId",
 */
export class MapTemplateProcessor{
    protected map:any;
    protected template:TemplateNode;
    protected KEdgeModel:any;
    protected KNodeModel:any;
    protected variables:any;
    protected callback:Function;
    // protected outputVariables:any;
    // protected currentNode:any = null;
    protected nodesPendingForInsert:any[] = [];

    constructor(map:any, template:TemplateNode, KEdgeModel:any, KNodeModel:any, variables:any = {}){
        this.map = map;
        this.template = template;
        this.KEdgeModel = KEdgeModel;
        this.KNodeModel = KNodeModel;
        this.variables = variables;
        //TODO: check if mapId and mapName are set, or to set it by this class
        //TODO: to see who would be the iAmId of creted nodes/edges? system or the user (map creator)?
    }

    protected processNodesInQueue():void{
        let node:TemplateNode;
        for(var n:number = 0; n<this.nodesPendingForInsert.length; n++){
            node = this.nodesPendingForInsert[n];
            if(Object.keys(node.inputVariables)){
                for(var iv in node.inputVariables){
                    for(var gv in this.variables){
                        if(gv === iv){ //the noded depends on the 'iv' inputVariable
                            for(var v in node.data){ //going through all the properties of the node
                                if(node.data[v] === '$'+iv){ //this property is depending on 'iv' inputvariable
                                    node.data[v] = this.variables[gv]; // it was inserted in this way `node.inputVariables[variableName] = v;` in `processVariables()`
                                    console.log('[processNodesInQueue] resolved %s with %s', iv, this.variables[gv]);
                                }
                            }
                            delete node.inputVariables[iv]; //after resolving we clean it not to be dependend on it any more
                        }
                    }
                }
            }
            this.insertNode(node);
        }
    }

    /**
     * 
     * @param node 
     * @returns true if a vairables have been updated by this node's outputVariable
     */
    protected setVariablesFromSavedOutputVariables(node:any):boolean
    {
        console.log('this.outputVariables', node.outputVariables);
        if(Object.keys(node.outputVariables)){
            for(var v in node.outputVariables){
                this.variables[node.outputVariables[v]] =  node.data[v];
                console.log('[setVariablesFromSavedOutputVariables] resolved',node.outputVariables[v]);
            }
            node.outputVariables = {}; //clean it after exhausted;
            console.log('after [setVariablesFromSavedOutputVariables]: this.variables',this.variables);
            return true;
        }
        return false;
    }
    /**
     * creating all the DB objects according to the loaded template
     * 
     * @param map map being creaated
     * 
     * @param template map template
     */
    protected processTemplateNode(node:TemplateNode):boolean { //Observable should be used or Promise ...
        switch(node.type){
            case MapTemplateTypes.ACTIONS:
                console.log('node', node);
                console.log('node.data', node.data);
                //TODO: force and ensure is it in the TemplateNode format; 
                // maybe to call some `TemplateNode.fill(obj)` for each node or for the whole node in the `processTemplate()`
                let actions:TemplateNode[] = (node.data as TemplateNode[]);
                //TODO check if it is Array
                for(let a:number = 0; a<actions.length;a++){ //Deal with error: `TypeError: Cannot read property 'length' of undefined` caused by not having parameter 'actions
                    //TODO: return and merge success results of all recursive calls
                    this.processTemplateNode(actions[a]);
                }
            break;
            case MapTemplateTypes.INSERT:
                console.log('Inserting %s into %s', node.name, node.collection);
                this.processVariables(node);
                if(!this.insertNode(node)){ //if could not been inserted because depends on input variables, we put it in the queue to be processed later when those input variables are resolved
                    this.nodesPendingForInsert.push(node);
                }
            break;
            default:
                console.error('TYPE Not Recognized');
        }
        return true;
    }

    /**
     * 
     * @param node template node to be inserted
     * @returns boolean = true if the node was inserted and = false if could not been inserted because of depending on input variables
     */
    protected insertNode(node:TemplateNode):boolean{
        let that:MapTemplateProcessor = this;

        /**
         * called after inserting the node
         * requires info of the template node for which it is called
         * @param err 
         */
        function onInsert(err:any):void{ 
            if (err) {
                console.error("[onInsert]", err);
                throw err;
            } else {
                console.log("[onInsert] finished", node.data);
                for(var n:number = 0; n<that.nodesPendingForInsert.length; n++){
                    if(that.nodesPendingForInsert[n] === node){ //removing it after being inserted
                        that.nodesPendingForInsert.splice(n,1);
                    }
                }
                if(that.setVariablesFromSavedOutputVariables(node)){ //resolved some output variables
                    that.processNodesInQueue();
                }
                // if (--insertsLeft == 0) {
                //     nodesEdgesSaved();
                // }
            }
        }

        let collection:any;
        if(node.collection == MapTemplateCollections.NODES){
            collection = this.KNodeModel.collection;
        }else if(node.collection == MapTemplateCollections.EDGES){
            collection = this.KEdgeModel.collection;
        }
        else{
            console.error('[processTemplateNode] Unknown Collection');
            throw new Error('Unknown Collection');
        }
        if(Object.keys(node.inputVariables).length === 0){ //if it is not pending on outputs from other inserts:
            collection.insert([node.data], onInsert); //.exec();// onInsert); // call to underlying MongoDb driver
            //TODO: instead of being class method, moved here in the insert function because of the context providing (getting acess to the node being inserted)
            // collection.insert([node.data], this.onInsert.bind(this)); //.exec();// onInsert); // call to underlying MongoDb driver
            return true;
        }else
        {
            console.log('Node %s still depends on %s to be inserted', node.name, Object.keys(node.inputVariables));
            return false;
        }
    }

    /**
     * processes variables of the node, resolving its input variables if available; and putting them in node.inputVariables if not, to be resolved later. 
     * It saves in node.outputVariables all the output variables that the node will create after saving (mostly '_id')
     * @param node 
     * @returns true if it depends on yet not provided input variables
     */
    protected processVariables(node:TemplateNode):boolean{
        let pending:boolean = false;
        let data:any = node.data;
        console.log('[processVariables]before', data);
        let variableName:string;
        let variable:string;
        node.outputVariables = {};
        node.inputVariables = {};
        for(var v in data){
            // console.log('data[v]', data[v]);
            // console.log('typeof data[v]', typeof data[v]);
            if((typeof data[v] === 'string') && (data[v] as string).indexOf('$')==0){ //if the valuse is a string and in the format of our map-template variable:
                variableName = (data[v] as string).substring(1);
                if(variableName.indexOf('>')==0 ){ //output variable in the form '$>varName' (used as a placeholder for the variable that will be created after insert, mostly, the obj._id):
                node.outputVariables[v] = variableName.substring(1);
                    delete data[v];
                    //TODO:
                    //TODO:  support saving the var result after inserting
                }else{ //input variable in the form '$varName':
                    if(variableName in this.variables){
                        variable = this.variables[variableName];
                        data[v] = variable; //substituting the linked variable
                    }else{
                        console.log('[MapTemplateProcessor::processVariables] %s is not in this.variables', variableName);
                        node.inputVariables[variableName] = v;
                        //TODO propagate erorrs;
                        pending = true;
                    }
                }
            }
        }
        console.log('[processVariables]after', data);
        return true;
    }

    public processTemplate(callback:Function):void { //Observable should be used or Promise ...
        this.callback = callback;
        this.processTemplateNode(this.template);
    }
}