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
    static loadServicesFromExternalPuzzleContainer(puzzlesInfo){
      console.info("[PluginsPreloader.loadExternalPuzzle] loading puzzle container: ", puzzlesInfo.name);
      for (var puzzleName in puzzlesInfo.puzzles) {
        var puzzle = puzzlesInfo.puzzles[puzzleName];
        // skip if disabled
        console.info("[PluginsPreloader.loadExternalPuzzle] puzzle %s: ", puzzleName, puzzle);
        if (!puzzle.active) continue;
        PluginsPreloader._loadServicesFromExternalPuzzle(puzzleName, puzzle);
      }
    }

    // loads all registered services from the puzzle
    // they can be of different type NG1 or NG2
    // and language JS or TS
    // and visible in NG1 and/or NG2 world
    static _loadServicesFromExternalPuzzle(puzzleName:string, puzzleInfo:any){
      console.info("[PluginsPreloader._loadServicesFromExternalPuzzle] loading puzzle: ", puzzleName);
      var services = puzzleInfo.services;
      for(var serviceName in services){
        let service = services[serviceName];
        console.info("[PluginsPreloader._loadServicesFromExternalPuzzle] loading service: ", serviceName, ", service:", service);
        if(service.isTS){
          var serviceClass = servicesDependencies[service.path];
          if(!serviceClass){
            console.error("[PluginsPreloader._loadServicesFromExternalPuzzle] service %s with path '%s' is missing",
              serviceName, service.path);
          }
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
      console.info("[PluginsPreloader._loadServicesFromExternalPuzzle] puzzle loaded");
    }

    /**
     * retrieving all  services that are needed for plugins
     * @param  {[type]} pluginsToLoad   plugins of interest
     * @param  {[type]} injectorAngular reference to angular $injector
     * @param  {[type]} injectorPartial reference to our components.utils.Injector
     * @param  {[type]} serviceRefs     returned services related to plugins
     */
    static retrieveServicesForPlugins(
      pluginsToLoad, injectorAngular, injectorPartial, serviceRefs
    ) {
      // loading internal puzzles
      PluginsPreloader._retrieveServicesForPluginsFromConfig(
        Config.Plugins.puzzles, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial);

      // loading external puzzles' plugins
      for(let puzzleName in Config.Plugins.external){
        console.info("[PluginsPreloader.retrieveServicesForPlugins] puzzle: ", puzzleName);
        let puzzleInfo = Config.Plugins.external[puzzleName];
        PluginsPreloader._retrieveServicesForPluginsFromConfig(
          puzzleInfo.puzzles, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial);
      }

    }

    // loading component plugins' services
    static _retrieveServicesForPluginsFromConfig(
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
    // and injects them into populatedPlugins structure
    // that will be used in sub components
    static populateInPluginsOfInterest(pluginsOfInterest, $injector, injector, populatedPlugins){
      // references to loaded services
      var serviceRefs = {};

      PluginsPreloader.retrieveServicesForPlugins(pluginsOfInterest, $injector, injector, serviceRefs);

      // injecting plugins
      for (var pluginName in pluginsOfInterest) {
        PluginsPreloader.populateInPlugins(pluginName, populatedPlugins, serviceRefs);
      }

      return populatedPlugins;
    }

    // this function iterates through components' plugins
    // and injects them into populatedPlugins structure
    // that will be used in sub components
    static populateInPlugins(pluginName, populatedPlugins, serviceRefs){
      if (!populatedPlugins[pluginName]) {
        populatedPlugins[pluginName] = {};
      }

      // injecting from internal puzzles-container
      PluginsPreloader.populateInPluginsFromPuzzles(pluginName, populatedPlugins, serviceRefs, Config.Plugins.puzzles);

      // injecting from external puzzles-containers
      for(let puzzleName in Config.Plugins.external){
        console.info("[PluginsPreloader.populateInPlugins] puzzle: ", puzzleName);
        let puzzleInfo = Config.Plugins.external[puzzleName];
        PluginsPreloader.populateInPluginsFromPuzzles(pluginName, populatedPlugins, serviceRefs, puzzleInfo.puzzles);
      }

    }

    // inject plugins from puzzles-container
    static populateInPluginsFromPuzzles(pluginName, populatedPlugins, serviceRefs, puzzlesInfo){

      for (var componentName in puzzlesInfo) {
        var component = puzzlesInfo[componentName];
        if (component.active && component.plugins &&
          component.plugins[pluginName]
        ) {
          for (var sId in component.plugins[pluginName]) {
            var serviceId = component.plugins[pluginName][sId];
            var serviceConfig = component.services[serviceId];
            var serviceName = serviceConfig.name || serviceId;

            if (!serviceRefs[componentName][serviceId].plugins) continue;

            // path to the service
            var servicePath = serviceConfig.path ||
              (componentName + "." + (serviceConfig.name || serviceId));

            populatedPlugins[pluginName][servicePath] =
              serviceRefs[componentName][serviceId].plugins[pluginName];
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
            console.info("[PluginsPreloader] Loading parent component: ", parentComponentName);

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
        console.error("[addDirectivesDependenciesForComponent] ViewComponents %s is missing", componentName);
        return;
      }

      var pluggableSubComponentsConfig = puzzleHostingConfig.components;

      // go through all pluggable sub components
      for(var pluggableSubComponentName in pluggableSubComponentsConfig){
        if (pluggableSubComponentsConfig[pluggableSubComponentName].active) {
            console.info("["+componentName+"] Loading pluggableSubComponent: ", pluggableSubComponentName);
            // get reference to the pluggable sub component class
            var pluggableSubComponent = PluginsPreloader.components[pluggableSubComponentName];
            if(pluggableSubComponent){
              // add to other directives that puzzle-hosting view component will contain
              componentDirectives.push(pluggableSubComponent);
            }else{
              console.error("["+componentName+"] Error loading pluggableSubComponent: ", pluggableSubComponentName);
            }
        } else {
            console.info("["+componentName+"] Not loading pluggableSubComponent: ", pluggableSubComponentName);
        }
      }
    }

    static loadChildrenComponents(parentComponentName, parentComponentReference) {
        console.info("[PluginsPreloader] Loading children components for the parent component: ", parentComponentName);
        if(!parentComponentReference) return;

        for(let componentName in parentComponentReference.components){
            let componentReference = parentComponentReference.components[componentName];

            PluginsPreloader.loadChildComponent(componentName, componentReference);
        }
    }

    static loadChildComponent(componentName, componentReference) {
        if(!componentReference || !componentReference.active) return;

        var componentPath = componentReference.path;
        console.info("[PluginsPreloader] Loading component: %s at path: %s", componentName, componentPath);
        /* import {TopPanel} from '../topPanel/topPanel'; */

        // Currently not supported because it we do not know the way
        // how to tell system.js to preload js/ts files
        if(PluginsPreloader.useSystemJsImport){
            var componentImport = System.import(componentPath);
            var componentPromise = new Promise(function(resolve, reject) {
                componentImport.then(function(result){
                    console.info("[PluginsPreloader] component", componentName, " is loaded: ", result);
                    var ComponentClass = result[componentName];
                    PluginsPreloader.components[componentName] = ComponentClass;
                    resolve(ComponentClass);
                });
            });
            PluginsPreloader.componentsPromises.push(componentPromise);
            componentPromise.then(function(result){
                console.info("[PluginsPreloader] component", componentName, " is loaded: ", result);
            });
        }else{
            if(components[componentPath]){
              PluginsPreloader.components[componentName] = components[componentPath];
              console.info("[PluginsPreloader] component", componentName, " is loaded: ");
            }else{
              console.error("[PluginsPreloader] component", componentName, " is missing among the plugindDependencies components");
            }

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
