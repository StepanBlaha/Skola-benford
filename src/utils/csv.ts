const DELIMITERS = [",", ";", "\t"]

// Split CSV text into rows and cells
// Quoted cells can contain the delimiter, but not line breaks
export function parseCsv(text: string) {
  const lines = text.split("\n").filter((line) => line.trim() !== "")
  const delimiter = detectDelimiter(lines[0] ?? "")
  return lines.map((line) => splitLine(line, delimiter))
}

// Pick delimiter that gives most cells in the header (czech CSV uses ; because of decimal comma)
export function detectDelimiter(header: string) {
  let best = DELIMITERS[0]
  for (const delimiter of DELIMITERS) {
    if (splitLine(header, delimiter).length > splitLine(header, best).length) best = delimiter
  }
  return best
}

// Split one line, delimiter inside quotes is ignored
function splitLine(line: string, delimiter: string) {
  const cells: string[] = []
  let cell = ""
  let quoted = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (quoted && char === '"' && line[i + 1] === '"') {
      // "" inside quotes means one "
      cell += '"'
      i++
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === delimiter && !quoted) {
      cells.push(cell.trim())
      cell = ""
    } else {
      cell += char
    }
  }

  cells.push(cell.trim())
  return cells
}
