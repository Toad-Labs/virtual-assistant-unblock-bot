const { 
    ComponentDialog, 
    ChoicePrompt, 
    WaterfallDialog, 
} = require('botbuilder-dialogs');

const UNBLOCK_BOT_DIALOG = 'UNBLOCK_BOT_DIALOG';
const MAIN_UNBLOCK_BOT_WATERFALL_DIALOG = 'MAIN_UNBLOCK_BOT_WATERFALL_DIALOG';

class UnblockBotDialog extends ComponentDialog {
    constructor() {

        super(UNBLOCK_BOT_DIALOG);

        this.addDialog(new WaterfallDialog(MAIN_UNBLOCK_BOT_WATERFALL_DIALOG,[
            async (step) => { 
                const choices = ['yes', 'no'];
                const options = { 
                    prompt: "What is it from UnblockBot Dailog?",
                    choices,
                };
                return await step.prompt("choicePrompt", options);
            },
            async (step) => { 
                switch (step.result.index) {
                    case 0: 
                        await step.context.sendActivity("You picked yes!");
                    break;
                    case 1: 
                        await step.context.sendActivity("You picked no!");
                    break; 
                    default: 
                        await step.context.sendActivity("I don't know what you picked");
                    break;
                }
                return await step.endDialog();
            }
        ]));
        this.addDialog(new ChoicePrompt("choicePrompt"));

        this.initialDialogId = MAIN_UNBLOCK_BOT_WATERFALL_DIALOG;

    }
}


module.exports.UnblockBotDialog = UnblockBotDialog;
module.exports.UNBLOCK_BOT_DIALOG = UNBLOCK_BOT_DIALOG;