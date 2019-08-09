// good example for describing interfaces: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fd7bea617cc47ffd252bf90a477fcf6a6b6c3ba5/types/node/index.d.ts#L438

// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';

// https://www.npmjs.com/package/mustache
// https://www.npmjs.com/package/@types/mustache
import * as Mustache from 'mustache';

export interface TemplateInfo {
    type: string,
    data: string
}

export interface FileDescription {
    path: string,
    description: string,
    chmode: string
}

enum EntityType{
    Folder = "folder",
    TemplateFile = "template-file"
}
interface Entity{
    type: EntityType, 
    mode: string, // "664"
    modeInt: number, // 0o664
    encoding: string,
    flag: string // "r"
}

interface RenderParametersCallback{
    (key:string):any;
}

var ChildProcess = require("child_process");

export class ColaboTemplateManager{
    private templateInfo: TemplateInfo;
    private colaboTemplate:any;
    constructor(private templatesFolder: string, private templateFileName:string){
        this.templateFileName = templatesFolder + "/" + templateFileName;
    }

    parse(){
        var templateFileFullUnresolved;
        var templateFileFull;
        if(this.templateFileName[0] == `/`){
            templateFileFull = this.templateFileName;
        }else{
            try {
                templateFileFullUnresolved = process.cwd() + "/" + this.templateFileName;
                templateFileFull = fs.realpathSync(templateFileFullUnresolved);
            } catch (e) {
                console.error("Problem with resolving the template file `%s` -> `%s`", this.templateFileName, templateFileFullUnresolved);
                console.error("Error: ", e);
                process.exit(2);
            }    
        }

        try{
           this.colaboTemplate = require(templateFileFull);
        }catch(e){
            console.error("Problem with importing the template file: ", templateFileFull);
            console.error("Error: ", e);
            process.exit(2);
        }
        this.templateInfo = this.colaboTemplate.info;
        console.log("Template file '%s' is loaded and parsed", this.templateFileName);
        console.log("templateInfo: %s", JSON.stringify(this.templateInfo));
    }

    execute(projectFolder, renderParameters:RenderParametersCallback){
        var structure = this.colaboTemplate.structure;

        // iterate through each templating entity
        for(let entityKey in structure){
            console.log("\nParsing templating entity: '%s'\n-----------------------------------------", chalk.bold.italic(entityKey));

            let entityKeyTrimmed = entityKey;
            let entityKeyReplaced = entityKey;
            let entityValue:Entity = structure[entityKey];

            // conversion from octal string into number
            if (entityValue.mode){
                entityValue.modeInt = parseInt(entityValue.mode[0])*8*8 
                + parseInt(entityValue.mode[1])*8
                + parseInt(entityValue.mode[2]);
            }
            console.log("entityValue for the entityKey '%s' is ", entityKey, JSON.stringify(entityValue));

            // get template parameters
            let templateView:any = renderParameters(entityKey);
            console.log("templateView for the entityKey '%s' is ", entityKey, JSON.stringify(templateView));    

            var rx = new RegExp("\<([^\<]+)\>", 'gi');
            let isMatchingVariable = false;
            let matchedVariable = "";
            for(let i=0; i<entityKey.length; i++){
                if(isMatchingVariable){
                    if(entityKey[i] === '>'){
                        console.log("entityKey[i]: %s" , matchedVariable);
                        entityKeyTrimmed = entityKeyTrimmed.replace(rx, matchedVariable);
                        entityKeyReplaced = entityKeyReplaced.replace(rx, templateView[matchedVariable]);
                        isMatchingVariable = false;
                    } else{
                        matchedVariable += entityKey[i];
                    }
                } else if(entityKey[i] === '<'){
                    isMatchingVariable = true;
                }
            }
            console.log("entityKeyTrimmed: '%s'", entityKeyTrimmed);
            console.log("entityKeyReplaced: '%s'", entityKeyReplaced);

            // create folder
            if (entityValue.type == EntityType.Folder){
                // get the entity folder path
                let entityFolder = projectFolder+"/"+entityKeyTrimmed;
                console.log("Creating entity folder '%s'", chalk.bold.italic(entityFolder));

                // create entity folder
                fs.mkdirSync(entityFolder, { recursive: true, mode: entityValue.modeInt });
            }

            // create template file
            if(entityValue.type == EntityType.TemplateFile){

                // get template file
                let templateFile = this.templatesFolder+"/"+entityKeyTrimmed;
                let templateString = fs.readFileSync(templateFile, { encoding: entityValue.encoding, flag: entityValue.flag });

                // renter parameters into template
                // https://www.npmjs.com/package/mustache
                // https://www.npmjs.com/package/@types/mustache
                let templateFileRendered = Mustache.render(templateString, templateView);

                // write rendered file
                let renderedFilePath = projectFolder+"/"+entityKeyReplaced;
                console.log("Writing template to ", renderedFilePath);
                fs.writeFileSync(renderedFilePath, templateFileRendered, { encoding: entityValue.encoding, mode: entityValue.modeInt })
            }
        }
    }

    info(){
        console.log("Template file '%s' info", this.templateFileName);
        // console.log("\tname: ", this.puzzlesDescription.name);
        // console.log("\tdescription: ", this.puzzlesDescription.description);
    }
    
    getTemplate():any{
        return this.colaboTemplate;
    }
}