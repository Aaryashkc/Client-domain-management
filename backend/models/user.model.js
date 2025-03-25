import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true,
  },
  fullName:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
    minLength: 6,
  },

}, 
{timestamps: true} //yesle chai time stamps haru show garxa 
);

const User = mongoose.model('User', userSchema);

export default User;