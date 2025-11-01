function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Hashpassword</th>
        <th>CreatedAt</th>
        <th>Remove</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  if (props.characterData === null) {
    return <caption>Data Unavailable</caption>;
  }
  const rows = props.characterData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.hashpassword}</td>
        <td>{row.createdAt}</td>
        <td>
          <button onClick={() => props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        characterData={props.characterData}
        removeCharacter={props.removeCharacter}
      />
    </table>
  );
}

export default Table;
