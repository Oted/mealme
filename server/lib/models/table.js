module.exports = (Mongoose) => {
  let tableSchema = new Mongoose.Schema({
    owner_id: { type : Mongoose.Schema.Types.ObjectId, required : true},
    mini_owner: { type : Mongoose.Schema.Types.Mixed, required : true },
    coordinates: { type: [Number], default: [0,0], required : true},
    status: { type: String, enum: ["AVAILABLE", "BOOKED", "CONFIRMED", "CLOSED", "SCHEDULED"], required : true},
    starts: { type: Date, required : true},
    ends: { type: Date, required : true},
    slots : { type : Number, required : true}
  }).plugin(require('mongoose-times'),{created: "created_at", lastUpdated: "updated_at"});

  tableSchema.index({coordinates: '2dsphere'});
  return Mongoose.model('Table', tableSchema);
};
