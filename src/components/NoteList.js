import React, { useState, useEffect } from "react";
import axios from "axios";
import delete_icon from "./delete.svg";
import diskette from "./diskette.png";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    body: "",
  });
  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("https://notes-app-backend-php.herokuapp.com/api/notes");
        if (Array.isArray(response.data.data)) {
          setNotes(response.data.data);
        } else {
          console.error("Invalid API response format. Expected an array.");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);



  const handleStatusChange = async (noteId, event) => {
    const updatedStatus = event.target.checked ? 1 : 0;
    const updatedNote = notes.find((note) => note.id === noteId);
    updatedNote.status = updatedStatus;
  
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, status: updatedStatus } : note
      )
    );
  
    try {
      await axios.put(`https://notes-app-backend-php.herokuapp.com/api/notes/${noteId}`, updatedNote);
    } catch (error) {
      console.error("Error updating note status:", error);
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, status: 1 - updatedStatus } : note
        )
      );
    }
  };
  


  const handleCreate = async () => {
    const response = await axios.post("https://notes-app-backend-php.herokuapp.com/api/notes", {
      ...newNote,
      status: 0,
    });
    setNotes([...notes, response.data.data]);
    setNewNote({ title: "", body: "" });
  };
  



  const handleEdit = async (noteId, key, newValue) => {
    await axios.put(`https://notes-app-backend-php.herokuapp.com/api/notes/${noteId}`, {
      [key]: newValue,
    });
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, [key]: newValue } : note)));
  };



  const handleDelete = async (noteId) => {
    await axios.delete(`https://notes-app-backend-php.herokuapp.com/api/notes/${noteId}`);
    setNotes(notes.filter((note) => note.id !== noteId));
  };



  const [editedNote, setEditedNote] = useState({});

  const handleInputChange = (noteId, key, value) => {
    setEditedNote((prevEditedNote) => ({
        ...prevEditedNote,
        id: noteId,
        [key]: value||'',
    }));
  };

  return (
    
    <div>
      <div class="container">
            <div class="app-title">
                <span>NOTES</span>
            </div>

            <div class="notes">
              
                <div class="note">
                    <div class="note-title">
                        <span>
                          <input
                            placeholder="New Title"
                            type="text"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                          />
                        </span>
                    </div>

                    <div class="note-body">
                      <textarea
                        rows="5"
                        placeholder="Type your notes here..."
                        value={newNote.body}
                        onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
                      />
                    </div>

                    <div class="note-action">
                      <button class="action-save" onClick={handleCreate}>
                        <img src={diskette} />
                      </button>
                    </div>
                </div>
              {notes.map((note) => (
                <div class="note" key={note.id}>
                    <div class="note-title">
                        <span>
                            <input
                            placeholder="Title"
                            type="text"
                            value={
                              editedNote.id === note.id &&
                              editedNote.title !== undefined && 
                              editedNote.title !== null
                                ? editedNote.title
                                : note.title || ""
                            }
                            onChange={(e) => handleInputChange(note.id, "title", e.target.value)}
                            onBlur={(e) => handleEdit(note.id, "title", e.target.value)}/>
                        </span>
                    </div>

                    <div class="note-body">
                        <textarea rows="5" placeholder="Type your notes here..." 
                        value={
                          editedNote.id === note.id &&
                          editedNote.body !== undefined &&
                          editedNote.body !== null 
                            ? editedNote.body
                            : note.body || ""
                        }
                        onChange={(e) => handleInputChange(note.id, "body", e.target.value)}
                        onBlur={(e) => handleEdit(note.id, "body", e.target.value)}></textarea>
                    </div>

                    <div class="note-action">
                        <button class="action-delete" onClick={() => handleDelete(note.id)}>
                          <img src={delete_icon}/>
                        </button>

                        <button class="action-status">
                          <input
                            type="checkbox"
                            class="regular-checkbox"
                            checked={note.status === 1}
                            onChange={(event) => handleStatusChange(note.id, event)}
                          />

                        </button>
                    </div>
                </div>
              ))}
            </div>
        </div>
    </div>
    
  );
};

export default NoteList;
