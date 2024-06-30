const {z} = require('zod');
const {teacherEmailSchema, studentEmailSchema} = require('./common.schema');

exports.registerRequestDTOSchema = z.object({
  teacher: teacherEmailSchema,
  students: z
    .array(studentEmailSchema, {
      required_error: 'Student email is required.',
      invalid_type_error: 'This field must be an array.',
    })
    .min(1, {
      message: 'Please provide at least one student email.',
    }),
});
