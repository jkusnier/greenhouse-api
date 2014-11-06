db.data_fahrenheit.drop()

var lastMaxTime = db.hist_fahrenheit.aggregate(
   [
     {
       $group:
         {
           _id: "1",
           maxTime: { $max: "$time" }
         }
     },
     { $project : { maxTime : 1 , _id : 0 } }
   ]
)

var matchPart = {$match: {"created_on": {$gte: ISODate(lastMaxTime.toArray()[0].maxTime)}}}

var projectParts = {
  $project: {
    "_id": "$_id",
    "fahrenheit": "$fahrenheit", 
    "coreid": "$coreid", 
    "published_at": "$published_at", 
    "yearStr": {$substr: ["$created_on", 0, 4]}, 
    "monthStr": {$substr: ["$created_on", 5, 2]}, 
    "dayStr": {$substr: ["$created_on", 8, 2]}, 
    "hourStr": {$substr: ["$created_on", 11, 2]}, 
    "minutesStr": {$substr: ["$created_on", 14, 1]} 
  } 
}

var combineDates = {
  $project: {
    "_id": "$_id",
    "coreid": "$coreid",
    "fahrenheit": "$fahrenheit", 
    "groupKey": {
      "$concat": [
        "$coreid", "/", "$yearStr", "-", "$monthStr", "-", "$dayStr", "T", "$hourStr", ":", "$minutesStr", "0:00.000Z"
      ]
    }
  }
}

db.environment.aggregate([matchPart, projectParts, combineDates, {$out: "temp_aggregate"}])

var mapFunction1 = function() {
  emit(this.groupKey, this.fahrenheit);
};

var reduceFunction1 = function(groupKey, fahrenheit) {
  var sum = 0;
  for (var i=0; i< fahrenheit.length; i++) {
    sum += fahrenheit[i];
  }
  
  return sum/fahrenheit.length;
};

db.temp_aggregate.mapReduce(mapFunction1, reduceFunction1, { out: "temp_data_fahrenheit" })

db.temp_aggregate.drop()

var splitKey = {
  $project: {
    "coreid": {$substr: ["$_id", 0, 24]}, 
    "time": {$substr: ["$_id", 25, 49]},
    "fahrenheit": "$value",
    _id: 0
  }
}

db.temp_data_fahrenheit.aggregate([splitKey, {$out: "data_fahrenheit"}])

db.data_fahrenheit.find().forEach(function(doc) {
  db.data_fahrenheit.update({_id:doc._id}, {$set: {time: ISODate(doc.time)}})
})

db.data_fahrenheit.ensureIndex({coreid: 1})

db.temp_data_fahrenheit.drop()

