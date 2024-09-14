// create model for Users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    //   validate: {
    //     validator: function (value) {
    //       // Validator for checking if the string contains at least one alphabet
    //       return (
    //         /[a-zA-Z]/.test(value) &&
    //         (typeof value === "string" || typeof value === "number")
    //       );
    //     },
    //     message:
    //       "Username must contain at least one letter and can be a string or number",
    //   },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [
        (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
        // validator: function(value) {
        //     // Validator for email format
        //     return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2, 3})+$/.test(value);
        //   },
        //   message: 'Invalid email format' 
        // }
      ],
      
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 15,
    //   validate: {
    //     validator: function(value) {
    //       // Validator for password strength
    //       return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/.test(value);
    //     },
    //     message: 'Password must be 6-10 characters long and contain at least one letter, one number, and one special character'
    //   }
    },
    refresh_token: String,
  },
  {
    virtuals: {
      // virtuals key is not field in database but can build virtual field by using actual field
      full_name: {
        get() {
          return `${this.first_name} ${this.last_name}`;
        },
      },
      _id: { // set _id in mongoDB to id
        get() {
            return this._id
        }
      }
    },
  }
);

module.exports = mongoose.model("User", userSchema);
