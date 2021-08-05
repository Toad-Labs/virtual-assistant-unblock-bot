// State machine to track a users progression through
// the unblockbot dialog conversation flow 
// 

class UnblockBotDetails {

    // Master error - flag that is thrown when we hit a critical error in the conversation flow
    masterError = null;

    // [STEP 1] Flag that confirms the user wants us to look into their file
    confirmLookIntoStep = null;

    // [STEP 2] Flag that confirms the user wants us to send an email 
    confirmSendEmailStep = null;

    errorCount = { 
        confirmLookIntoStep : 0,
    };
}

module.exports.UnblockBotDetails = UnblockBotDetails;