// Here go all dependencies that plugins reuqire,
// but are not explicitly imported from any file reachable
// from the app entry file (in our case `js/app2.js`)

import {TopPanel} from '../components/topPanel/topPanel';
import {GardeningControls} from '../components/gardening/gardening-controls.component';
import {RimaUsersList} from '../components/rima/rimaUsersList';
import {BrainstormingFormComponent} from '../components/brainstorming/brainstorming-form.component';
import {BrainstormingPanelComponent} from
'../components/brainstorming/brainstorming-panel.component';
import {OntovComponent} from '../components/ontov/ontov.component';
import {SessionFormComponent} from '../components/session/session-form.component';
import {BrainstormingPhase} from '../components/brainstorming/brainstorming';

export var components:any = {};

components['/components/topPanel/topPanel'] = TopPanel;
components['/components/gardening/gardening-controls.component'] = GardeningControls;
components['/components/rima/rimaUsersList'] = RimaUsersList;
components['/components/brainstorming/brainstorming-form.component'] = BrainstormingFormComponent;
components['/components/brainstorming/brainstorming-panel.component'] = BrainstormingPanelComponent;
components['/components/ontov/ontov.component'] = OntovComponent;
components['/components/session/session-form.component'] = SessionFormComponent;
components['/components/brainstorming/brainstorming'] = BrainstormingPhase;

import {IbisTypesList} from '../../dev_puzzles/ibis/ibisTypesList';
components['cf.puzzles.ibis.typesList'] = IbisTypesList;
import {PresentationList} from '../../dev_puzzles/presentation/presentationList';
components['cf.puzzles.presentation.list'] = PresentationList;

// service dependencies that other parts of the system depends on
export var servicesDependencies:any = {};

import {CfPuzzlesIbisService} from '../../dev_puzzles/ibis/cf.puzzles.ibis.service';
servicesDependencies['cf.puzzles.ibis.service'] = CfPuzzlesIbisService;
import {CfPuzzlesPresentationServices} from '../../dev_puzzles/presentation/cf.puzzles.presentation.service';
servicesDependencies['cf.puzzles.presentation.service'] = CfPuzzlesPresentationServices;
