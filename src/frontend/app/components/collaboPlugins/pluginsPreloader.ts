import {Component} from '@angular/core';

declare var Config:any;

/**
 * This class preloads all necessary compponents that have to be ready
 * when other parts of the system needs to be loaded
 * @class PluginsPreloader
 * @memberof collaboframework.plugins
*/

export class PluginsPreloader {
    static loadingInitiated:Boolean = false;
    static components:any = {};
    static componentsPromises:Array<any> = [];
    static componentsPromise;

    static loadPlugins() {
        if(PluginsPreloader.loadingInitiated) return;
        PluginsPreloader.loadingInitiated = true;

        for(let parentComponentName in Config.Plugins.ViewComponents){
            let parentComponentReference = Config.Plugins.ViewComponents[parentComponentName];

            PluginsPreloader.loadChildrenComponents(parentComponentName, parentComponentReference);
        }

        PluginsPreloader.componentsPromise = Promise.all(PluginsPreloader.componentsPromises);
    }

    static loadChildrenComponents(parentComponentName, parentComponentReference) {
        if(!parentComponentReference) return;

        for(let componentName in parentComponentReference.components){
            let componentReference = parentComponentReference.components[componentName];

            PluginsPreloader.loadChildComponent(componentName, componentReference);
        }
    }

    static loadChildComponent(componentName, componentReference) {
        if(!componentReference || !componentReference.active) return;

        console.warn("[PluginsPreloader] Loading component: ", componentName);
        var componentPath = componentReference.path;
        /* import {TopPanel} from '../topPanel/topPanel'; */
        var componentImport = System.import(componentPath);
        var componentPromise = new Promise(function(resolve, reject) {
            componentImport.then(function(result){
                console.log("[PluginsPreloader] component", componentName, " is loaded: ", result);
                var ComponentClass = result[componentName];
                PluginsPreloader.components[componentName] = ComponentClass;
                resolve(ComponentClass);
            });
        });
        PluginsPreloader.componentsPromises.push(componentPromise);
        componentPromise.then(function(result){
            console.log("[PluginsPreloader] component", componentName, " is loaded: ", result);
        });
    }

    constructor() {
    }
}

PluginsPreloader.loadPlugins();
