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
        var taskProgress = 0;

        this.progressTask = function () {  
            if (!completed) {
                taskProgress += this.step;
                if (taskProgress >= 100) {
                    this.completeTask();
                } 
                return taskProgress;
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

        this.getCommandArray = function () {
            return this.commandArray;
        }

        this.getTaskDescription = function () {
            return this.textArray[1];
        }

        this.getTaskTextArray = function () {
            return this.textArray;
        }
    }
}