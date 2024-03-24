import React, { useEffect } from "react";
import Header from "./components/Header";
import * as api from "../api/api";
import add_button from "../assets/add_button.png";
import edit from "../assets/edit.png"
import delete_button from "../assets/recycle_bin.png"
import { useState } from "react";
import EditPopupLeftSideWorkspaces from "./components/EditPopupLeftSideWorkspaces.jsx";
import { useNavigate } from "react-router-dom";


function Workspace() {

    const [active, setActive] = useState("");
    const [rightActive, setRightActive] = useState(false);
    const [EditPopUpLeftSideWorkspacesStatus, setEditPopUpLeftSideWorkspacesStatus] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);               // replace workspaces par board
    const [currentWorkspace, setCurrentWorkspace] = useState("");   // replace currentWorkspace par currentBoard
    const [boards, setBoards] = useState([]);                       // replace boards par lists
    const [id, setId] = useState("");
    const trelloAPI = new api.TrelloAPI();
    const navigate = useNavigate();

    useEffect(() => {
        api.handleTokenStorage();
        const fetchData = async () => {

            let trelloAPI = new api.TrelloAPI();
            try {
                
                // Now you can work with workspaces here
            } catch (error) {
                console.error("Error fetching workspaces:", error);
            }
        };
        fetchData();
    }, []);

    const handleBoardClick = (workspaces, boards) => {
        navigate("/table", { state: { workspaces, boards } });
    };



    useEffect(() => {
        const fetchWorkspaces = async () => {
            const data = await trelloAPI.listWorkspaces();
            setWorkspaces(data);
        };
        fetchWorkspaces();
    }, []);



    function setListByWorkspaceName(name) {
        for (let i = 0; i < workspaces.length; i++) {
            if (workspaces[i].name === name) {
                setBoards(workspaces[i].lists);

            }
        }
    }

    const handleWorkspaceClick = (workspace) => {
        setId(workspace.id);
        setActive(workspace.id);
        setRightActive(true);
        fetchBoards(workspace.id);

    };

    const fetchBoards = async (workspaceId) => {
        if (workspaceId) {
            const data = await trelloAPI.listBoardsInWorkspace(workspaceId);
            setBoards(data);
        }
        else {
            console.error("No workspace id provided");
        }
    };

    const deleteWorkspace = async (workspaceId) => {
        try {
            await trelloAPI.deleteWorkspace(workspaceId);
            fetchWorkspaces();
        } catch (error) {
            console.error("Error deleting workspace:", error);
        }
    };


    const deleteBoard = async (boardId) => {
        try {
            await trelloAPI.deleteBoard(boardId);
            fetchBoards(id);
        } catch (error) {
            console.error("Error deleting board:", error);
        }
    };

    const createWorkspace = async () => {
        try {
            await trelloAPI.createWorkspace();
        } catch (error) {
            console.error("Error creating workspace:", error);
        }
    };

    const createBoard = async (active) => {
        try {
            await trelloAPI.createBoard(active);
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };



    const trello = new api.TrelloAPI();
    return (

        <div className="overflow-x-hidden overflow-y-hidden h-screen">
            <Header></Header>
            <div className="flex w-screen flex-1 h-screen">

                {/* Left side of the page */}
                <div className="flex flex-col w-1/5 bg-gray-200 scroll-smooth border-r-2 border-black">
                    <div className="flex flex-col py-2 rounded-lg bg-blue-500 mt-3 ml-3 mr-3 mb-6">
                        <div className="flex items-center justify-start">
                            <img className="fw-4 h-4 ml-4 cursor-pointer hover:rotate-90 duration-300" src={add_button}
                                alt="add button" onClick={() => createWorkspace}/>
                            <h1 className="flex-1 mr-8 text-center">Workspaces :</h1>
                        </div>
                    </div>

                    {workspaces.length ? (
                        workspaces.map((workspace) => (
                            <div key={workspace.id} className="flex justify-center content-center ml-3 mr-3 mb-3">
                                <button onClick={() => handleWorkspaceClick(workspace)}
                                    className="flex justify-center items-center w-96 py-2 rounded-lg bg-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:text-white">
                                    {active === workspace.id && (
                                        <img onClick={() => setEditPopUpLeftSideWorkspacesStatus(true)}
                                            className="fw-4 h-4 ml-4 cursor-pointer hover:rotate-90 duration-300"
                                            src={edit}
                                            alt="edit button" />
                                    )}
                                    <h1 className="flex-1 mr-8 text-center">{workspace.name}</h1>
                                </button>
                                <button onClick={() => trelloAPI.deleteWorkspace(workspace.id)}>
                                    <img className="fw-4 h-4 w-4 flex ml-4 cursor-pointer hover:rotate-90 duration-300"
                                        src={delete_button}
                                        alt="delete button" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center content-center ml-3 mr-3 mb-3">
                            <div className="flex justify-center items-center w-96 py-2 rounded-lg bg-blue-300">
                                <p className="flex-1 text-center">No Boards</p>
                            </div>
                        </div>
                    )}


                </div>
                {/* Right side of the page */}
                <div className="flex flex-1 bg-gradient-to-r from-red-700/75 to-indigo-700/75 h-full scroll-smooth">
                    <div>
                        {boards.length ? (
                            boards.map((board) => (
                                <div key={board.id} className="flex  w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3 justify-center items-center">
                                    <button className="flex items-center justify-start" onClick={() => handleBoardClick(workspaces, boards)} >
                                        <div className="flex ml-8 text-center">{board.name}</div>

                                    </button>
                                    <button onClick={() => trelloAPI.deleteBoard(board.id)}>
                                        <img className="fw-4 h-4 w-4 flex ml-4 cursor-pointer hover:rotate-90 duration-300"
                                            src={delete_button}
                                            alt="delete button" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3">
                                <div className="flex-1 text-center">No Boards</div>
                            </div>
                        )}
                    </div>
                    {/* Show only if workspaces id !== null */}
                    {active ? (
                    <div>
                        <button onClick={() => createBoard(active)} className="flex w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 cursor-pointer m-3" >
                            <div className="flex-1 text-center italic opacity-60">Create board</div>
                        </button>
                    </div>
                    ) : null}
                </div>
            </div>
            {EditPopUpLeftSideWorkspacesStatus ?
                <EditPopupLeftSideWorkspaces
                    setEditPopUpLeftSideWorkspacesStatus={setEditPopUpLeftSideWorkspacesStatus}
                    workspaceId={active}
                />
                :
                null
            }

        </div>
    )
}

export default Workspace;