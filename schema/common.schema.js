const {z} = require('zod');

exports.emailSchema = (
  requiredErrorMsg = 'Email is required.',
  invalidTypeErrorMsg = 'Email must be a string.',
  invalidEmailFormatMsg = 'Email is invalid.'
) =>
  z
    .string({
      required_error: requiredErrorMsg,
      invalid_type_error: invalidTypeErrorMsg,
    })
    .email({
      message: invalidEmailFormatMsg,
    });

exports.teacherEmailSchema = this.emailSchema(
  'Teacher email is required.',
  'Teacher email must be a string.',
  'Teacher email is invalid.'
);

exports.studentEmailSchema = this.emailSchema(
  'Student email is required.',
  'Student email must be a string.',
  'Student email is invalid.'
);
