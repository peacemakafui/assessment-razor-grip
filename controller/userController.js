const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





// we need a function to get the list of all registered users
signup_get = (req, res)=> {
    User.find()
        .then((users) => res.json(users))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    
}

//logic for user sign_up
signup_post = async (req, res) => {
    try {
        if (!req.body.name || !req.body.password || !req.body.email) {
            res.status(400).json({ message: 'Please fill all fields' });
        }
    
        const user = await User.findOne({ name: req.body.name });
    
        if (user) {
            res.status(400).json({message: 'User account already exists'});
        }
        bcrypt.genSalt(10, function (error, salt) {
            bcrypt.hash(req.body.password, salt, (error, hash) => {
                //hash password store in db
                let newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                });
                newUser
                    .save()
                    .then((user) => res.json(user))
                    .catch((error) => res.status(400).json(`Error: ${error}`));
            });
        });
        
    } catch (error){
        res.status(400).json({ message: error.message });
    }


}

//we need to authenticate the users before they use our application,
//we can do it at the front end and backend for the backend because of our mongodb we would 
//use json web tokens and implement Auth0 at the front end
login_post = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password field cannot be empty please' });
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send({ message: 'User does not exists' });
    }

    //we need to compare the user hashed password and the password in our db using bcrypt
    const auth = await bcrypt.compare(req.body.password, user.password, (error, response) => {
        if (response) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.json({
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    date: user.date,
                },
            });
        } else { return res.status(400).send({ message: 'Authentication Error' });}
    });
}

//token validation
token_valid_post = async (req, res) => {
    try {
        const token = req.header('auth-token');

        //we then check for the token in our req
        if (!token) {
            return res.json(false);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // we need to check for the jwt token
        if (!verified) {
            return res.json(false);
        }

        const user = await User.findById(verified._id);

        if (!user) {
            return res.json(false);
        }

        return res.json(true);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

//logic for getting user profile
profile_get = async (req, res) => {
    try{const user = await User.findById(req.user._id)
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            date: user.date
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
    
}

//logic for deleting user account
profile_delete = (req, res) => {
    User.findByIdAndDelete(req.user._id)
        .then(() => res.json('User account deleted'))
        .catch((error) => res.status(400).json(`Error: ${error}`));
}



module.exports = {
    signup_get,
    signup_post,
    login_post,
    token_valid_post,
    profile_get,
    profile_delete
}