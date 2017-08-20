const Bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

module.exports = (Mongoose) => {
  let restaurantSchema = new Mongoose.Schema({
    bound_user : { type : String},
    bookings : { type : Number, default : 0 },
    place_id : {type : String, required : true, unique : true},
    coordinates: { type: [Number], defaultyy: [0,0], required : true},
    name : { type : String, required : true },
    description : { type : String, required : true },
    website : {type : String, required: true},
    images: { type : [String], default : []},
    menu: {type : [String], default : []},
    food_types : {type : [String], default : []},
    price_range : { type : Number, min: 1, max : 4 },
    geo: { type : Mongoose.Schema.Types.Mixed, required : true },
    place: { type : Mongoose.Schema.Types.Mixed, required : true },
  }).plugin(require('mongoose-times'),{created: "created_at", lastUpdated: "updated_at"});

  return Mongoose.model('Restaurant', restaurantSchema);
};
