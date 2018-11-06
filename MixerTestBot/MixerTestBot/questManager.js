var task = require('./guildTask.js');
var quest = require('./quest.js');

let quests = [];
let tasks = [];
let activeTasks = [];
let activeQuest;

// Exported methods
var methods = {
    initializeTasks: function (_taskCount) {
        // Task (Name of Task, !command for guild board, Difficulty, step increase per attempt (100 is complete), reward [recepient (guild / player), type (exp / gold), amount]
        //       [!commands for task, Flavor text for command], [progressFlag, ProgressText (always starts with 0, "Description of Task")]
        // When creating the pairs, take the task into account, think about appropriate step values for the increment value. i.e. a task with step of 20 would not need flavor text at 10 or below.
        var taskCount = _taskCount;
        // Purge all arrays if initialized after start.
        tasks = [];
        activeTasks = [];
        console.log('INITIALIZING Tasks...');
        console.log('Creating Tasks...');

        var rats = new task('Rats', '!Rats', 'Easy', 10, ['guild', 'gold', 5], 
            // !Command / flavor text pairs.
            [
                'trap', 'You lay some traps for the rats.', 
                'kill', 'You decide to go old school and start stomping!', 
                'poison', 'You place some poisoned bait for the rats.'
            ],
            // Progress / flavor text pairs.
            [
                0, 'Stable workers are requesting an extermination of rats.',
                1, 'The stables are completely swarmed with rats. Their numbers do not appear to be decreasing. Keep at it!',
                30, 'There are still many rodents scurrying about but their numbers are definitely dwindling.',
                60, 'Looks like the job is nearly complete.',
                100, 'The stables have been cleared of all rodents. Great job!'
            ]);
        tasks.push(rats);
        console.log('RATS created');

        var missingPerson = new task('Missing Person', '!missingPerson', 'Medium', 5, ['guild', 'gold', 25],
            [
                'question', 'You ask about the missing person around town',
                'search', 'You decide to spend some time searching for the missing person',
                'post', 'You create flyers for the missing persons hoping other townfolk will come forward with information'
            ],
            [
                0, 'A distraught farmer has asked that the guild help find his missing daughter.',
                1, 'So far the search is not providing any good leads.',
                25, 'The information you have gathered appears to be somewhat useful. Keep digging.',
                50, 'You think you may know of the general area but are missing some key details about the kidnapping.',
                75, 'You have discovered the whereabouts of the missing child.',
                100, 'You found the missing child and returned her safely to her father. Amazing!'
            ]);
        tasks.push(missingPerson);
        console.log('MISSSING created');

        console.log('All Tasks Created!');
        console.log('Randomizing Tasks...');

        // Prevent an excessive task request from causing a problem.
        if (taskCount > tasks.length) {
            taskCount = tasks.length;
        }
        // For loop that grabs _taskCount random tasks from all available tasks.
        //for (var x = 0; x < _taskCount + 1; x++) {
        //    var rand = Math.random() * Math.floor(tasks.length);
        //    activeTasks.push(tasks[rand]);
        //}
        console.log('Tasks Randomized!');

        // ***********************************************************************************
        // ***********************************************************************************
        // Add all tasks for testing. Use above implementation in final version for randomness.
        for (var x = 0; x < tasks.length; x++) {
            activeTasks.push(tasks[x]);
        }
        console.log("Tasks Added");
        // ***********************************************************************************
        // ***********************************************************************************

        var taskList = [];
        // Populate the progress tracker for each task created.
        for (var x = 0; x < activeTasks.length; x++) {
            taskList.push(activeTasks[x].getTaskCommand().toLowerCase());
        }

        // Verify the progress for each task.
        console.log(activeTasks.length + ' tasks READY');
        checkTaskProgress();

        return taskList;
    },
    checkQuestProgress: function (questIdentifier) {
        if (questIdentifier = 'q1') {
            return quests[0];
        }
        if (questIdentifier = 'q2') {
            return quests[1];
        }
        if (questIdentifier = 'q3') {
            return quests[2];
        }
        if (questIdentifier = 'q4') {
            return quests[3];
        }
        if (questIdentifier = 'q5') {
            return quests[4];
        }
    },
    getAvailableQuest: function () {
        return activeQuest;
    },
    getQuestInfo: function (questIndex) {
        // TBD
    },
    // Packages tasks in a new array that can be read out to chat without requiring access to guildTask.js by monitorChat.js.
    getAvailableTasks: function () {
        var taskList = [];
        for (var x = 0; x < tasks.length; x++) {
            if (!tasks[x].taskComplete()) {
                taskList.push(activeTasks[x].getTaskName() + " : " + activeTasks[x].getTaskCommand() + " : " + activeTasks[x].getTaskDescription());
            }
        }
        return taskList;   
    },
    // Accepts a quest ! command (_questID) and a secondary command (_command) from chat and returns the task status message associated with.
    manageTasks: function (_questID, _command) {
        for (var x = 0; x < activeTasks.length; x++) {
            // Check if the current ! command has a task associated with it.
            if (activeTasks[x].getTaskCommand().toLowerCase() == _questID) {
                // Verify the task is not yet completed.
                if (!activeTasks[x].taskComplete()) {
                    // Check the current task for the passed sub-command.
                    if (activeTasks[x].getCommandArray().indexOf(_command) != -1) {
                        // Increment the task progress. Gather current task progress and gather the task progress text array.
                        activeTasks[x].progressTask();
                        var taskText = activeTasks[x].getTaskTextArray();
                        var tempProgress = activeTasks[x].getTaskProgress();
                        // Search through the text array associated with the task and return the associated flavor text.
                        for (var y = 0; y < taskText.length; y += 2) {
                            if (tempProgress >= taskText[y]) {
                                if (tempProgress == 100) {
                                    return taskText[taskText.length - 1];
                                }
                                continue;
                            } else { return taskText[y - 1];}
                        }
                    } else { return "That sub-command doesn\'t exist: " + _command;}
                } else { return "This task has been completed. Thank\'s for your participation!";}
                break;
            }
        }
    }
}

// Internal methods
function checkTaskProgress() {
    for (var x = 0; x < activeTasks.length; x++) {
        console.log(activeTasks[x].getTaskName() + " progress: " + activeTasks[x].getTaskProgress());
    }
}

exports.methods = methods;


// Tasks to implement.
//if (primary == '!merchant' && m3 < 100) {
//    whisper(data.user_name, `You assist the merchant for a while. There is a lot of work to do.`);
//    m3 += 7;
//    console.log(`${data.user_name} assisted the merchant. Progress: ` + m3);
//    if (m3 >= 100) {
//        reply(data.user_name, `Moved the last bit of goods for the merchant.`);
//    }
//}

//if (primary == '!thugs' && m4 < 100) {
//    whisper(data.user_name, `You find the thugs and begin to educate them about proper manners.`);
//    m4 += 1;
//    console.log(`${data.user_name} had words with the thugs. Progress: ` + m4);
//    if (m4 >= 100) {
//        reply(data.user_name, `Convinced the last thug to change jobs.`);
//    }
//}

//if (primary == '!gold' && m5 < 100) {
//    whisper(data.user_name, `You spend some time performing odd jobs to help fill the guild coffers.`);
//    m5 += 1;
//    console.log(`${data.user_name} helped fill the guild coffers. Progress: ` + m5);
//    if (m5 >= 100) {
//        reply(data.user_name, `Placed the last coin in the guild coffers. Great job!`);
//    }
//}