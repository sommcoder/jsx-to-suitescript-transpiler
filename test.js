/* <Form>
  <Sublist>
    <Field />
    <Field />
    <Field />
  </Sublist>
</Form> */

// _SS(type, {props: {}, children: [{}]}, key: "")

function Page() {
  return _SS("Form", {
    props: {},
    children: [
      _SS("Sublist", {
        props: {
          // examples:
          arguments: {
            varName: "",
            parentVar: "",
            pageVar: "",
          },
          methods: {
            // the other functions besides add
          },
          children: [
            _SS("Field", {
              props: {},
              children: [{}],
              key: "",
            }),
            _SS("Field", {
              props: {},
              children: [{}],
              key: "",
            }),
            _SS("Field", {
              props: {},
              children: [{}],
              key: "",
            }),
          ],
          key: "",
        },
      }),
    ],
  });
}

const _SS = {};
