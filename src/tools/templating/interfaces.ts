/* -------------------

Describes Template and Template Apps

------------------- */

// the info part of the template
// usually provided as a part of the JSON file describing the template
export interface TemplateInfo {
    type: string, // template type
    data: {
        name: string // template name
    }
}

// a string-key dictionary holding all application types that the template provides
export interface IAppInfos{
    [id: string] : IAppInfo;
}


// describes an application that the template provides
export interface IAppInfo{
    name: string,
    // it is an ***`template-string`***. 
    // It means it can contain templating variables, like `apps/<pname>`
    // In this case, the (relative) ***source path*** (where template is stored) will be resolved by trimming variable placeholders as `apps/pname`, while the ***destination path*** (where the generated rendered path will be placed) will be resolved by replacing variables as `apps/cvrkut` (in the case project name provided in the colabo command was `cvrkut`)
    path: string,
    // the type `octal-string` means that the number will be interpreted as an octal number. The paramter `"mode": "775"` will be interpreted as 0775
    mode: string,
    structure: IAppInfoStructure
}

// a string-key dictionary holding all structures that the application consists of
export interface IAppInfoStructure{
    [id: string] : IAppInfoStructureEntity;
}

/* -------------------

Describes structure entities that an app consists of

------------------- */

// generic structure entity
export interface IAppInfoStructureEntity{
    type: IAppInfoStructureEntityType
}

// enum telling the type of the structure entity
export enum IAppInfoStructureEntityType{
    Folder = "folder",
    TemplateFile = "template-file",
    TemplateFolder = "template-folder"
}

// structure entity describing folder to be created
export interface IAppInfoStructureEntityFolder extends IAppInfoStructureEntity{
    mode: string, // "664"
    modeInt: number, // 0o664
    recursive: boolean
}

// structure entity describing templating file to be rendered
export interface IAppInfoStructureEntityTemplateFile extends IAppInfoStructureEntity{
    mode?: string, // "664"
    modeInt?: number, // 0o664
    encoding?: string,
    flag?: string // "r",
    excludeTemplate?: string[]
}

// structure entity describing templating folder to be parsed and each inner file/folder generated
export interface IAppInfoStructureEntityTemplateFolder extends IAppInfoStructureEntity{
    dmode: string, // directory mode "775"
    fmode: string, // file mode "664"
    dmodeInt: number, // 0o775
    fmodeInt: number, // 0o664
    encoding: string,
    flag: string // "r",
    exclude?: string[],
    excludeTemplate?: string[]
}

/* ----------------------

Various interfaces

---------------------- */

// a function callback that will provide all necessary parameters for template rendering
// the `key` provided, tells the path to the template, which helps the callback function to understand which parameters and which values should be provided
export interface RenderParametersCallback{
    (key:string):any;
}

// holds various versions of an templating path
export interface ITemplatingPaths{
    // original `apps/<pname>`
    original: string,
    // trimmed `apps/pname`
    // used for accessing templating file
    trimmed: string,
    // replaced `apps/cvrkut`
    // used for destination path of the rendered template 
    replaced: string
}