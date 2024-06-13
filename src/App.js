import { useState } from "react";
import "./styles.css";
import "./input.css";

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

  const [history, setHistory] = useState([initialTableRows]);
  const [historyPoint, setHistoryPoint] = useState(0);
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

    if (value && historyPoint < history.length - 1) {
      const newHistory = [...history.slice(0, historyPoint + 1), tableRowsCopy];
      setHistoryPoint(historyPoint + 1);
      setHistory(newHistory);
    } else if (value) {
      setHistoryPoint(historyPoint + 1);
      setHistory([...history, tableRowsCopy]);
    }
  };

  const addNewRow = () => setTableRows([...tableRows, addEmptyRow()]);

  const removeRow = (rowIndex) =>
    setTableRows(tableRows.filter((row, index) => index != rowIndex));

  const goBack = () => {
    //console.log("goBack", history);
    const prevHistoryPoint = historyPoint - 1;
    setHistoryPoint(prevHistoryPoint);
    setTableRows(history[prevHistoryPoint]);
  };

  const goForward = () => {
    //console.log("goForward", history);
    const nextHistoryPoint = historyPoint + 1;
    setHistoryPoint(nextHistoryPoint);
    setTableRows(history[nextHistoryPoint]);
  };

  console.log(history);

  return (
    <>
      {tableRows.map((row, index) => (
        <TableRow
          key={index}
          index={index}
          price={row.price}
          unit={row.unit}
          rate={row.rate}
          priceKey={inputKey.price}
          unitKey={inputKey.unit}
          bestRowIndex={bestRowIndex}
          handleInputChange={handleInputChange}
          removeRow={removeRow}
        />
      ))}
      <button onClick={addNewRow}>Add new row</button>
      <div>
        <button onClick={goBack} disabled={historyPoint > 0 ? false : true}>
          Back
        </button>
        <button
          onClick={goForward}
          disabled={historyPoint < history.length - 1 ? false : true}
        >
          Forward
        </button>
      </div>
    </>
  );
};

const TableRow = ({
  index,
  price,
  unit,
  rate,
  priceKey,
  unitKey,
  bestRowIndex,
  handleInputChange,
  removeRow,
}) => {
  const isBestRow = bestRowIndex === index;

  return (
    <div className={isBestRow ? "bestrow" : ""}>
      <span>
        <input
          type="number"
          value={price ? price : ""}
          onChange={(e) => handleInputChange(index, priceKey, e.target.value)}
        />
      </span>
      <span>
        <input
          type="number"
          value={unit ? unit : ""}
          onChange={(e) => handleInputChange(index, unitKey, e.target.value)}
        />
      </span>
      <span>
        <input type="number" placeholder={rate} disabled />
      </span>
      <button
        onClick={() => {
          removeRow(index);
        }}
      >
        Remove row
      </button>
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
