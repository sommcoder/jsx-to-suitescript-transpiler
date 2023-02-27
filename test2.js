const Form = {
  add: (ui, title) => {
    return `const ${title} = ${ui}.createForm({
      	title: ${title},
 	});`;
  },
};

console.log(Form.add("ui", "this is the title"));
