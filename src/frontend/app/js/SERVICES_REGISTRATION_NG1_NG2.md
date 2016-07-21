# Registration of TS NG2 Services

NG2 TS -> downgrade into NG1:
```
var changeServices =
    angular.module('changeServices');

changeServices.
    service('ChangeService', upgradeAdapter.downgradeNg2Provider(ChangeService))
```

# Registration of TS NG1 Services
injection:
```
import {KnalledgeMapPolicyService} from '../components/knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../components/knalledgeMap/knalledgeMapViewService';
import {GlobalEmitterService} from '../components/collaboPlugins/globalEmitterService';
```

// registering ng1 services (written in TypeScript) into/as ng1 services:
```
var knalledgeMapServicesModule = angular.module('knalledgeMapServices');
knalledgeMapServicesModule
  .service('KnalledgeMapPolicyService', KnalledgeMapPolicyService)
  .service('KnalledgeMapViewService', KnalledgeMapViewService)
 .service('GlobalEmitterServicesArray', GlobalEmitterServicesArray)
   ;
```

upgrading ng1 services (written in TS) into ng2 space:
```
upgradeAdapter.upgradeNg1Provider('KnalledgeMapPolicyService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapViewService');
upgradeAdapter.upgradeNg1Provider('GlobalEmitterServicesArray');
```

# Registration of JS NG1 Services
