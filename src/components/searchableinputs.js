import React, { useEffect, useState } from 'react';

const SearchableInput = ({onValueChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const options = [
    { pid: 1, option: 'Plywood', hsnCode: '4412', unit: 'Square Foot' },
    { pid: 2, option: 'Laminate', hsnCode: '4823', unit: 'Sheet' },
    { pid: 3, option: 'Adhesive', hsnCode: '3506', unit: 'Pouch' },
    { pid: 4, option: 'Adhesive ', hsnCode: '3506', unit: 'Box' },
    { pid: 5, option: 'M.D.F.', hsnCode: '9403', unit: 'Square Foot' },
    { pid: 6, option: 'Tape', hsnCode: '4811', unit: 'Piece' },
    { pid: 7, option: 'Tape Bundle', hsnCode: '4811', unit: 'Bundle' },
    { pid: 8, option: 'Cement Sheet', hsnCode: '6811', unit: 'Square Foot' },
    { pid: 9, option: 'Acrylic', hsnCode: '3920', unit: 'Square Foot' },
    { pid: 10, option: 'Wood', hsnCode: '4407', unit: 'Piece' },
    { pid: 11, option: 'P.S. Sheet', hsnCode: '3920', unit: 'Sheet' },
    { pid: 12, option: 'A.C.P. Sheet', hsnCode: '7606', unit: 'Sheet' },
    { pid: 13, option: 'Flush Door', hsnCode: '4418', unit: 'Sheet' },
    { pid: 14, option: 'Masking Tape', hsnCode: '4811', unit: 'Roll' },
    { pid: 15, option: 'PVC P', hsnCode: '3921', unit: 'Sheet' },
    { pid: 16, option: 'Particle Board', hsnCode: '4410', unit: 'Sheet' },
    { pid: 17, option: 'Termiguard', hsnCode: '3808', unit: 'Bundle' },
  ];
  
  // useEffect(() => {
  //   onValueChange(searchTerm);
  // }, [searchTerm, onValueChange]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);  
    const selectedOption = options.find((option) => option.option === event.target.value);
    onValueChange(selectedOption);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        list="products"
      />
      <datalist id="products">
        {options.map((item) => (
          <option key={item.pid} value={`${item.option}`} >{item.unit} - {item.hsnCode}</option>
        ))}
      </datalist>
    </div>
  );
};

export default SearchableInput;
