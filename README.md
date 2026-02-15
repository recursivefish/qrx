> 🏗️ Work in progress

# QRx - vibe coding with qr codes

![251031](https://github.com/user-attachments/assets/a3aeac2e-698e-425d-8d0e-613f2f6e371e)

**permeating the ruliad is a bubbling matrix of 1s and 0s, the dataverse's analogue of the universe's the quantum foam**

everything that can digitally exist has always existed. this document describes two approaches for hyperstitioning the dataverse:
1. using recursive data uri's to spontaneously generate "**boltzmann websites**"
2. mapping hyperlink #hashes to localstorage allowing for the emergence of self generating generative links

to help align your dataversal demiurges this document also explores the teleology of hypertext including:
1. shepherding streams of consciousness into streams of tokens
2. digital transmigration through the inverse: shepherding streams of tokens into streams of consciousness

for convenience this repository also contains prebaked dataverses and other resources:
1. [qrx.world](https://qrx.world) - a qr code driven 1995 simulated mesh network
2. [r/QRCoding](https://reddit.com/r/qrcoding) - a subreddit for research, memes, and discussions

---

# Kernel 26.02.15 (index.html)

![kernel](./public/index.qr.png)

# Core flags
The above Kernel exposes the following URL `?query` params

| Flag | Description |
| :--- | :--- |
| **`a`** | **Append Mode**. If `1`, subsequent commands append to the accumulator. If `0` (default), they overwrite it. |
| **`f`** | **File Pointer**. Sets the target filename (`filename`) for subsequent write (`w`) operations. |
| **`c`** | **Context**. Loads data (from DB or `src`) into a side-buffer for the AI, without affecting the main accumulator. `0` clears it. |
| **`k, m, s, h`** | **AI Config**. Sets the API Key (`k`), Model (`m`), System Prompt (`s`), or Host (`h`) in `localStorage`. |
| **`e`** | **Echo**. Pushes the raw value directly into the accumulator (hardcoded strings/HTML). |
| **`r`** | **Read**. Reads a file from the database (or `src` for source code) into the accumulator. |
| **`u`** | **URL**. Fetches text from a remote URL and puts it into the accumulator. |
| **`p`** | **Prompt**. Sends the current context + accumulator + value to the LLM. The result becomes the new accumulator. |
| **`w`** | **Write**. Saves the current accumulator content to the database under the name defined by `f`. |
| **`x`** | **Execute**. Runs the value (or the current accumulator if value is empty) as JavaScript. |

# Globals
The kernel exposes the following variables and methods

## Variables
| Variable | Description |
| :--- | :--- |
| **`filename`** | **File Pointer**. The name of the current record being read from or written to. Defaults to `MAIN` or the value before `?` in the hash. |
| **`DB`** | **Database Name**. The name of the active IndexedDB instance, derived from the URL path (e.g., `/private` sets `DB` to `'private'`). |
| **`MAIN`** | **Kernel Name**. The default database name (`'main'`). Used as the fallback/system database when `DB` is set to something else. |
| **`os`** | **System DB Handle**. A reference to the `MAIN` database connection. Used for "inheritance"—if a file isn't found in `DB`, `read()` looks here. |
| **`db`** | **Active DB Handle**. The raw `IDBDatabase` connection object for the current `DB`. |
| **`FILES`** | **Table Name**. The hardcoded name of the object store (`'files'`) within the IndexedDB where all records are saved. |

## Methods
| Method | Description |
| :--- | :--- |
| **`read(k, [d])`** | **Async Read**. Returns the content of file `k`. Checks the current database first, then falls back to the `os` database if the file exists there. |
| **`write(v, [k])`** | **Async Write**. Saves value `v` to file `k`. If `k` is omitted, it defaults to the current `filename` pointer. |
| **`hydrate(h)`** | **Render**. Injects HTML string `h` into the main DOM (`<main id=A>`) and recursively executes any embedded `<script>` tags. |
| **`gen(ctx, p)`** | **Vibe Code**. Sends the context buffer `ctx` and prompt `p` to the configured LLM API and returns the generated text. |
| **`keys([q], [d])`** | **List Files**. Returns an array of all keys (filenames) in the database. `q` is an optional `IDBKeyRange`. |
| **`getDB([n])`** | **Database Access**. Returns the IndexedDB instance for name `n`. Defaults to the current active database. |
| **`run()`** | **Re-Run Tape**. Manually triggers the URL parsing loop. Useful if hash state changes programmatically without a reload. |
