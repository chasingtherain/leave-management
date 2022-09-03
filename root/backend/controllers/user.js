const User = require('../models/user')

exports.getAllUser = (req,res,next) => {
    User.find((err, docs) => {
        if (!err) {
            console.log(docs)
            res.status(200).send(docs)   
        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });

    
}