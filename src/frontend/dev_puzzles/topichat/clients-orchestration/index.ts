/*
 * Public API Surface of `@colabo-topichat/f-clients-orchestration`
 */

export { TopiChatClientsOrchestrationModule } from './lib/module';
export { TopiChatClientsOrchestrationForm } from './lib/clients-orchestration/clients-orchestration-form.component';
export {
    TopiChatClientsOrchestrationService,
    TopiChatClientsOrchestrationEvents,
    TopiChatClientsOrchestrationDefaultEvents, TopiChatClientsOrchestrationDefaultPayload,
    TopiChatPluginPackage, TopiChatPackage, ColaboPubSubPlugin
} from './lib/topiChat-clients-orchestration.service';
