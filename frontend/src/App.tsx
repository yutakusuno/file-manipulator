import { useState } from 'react';
import './App.css';

const baseUrl = 'http://localhost:3000';

const App = () => {
  const [fileName, setFileName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileExtension, setFileExtension] = useState<string>('txt');
  const [result, setResult] = useState<string>('');

  const handleFsWrite = async (): Promise<void> => {
    console.log('handleFsWrite', fileName, fileExtension, content);

    try {
      const response = await fetch(`${baseUrl}/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResult('File created');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleFsRead = async (): Promise<void> => {
    console.log('handleFsRead', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/file${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleFsAppend = async (): Promise<void> => {
    console.log('handleFsAppend', fileName, fileExtension, content);

    try {
      const response = await fetch(`${baseUrl}/append-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResult('Content appended');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleFsGetINode = async (): Promise<void> => {
    console.log('handleFsGetINode', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/inode${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div>
      <input
        type='text'
        placeholder='File Name'
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <select
        name='file-extension'
        id='file-extension'
        onChange={(e) => setFileExtension(e.target.value)}
      >
        <option value='txt'>txt</option>
        <option value='json'>json</option>
        <option value='md'>md</option>
      </select>
      <br />
      <textarea
        placeholder='Content'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={handleFsWrite}>Create </button>
      <button onClick={handleFsRead}>Read Content</button>
      <button onClick={handleFsAppend}>Append Content</button>
      <button onClick={handleFsGetINode}>Read Inode</button>
      <div>Result: {result}</div>
    </div>
  );
};

export default App;
