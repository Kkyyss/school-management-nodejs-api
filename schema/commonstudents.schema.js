const {z} = require('zod');
const {teacherEmailSchema} = require('./common.schema');

exports.commonStudentsRequestDTOSchema = z.object({
  teacher: z
    .union([teacherEmailSchema, z.array(teacherEmailSchema)], {
      required_error: 'This field is required.',
      invalid_type_error:
        'Teacher email must be a string or an array of strings.',
    })
    .transform((val) => {
      if (Array.isArray(val)) {
        return val;
      }
      return [val];
    }),
});
