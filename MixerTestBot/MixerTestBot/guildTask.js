module.exports = class GuildTask {
    constructor(taskName, taskBangCommand, taskDifficulty, taskStep, taskReward, taskCommands, taskText) {
        this.name = taskName;
        this.taskIdentifier = taskBangCommand;
        this.difficulty = taskDifficulty;
        this.step = taskStep;
        this.reward = taskReward;
        this.commandArray = taskCommands;
        this.textArray = taskText;
        var completed = false;

        this.progress = function (value) {
            if (!completed) {
                this.questStep += 1;
                if (questStep >= questSteps) {
                    completeQuest();
                }
            }
        }

        this.getTaskInfo = function () {
            return questText[questStep];
        }

        this.completeTask = function () {
            // Issue EXP to the user. 
            // Complete Quest.
            completed = true;
        }

        this.getTaskName = function () {
            return this.name;
        }

        this.getTaskCommand = function () {
            return this.taskIdentifier;
        }

        this.getCommands = function () {
            return this.commandArray;
        }

        this.getTaskDescription = function () {
            return this.textArray[1];
        }
    }
}