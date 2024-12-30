import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  }
});

// Hash Password
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this .password = await bcrypt.hash(this.password, 12);
    }
    next()
});


// Token generate
userSchema.methods.generateAuthtoken = async function() {
    try {
        let token1 = jwt.sign({_id: this._id}, process.env.KEYSECRET,{
            expiresIn: "1d"
        });
        this.tokens = this.tokens.concat({ token: token1 });
        await this.save();
        return token1;
    } catch (error) {
        resizeBy.status(422).json(error);
    }
};

const user = mongoose.model("user", userSchema);
export default user;
