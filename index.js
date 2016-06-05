var Setting = require('./setting_model.js');
var Log = require('./log_model.js');
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
  	autoRun();
});

function autoRun (arguments) {
    Setting.find({}, {'_id': 0, '__v': 0}).exec(function (error, result) {
        if (error) {
        	console.log(error);
        } else {
            if (result && result.length) {
            	var expired = +result[0].expired_time; // 单位：秒
            	var deadline = Date.now() - expired * 1000;
            	var condition = {
            		'create_time': {
            			'$lt': deadline
            		}
            	};

            	Log.remove(condition, function (err, res) {
            	    if (err) {
            	    	console.log(err);
            	    } else {
            	    	console.log(res);
            	    }
            	});
            }
        }
    });
}