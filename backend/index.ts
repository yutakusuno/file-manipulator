import express from 'express';
import cors from 'cors';
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  appendFileSync,
  statSync,
} from 'node:fs';
import { appendFile, writeFile, readFile, mkdir, stat } from 'node:fs/promises';

const PORT = 3000;
const whiteList = ['http://localhost:5173'];
const corsOptions = { origin: whiteList, methods: ['POST'] };

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// NOTE: Basically file I/O is sequential
// https://stackoverflow.com/questions/77420271/does-fs-writefile-perform-sequential-or-random-io
//
// fs: https://nodejs.org/api/fs.html
// Memory leak countermeasure with AbortController: https://nodejs.org/api/globals.html
// import.meta: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta

// Create a file
app.post('/non-blocking-io/file', async (req, res) => {
  console.log('non-blocking-io/file', req.body);

  const { fileName, fileExtension, content } = req.body;
  const dirPath = './tmp';
  const filePath = `${dirPath}/${fileName}.${fileExtension}`;
  const dir = new URL(dirPath, import.meta.url);
  const abortController = new AbortController();

  try {
    await mkdir(dir, { recursive: true });

    await writeFile(filePath, content, {
      signal: abortController.signal,
    });

    abortController.abort();

    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Read a file
app.get('/non-blocking-io/file', async (req, res) => {
  console.log('non-blocking-io/file', req.query);

  const { fileName, fileExtension } = req.query;
  const filePath = `./tmp/${fileName}.${fileExtension}`;
  const abortController = new AbortController();

  try {
    const contents = await readFile(filePath, {
      signal: abortController.signal,
    });

    abortController.abort();

    res.status(200).json({ result: contents.toString() });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
  res.status(200).json({ result: 'File read' });
});

// Get the inode of a file
app.get('/non-blocking-io/inode', async (req, res) => {
  console.log('non-blocking-io/inode', req.query);

  const { fileName, fileExtension } = req.query;
  const filePath = `./tmp/${fileName}.${fileExtension}`;

  try {
    const info = await stat(filePath);
    console.log('inode-info', info);

    res.status(200).json({ result: info.ino });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Append content to a file
app.post('/non-blocking-io/append-file', async (req, res) => {
  console.log('non-blocking-io/append-file', req.body);

  const { fileName, fileExtension, content } = req.body;
  const filePath = `./tmp/${fileName}.${fileExtension}`;

  try {
    await appendFile(filePath, content);

    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Create a file with blocking I/O
app.post('/blocking-io/file', (req, res) => {
  console.log('blocking-io/file', req.body);

  const { fileName, fileExtension, content } = req.body;
  const dirPath = './tmp2';
  const filePath = `${dirPath}/${fileName}.${fileExtension}`;
  const dir = new URL(dirPath, import.meta.url);

  try {
    mkdirSync(dir, { recursive: true });

    writeFileSync(filePath, content);
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Read a file with blocking I/O
app.get('/blocking-io/file', (req, res) => {
  console.log('blocking-io/file', req.query);

  const { fileName, fileExtension } = req.query;
  const filePath = `./tmp2/${fileName}.${fileExtension}`;

  try {
    const data = readFileSync(filePath);
    res.status(200).json({ result: data.toString() });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Append content to a file with blocking I/O
app.post('/blocking-io/append-file', (req, res) => {
  console.log('blocking-io/append-file', req.body);

  const { fileName, fileExtension, content } = req.body;
  const filePath = `./tmp2/${fileName}.${fileExtension}`;

  try {
    appendFileSync(filePath, content);
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get the inode of a file with blocking I/O
app.get('/blocking-io/inode', (req, res) => {
  console.log('blocking-io/inode', req.query);

  const { fileName, fileExtension } = req.query;
  const filePath = `./tmp2/${fileName}.${fileExtension}`;

  try {
    const info = statSync(filePath);
    console.log('inode-info', info);

    res.status(200).json({ result: info.ino });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
