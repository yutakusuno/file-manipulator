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
app.post('/file', async (req, res) => {
  const { fileName, fileExtension, content } = req.body;
  const dirPath = './tmp';

  try {
    const dir = new URL(dirPath, import.meta.url);
    await mkdir(dir, { recursive: true });

    const abortController = new AbortController();
    await writeFile(`${dirPath}/${fileName}.${fileExtension}`, content, {
      signal: abortController.signal,
    });
    const contents = await readFile(`${dirPath}/${fileName}.${fileExtension}`, {
      signal: abortController.signal,
    });

    abortController.abort();

    res.json({ result: contents.toString() });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
