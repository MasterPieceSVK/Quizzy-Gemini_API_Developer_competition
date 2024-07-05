const removeDots = (value) => {
  // Split email into local part and domain part
  const [localPart, domain] = value.split("@");

  // Remove dots from local part
  const normalizedLocalPart = localPart.replace(/\./g, "");

  // Combine normalized local part with domain
  return `${normalizedLocalPart}@${domain}`;
};

module.exports = removeDots;
