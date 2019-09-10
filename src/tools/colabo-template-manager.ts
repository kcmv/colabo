// good example for describing interfaces: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fd7bea617cc47ffd252bf90a477fcf6a6b6c3ba5/types/node/index.d.ts#L438

// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';
import * as path from 'path';

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

enum IAppInfoStructureEntityType{
    Folder = "folder",
    TemplateFile = "template-file",
    TemplateFolder = "template-folder"
}
interface IAppInfoStructureEntity{
    type: IAppInfoStructureEntityType
}

interface IAppInfoStructureEntityFolder extends IAppInfoStructureEntity{
    mode: string, // "664"
    modeInt: number, // 0o664
    recursive: boolean
}

interface IAppInfoStructureEntityTemplateFile extends IAppInfoStructureEntity{
    mode?: string, // "664"
    modeInt?: number, // 0o664
    encoding?: string,
    flag?: string // "r",
    excludeTemplate?: string[]
}

interface IAppInfoStructureEntityTemplateFolder extends IAppInfoStructureEntity{
    dmode: string, // directory mode "775"
    fmode: string, // file mode "664"
    dmodeInt: number, // 0o775
    fmodeInt: number, // 0o664
    encoding: string,
    flag: string // "r",
    exclude?: string[],
    excludeTemplate?: string[]
}

interface RenderParametersCallback{
    (key:string):any;
}

interface IAppInfoStructure{
    [id: string] : IAppInfoStructureEntity;
}

interface IAppInfo{
    name: string,
    path: string,
    mode: string,
    structure: IAppInfoStructure
}

interface IAppInfos{
    [id: string] : IAppInfo;
}

var ChildProcess = require("child_process");

export class ColaboTemplateManager{
    private templateInfo: TemplateInfo;
    private colaboTemplate:any;
    private renderParameters:RenderParametersCallback;

    constructor(private templatesFolder: string, private templateFileName:string){
        this.templateFileName = templatesFolder + "/" + templateFileName;
        console.log("[ColaboTemplateManager] this.templateFileName: ", this.templateFileName);
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

    // conversion from octal string into number
    modeStr2Int(modeStr:string):number{
        let modeInt:number = parseInt(modeStr[0])*8*8 
            + parseInt(modeStr[1])*8
            + parseInt(modeStr[2]);
        return modeInt;
    }

    execute(projectFolder, renderParameters:RenderParametersCallback, appType:string){
        let appInfo:IAppInfo = this.colaboTemplate.appTypes[appType];

        this.renderParameters = renderParameters;

        let appPath = appInfo.path;
        // get root/default template parameters
        let entityKey:string = '.'
        let templateView:any = renderParameters(entityKey);
        console.log("templateView for the entityKey '%s' is ", entityKey, JSON.stringify(templateView));
        
        // get path relative for the selected application
        var rx = new RegExp("\<([^\<]+)\>", 'gi');
        let isMatchingVariable = false;
        let matchedVariable = "";
        let appPathTrimmed = appPath;
        let appPathReplaced = appPath;
        for(let i=0; i<appPath.length; i++){
            if(isMatchingVariable){
                if(appPath[i] === '>'){
                    console.log("appPath[i]: %s" , matchedVariable);
                    appPathTrimmed = appPathTrimmed.replace(rx, matchedVariable);
                    appPathReplaced = appPathReplaced.replace(rx, templateView[matchedVariable]);
                    isMatchingVariable = false;
                } else{
                    matchedVariable += appPath[i];
                }
            } else if(appPath[i] === '<'){
                isMatchingVariable = true;
            }
        }
        console.log("appPathTrimmed: '%s'", appPathTrimmed);
        console.log("appPathReplaced: '%s'", appPathReplaced);
        let templateFolderSource:string = fs.realpathSync(this.templatesFolder + "/" + appPathTrimmed);

        // create the templateFolderDestination
        let appInfoModeInt:number = appInfo.mode ? this.modeStr2Int(appInfo.mode) : 0x775;
        let templateFolderDestination:string = projectFolder + "/" + appPathReplaced;
        console.log("Creating templateFolderDestination folder '%s'", chalk.bold.italic(templateFolderDestination));
        fs.mkdirSync(templateFolderDestination, { recursive: true, mode: appInfoModeInt });
        
        templateFolderDestination = fs.realpathSync(projectFolder + "/" + appPathReplaced);
        console.log("templateFolderSource: '%s'", templateFolderSource);
        console.log("templateFolderDestination: '%s'", templateFolderDestination);

        var appStructure = appInfo.structure;

        // iterate through each templating entity
        for(let entityKey in appStructure){
            console.log("\nParsing templating entity: '%s'\n========================================", chalk.bold.italic(entityKey));
            let entityKeyTrimmed:string = entityKey;
            let entityKeyReplaced:string = entityKey;

            let appInfoEntity:IAppInfoStructureEntity = appStructure[entityKey];

            console.log("appInfoEntity for the entityKey '%s' is ", entityKey, JSON.stringify(appInfoEntity));

            // get template parameters
            let templateView:any = renderParameters(entityKey);
            console.log("templateView for the entityKey '%s' is ", entityKey, JSON.stringify(templateView));

            // create folder
            if (appInfoEntity.type == IAppInfoStructureEntityType.Folder){
                this.renderFolder(<IAppInfoStructureEntityFolder>appInfoEntity, entityKeyReplaced, templateFolderDestination);
            }

            // create template file
            if(appInfoEntity.type == IAppInfoStructureEntityType.TemplateFile){
                this.renderTemplateFile(<IAppInfoStructureEntityTemplateFile>appInfoEntity, entityKeyTrimmed, entityKeyReplaced, templateFolderSource, templateFolderDestination, templateView);
            }

            // create template folder
            if(appInfoEntity.type == IAppInfoStructureEntityType.TemplateFolder){
                this.renderTemplateFolder(<IAppInfoStructureEntityTemplateFolder>appInfoEntity, entityKeyTrimmed, entityKeyReplaced, templateFolderSource, templateFolderDestination, templateView);
            }
        }
    }

    renderFolder(appInfoEntity:IAppInfoStructureEntityFolder, entityKeyReplaced:string, templateFolderDestination:string){
        // get the entity folder path
        let entityFolder = templateFolderDestination+"/"+entityKeyReplaced;
        console.log("Creating entity folder '%s'", chalk.bold.italic(entityFolder));

        console.log("\nGenerating folder: '%s' (%s)\n-----------------------------------------", chalk.bold(entityFolder), chalk.italic(entityKeyReplaced));

        if (appInfoEntity.mode){
            appInfoEntity.modeInt = this.modeStr2Int(appInfoEntity.mode);
        }
        // create entity folder
        fs.mkdirSync(entityFolder, { recursive: true, mode: appInfoEntity.modeInt });
    }

    renderTemplateFile(appInfoEntity:IAppInfoStructureEntityTemplateFile, entityKeyTrimmed:string, entityKeyReplaced:string, templateFolderSource:string, templateFolderDestination:string, templateView:any){

        // get template file
        let templateFile = templateFolderSource+"/"+entityKeyTrimmed;

        console.log("\n[renderTemplateFile] rendering template: '%s'\n(%s)\n-----------------------------------------", chalk.bold(entityKeyTrimmed), chalk.italic(templateFile));

        let templateString = fs.readFileSync(templateFile, { encoding: appInfoEntity.encoding, flag: appInfoEntity.flag });

        let templateFileRendered:string;

        // TODO: optimize: do system copy for non-template files
        if(!this.checkFileExclusion(templateFile, appInfoEntity.excludeTemplate)){
            // renter parameters into template
            // https://www.npmjs.com/package/mustache
            // https://www.npmjs.com/package/@types/mustache
            templateFileRendered = Mustache.render(templateString, templateView);    
        }else{
            templateFileRendered = templateString;
        }

        if (appInfoEntity.mode){
            appInfoEntity.modeInt = this.modeStr2Int(appInfoEntity.mode);
        }    
        // write rendered file
        let renderedFilePath = templateFolderDestination+"/"+entityKeyReplaced;
        console.log("Writing template to ", renderedFilePath);
        fs.writeFileSync(renderedFilePath, templateFileRendered, { encoding: appInfoEntity.encoding, mode: appInfoEntity.modeInt });
    }

    checkFileExclusion(filename:string, exclusionList:string[]):boolean{
        console.log("[checkFileExclusion] filename: %s, exclusionList: %s", filename, exclusionList);
        for(let i in exclusionList){
            let exclusion:string = exclusionList[i];
            let exclusionReplace:string = exclusion;
            exclusionReplace = exclusion.replace(".", "\.");
            exclusionReplace = exclusionReplace.replace("*", ".*");
            exclusionReplace = "^"+exclusionReplace+"$";
            console.log("\t%s -> %s", exclusion, exclusionReplace);
            let regexObj:any = new RegExp('foo', 'gi'); 
            regexObj.compile(exclusionReplace, 'g');
            if(filename.match(regexObj)){
                console.log("\texcluded by '%s'", exclusion);
                return true;
            }
        }
        return false;
    }

    renderTemplateFolder(appInfoEntity:IAppInfoStructureEntityTemplateFolder, entityKeyTrimmed:string, entityKeyReplaced:string, templateFolderSource:string, templateFolderDestination:string, templateView:any){
        let that:ColaboTemplateManager = this;

        let templateFolder:string = templateFolderSource+"/"+entityKeyTrimmed;

        walkDir(templateFolderSource, templateFolderDestination, entityKeyTrimmed, entityKeyReplaced);

        function walkDir(templateFolderSource:string, templateFolderDestination:string, entityKeyTrimmed:string, entityKeyReplaced:string) {

            console.log("[walkDir] templateFolder: %s, entityKeyTrimmed: %s, entityKeyReplaced: %s", templateFolder, entityKeyTrimmed, entityKeyReplaced);
            let templateFolderSubfolderSource:string = path.join(templateFolderSource, entityKeyTrimmed);
            let templateFolderSubfolderDestination:string = path.join(templateFolderDestination, entityKeyReplaced);

            console.log("\n[renderTemplateFile] rendering template folder: '%s'\n(%s)\n-----------------------------------------", chalk.bold(entityKeyTrimmed), chalk.italic(templateFolderSubfolderSource));

            fs.readdirSync(templateFolderSubfolderSource).forEach( f => {
                let templateFolderSubfolderSourceChild:string = path.join(templateFolderSubfolderSource, f);
                let templateFolderSubfolderDestinationChild:string = path.join(templateFolderSubfolderDestination, f);

                let entityKeyTrimmedChild:string = path.join(entityKeyTrimmed, f);
                let entityKeyReplacedChild:string = path.join(entityKeyReplaced, f);
                let isDirectory:boolean = fs.statSync(templateFolderSubfolderSourceChild).isDirectory();

                if(that.checkFileExclusion(templateFolderSubfolderSourceChild, appInfoEntity.exclude)) return;

                if(isDirectory){
                    if (appInfoEntity.dmode){
                        appInfoEntity.dmodeInt = that.modeStr2Int(appInfoEntity.dmode);
                    }
                    // create entity folder
                    console.log("creating folder: %s", templateFolderSubfolderDestinationChild);
                    fs.mkdirSync(templateFolderSubfolderDestinationChild, { recursive: true, mode: appInfoEntity.dmodeInt });
                    walkDir(templateFolderSource, templateFolderDestination, entityKeyTrimmedChild, entityKeyReplacedChild);
              }else{
                let templateFileEntity:IAppInfoStructureEntityTemplateFile = {
                    encoding: appInfoEntity.encoding,
                    mode: appInfoEntity.fmode,
                    flag: appInfoEntity.flag,
                    type:IAppInfoStructureEntityType.TemplateFile,
                    modeInt: 0,
                    excludeTemplate: appInfoEntity.excludeTemplate
                };

                // get template parameters
                let templateView:any = that.renderParameters(entityKeyTrimmed);
                console.log("templateView for the entityKeyTrimmed '%s' is ", entityKeyTrimmed, JSON.stringify(templateView));

                that.renderTemplateFile(templateFileEntity, entityKeyTrimmedChild, entityKeyTrimmedChild, templateFolderSource, templateFolderDestination, templateView);
            }
            });
          };
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