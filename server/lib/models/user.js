const Bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

module.exports = (Mongoose) => {
  let userSchema = new Mongoose.Schema({
    email : { type : String, required : true, unique : true},
    ip : { type : String, required : true },
    password : {type : String, required : true},
    visits : { type : Number, default : 1 },
    headers : { type : Mongoose.Schema.Types.Mixed },
    coordinates: { type: [Number], defaulty: [0,0], required : true},
    geo: { type : Mongoose.Schema.Types.Mixed, required : true },
    name : { type : String, required : true },
    type : { type: String, enum: ["PROVIDER", "CONSUMER"], required : true },
    restaurant_id : {type: String, default : null},
    mini_restaurant : { type : Mongoose.Schema.Types.Mixed, default : null },
  }).plugin(require('mongoose-times'),{created: "created_at", lastUpdated: "updated_at"});

  userSchema.pre('save', function(next) {
    const user = this;
    if (user.type === "PROVIDER" && !user.restaurant_id) {
      return next(new Error('A provider must belong to a restaurant'));
    }

    if (!user.isModified('password')) {
      return next();
    }

    return Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        return next(err);
      }

      return Bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }

        user.password = hash;
        return next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, done) {
    return Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) {
        return done(err);
      }

      return done(null, isMatch);
    });
  };

  return Mongoose.model('User', userSchema);
};
