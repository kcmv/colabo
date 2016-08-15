import {Component} from '@angular/core';
import {components, servicesDependencies} from '../../js/pluginDependencies';
import {upgradeAdapter} from '../../js/upgrade_adapter';
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

    /**
     * Loads external puzzle from puzzleInfo
     * loads and injects services, adds providers, ng1/2 upgrade/downgrade, ...
     * @param  {[type]} puzzleInfo external puzzle info
     * used at the frontend, run-time for loading puzzle dependencies
     */
    static loadExternalPuzzleContainer(puzzlesInfo){
      console.info("[PluginsPreloader.loadExternalPuzzle] loading puzzle container: ", puzzlesInfo.name);
      for (var puzzleName in puzzlesInfo.puzzles) {
        var puzzle = puzzlesInfo.puzzles[puzzleName];
        // if disabled skip
        if (!puzzle.active) continue;
        PluginsPreloader._loadExternalPuzzle(puzzleName, puzzle);
      }
    }

    static _loadExternalPuzzle(puzzleName:string, puzzleInfo:any){
      // loads all registered services from the puzzle
      // they can be of different type NG1 or NG2
      // and language JS or TS
      // and visible in NG1 and/or NG2 world
      console.info("[PluginsPreloader._loadExternalPuzzle] loading puzzle: ", puzzleName);
      var services = puzzleInfo.services;
      for(var serviceName in services){
        let service = services[serviceName];
        console.info("[PluginsPreloader._loadExternalPuzzle] loading service: ", serviceName, ", service:", service);
        if(service.isTS){
          var serviceClass = servicesDependencies[service.path];
          if(service.isGlobal){
            // upgradeAdapter
            upgradeAdapter.addProvider(serviceClass);
          }
        }
        if(service.isAvailableInNG1){
          var moduleRef =
              angular.module(service.module);
          moduleRef.
              service(serviceName,
                service.isNG2 ? upgradeAdapter.downgradeNg2Provider(serviceClass) :
                serviceClass
              );
        }
      }
      console.info("[PluginsPreloader._loadExternalPuzzle] puzzle loaded");
    }

    // loading component plugins' services
    static loadPluginsServices(
      serviceRefs, pluginsToLoad, injectorAngular, injectorPartial
    ) {
      // loading internal puzzles
      PluginsPreloader._loadPluginsServicesForConfig(
        Config.Plugins.puzzles, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial);

      // loading external puzzles' plugins
      for(let puzzleName in Config.Plugins.external){
        console.info("[PluginsPreloader.loadPluginsServices] puzzle: ", puzzleName);
        let puzzleInfo = Config.Plugins.external[puzzleName];
        PluginsPreloader._loadPluginsServicesForConfig(
          puzzleInfo.puzzles, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial);
      }

    }

    // loading component plugins' services
    static _loadPluginsServicesForConfig(
      configPlugins, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial
    ) {
      // iterating through components
      for (var componentName in configPlugins) {
        var component = configPlugins[componentName];
        // if disabled skip
        if (!component.active) continue;

        // list of services that we have to load
        var serviceIds = [];

        serviceRefs[componentName] = {};

        // iterating through all plugins we care for in this directive
        if (!component.plugins) continue;
        for (var pluginId in component.plugins) {
          if (!pluginsToLoad[pluginId]) continue;

          var plugins = component.plugins[pluginId];
          for (var pId in plugins) {
            var serviceId = plugins[pId];
            serviceIds.push(serviceId);
          }
        }
        // injecting reuqired services
        for (var sId in serviceIds) {
          var serviceId = serviceIds[sId];
          if (serviceRefs[componentName][serviceId]) continue;
          var serviceConfig = component.services[serviceId];
          // injecting
          var serviceRef =
            injectorAngular.get(serviceConfig.name || serviceId);
          serviceRefs[componentName][serviceId] =
            serviceRef;
          // path to the service
          var servicePath = serviceConfig.path ||
            (componentName + "." + (serviceConfig.name || serviceId));

          if (!injectorPartial.has(servicePath))
            injectorPartial.addPath(servicePath, serviceRef);
        }
      }
    }

    // this function iterates through components' plugins
    // and injects them into mapPlugins structure
    // that will be used in sub components
    static injectPluginsOfInterestForComponent(pluginsOfInterest, componentServiceRefs){
      var mapPlugins = {};

      // injecting plugins
      for (var pluginName in pluginsOfInterest) {
        PluginsPreloader.injectPluginsForComponent(pluginName, mapPlugins, componentServiceRefs);
      }

      return mapPlugins;
    }

    // this function iterates through components' plugins
    // and injects them into mapPlugins structure
    // that will be used in sub components
    static injectPluginsForComponent(pluginName, mapPlugins, componentServiceRefs){
      if (!mapPlugins[pluginName]) {
        mapPlugins[pluginName] = {};
      }

      // injecting from internal puzzles-container
      PluginsPreloader.injectPluginsForComponentFromPuzzles(pluginName, mapPlugins, componentServiceRefs, Config.Plugins.puzzles);

      // injecting from external puzzles-containers
      for(let puzzleName in Config.Plugins.external){
        console.info("[PluginsPreloader.loadPluginsServices] puzzle: ", puzzleName);
        let puzzleInfo = Config.Plugins.external[puzzleName];
        PluginsPreloader.injectPluginsForComponentFromPuzzles(pluginName, mapPlugins, componentServiceRefs, puzzleInfo.puzzles);
      }

    }

    // inject plugins from puzzles-container
    static injectPluginsForComponentFromPuzzles(pluginName, mapPlugins, componentServiceRefs, puzzlesInfo){

      for (var componentName in puzzlesInfo) {
        var component = puzzlesInfo[componentName];
        if (component.active && component.plugins &&
          component.plugins[pluginName]
        ) {
          for (var sId in component.plugins[pluginName]) {
            var serviceId = component.plugins[pluginName][sId];
            var serviceConfig = component.services[serviceId];
            var serviceName = serviceConfig.name || serviceId;

            if (!componentServiceRefs[componentName][serviceId].plugins) continue;

            // path to the service
            var servicePath = serviceConfig.path ||
              (componentName + "." + (serviceConfig.name || serviceId));

            mapPlugins[pluginName][servicePath] =
              componentServiceRefs[componentName][serviceId].plugins[pluginName];
          }
        }
      }
    }

    // Iterates through Config.Plugins.ViewComponents and loads
    // all components that are requested
    //
    static loadRequiredPuzzleComponentClasses() {
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

    // adds to the component's directives list componentDirectives
    // all components that are dinamically loaded through puzzles
    // and described in Config.Plugins.ViewComponents[componentName]
    static addDirectivesDependenciesForComponent(componentName, componentDirectives){
      // get the config for ourselves
      var puzzleHostingConfig = Config.Plugins.ViewComponents[componentName];
      if(!puzzleHostingConfig){
        console.warn("[addDirectivesDependenciesForComponent] ViewComponents %s is missing", componentName);
        return;
      }

      var pluggableSubComponentsConfig = puzzleHostingConfig.components;

      // go through all pluggable sub components
      for(var pluggableSubComponentName in pluggableSubComponentsConfig){
        if (pluggableSubComponentsConfig[pluggableSubComponentName].active) {
            console.warn("["+componentName+"] Loading pluggableSubComponent: ", pluggableSubComponentName);
            // get reference to the pluggable sub component class
            var pluggableSubComponent = PluginsPreloader.components[pluggableSubComponentName];
            if(pluggableSubComponent){
              // add to other directives that puzzle-hosting view component will contain
              componentDirectives.push(pluggableSubComponent);
            }else{
              console.error("["+componentName+"] Error loading pluggableSubComponent: ", pluggableSubComponentName);
            }
        } else {
            console.warn("["+componentName+"] Not loading pluggableSubComponent: ", pluggableSubComponentName);
        }
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

        // Currently not supported because it we do not know the way
        // how to tell system.js to preload js/ts files
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

PluginsPreloader.loadRequiredPuzzleComponentClasses();
