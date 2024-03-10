import { useState } from 'react';
import './App.css';

const baseUrl = 'http://localhost:3000';

const App = () => {
  const [fileName, setFileName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileExtension, setFileExtension] = useState<string>('txt');
  const [resultNonBlockingIo, setResultNonBlockingIo] = useState<string>('');
  const [resultBlockingIo, setResultBlockingIo] = useState<string>('');

  const handleNonBlockingIoFsWrite = async (): Promise<void> => {
    console.log('handleNonBlockingIoFsWrite', fileName, fileExtension, content);

    try {
      const response = await fetch(`${baseUrl}/non-blocking-io/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResultNonBlockingIo('File created');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleNonBlockingIoFsRead = async (): Promise<void> => {
    console.log('handleNonBlockingIoFsRead', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/non-blocking-io/file${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResultNonBlockingIo(data.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleNonBlockingIoFsAppend = async (): Promise<void> => {
    console.log(
      'handleNonBlockingIoFsAppend',
      fileName,
      fileExtension,
      content
    );

    try {
      const response = await fetch(`${baseUrl}/non-blocking-io/append-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResultNonBlockingIo('Content appended');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleNonBlockingIoFsGetINode = async (): Promise<void> => {
    console.log('handleNonBlockingIoFsGetINode', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/non-blocking-io/inode${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResultNonBlockingIo(data.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleBlockingIoFsWrite = async (): Promise<void> => {
    console.log('handleBlockingIoFsWrite', fileName, fileExtension, content);

    try {
      const response = await fetch(`${baseUrl}/blocking-io/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResultBlockingIo('File created');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleBlockingIoFsRead = async (): Promise<void> => {
    console.log('handleBlockingIoFsRead', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/blocking-io/file${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResultBlockingIo(data.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleBlockingIoFsAppend = async (): Promise<void> => {
    console.log('handleBlockingIoFsAppend', fileName, fileExtension, content);

    try {
      const response = await fetch(`${baseUrl}/blocking-io/append-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileExtension, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResultBlockingIo('Content appended');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleBlockingIoFsGetINode = async (): Promise<void> => {
    console.log('handleBlockingIoFsGetINode', fileName, fileExtension);
    const query = `?fileName=${fileName}&fileExtension=${fileExtension}`;

    try {
      const response = await fetch(`${baseUrl}/blocking-io/inode${query}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResultBlockingIo(data.result);
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
      <h2>Non Blocking IO</h2>
      <button onClick={handleNonBlockingIoFsWrite}>Create</button>
      <button onClick={handleNonBlockingIoFsRead}>Read Content</button>
      <button onClick={handleNonBlockingIoFsAppend}>Append Content</button>
      <button onClick={handleNonBlockingIoFsGetINode}>Read Inode</button>
      <div>Result: {resultNonBlockingIo}</div>

      <h2>Blocking IO</h2>
      <button onClick={handleBlockingIoFsWrite}>Create</button>
      <button onClick={handleBlockingIoFsRead}>Read Content</button>
      <button onClick={handleBlockingIoFsAppend}>Append Content</button>
      <button onClick={handleBlockingIoFsGetINode}>Read Inode</button>
      <div>Result: {resultBlockingIo}</div>
    </div>
  );
};

export default App;
