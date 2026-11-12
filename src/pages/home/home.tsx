import { useState } from "react";
import styles from "./home.module.css";


const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]


/*
  Benforduv zakon

  Ocekavana pravdepodobnost, ze cislo zacina cislici d (1 az 9):

  P(d) = log10(1 + 1/d)

  d - prvni cislice cisla (1-9)
  P(d) - pravdepodobnost, ze nahodne vybrane cislo z dat zacina cislem d
  log10 - na kolikatou musim umocnit 10, abych dostal tohle cislo

  Napr. 
  P(1) = log10(2) = 0.301 -> 30.1%
  P(9) = log10(10/9) = 0.046 -> 4.6%

  Proc zrovna logaritmus:
  Kdyz data rostou nasobenim (populace, ceny, ucty...), jsou rovnomerne rozlozena na logaritmicke ose. Cislo zacina cislici d, kdyz lezi mezi d a d+1 (krat nejaka mocnina 10).
  Na logaritmicke ose ma ten usek delku log10(d + 1) - log10(d) = log10((d + 1) / d) = log10(1 + 1/d).
  Usek od 1 do 2 je tak mnohem delsi nez od 9 do 10, proto jednicek je nejvic.

  Soucet P(1) + ... + P(9) = log10(2/1 * 3/2 * ... * 10/9) = log10(10) = 1
*/

// Count benford
function benford(d: number) {
  return Math.log10(1 + 1 / d)
}


// Split CSV text into rows and cells
// Doesnt handle quoted cells with the delimiter inside, use ; as delimiter for those
function parseCsv(text: string) {
  // Czech CSV uses ; (because of decimal comma), otherwise ,
  const delimiter = text.includes(";") ? ";" : ","
  const rows: string[][] = []

  // Go through the text line by line, skip empty lines and split by our defined delimeter
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue
    rows.push(line.split(delimiter).map(cell => cell.replaceAll('"', "").trim()))
  }

  return rows
}

// Get first digit of a number (1-9), or null if the cell is not a number
function firstDigit(cell: string) {
  const value = Number(cell.replaceAll(" ", "").replace(",", "."))
  if (isNaN(value) || value === 0) return null

  // First character from 1 to 9, skips "-", "0" and "." (0.0045 -> 4)
  for (const char of cell) {
    if (char >= "1" && char <= "9") return Number(char)
  }
  return null
}


export default function Home() {

  // Text of the CSV (from upload, sample or paste)
  const [csvText, setCsvText] = useState<string>("")
  // Column selected by user - automatic if not picked
  const [column, setColumn] = useState<number | null>(null)

  // Error message shown under the textarea
  const [error, setError] = useState<string>("")

  // Parse the CSV text into rows and cells
  const rows = parseCsv(csvText)
  const header = rows[0] ?? []

  // Count how many numbers are in each column, pick the one with most by default
  const numbersInColumn = header.map((_, i) =>
    // Keep only rows where cell i is a number and count them
    rows.filter(row => firstDigit(row[i] ?? "") !== null).length
  )

  // lastIndexOf because the value column is usually last (country,year,value)
  const bestColumn = numbersInColumn.lastIndexOf(Math.max(...numbersInColumn))
  // Use the column picked by user, if there is none use the best one
  const selected = column ?? bestColumn

  // Count first digits in the selected column
  const counts = DIGITS.map(() => 0)
  for (const row of rows) {
    // Get first digit of the cell in selected column
    const digit = firstDigit(row[selected] ?? "")
    if (digit !== null) counts[digit - 1]++
  }
  // Add all counts together = how many numbers we counted
  const total = counts.reduce((sum, count) => sum + count, 0)

  // Observed share of each digit = count / total
  const observed = counts.map(count => total ? count / total : 0)
  // Expected share from Benford's law for digits 1-9
  const expected = DIGITS.map(benford)
  // Highest bar is 100 % of the chart height
  const max = Math.max(...observed, ...expected)


  // Set new CSV text and reset column and error
  function loadText(text: string) {
    setCsvText(text)
    setColumn(null)
    setError("")
  }

  // Read uploaded file
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Read the file as text and load it
    loadText(await file.text())
  }

  // Load sample dataset from public folder
  async function loadSample() {
    // BASE_URL so it works also on the deployed version
    const res = await fetch(import.meta.env.BASE_URL + "sample.csv")
    // Request failed (e.g. file not found)
    if (!res.ok) {
      setError("Could not load sample")
      return
    }
    // Read the response as text and load it
    loadText(await res.text())
  }


  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Benford's law</h1>
        <p className={styles.subtitle}>
          Upload or paste a CSV and see how often each first digit appears
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Data</h2>
          <div className={styles.inputs}>
            <label className={styles.button}>
              Upload CSV
              <input type="file" accept=".csv,text/csv,text/plain" onChange={uploadFile} hidden />
            </label>
            <button className={styles.button} type="button" onClick={() => loadSample()}>
              Load sample
            </button>
          </div>
        </div>

        <textarea
          className={styles.textarea}
          placeholder={"or paste CSV here\n\ncountry;population\nCzechia;10900555"}
          value={csvText}
          onChange={(e) => loadText(e.target.value)}
        />

        {(header.length > 1 || total > 0) &&
          <div className={styles.cardFooter}>
            {header.length > 1 &&
              <label className={styles.select}>
                Column
                <select value={selected} onChange={(e) => setColumn(Number(e.target.value))}>
                  {header.map((name, i) =>
                    <option key={i} value={i}>{name || `Column ${i + 1}`}</option>
                  )}
                </select>
              </label>
            }
            <span className={styles.total}>Numbers counted: <strong>{total}</strong></span>
          </div>
        }

        {error && <p className={styles.error}>{error}</p>}
        {csvText && total === 0 && <p className={styles.error}>No numbers found in this column</p>}
      </section>

      {total > 0 &&
        <>
          <div className={styles.legend}>
            <span><i className={styles.legendBar} /> Your data</span>
            <span><i className={styles.legendLine} /> Benford's law</span>
          </div>

          <section className={styles.card}>
            <h2>Chart</h2>

            <div className={styles.chart}>
              {DIGITS.map((digit, i) =>
                <div key={digit} className={styles.column}>
                  <span className={styles.value}>{(observed[i] * 100).toFixed(1)}%</span>
                  <div className={styles.barArea}>
                    {/* Bar height in % of the chart, highest value = 100 % */}
                    <div className={styles.bar} style={{ height: `${observed[i] / max * 100}%` }} />
                    {/* Dashed line at the height of the Benford value */}
                    <div className={styles.expected} style={{ bottom: `${expected[i] / max * 100}%` }} />
                  </div>
                  <span className={styles.digit}>{digit}</span>
                </div>
              )}
            </div>
          </section>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Digit</th>
                <th>Count</th>
                <th>Data</th>
                <th>Benford</th>
              </tr>
            </thead>
            <tbody>
              {DIGITS.map((digit, i) =>
                <tr key={digit}>
                  <td>{digit}</td>
                  <td>{counts[i]}</td>
                  <td>{(observed[i] * 100).toFixed(1)}%</td>
                  <td>{(expected[i] * 100).toFixed(1)}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      }
    </div>
  );
}
