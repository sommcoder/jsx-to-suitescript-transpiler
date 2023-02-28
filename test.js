function convertToCamelCase(label) {
  // No special character, underscore is allowed
  if (label && /^[a-zA-Z0-9_\s]+$/.test(label))
    return label
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word, i) => {
        if (i !== 0)
          return word.charAt(0).toUpperCase() + word.slice(1, word.length);
        else return word;
      })
      .join("");
  else console.log("error:", "error");
}

function createComponentId(label) {
  if (label && /^[a-zA-Z0-9_\s]+$/.test(label))
    return `${"custpage_" + label.trim().toLowerCase().split(" ").join("_")}
  `;
  else console.log("error:", "error");
}

console.log(convertToCamelCase("Quantity Distribution Number"));

console.log(createComponentId("Qty Distribution Number", "Form", "Sublist"));
