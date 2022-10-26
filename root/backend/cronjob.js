const schedule = require('node-schedule');


exports.runCronJob = () => {
    const rule = new schedule.RecurrenceRule();
    rule.second = 5;
    
    // rule.month = 0 // jan
    // rule.date = 1 // 1st
    // rule.hour = 0 // 00:00
    // rule.minute = 0
    // rule.second = 0;
    // rule.tz = "Asia/Singapore"
    
    rule.minute = 0
    rule.tz = "Asia/Singapore"


    schedule.scheduleJob(rule, () => {
        console.log(`cronjob is executed at ${new Date()}!`);
    });
}