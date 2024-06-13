import { useState } from "react";
import "./styles.css";
import "./input.css";

const style = {
  button: "bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded",
  buttonRed: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded",
  input:
    "border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  highlightTableRow: "bg-green-400",
};

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
      <button onClick={addNewRow} className={style.button}>
        Add new row
      </button>
      <div>
        <button
          onClick={goBack}
          disabled={historyPoint > 0 ? false : true}
          className={style.button}
        >
          Back
        </button>
        <button
          onClick={goForward}
          disabled={historyPoint < history.length - 1 ? false : true}
          className={style.button}
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
    <div className={isBestRow ? style.highlightTableRow : ""}>
      <span>
        <input
          type="number"
          value={price ? price : ""}
          onChange={(e) => handleInputChange(index, priceKey, e.target.value)}
          className={style.input}
        />
      </span>
      <span>
        <input
          type="number"
          value={unit ? unit : ""}
          onChange={(e) => handleInputChange(index, unitKey, e.target.value)}
          className={style.input}
        />
      </span>
      <span>
        <input
          type="number"
          placeholder={rate}
          disabled
          className={style.input}
        />
      </span>
      <button
        onClick={() => {
          removeRow(index);
        }}
        className={style.buttonRed}
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
