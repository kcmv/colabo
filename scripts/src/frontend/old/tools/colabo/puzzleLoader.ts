/**
Colabo component for finding dependencies for each internal and external puzzle
based on config files (global and external-puzzle-speciffic ones) and
injecting them in the list of dependencies

The ORDER of dependencies injected is decided based on the order of puzzles
in the puzzles config object in global config file
*/

import {normalize, join} from 'path';

import {PROJECT_ROOT, CSS_DEST, IDependency, replaceStrPaths} from '../config';

/**
 * Analyzes puzzleBuild and extracts and injects JavaScript build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectJsDependencyFactory(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
    // Example
    // { src: join('components/gardening/js/services.js'), inject: true, noNorm: true },

    var jsDpendencyTemplate = { src: null,
        inject: true, noNorm: true
    };

    var path = replaceStrPaths(puzzleBuild.path, parentPath);
    path = normalize(path);

    function injectJsDependency(injectJs:string){
        var dPath = injectJs[0] === '.' ? parentPath : path;
        // console.log("injectJs: ", injectJs, "dPath: ", dPath, "parentPath: ", parentPath, "path: ", path);
        var dependency:any = {};
        Object.assign(dependency, jsDpendencyTemplate);
        dependency.src = (dPath) ?
          dPath + "/" + injectJs : injectJs;
        dependency.src = normalize(dependency.src);
        console.log("[injectJsDependencyFactory] dependency=", dependency);
        dependencies.push(dependency);
    }
    return injectJsDependency;
}

/**
 * Analyzes puzzleBuild and extracts and injects CSS build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectCssDependencyFactory(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
    // Example
    // { src: join(APP_SRC, 'components/gardening/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },

    var cssDpendencyTemplate = { src: null, dest: CSS_DEST,
        inject: true, noNorm: true
    };

    var path = replaceStrPaths(puzzleBuild.path, parentPath);
    path = normalize(path);

    function injectCssDependency(injectCss:string){
      var dPath = injectCss[0] === '.' ? parentPath : path;
        var dependency:any = {};
        Object.assign(dependency, cssDpendencyTemplate);
        dependency.src = (dPath) ?
          dPath + "/" + injectCss : injectCss;
        dependency.src = normalize(dependency.src);
        console.log("[injectCssDependencyFactory] dependency=", dependency);
        dependencies.push(dependency);
    }
    return injectCssDependency;
}

/**
 * Analyzes puzzleBuild and extracts and injects all build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectPuzzle(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){

    let injectJsDependency = injectJsDependencyFactory(dependencies, puzzleBuild, parentPath);

    if(Array.isArray(puzzleBuild.injectJs)){
        for(let i in puzzleBuild.injectJs){
            let injectJs = puzzleBuild.injectJs[i];
            injectJsDependency(injectJs);
        }
    }else if(puzzleBuild.injectJs){
        let injectJs = puzzleBuild.injectJs;
        injectJsDependency(injectJs);
    }

    let injectCssDependency = injectCssDependencyFactory(dependencies, puzzleBuild, parentPath);

    if(Array.isArray(puzzleBuild.injectCss)){
        for(let i in puzzleBuild.injectCss){
            let injectCss = puzzleBuild.injectCss[i];
            injectCssDependency(injectCss);
        }
    }else if(puzzleBuild.injectCss){
        let injectCss = puzzleBuild.injectCss;
        injectCssDependency(injectCss);
    }
}


/**
 * Analyzes if there are additional sub puzzles/build-folders in the puzzleBuild
 * and calls injectPuzzle on appropriate builds
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectPuzzleWithPossibleSubPuzzles(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
  if('path' in puzzleBuild){
      injectPuzzle(dependencies, puzzleBuild, parentPath);
  }else{
      for(var subPuzzleName in puzzleBuild){
          var subPuzzleBuild = puzzleBuild[subPuzzleName];
          console.log("subPuzzleBuild: ", subPuzzleBuild);
          if('path' in subPuzzleBuild){
              injectPuzzle(dependencies, subPuzzleBuild, parentPath);
          }
      }
  }
}

/**
 * INJECTING EXTERNAL PUZZLES
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {string} externalPuzzleName the name of external puzzle how it is registered in the global Colabo space config file
 * @param  {any}           puzzleConfig  config object pointing to the external puzzle's config file
 * @param  {any}           configBuild  config object describing how sass files of internals puzzles are built
 */

function injectExternalPuzzle(dependencies:IDependency[], externalPuzzleName:string, puzzleConfig:any, configBuild:any){
  console.log("[injectExternalPuzzle] Injecting external puzzle: ", externalPuzzleName);
  var puzzlePath = puzzleConfig.path;
  var puzzlesContainerConfig = require(join(PROJECT_ROOT, puzzlePath, 'config.js'));

  // injecting dependencies
  var puzzlesBuild = puzzlesContainerConfig.puzzlesBuild;
  var puzzlesConfig = puzzlesContainerConfig.puzzles;
  console.log("[external:%s] puzzlesBuild: %s", externalPuzzleName, puzzlesBuild);

  var puzzleName;
  // inject 'config.js' if not already injected
  // we need this to be accessable during the runtime
  for(puzzleName in puzzlesBuild){
    var puzzleBuild = puzzlesBuild[puzzleName];

    // if not configured or set as unavailable do not inject it
    if(!(puzzleName in puzzlesConfig) || !puzzlesConfig[puzzleName].active) continue;

    if(typeof puzzleBuild.injectJs === 'string') puzzleBuild.injectJs = [puzzleBuild.injectJs];
    if(puzzleBuild.injectJs.indexOf('config.js') < 0){
      puzzleBuild.injectJs.push('./config.js');
    }

    // if not configured or set as unavailable do not inject it
    injectPuzzleWithPossibleSubPuzzles(dependencies, puzzleBuild, puzzlePath);
  }


  // injecting compass building
  var compassPaths = configBuild.PATHS;
  var compassPathsPuzzle = puzzlesContainerConfig.COMPASS.PATHS;
  for(var cppPath in compassPathsPuzzle){
    var compassPathPuzzle = compassPathsPuzzle[cppPath];
    compassPathPuzzle.isPathFull = true;
    compassPaths[puzzlePath] = compassPathPuzzle;
  }
}

/**
 * injects both internal and external puzzles dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzlesConfig  config object describing describing each internal puzzle, its configuration, activity state, etc,
 * and pointing to external puzzles config files
 * @param  {any}           puzzlesBuild  config object describing build aspects of internal puzzles
 * @param  {any}           configBuild  config object describing how sass files of internals puzzles are built
 */
export function injectPuzzlesDependencies(dependencies:IDependency[], puzzlesConfig:any, puzzlesBuild:any, configBuild:any){
  /*
   * Iterates through all puzzles inside the puzzles config and
   * 1. if they are internal
   *   - use respective puzzlesBuild entry for building and call injectPuzzleWithPossibleSubPuzzles()
   * 2. if they are external
   *   - use the puzzlesBuild from the external `config.js` file
   *   (this is done inside the injectExternalPuzzle before calling injectPuzzleWithPossibleSubPuzzles() )
   */
  for(var puzzleName in puzzlesConfig){
      var puzzleConfig = puzzlesConfig[puzzleName];

      // if set as unavailable do not inject it
      if(!puzzleConfig.active) continue;

      // puzzle is external if it has `path` parameter
      if('path' in puzzleConfig){ // external
        injectExternalPuzzle(dependencies, puzzleName, puzzleConfig, configBuild);
      }else{ // internal
        var puzzleBuild = puzzlesBuild[puzzleName];
        console.log("[internal:%s] puzzleBuild: %s", puzzleName, puzzleBuild);
        // skip if no build for the puzzle
        if(!puzzleBuild) continue;

        injectPuzzleWithPossibleSubPuzzles(dependencies, puzzleBuild);
      }
  }
}
