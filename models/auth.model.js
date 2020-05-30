const mongoos =require('mongoose');
const bcrypt = require('bcrypt');
const DB_URL = 'mongodb://localhost:27017/online-shop';

const userSchema = mongoos.Schema ({
    username : String,
    email    : String,
    password : String
});

const User = mongoos.model('user', userSchema);

exports.createNewUser = (username,email,password) => {
    //check if email exists
    // yes ==> reject
    // no == > create new acount
    return new Promise ((resolve, reject) => {
        mongoos.connect(DB_URL).then(()=> {
            return User.findOne({email : email});
        }).then(user => {
            mongoos.disconnect()
            if (user) reject('Email is Used')
            else{
                return bcrypt.hash(password, 10)
            }
        }).then(hashedPassword => {
            let user = new User({
                username : username,
                email    : email,
                password : hashedPassword
            })
            return user.save()
        }).then(() => {
            mongoos.disconnect()
            resolve()
        }).catch(err => {
            mongoos.disconnect()
            reject(err)})
    })
}


exports.login = (email, password)=> {
    return new Promise ((resolve, reject) => {
        mongoos.connect(DB_URL).then(() => User.findOne({email : email})).then(user => {
          if (!user) {
            mongoos.disconnect();
            reject('There Is No User Matches This Email');
          }else {
             bcrypt.compare(password, user.password).then(same =>{
                if (!same){
                    mongoos.disconnect();
                    reject('Password Is Incorrect');
                }else{
                    mongoos.disconnect();
                    resolve(user._id)
                }
            })
          }
        }).catch(err => {
            mongoos.disconnect();
            reject(err);
        })

 })

}
