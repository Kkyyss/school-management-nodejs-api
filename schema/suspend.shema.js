const {z} = require('zod');
const {emailSchema, studentEmailSchema} = require('./common.schema');

exports.suspendRequestDTOSchema = z.object({
  student: studentEmailSchema,
});
