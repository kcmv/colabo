# Introduction

Colabo CLI Tool support generating set of files based on templates.

## Commands

Colabo tool is built of **commands**. Each command performs particular task, like generating project, puzzle, flow, etc.

Each command has its own folder under the `commands` folder, like `colabo-project` for generating colabo project, or `colabo-puzzle` for generating colabo puzzle, etc.

Most of the commands to work properly needs a template that they use to generate necessary files.

# Templates

Template is set of files, where some of them are just plain files (that will be copied to the final destination) and template files, that will be processed with command, some parameteres, placeholders, will be replaced with correct values. The templating enginee we use is ***[Mustache](https://www.npmjs.com/package/mustache)***.

***`templating/interfaces.ts`*** contains all interfaces and enums that describe templates.

A Template consists of the info part (interface `TemplateInfo` in the `templating/interfaces.ts` file), and apps (under `appTypes`). Each app can be separately created based on the template.

Apps are described under the `appTypes` key (and covered with the interface `IAppInfos`).

```json
{
    "info": { // `interface TemplateInfo`
        "type": "project",
        "data": {
            "name": "colabo-command-create-project"
        }
    }, "appTypes": { // `interface IAppInfos`
        "general": { // `interface IAppInfo`
            // ...
        },
        "frontend": { // `interface IAppInfo`
            // ...
        },
        "backend": { // `interface IAppInfo`
            // ...
        }
    }
}
```

```sh
colabo project-create --pname "cvrkut" --ppath cvrkut --pdescription "Cvrkut is social creative writing ecosystem" --ptype frontend --pversion 2.0.0  --plicense MIT --prepository https://github.com/mprinc/cvrkut.git
```

will create a ***frontend*** (`--ptype frontend`) project (`project-create`), while

```sh
colabo project-create --pname "cvrkut" --ppath cvrkut --pdescription "Cvrkut is social creative writing ecosystem" --ptype backend --pversion 2.0.0  --plicense MIT --prepository https://github.com/mprinc/cvrkut.git
```

will create a ***backend*** (`--ptype backend`) project.

## Template apps

If we look the frontend app in the colabo-project template (`commands/colabo-project/templates/template-info.json`), we have:

```json
    "frontend": { // `interface IAppInfo`
        "name": "frontend",
        "path": "src/frontend",
        "mode": "775",
        "structure": { // `interface IAppInfoStructure`
        // ...
        }        
    }
```

Each application is covered with `IAppInfo` interface.

+ **name** (string) - tells the name of the application
+ **path** (template-string) - provides a path where the template for the app is placed, and where it should be generated.
    + the type of the `path` paremeter is ***`template-string`***. It means it can contain templating variables, like `apps/<pname>`
    + In this case, the (relative) ***source path*** (where template is stored) will be resolved by trimming variable placeholders as `apps/pname`, while the ***destination path*** (where the generated rendered path will be placed) will be resolved by replacing variables as `apps/cvrkut` (in the case project name provided in the colabo command was `cvrkut`)
+ **mode** (octal-string) - gives the folder generation mode the application should be created with
    + the type `octal-string` means that the number will be interpreted as an octal number. The paramter `"mode": "775"` will be interpreted as 0775.
+ **structure** (interface `IAppInfoStructure`) - is a string-key dictionary containing all structures that app consists of. Each structure contains particular section of an app to be generated.

## Structures of an App

Each application in the template consists of one or more sections that generates the rendered application.

Take a look on the following example:

```json
    "frontend": { // `interface IAppInfo`
        "name": "frontend",
        "path": "src/frontend",
        "mode": "775",
        "structure": { // `interface IAppInfoStructure`
            ".": { // `interface `
                "type": "template-folder", "dmode": "775", "fmode": "664", "encoding": "utf8", "flag": "r",
                "exclude": [
                    "apps/pname"
                ],
                "excludeTemplate": [
                    "*.jpg"
                ]
            },
            "apps/<pname>": { // `interface `
                "type": "template-folder", "dmode": "775", "fmode": "664", "encoding": "utf8", "flag": "r",
                "excludeTemplate": [
                    "*.jpg"
                ]
            }
        }        
    }
```

The ***key*** in the `IAppInfoStructure` is of the type ***`template-string`*** and it goes the same as for the path parameter of the templating app. The structure entity that benefits of it is the 2nd structure with the key `apps/<pname>`.

We can see that the `frontend` app consists of two structures: `.` and `apps/<pname>`. Each structure is described with the `IAppInfoStructureEntity` interface or its extensions, like `IAppInfoStructureEntityFolder`, `IAppInfoStructureEntityTemplateFile`, `IAppInfoStructureEntityTemplateFolder`.

+ ***type*** (string or enum `IAppInfoStructureEntityType`) - tells the type of the structire entity.
+ ***dmode*** (octal-string) and ***fmode*** (octal-string) - give the folder and file (respectively) generation mode
+ ***encoding*** (string) - tells the encoding of a file / template
+ ***flag*** (string) - tells the file flags the file should be 
    + TODO: folder and file should be isolated
+ **exclude** (an array of template-strings) - a list of files/folders that should be excluded for generating/replicating/copying
+ **excludeTemplate** (an array of template-strings) - a list of files/folders that should be excluded from templating, but rather directly carbon-copied

# TODO

+ probably if a structure renders files/folders, that are explicitly or more closely addresed with other structure, than in the first structure they should/could be skipped
    + currently for such scenario (which is very common), we are using `exclude` parameter to achieve that