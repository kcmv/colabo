import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';


@Injectable()
export class BrainstormingService {
    test:string = "Hello from BrainstormingService!";

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
