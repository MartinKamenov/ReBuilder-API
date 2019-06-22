import { Application } from 'express';
import UserRepository from '../models/repositories/UserRepository';
import UserModel from '../models/UserModel';
import User from '../models/contracts/User';

/* eslint max-len: ["error",  { "ignoreRegExpLiterals": true } ]*/
const passport = require('passport');
const { Strategy } = require('passport-local');
const uuid = require('uuid');
const NO_USERS_FOUND_MESSAGE = 'No user with such id was found.';
const COULD_NOT_CONNECT_MESSAGE = 'Could not connect to database.';
const USERNAME_IS_TAKEN_MESSAGE = 'Username is taken';
const MORE_THAN_ONE_USER_FOUND_MESSAGE =
    'There is more than one user with this id';
const ALL_FIELDS_ARE_REQUIRED_MESSAGE = 'All fields are required';
const COULD_NOT_REGITRATE_USER_MESSAGE = 'User could not be registered';
const PASSWORDS_NOT_SAME_MESSAGE = 'Passwords are not the same';
const WRONG_USERNAME_OR_PASSWORD_MESSAGE = 'Wrong username or password';
const PASSWORD_VALIDATION_MESSAGE =
    'Password must be at 4 characters long';
const USERNAME_VALIDATION_MESSAGE = 
    'Username should consists only of letters and numbers';
const EMAIL_VALIDATION_MESSAGE = 'E-mail is not valid';

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateUsername(username) {
    const re = /^[0-9A-Za-z\s\-]+$/;
    return re.test(username);
}

const configAuth = (app: Application, userRepository: UserRepository) => {
    passport.use(new Strategy({
        passReqToCallback: true,
    }, (req, username, password, done) => {
        const email = req.body.email;
        const imageUrl = req.body.imageUrl;

        if (!email) {
            // This is the Login, because no e-mail is sent
            return userRepository.findUserByParams({
                username,
                password
            })
            .then((users) => {
                if (users.length < 1) {
                    return done(null, false, {
                        message: WRONG_USERNAME_OR_PASSWORD_MESSAGE
                    });
                } else if (users.length > 1) {
                    return done(null, false, {
                        message: MORE_THAN_ONE_USER_FOUND_MESSAGE
                    });
                }
                return done(null, users[0]);
            })
            .catch((ex) => {
                return done(ex);
            });
        }

        // Register module
        const repeatPassword = req.body.password_confirm;
        if (!password || !username || !email || !repeatPassword || !imageUrl) {
            return done(null, false, {
                message: ALL_FIELDS_ARE_REQUIRED_MESSAGE,
            });
        }

        if (password !== repeatPassword) {
            return done(null, false, {
                message: PASSWORDS_NOT_SAME_MESSAGE,
            });
        }
        if (password.length < 4) {
            return done(null, false, {
                message: PASSWORD_VALIDATION_MESSAGE,
            });
        }
        if (!validateEmail(email)) {
            return done(null, false, {
                message: EMAIL_VALIDATION_MESSAGE,
            });
        }
        if (!validateUsername(username)) {
            return done(null, false, {
                message: USERNAME_VALIDATION_MESSAGE,
            });
        }
        return userRepository.findUserByUsername(username)
            .then((users) => {
                if (users.length > 0) {
                    return done(null, false, {
                        message: USERNAME_IS_TAKEN_MESSAGE,
                    });
                }

                const newUser = new UserModel(uuid.v1(), username, password, email, imageUrl, []);
                return userRepository.addUser(newUser)
                    .then(() => {
                        done(null, newUser);
                    }).catch(() => {
                        const message = COULD_NOT_REGITRATE_USER_MESSAGE;
                        done(message);
                    });
            })
            .catch(() => {
                const message = COULD_NOT_CONNECT_MESSAGE;
                done(message);
            });
    }
    ));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: User, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userRepository.findUserByParams({ id })
            .then((users) => {
                if (users.length < 1) {
                    return done(NO_USERS_FOUND_MESSAGE);
                } else if (users.length > 1) {
                    return done(MORE_THAN_ONE_USER_FOUND_MESSAGE);
                }
                return done(null, users[0]);
            })
            .catch((ex) => done(ex));
    });
};

export default configAuth;
