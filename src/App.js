import { useEffect, useState } from "react";
import * as d3 from "d3";
import dataPath from "./nyc-rolling-sales-preproc.csv"
import BarChart from "./components/BarChart"
import Histogram from "./components/Histogram";
import "./App.css";
import Scatter from "./components/Scatter";

function App() {
  const [data, setData] = useState([]);
  const [currentColumn, setCurrentColumn] = useState("")
  const [currentX, setCurrentX] = useState("")
  const [currentY, setCurrentY] = useState("")
  const [xData, setXData] = useState([])
  const [yData, setYData] = useState([])
  const [xFlip, setXFlip] = useState(false)
  const [yFlip, setYFlip] = useState(false)
  const [toAxis, setToAxis] = useState("")

  const categorical = new Set(["BOROUGH", "NEIGHBORHOOD", "TAX CLASS AT PRESENT", "BLOCK", "BUILDING CLASS AT PRESENT", "ZIP CODE", "YEAR BUILT", "TAX CLASS AT TIME OF SALE", "BUILDING CLASS AT TIME OF SALE", "SALE DATE"])

  useEffect(() => {
    // Load data
    d3.csv(dataPath)
      .then(data => {setData(data)});
  }, [])

  const handleRadioChange = (e) => {
    setToAxis("");

    let col = data.map((x) => x[currentColumn]);

    let counts = {};
    for (const element of col) {
      counts[element] = counts[element] ? counts[element] + 1 : 1;
    }

    let formatted = [];
    for (const [key, value] of Object.entries(counts)) {
      formatted.push({"category": key, "value": value})
    }

    if (categorical.has(currentColumn)) {
      console.log(formatted)
      formatted.sort((a, b) => a.category.localeCompare(b.category))
      formatted["type"] = "cat"
      console.log(formatted)
    } else {
      formatted = col
      formatted = formatted.map(Number)
      formatted["type"] = "num"
    }

    formatted["raw"] = col
    formatted["title"] = currentColumn

    if (e.target.value === "x-axis") {
      setCurrentX(currentColumn)
      setXData(formatted)
    } else {
      setCurrentY(currentColumn)
      setYData(formatted)
    }
    setCurrentColumn("")
  }

  const handleReset = (e) => {
    if (e.target.id === "XReset") {
      setCurrentX("")
      setXData([])
    } else {
      setCurrentY("")
      setYData([])
    }
  }

  const handleFlip = (e) => {
    if (e.target.id === "XFlip") {
      setXFlip(!xFlip)
    } else {
      setYFlip(!yFlip)
    }
  }

  const handleSwitch = () => {
    let temp = yData
    setYData(xData)
    setCurrentY(xData.title)
    setXData(temp)
    setCurrentX(temp.title)
  }

  return (
    <div className="grid-container">
      <div className="grid-item" id="menu">
        <div className="menu-row1">NYC Property Sales Dataset</div>
        <div className="menu-row2">
          <span>Select a variable: </span>
          <select value={currentColumn} onChange={(e) => setCurrentColumn(e.target.value)}>
            <option></option>
            {data.columns && data.columns.map((col) => <option key={col}>{col}</option>)}
          </select>
          {currentColumn &&
          <>
            <div>Assign to which axis?</div>
            <form className="radio-group">
              <div className="radio">
                <label>
                  x-axis
                </label>
                <input type="radio" value="x-axis" checked={toAxis === "x-axis"} onChange={handleRadioChange}/>
              </div>
              <div className="radio">
                <label>
                  y-axis
                </label>
                <input type="radio" value="y-axis" checked={toAxis === "y-axis"} onChange={handleRadioChange}/>
              </div>
            </form>
          </>
          }
        </div>
        <div className="menu-row3">
          <div className="menu-row3-col">
            <div className="menu-row3-col-row">Selected x-axis variable:</div>
            <div className="menu-row3-col-row">{currentX ? currentX : "None"}</div>
            <div className="menu-row3-col-row">
              <button onClick={handleFlip} id="XFlip">Flip Chart</button>
              <button onClick={handleReset} id="XReset">Reset</button>
            </div>
          </div>
          <div className="menu-row3-col">
            <button id="Switch" onClick={handleSwitch}>Switch Variables</button>
          </div>
          <div className="menu-row3-col">
            <div className="menu-row3-col-row">Selected y-axis variable:</div>
            <div className="menu-row3-col-row">{currentY ? currentY : "None"}</div>
            <div className="menu-row3-col-row">
              <button onClick={handleFlip} id="YFlip">Flip Chart</button>
              <button onClick={handleReset} id="YReset">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-item">
        <Scatter dataX={xData} dataY={yData} width={900} height={450}></Scatter>
      </div>
      <div className="grid-item" id="bottom-left">
        {xData.type === "cat" ? 
          <BarChart data={xData} width={900} height={450} title={xData.title} flip={xFlip}></BarChart> : 
          <Histogram data={xData} width={900} height={450} title={xData.title} flip={xFlip}></Histogram>
        }
      </div>
      <div className="grid-item" id="bottom-right">
        {yData.type === "cat" ? 
          <BarChart data={yData} width={900} height={450} title={yData.title} flip={yFlip}></BarChart> : 
          <Histogram data={yData} width={900} height={450} title={yData.title} flip={yFlip}></Histogram>
        }
      </div>
    </div>
  );
}

export default App;
