// good example for describing interfaces: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fd7bea617cc47ffd252bf90a477fcf6a6b6c3ba5/types/node/index.d.ts#L438

// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';
import * as path from 'path';

// https://www.npmjs.com/package/mustache
// https://www.npmjs.com/package/@types/mustache
import * as Mustache from 'mustache';

// the info part of the template
// usually provided as a part of the JSON file describing the template
export interface TemplateInfo {
    type: string, // template type
    data: {
        name: string // template name
    }
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

// holds various versions of the app path
interface IAppPaths{
    // original `apps/<pname>`
    original: string,
    // trimmed `apps/pname`
    // used for accessing templating file
    trimmed: string,
    // replaced `apps/cvrkut`
    // used for destination path of the rendered template 
    replaced: string
}

var ChildProcess = require("child_process");

export class ColaboTemplateManager{
    private templateInfo: TemplateInfo;
    private colaboTemplate:any;
    private renderParametersCallback:RenderParametersCallback;

    constructor(private templatesFolder: string, private templateFileName:string){
        this.templateFileName = templatesFolder + "/" + templateFileName;
        console.log("[ColaboTemplateManager] this.templateFileName: ", this.templateFileName);
    }

    // parses the template file and converts into an object, `this.colaboTemplate`
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

    // conversion from octal string into а number
    modeStr2Int(modeStr:string):number{
        let modeInt:number = parseInt(modeStr[0])*8*8 
            + parseInt(modeStr[1])*8
            + parseInt(modeStr[2]);
        return modeInt;
    }

    extractPaths(appPath:string, templateView:any):IAppPaths{
        let appPaths:IAppPaths;

        // get app paths for the selected application
        var rx = new RegExp("\<([^\<]+)\>", 'gi');
        let isMatchingVariable = false;
        let matchedVariable = "";
        // path that is trimmed
        // `apps/<pname>` -> apps/pname
        let appPathTrimmed = appPath;
        // path that is replaced with a real name
        // if app name is `pname === cvrkut`:
        // `apps/<pname>` -> apps/cvrkut
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

        appPaths = {
            original: appPath,
            trimmed: appPathTrimmed,
            replaced: appPathReplaced
        };
        console.log("appPaths: '%s'", JSON.stringify(appPaths));

        return appPaths;
    }

    execute(projectFolderPath:string, renderParametersCallback:RenderParametersCallback, appType:string){
        let appInfo:IAppInfo = this.colaboTemplate.appTypes[appType];

        this.renderParametersCallback = renderParametersCallback;

        let appPath = appInfo.path;
        // get root/default template parameters
        let entityKey:string = '.'
        let templateView:any = renderParametersCallback(entityKey);
        console.log("templateView for the entityKey '%s' is ", entityKey, JSON.stringify(templateView));
        
        let appPaths:IAppPaths = this.extractPaths(appPath, templateView);

        this.createDestinationFolder(projectFolderPath, appInfo.mode);

        let appStructure:IAppInfoStructure = appInfo.structure;

        // iterate through each templating entity
        for(let entityKey in appStructure){
            console.log("\nParsing templating entity: '%s'\n========================================", chalk.bold.italic(entityKey));

            let appInfoEntity:IAppInfoStructureEntity = appStructure[entityKey];

            let structureFolderDestination:string = this.createDestinationFolder(projectFolderPath + "/" + appPaths.replaced, appInfo.mode);

            this.renderAppInfoStructure(
                entityKey, appInfoEntity, 
                this.templatesFolder + "/" + appPaths.trimmed,
                structureFolderDestination,
                renderParametersCallback);
        }
    }

    createDestinationFolder(templateFolderDestination:string, mode:string){
        // creating the templateFolderDestination folder
        let appInfoModeInt:number = mode ? this.modeStr2Int(mode) : 0x775;

        console.log("Creating templateFolderDestination folder '%s'", chalk.bold.italic(templateFolderDestination));
        fs.mkdirSync(templateFolderDestination, { recursive: true, mode: appInfoModeInt });
        
        // get normalized templateFolderDestination
        // we cannot do this before the folder is created
        // as fs.realpathSync crashes otherwise
        templateFolderDestination = fs.realpathSync(templateFolderDestination);
        console.log("normalized templateFolderDestination: '%s'", templateFolderDestination);

        return templateFolderDestination;
    }

    renderAppInfoStructure(structurePath:string, appInfoEntity:IAppInfoStructureEntity, structureFolderSource:string, structureFolderDestination:string, renderParametersCallback:RenderParametersCallback){
        console.log("appInfoEntity for the entityKey '%s' is ", structurePath, JSON.stringify(appInfoEntity));

        // get the normalized source folder
        structureFolderSource = fs.realpathSync(structureFolderSource);
        console.log("normalized templateFolderSource: '%s'", structureFolderSource);

        // get template parameters
        let templateView:any = renderParametersCallback(structurePath);
        console.log("templateView for the entityKey '%s' is ", structurePath, JSON.stringify(templateView));

        let structurePaths:IAppPaths = this.extractPaths(structurePath, templateView);

        let entityKeyTrimmed:string = structurePaths.trimmed;
        let entityKeyReplaced:string = structurePaths.replaced;

        // create folder
        if (appInfoEntity.type == IAppInfoStructureEntityType.Folder){
            this.createDestinationFolder(structureFolderDestination, (<IAppInfoStructureEntityFolder>appInfoEntity).mode);

            this.renderFolder(<IAppInfoStructureEntityFolder>appInfoEntity, entityKeyReplaced, structureFolderDestination);
        }

        // create template file
        if(appInfoEntity.type == IAppInfoStructureEntityType.TemplateFile){
            this.renderTemplateFile(<IAppInfoStructureEntityTemplateFile>appInfoEntity, entityKeyTrimmed, entityKeyReplaced, structureFolderSource, structureFolderDestination, templateView);
        }

        // create template folder
        if(appInfoEntity.type == IAppInfoStructureEntityType.TemplateFolder){
            this.renderTemplateFolder(<IAppInfoStructureEntityTemplateFolder>appInfoEntity, entityKeyTrimmed, entityKeyReplaced, structureFolderSource, structureFolderDestination, templateView);
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

        console.log("\n[renderTemplateFile] rendering template file (entityKeyReplaced: '%s')\n(%s)\n-----------------------------------------", chalk.bold(entityKeyReplaced), chalk.italic(templateFile));

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

    // checks if the file `filename` should be excluded based on the `exclusionList`
    // exclusion list containst the list of simply shell-like regular expressions (`*`, `.`)
    // each exclusion should completely match against the filename
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

    // render a whole folder with files and subfolders, recursivelly (unless matched against the `IAppInfoStructureEntityTemplateFolder.exclude` parameter)
    // it renders each file as an a template (unless matched against `IAppInfoStructureEntity.excludeTemplate` parameter)
    renderTemplateFolder(appInfoEntity:IAppInfoStructureEntityTemplateFolder, entityKeyTrimmed:string, entityKeyReplaced:string, templateFolderSource:string, templateFolderDestination:string, templateView:any){
        let that:ColaboTemplateManager = this;

        let templateFolder:string = templateFolderSource+"/"+entityKeyTrimmed;

        walkDir(templateFolderSource, templateFolderDestination, entityKeyTrimmed, entityKeyReplaced);

        function walkDir(templateFolderSource:string, templateFolderDestination:string, entityKeyTrimmed:string, entityKeyReplaced:string) {

            console.log("[walkDir] templateFolder: %s, entityKeyTrimmed: %s, entityKeyReplaced: %s", templateFolder, entityKeyTrimmed, entityKeyReplaced);
            let templateFolderSubfolderSource:string = path.join(templateFolderSource, entityKeyTrimmed);
            let templateFolderSubfolderDestination:string = path.join(templateFolderDestination, entityKeyReplaced);

            // create entity folder
            console.log("[walkDir] creating folder: %s", templateFolderSubfolderDestination);
            fs.mkdirSync(templateFolderSubfolderDestination, { recursive: true, mode: appInfoEntity.dmodeInt });

            console.log("\n[renderTemplateFolder] rendering template folder (entityKeyReplaced: '%s') \n(%s)\n-----------------------------------------", chalk.bold(entityKeyReplaced), chalk.italic(templateFolderSubfolderSource));

            fs.readdirSync(templateFolderSubfolderSource).forEach( f => {
                let templateFolderSubfolderSourceChild:string = path.join(templateFolderSubfolderSource, f);
                let templateFolderSubfolderDestinationChild:string = path.join(templateFolderSubfolderDestination, f);

                let entityKeyTrimmedChild:string = path.join(entityKeyTrimmed, f);
                let entityKeyReplacedChild:string = path.join(entityKeyReplaced, f);
                let isDirectory:boolean = fs.statSync(templateFolderSubfolderSourceChild).isDirectory();

                console.log("templateFolderSubfolderSourceChild (entityKeyTrimmedChild: %s): %s, appInfoEntity.exclude: %s", entityKeyTrimmedChild, templateFolderSubfolderSourceChild, appInfoEntity.exclude);

                if(that.checkFileExclusion(entityKeyTrimmedChild, appInfoEntity.exclude)) return;

                if(isDirectory){
                    if (appInfoEntity.dmode){
                        appInfoEntity.dmodeInt = that.modeStr2Int(appInfoEntity.dmode);
                    }
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
                    let templateView:any = that.renderParametersCallback(entityKeyTrimmed);
                    console.log("templateView for the entityKeyTrimmed '%s' is ", entityKeyTrimmed, JSON.stringify(templateView));

                    that.renderTemplateFile(templateFileEntity, entityKeyTrimmedChild, entityKeyReplacedChild, templateFolderSource, templateFolderDestination, templateView);
                }
            });
        };
    }

    // provides info
    info(){
        console.log("Template file '%s' info", this.templateFileName);
        // console.log("\tname: ", this.puzzlesDescription.name);
        // console.log("\tdescription: ", this.puzzlesDescription.description);
    }
    
    // returns parsed template
    getTemplate():any{
        return this.colaboTemplate;
    }
}