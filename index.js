var gulp = require("gulp");
var gutil = require("gulp-util");
var Promise = require("promise");
var events = require("events");
var emitter = new events.EventEmitter();

var sign = "tosync-";
var eventCount = 0;
var runningTasks = [];

module.exports = function(){
    var args = [].slice.call(arguments);
    var tasks = [];

    // save the task name into tasks list
    args.forEach(function(a, i){
        var taskname = sign + (i + +(new Date()) + ~~(Math.random() * 100));
        var type = Object.prototype.toString.call(a);

        tasks.push(taskname);

        if(type === "[object String]"){
            a = [a];
        } else if(type === "[object Array]"){
            for(var j = 0; j < a.length; j++){
                if(typeof a[j] !== "string"){
                    throw new Error("element of array must be a string!");
                }
            }
        } else if(type !== "[object Function]"){
            throw new Error("arguments must be a string, array or function");
        }

        gulp.task(taskname, a);
    });

    return function(){
        if(!tasks.length) return;

        // return a Promise , resolve when the task is stop
        return new Promise(function(resolve){
            runningTasks.push({
                tasks: tasks,
                seq: gulp.seq.slice(0)
            });

            // record the stopped task count
            var count = 0;

            // event names
            var eventName = "sync_task_stop_" + (eventCount++);

            tasks.eventName = eventName;

            // being triggered when the task of tasks was running out
            emitter.on(eventName, function(){

                if(count === tasks.length){

                    // reset the seq of gulp
                    gulp.seq = (runningTasks.pop()).seq;

                    resolve();
                }

                count++;
            });

            gulp.seq = [];

            // running first task of tasks
            gulp.start([tasks[0]]);
        });
    }
};

// avoid outputting the signed task name
var oldemit = gulp.emit;
gulp.emit = function(events, taskArg){
    var taskName = taskArg ? (taskArg.task || "") : "";
    var isSyncTask = (events === "task_start" || events === "task_stop") && (taskName.indexOf(sign) >= 0);

    if (!isSyncTask) {

        oldemit.apply(this, arguments);

    }else {
        // signed task_stop events
        if(events === "task_stop" && runningTasks.length){

            // get the latest tasks
            var tasks = runningTasks[runningTasks.length - 1].tasks;

            tasks.shift();

            if (tasks.length) {
                gulp.start([tasks[0]]);
            } else {
                emitter.emit(tasks.eventName);
            }

        }
    }
};
