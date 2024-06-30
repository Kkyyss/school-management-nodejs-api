exports.errorMessageHelper = (errors) => {
  let messages = {};
  errors.forEach((error, idx) => {
    switch (error.validatorKey) {
      case 'not_unique':
        messages[error.path] = `${error.value} already taken.`;
        break;
      default:
        messages[error.path] = error.message;
        break;
    }
  });

  return messages;
};
