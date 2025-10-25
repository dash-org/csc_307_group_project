// src/Form.jsx
import React, { useState } from 'react';

function Form(props) {
  function handleChange(event) {
    const { name, value } = event.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  }

  function submitForm() {
    props.handleSubmit(person);
    setPerson({ name: '', email: '', createdAt: '' });
  }

  const [person, setPerson] = useState({
    name: '',
    email: '',
    createdAt: '',
  });

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        id="email"
        value={person.email}
        onChange={handleChange}
      />
      <label htmlFor="createdAt">CreatedAt</label>
      <input
        type="date"
        name="createdAt"
        id="createdAt"
        value={person.createdAt}
        onChange={handleChange}
      />
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

export default Form;
