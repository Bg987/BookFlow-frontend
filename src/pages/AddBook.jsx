import React from "react";
import AddBookForm from "../components/BookForm";

const AddBook = ({  isbn,handleBookAdded }) => {
  return (
    <div>
      <AddBookForm
        initialIsbn={isbn}
        handleBookAdded= {handleBookAdded}
      />
    </div>
  );
};

export default AddBook;
