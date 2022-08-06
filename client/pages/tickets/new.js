import React, { useState } from 'react';

function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const onBlurHandeler = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            // onBlur gets triggered when user clicks out of input field, we wanna format number to 2 decimals
            onBlur={onBlurHandeler}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default NewTicket;
