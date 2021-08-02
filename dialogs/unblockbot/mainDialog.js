// Copyright (c) Team Toad. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, ChoiceFactory, ChoicePrompt, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');

// The String ID name for the main dialog
const MAIN_DIALOG = 'MAIN_DIALOG';

// The String ID of the waterfall dialog that exists in the main dialog
const MAIN_WATERFALL_DIALOG = 'MAIN_WATERFALL_DIALOG';

class MainDialog extends ComponentDialog {
    constructor() {
        super(MAIN_DIALOG);

        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG,[
            async (step) => { 
                const choices = ['yes', 'no'];
                const options = { 
                    prompt: "What is it from Main Dailog?",
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


        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
     async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

}

module.exports.MainDialog = MainDialog;