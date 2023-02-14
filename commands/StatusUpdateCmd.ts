import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext, ISlashCommandPreview, ISlashCommandPreviewItem } from "@rocket.chat/apps-engine/definition/slashcommands";
import { ISlashCommand } from "@rocket.chat/apps-engine/definition/slashcommands/ISlashCommand";


export class StatusUpdateCmd implements ISlashCommand {
    command: string = 'st';
    i18nParamsExample: string ='status_update_command_params_example';
    i18nDescription: string = 'status_update_command_description';
    providesPreview: boolean = false;


    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
       let user=context.getSender();
       const params = context.getArguments();
        if(!params||params.length==0){
            return this.notifyMessage(context,modify,"At least one status argument is mandatory. A second argument can be passed as status text.");
        }
        let status=params[0];
        let statusText='';
        if(params.length>1){
            statusText=params[1];
        }
        await modify.getUpdater().getUserUpdater().updateStatus(user,statusText,status);
        this.notifyMessage(context,modify,"Status updated to "+status+" ("+statusText+").");
    }

    private async notifyMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const notifier=modify.getNotifier();
        const messageBuilder=notifier.getMessageBuilder();
        const room = context.getRoom();
        messageBuilder.setText(message);
        messageBuilder.setRoom(room);
        await notifier.notifyUser(context.getSender(),messageBuilder.getMessage());
    }
}
