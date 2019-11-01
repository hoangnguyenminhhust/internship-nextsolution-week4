var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var mongoose = require('mongoose'),
    User = mongoose.model('User')


exports.register = function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 10);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        // else {
        //     var token = jwt.sign({
        //         id: user._id
        //     }, config.secret, {
        //         expiresIn: 86400
        //     });
        //     res.status(200).send({
        //         auth: true,
        //         token: token,
        //         user
        //     });
        // };
        res.json(user)
    });
};

exports.list_all = function (req, res) {
    var token = req.header('Authorization').replace('Bearer ','');
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    jwt.verify(token, config.secret, function (err, data) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        // User.findById(data.id, function (err, user) {
        //     if (err) return res.status(500).send("There was a problem finding the user.");
        //     if (!user) return res.status(404).send("No user found.");

        //     res.status(200).send(user);
        // });
        User.find({}, (err, data) => {
            if (err)
                res.status(404).send(err)
            res.json(data)
        })

    });
}



exports.login = function (req, res) {

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({
            auth: false,
            token: null
        });

        var token = jwt.sign({
            id: user._id
        }, config.secret, {
            expiresIn: 12 // token save in 12s
        });

        res.status(200).send({
            auth: true,
            token: token,
            user
        });
    });

};