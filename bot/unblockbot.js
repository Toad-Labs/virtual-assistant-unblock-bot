const { ActivityHandler, MessageFactory, ActivityTypes } = require('botbuilder');
const { WaterfallDialog, WaterfallStepContext, ChoicePrompt, TextPrompt, DialogTurnStatus} = require('botbuilder-dialogs');

class UnblockBot extends ActivityHandler {
    constructor(conversationState, dialogSet) {
        super();

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!dialogSet) throw new Error('[DialogBot]: Missing parameter. dialogSet is required');

        this.conversationState = conversationState;
        this.dialogSet = dialogSet;

        this.addDialogs();
        
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            // Create DialogContext for the current turn
            const dc = await this.dialogSet.createContext(context);

            // Try to continue executing an active multi-turn dialog
            const result = await dc.continueDialog();

            // Send greeting if no other dialogs active
            /*
            if (result.status == DialogTurnStatus.empty && dc.context.activity.type == ActivityTypes.Message) {
                await dc.beginDialog('help');
            }
            */

            // By calling next() you ensure that the next BotHandler is run.
            await next();
            

        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            
            const welcomeText = 'Hi Mary, I’m your virtual concierge!';

            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    
                    // Send the welcome message
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));

                    // Create DialogContext for the current turn
                    const dc = await this.dialogSet.createContext(context);

                    // Begin the dialog
                    await dc.beginDialog('help');

                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });


    }

    addDialogs = function () { 

        this.dialogSet.add(new WaterfallDialog('help',[
            async (step) => { 
                const choices = ['yes', 'no'];
                const options = { 
                    prompt: "What is it?",
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
        this.dialogSet.add(new ChoicePrompt("choicePrompt"));

    }

     /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
    }
}

module.exports.UnblockBot = UnblockBot;