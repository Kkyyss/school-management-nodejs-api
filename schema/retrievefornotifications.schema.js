const {z} = require('zod');
const {emailSchema, teacherEmailSchema} = require('./common.schema');

exports.retrieveForNotificationsRequestDTOSchema = z.object({
  teacher: teacherEmailSchema,
  notification: z
    .string({
      required_error: 'Notification is required.',
      invalid_type_error: 'Notification must be a string.',
    })
    .transform((val) => {
      const plainText = val.trim();

      const notificationWords = plainText.split(' ');
      const studentSet = new Set(); // remove duplicates/repetitions

      notificationWords.forEach((word) => {
        if (word[0] === '@') {
          const parsedEmail = emailSchema().safeParse(word.slice(1));
          if (parsedEmail.success) {
            studentSet.add(parsedEmail.data);
          }
        }
      });

      return Array.from(studentSet);
    }),
});
