import { z } from "zod"

/** Bigger files freeze the page */
const MAX_FILE_MB = 5
const BYTES_PER_MB = 1024 * 1024
const MAX_FILE_BYTES = MAX_FILE_MB * BYTES_PER_MB

export const CsvFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_BYTES, `File is too big (max ${MAX_FILE_MB} MB)`)

// File or sample cant be empty
export const CsvTextSchema = z.string().trim().min(1, "File is empty")

// Pasted text can be empty (cleared textarea), same size limit as files
export const PastedTextSchema = z.string().max(MAX_FILE_BYTES, `Pasted text is too big (max ${MAX_FILE_MB} MB)`)
