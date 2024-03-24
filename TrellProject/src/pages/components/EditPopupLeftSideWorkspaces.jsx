import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as api from "../../api/api";


function EditPopupLeftSideWorkspaces({setPopUpStatus, workspaceId}) {
    const [newName, setNewName] = useState(""); // State to hold the new name input by the user
    const trelloAPI = new api.TrelloAPI();
    const navigate = useNavigate();

    // Function to handle name update
    const handleUpdateWorkspaceName = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await trelloAPI.updateWorkspace(workspaceId, newName);
            // Handle the response accordingly. This could include:
            // - showing a success message
            // - closing the popup
            // - etc.
        } catch (error) {
            console.error("Failed to update the board name:", error);
            // Here, handle the error (e.g., show an error message to the user)
        }
        //reload page
        window.location.reload();
    };


    return (

        <form onSubmit={handleUpdateWorkspaceName}>
            <div className="absolute bg-black opacity-85 h-screen w-screen inset-0 flex items-center justify-center">
                <div className="flex flex-col w-96 py-2 rounded-lg bg-white">
                    <div className="flex items-center justify-start">
                        <div className="flex-1 text-center">Name of the Workspace :</div>
                        <div className="flex rounded-md mr-2 w-5 ring-1 ring-offset-1 ring-black">
                            <button onClick={() => setPopUpStatus(false)}
                                    className="flex items-center justify-center w-full h-full">
                                X
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mb-2">
                        <input
                            className="flex-1 ml-2 mr-2 mt-2 rounded-md ring-1 ring-inset ring-black bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="New Workspace name ..."
                            onChange={(e) => setNewName(e.target.value)} // Update state on input change
                        />
                    </div>
                    <div className="flex justify-between pt-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-10">validate</button>
                    </div>
                </div>
            </div>
        </form>


    );
}

export default EditPopupLeftSideWorkspaces;