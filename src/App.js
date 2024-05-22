import logo from './logo.svg';
import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data.js"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase.js"



export default function App() {
  const [notes, setNotes] = React.useState([]);//loading app with saved data on local storage
  const [currentNoteId, setCurrentNoteId] = React.useState("");

  const currentNote = notes.find(note => {
    //holds selected note id
    return note.id === currentNoteId
  }) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
  const [tempNoteText, setTempNoteText] = React.useState("");

  React.useEffect(() => {
    // sets up temporary note tracking for monitoring and avoiding debouncing affect
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote]);

  React.useEffect(() => {
    // sets a current selected note as first note by default
    if (!currentNoteId) {
      setCurrentNoteId(notes[0] && notes[0].id)
    }

  }, [])

  React.useEffect(() => {
    // Avoiding debouncing effect by delaying update request to firebase Firestore cloud
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }

    }, 5000);

    return () => clearTimeout(timeoutId)
  }, [tempNoteText])

  React.useEffect(() => {
    // setting firebase for storage //read operation
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      // Sync up our local notes array with the snapshot data
      const newArray = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      });
      console.log(newArray);
      setNotes(newArray);
    })
    return unsubscribe;//release function
  }, [])

  async function createNewNote() {
    //creates a new note and adds to fireStore cloud
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id)
  }

  async function updateNote(text) {
    // udates notes in firebase firestore cloud
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
  }

  async function deleteNote(noteId) {
    //deletes notes in firebase firestore cloud and reflects in application
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }
  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={sortedNotes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {

              <Editor
                currentNote={tempNoteText}
                updateNote={setTempNoteText}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
