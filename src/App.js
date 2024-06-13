import { useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Table />
    </div>
  );
}

const Table = () => {
  const emptyRow = {
    price: undefined,
    unit: undefined,
    rate: undefined,
  };
  const addEmptyRow = () => ({ ...emptyRow });
  const initialTableRows = [addEmptyRow(), addEmptyRow()];
  const inputKey = { price: "price", unit: "unit" };

  const [tableRows, setTableRows] = useState(initialTableRows);
  const [bestRowIndex, setBestRowIndex] = useState();

  const handleInputChange = (rowIndex, inputKey, value) => {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));

    tableRowsCopy[rowIndex][inputKey] = value;

    tableRowsCopy[rowIndex].rate = getPriceToUnitRate(
      tableRowsCopy[rowIndex].price,
      tableRowsCopy[rowIndex].unit,
    );

    const bestPriceRowIndex = findBestPriceRowIndex(tableRowsCopy);

    setTableRows(tableRowsCopy);
    setBestRowIndex(bestPriceRowIndex);
  };

  return (
    <>
      {tableRows.map((row, index) => (
        <TableRow
          key={index}
          index={index}
          rate={row.rate}
          priceKey={inputKey.price}
          unitKey={inputKey.unit}
          bestRowIndex={bestRowIndex}
          handleInputChange={handleInputChange}
        />
      ))}
    </>
  );
};

const TableRow = ({
  index,
  rate,
  priceKey,
  unitKey,
  bestRowIndex,
  handleInputChange,
}) => {
  const isBestRow = bestRowIndex === index;

  return (
    <div className={isBestRow ? "bestrow" : ""}>
      <span>
        <input
          type="number"
          onChange={(e) => handleInputChange(index, priceKey, e.target.value)}
        />
      </span>
      <span>
        <input
          type="number"
          onChange={(e) => handleInputChange(index, unitKey, e.target.value)}
        />
      </span>
      <span>
        <input type="number" placeholder={rate} disabled />
      </span>
    </div>
  );
};

function getPriceToUnitRate(price, unit) {
  if (!price || !unit) return;
  return price / unit;
}

function findBestPriceRowIndex(tableRows) {
  let rows = tableRows
    .map((row, index) => ({ ...row, index: index }))
    .filter((row) => row.price && row.unit);
  if (!rows.length) return;
  rows = rows.map((row) => ({ ...row, rate: row.price / row.unit }));
  rows.sort((a, b) => a.rate - b.rate);
  return rows[0].index;
}
