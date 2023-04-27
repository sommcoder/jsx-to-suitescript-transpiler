function Page() {
  // bindings inside scope:
  const fileId = "654321";
  const def = 123;
  const clr = () => {};
  return (
    <Form title="Customer" fileId={fileId}>
      <Tab label="Customer Number">
        <FieldGroup label="Customer Number">
          <Field label="Customer Number" type="integer" def={def} />
        </FieldGroup>
      </Tab>
      <Tab label="Customer Information">
        <Sublist label="item history">
          <Field label="Items Purchased" type="text" />
          <Field label="SO" type="text" />
          <Field label="Total Spend" type="text" />
          <Field label="Date Added" type="text" />
          <Field label="Customer" type="text" />
        </Sublist>
      </Tab>
      <Button label="Clear Button" fn={clr} />
    </Form>
  );
}

// _SS('Form', props, child, key)

//     function Page() {
//       // bindings inside scope:
//       const fileId = "654321";
//       const def = 123;
//       const clr = () => {};
//       return (
//         _SS('Form', {
//           props: {
//             title: "Customer",
//             fileId: fileId
//           },
//           children: {
//             add: _SS('Sublist', {
//                props: {
//                  title: "Customer",
//                   fileId: fileId
//           }, children: {
//                add: _SS('Field', {
//                   props: {
//                   title: "Customer",
//                   fileId: fileId
//           },

//         }
//     )

//   }
//             }
// )

//           }
// )
// )
// };

{
  /* <Form>
  <Sublist>
    <Field />
    <Field />
    <Field />
  </Sublist>
</Form> */
}

// _SS(type, {props: {}, children: [{}]}, key: "")

// function Page() {
//   return _SS("Form", {
//     props: {},
//     children: [
//       {
//         add: _SS("Sublist", {
//           props: {
//             // examples:
//             arguments: {
//               varName: "",
//               parentVar: "",
//               pageVar: "",
//             },
//             methods: {
//               // the other functions besides add
//             },
//           },
//           children: [
//             {
//               add: _SS("Field", {
//                 props: {},
//                 children: [{}],
//                 key: "",
//               }),
//               add: _SS("Field", {
//                 props: {},
//                 children: [{}],
//                 key: "",
//               }),
//               add: _SS("Field", {
//                 props: {},
//                 children: [{}],
//                 key: "",
//               }),
//             },
//           ],
//           key: "",
//         }),
//       },
//     ],
//   });
// }
