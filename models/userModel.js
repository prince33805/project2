const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{ type: String , required: true , thim: true , default: "user" },
    email:{ type: String , required: true , unique: true , lowercase: true , 
        validator: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error( { error: 'Invalid email address' })
            }
        }  
    },
    password:{ type: String , required: true , minlength: 6 }, //hashed password
    address:{ type: String , required: true },
    telephone:{ type: Number , required: true , minlength:10 , maxlength: 10},
    admin: {type: Boolean , default: false },
    tokens: [{
        token: { type: String, required: true}
    }],
    created: { type: Date , required: true , default: Date.now },
    updated: { type: Date , required: true , default: Date.now }
})

//schema-level middleware
userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')){
        // salt+hash encryption (หาเอาจะถามตอนสอน ลิ้งอยู่ใน sharing clipboard)
        user.password = await bcrypt.hash(user.password,10)
    }

    //continue 
    next()

})

userSchema.methods.generateAuthToken = async function() {
    const user = this 
    const payload = {
        _id: user._id,
        email: user.email,
        admin: user.admin
    }
    const token = jwt.sign( payload, process.env.TOKEN_KEY, 
                            {
                                expiresIn: '2h',
                                issuer: 'Aweson API v22'
                            })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    try {
        const user = await User.findOne( {email})
        if (!user) { throw new Error() }

        // compare provided 'password' with hashed 'user.password'
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) { throw new Error() }

        return user 

    } catch (error) {
        return null 
    }
}

const User = mongoose.model('User',userSchema)

module.exports = User
