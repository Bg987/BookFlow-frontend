import React from "react";
import AddBookForm from "../components/BookForm";

const AddBook = ({  isbn}) => {
  return (
    <div>
      <AddBookForm
        initialIsbn={isbn}
      />
    </div>
  );
};

export default AddBook;
