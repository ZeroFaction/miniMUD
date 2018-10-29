module.exports = class Quest {
    constructor(questUserName, questName, questDifficulty, questSteps, questStep, questExperience, questCommands, questText) {
        this.userName = questUserName;
        this.name = questName;
        this.difficulty = questDifficulty;
        this.steps = questSteps;
        this.step = questStep;
        this.experience = questExperience;
        this.commandArray = questCommands;
        this.textArray = questText;
        var completed = false;

        this.progress = function (value) {
            if (!completed) {
                this.questStep += 1;
                if (questStep >= questSteps) {
                    completeQuest();
                }
            }
        }

        this.getQuestInfo = function () {
            return questText[questStep];
        }

        this.completeQuest = function () {
            // Issue EXP to the user. 
            // Complete Quest.
            completed = true;
        }
    }
}
