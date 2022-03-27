import { db } from '../db';
import React, { useState } from 'react';

import { Input } from '@chakra-ui/react'


export default function AddNote() {
  const [text, setText] = useState('A');
  const [tags, setTags] = useState(['Test']);
  const [status, setStatus] = useState('');

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.notes.add({
        text,
        tags,
      });

      setStatus(`Note ${id} successfully added.`);
      setText('');
      setTags([]);
    } catch (error) {
      setStatus(`Failed to add Note: ${error}`);
    }
  }

  return (
    <div>
      <div>
        <p>{status}</p>
        Text:
        <Input
          type="text"
          value={text}
          onChange={({target}) => setText(target.value)}
        />
      </div>

      <br />

      <div>
        Tags:
        <Input
          type="tags"
          value={tags.join(',')}
          onChange={({ target }) => setTags(target.value.split(','))}
        />
      </div>
      <br />

      <div>
        <button onClick={addFriend}>Add</button>
      </div>
    </div>
  );
}
