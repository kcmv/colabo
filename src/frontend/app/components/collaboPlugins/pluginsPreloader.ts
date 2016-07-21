import {Component} from '@angular/core';
import {components} from '../../js/pluginDependencies';
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
    static useSystemJsImport = false;

    static loadPlugins() {
        if(PluginsPreloader.loadingInitiated) return;
        PluginsPreloader.loadingInitiated = true;

        for(let parentComponentName in Config.Plugins.ViewComponents){
            let parentComponentReference = Config.Plugins.ViewComponents[parentComponentName];

            PluginsPreloader.loadChildrenComponents(parentComponentName, parentComponentReference);
        }

        if(PluginsPreloader.useSystemJsImport){
            PluginsPreloader.componentsPromise = Promise.all(PluginsPreloader.componentsPromises);
        }else{
            PluginsPreloader.componentsPromise = new Promise(function(resolve, reject) {
                resolve(true);
            });
        }
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

        var componentPath = componentReference.path;
        console.warn("[PluginsPreloader] Loading component: %s at path: %s", componentName, componentPath);
        /* import {TopPanel} from '../topPanel/topPanel'; */

        if(PluginsPreloader.useSystemJsImport){
            var componentImport = System.import(componentPath);
            var componentPromise = new Promise(function(resolve, reject) {
                componentImport.then(function(result){
                    console.warn("[PluginsPreloader] component", componentName, " is loaded: ", result);
                    var ComponentClass = result[componentName];
                    PluginsPreloader.components[componentName] = ComponentClass;
                    resolve(ComponentClass);
                });
            });
            PluginsPreloader.componentsPromises.push(componentPromise);
            componentPromise.then(function(result){
                console.warn("[PluginsPreloader] component", componentName, " is loaded: ", result);
            });
        }else{
            PluginsPreloader.components[componentName] = components[componentPath];

            console.warn("[PluginsPreloader] component", componentName, " is loaded: ");

            var componentPromise = new Promise(function(resolve, reject) {
                resolve(true);
            });
            PluginsPreloader.componentsPromises.push(componentPromise);
        }
    }

    constructor() {
    }
}

PluginsPreloader.loadPlugins();
