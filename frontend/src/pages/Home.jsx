import {useState, useEffect} from "react";
import api from "../api";
// import Note from "../components/Note";

import "../styles/Home.css"

function Home() {
    // const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // useEffect(() => {
    //     getNotes();
    // }, []);

    // const getNotes = () => {
    //     api
    //         .get(`/api/notes/`)
    //         .then((res) => res.data)
    //         .then((data) => {setNotes(data); console.log(data)})
    //         .catch((err) => alert(err))
    // }

    // const deleteNote = (id) => {
    //     api
    //         .delete(`/api/notes/delete/${id}/`)
    //         .then((res) => {
    //             if(res.status === 204){alert("Note Deleted");}
    //             else{alert("Failed to delete note");}
    //
    //             getNotes();
    //         })
    //         .catch((error) => {alert(error)});
    // }

    // const createNote = (e) => {
    //     e.preventDefault();
    //
    //     api
    //         .post(`/api/notes/`, {content, title})
    //         .then(res => {
    //             if(res.status === 201){alert("Note Created")}
    //             else{alert("Failed to create note");}
    //
    //             getNotes();
    //         })
    //         .catch((error) => {alert(error)});
    // }

    return (
        <p>azzzzzz</p>
    );
}

export default Home;