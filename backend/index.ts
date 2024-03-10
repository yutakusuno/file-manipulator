import express from 'express';
import cors from 'cors';
import { writeFile, readFile, mkdir } from 'node:fs/promises';

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
app.post('/file', async (req, res) => {
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
app.get('/file', async (req, res) => {
  const { fileName, fileExtension } = req.query;
  const dirPath = './tmp';
  const filePath = `${dirPath}/${fileName}.${fileExtension}`;
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
