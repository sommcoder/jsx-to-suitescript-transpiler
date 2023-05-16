// search props/bindings:
const filters = [
  ["item", "anyof", sublistItems],
  "AND",
  ["mainline", "is", "F"],
];
const settings = [
  {
    name: "consolidationtype",
    value: "AVERAGE",
  },
];
// const columns = ["entity", "subsidiary", "name", "currency"];

// columns is optional, as the dev could set up the Fields in the order they want, and value would get pushed to the columnsArr for SuiteScript calls, but is technically not needed here

// if you want a result.getValue() called on it, use the value prop, if you want result.getText(), use text prop.
// there CANNOT be both or multiple on the same component
// they all get populated and

const fieldsArr = [
  {
    label: "Entity",
    type: "text",
    column: "",
  },
  {
    label: "Subsidiary",
    type: "text",
    column: "",
  },
  {
    label: "Name",
    type: "text",
    column: "",
  },
  {
    label: "Currency",
    type: "number",
    column: "",
  },
];

// function search(fieldsArr, filters, settings) {
//   let array = [];

//   path.node;
//   /*
//   - filters and settings will just get added to the searchSyntax string
//   - but fieldsArr is what gets returned and iterated over
//   */

//   return fieldsArr;
// }

//////////////
// is this too narrow of a solution????
// what if the dev DOESN'T want to

<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      {search(fieldsArr, filters, settings).map(({ col, lab, typ }, i) => {
        <Field label={lab} type={typ} column={col} />;
      })}
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>;

/* 
        .map() is basically our .each() callback function, since map will iterated through each result in the ResultSet.

        we will also have access to the iteration variable inside .map() so that'll allow us to express plenty of logic here
        
        Could we just make value and text === column={}
        and then whether or not it is a .getValue() or .getText() would be inferred by the components type???

        The return just needs to be the components and.
        */

{
  /* <Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Search type="sales order" filters={filters} settings={settings}>
        {fieldArr.map(({ l, t, v }) => (
          <Field label={l} type={t} value={v} />
        ))}
      </Search>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>; */
}

//////////////////////////////////////////////////////

// if we do this technique, it's almost redundant to specify columns when the column that we need will be specified in the value prop of the respective component that we wish to populate that column value on

// because column EQUALS

// label and column name won't necessarily be same/similar. the column name is based on Records, whereas the label will be whatever is best for te user/client
/*
 
The search functionality here is basic because compared to a callback function, there are limitations on what we can and cannot express with just JSX syntax.

We do however have the ability to cut down on verbosity and produce simple search functionality in extremely simple syntax that is highly readable BUT we'll just never be able to express anything THAT complex within the Search component


1) we haven't even tested basic syntax with arr.map() for jsx
 
*/
