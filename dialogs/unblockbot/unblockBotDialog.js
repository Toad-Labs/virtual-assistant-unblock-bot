const { 
    ComponentDialog, 
    ChoicePrompt, 
    WaterfallDialog, 
} = require('botbuilder-dialogs');


const { ConfirmLookIntoStep, CONFIRM_LOOK_INTO_STEP } = require('./confirmLookIntoStep');
const { ConfirmSendEmailStep, CONFIRM_SEND_EMAIL_STEP } = require('./confirmSendEmailStep');

 const { UnblockBotDetails } = require('./unblockBotDetails');

const UNBLOCK_BOT_DIALOG = 'UNBLOCK_BOT_DIALOG';
const MAIN_UNBLOCK_BOT_WATERFALL_DIALOG = 'MAIN_UNBLOCK_BOT_WATERFALL_DIALOG';

class UnblockBotDialog extends ComponentDialog {
    constructor() {

        super(UNBLOCK_BOT_DIALOG);

        // Add the ConfirmLookIntoStep dialog to the dialog stack
        this.addDialog(new ConfirmLookIntoStep());
        this.addDialog(new ConfirmSendEmailStep());

        this.addDialog(new WaterfallDialog(MAIN_UNBLOCK_BOT_WATERFALL_DIALOG, [
            this.confirmLookIntoStep.bind(this),
            this.confirmSendEmailStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = MAIN_UNBLOCK_BOT_WATERFALL_DIALOG;

    }


     /**
     * Initial step in the waterfall. This will kick of the unblockbot dialog
     * Most of the time this will just kick off the CONFIRM_LOOK_INTO_STEP dialog - 
     * But in the off chance that the bot has already run through the switch statement
     * will take care of edge cases
     */
    async confirmLookIntoStep(stepContext) {

        // Get the unblockbot details / state machine for the current user 
        const unblockBotDetails = stepContext.options;

        // DEBUG
        console.log('DEBUG: unblockBotDetails:', unblockBotDetails);

        switch(unblockBotDetails.confirmLookIntoStep) {
            
            // The confirmLookIntoStep flag in the state machine isn't set 
            // so we are sending the user to that step 
            case null:
                return await stepContext.beginDialog(CONFIRM_LOOK_INTO_STEP, unblockBotDetails );
            
            // The confirmLookIntoStep flag in the state machine is set to true 
            // so we are sending the user to next step 
            case true:
                console.log('DEBUG', unblockBotDetails);
                return await stepContext.next(unblockBotDetails);

            // The confirmLookIntoStep flag in the state machine is set to false 
            // so we are sending to the end because they don't want to continue
            case false:
                // code block
                return await stepContext.endDialog(unblockBotDetails);

            // Default catch all but we should never get here
            default:
                return await stepContext.endDialog(unblockBotDetails);
              
          } 

    }
    
    /** 
     * Second Step 
     * 
     */
    async confirmSendEmailStep(stepContext) {

        // Get the state machine from the last step
        const unblockBotDetails = stepContext.result;

        // DEBUG
        console.log('DEBUG: confirmSendEmailStep:', unblockBotDetails, stepContext.result);

        switch(unblockBotDetails.confirmSendEmailStep) {
            
            // The confirmLookIntoStep flag in the state machine isn't set 
            // so we are sending the user to that step 
            case null:
                return await stepContext.beginDialog(CONFIRM_SEND_EMAIL_STEP, unblockBotDetails );
            
            // The confirmLookIntoStep flag in the state machine is set to true 
            // so we are sending the user to next step 
            case true:
                return await stepContext.next();

            // The confirmLookIntoStep flag in the state machine is set to false 
            // so we are sending to the end because they don't want to continue
            case false:
                return await stepContext.endDialog(unblockBotDetails);

            // Default catch all but we should never get here
            default:
                return await stepContext.endDialog(unblockBotDetails);
              
          } 

    }


    /**
     * Final step in the waterfall. This will end the unblockbot dialog
     */
     async finalStep(stepContext) {

        const unblockBotDetails = stepContext.result;

        console.log('DEBUG DETAILS: ', unblockBotDetails);

        // Get the results of the last ran step 
        if (stepContext.result) { 
            // DEBUG
            // console.log('Step Results: ', stepContext.result);
            const unblockBotDetails = stepContext.result;
        }

        if (unblockBotDetails.masterError === true) { 
            await stepContext.context.sendActivity("Well this is awkward. Looks like we're having some issues today...");
        }
        

        if (unblockBotDetails.confirmLookIntoStep === true) { 
            await stepContext.context.sendActivity('Looks like confirm is true!');
        }
        else { 
            await stepContext.context.sendActivity('Looks like confirm is false!');
        }

        return await stepContext.endDialog(unblockBotDetails);
    }


}

module.exports.UnblockBotDialog = UnblockBotDialog;
module.exports.UNBLOCK_BOT_DIALOG = UNBLOCK_BOT_DIALOG;