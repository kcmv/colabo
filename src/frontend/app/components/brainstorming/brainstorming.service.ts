import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {Brainstorming} from './brainstorming';

@Injectable()
export class BrainstormingService {
    test:string = "Hello from BrainstormingService!";
    brainstorming: Brainstorming = new Brainstorming();
  /**
   * Service constructor
   * @constructor
   */
  constructor(
      //  @Inject('RimaService') private rimaService,
      // @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
      ) {

  }
};
