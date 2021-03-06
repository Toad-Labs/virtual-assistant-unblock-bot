// Copyright (c) Team Toad. All rights reserved.
// Licensed under the MIT License.

const { 
    ComponentDialog, 
    ChoiceFactory, 
    ChoicePrompt, 
    DialogSet, 
    DialogTurnStatus, 
    WaterfallDialog, 
} = require('botbuilder-dialogs');

const { 
    UnblockBotDialog, 
    UNBLOCK_BOT_DIALOG, 
} = require('./unblockBotDialog');

const { UnblockBotDetails } = require('./unblockBotDetails');

// The String ID name for the main dialog
const MAIN_DIALOG = 'MAIN_DIALOG';

// The String ID of the waterfall dialog that exists in the main dialog
const MAIN_WATERFALL_DIALOG = 'MAIN_WATERFALL_DIALOG';

class MainDialog extends ComponentDialog {
    constructor() {
        super(MAIN_DIALOG);

        // Add the unblockbot dialog to the dialog 
        this.addDialog(new UnblockBotDialog());

        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

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

    /**
     * Initial step in the waterfall. This will kick of the unblockbot dialog
     */
    async initialStep(stepContext) {
        const unblockBotDetails = new UnblockBotDetails();
        return await stepContext.beginDialog(UNBLOCK_BOT_DIALOG, unblockBotDetails);
    }

    /**
     * This is the final step in the main waterfall dialog.
     */
    async finalStep(stepContext) {

        const unblockBotDetails = stepContext.result;

        console.log('UnblockBot Details After:', unblockBotDetails);

        await stepContext.context.sendActivity('Ok, have a great day!');
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await stepContext.endDialog();
    }

}

module.exports.MainDialog = MainDialog;