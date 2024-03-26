import React, { useEffect } from "react";
import Header from "./components/Header";
import * as api from "../api/api";
import add_button from "../assets/add_button.png";
import edit from "../assets/edit.png";
import delete_button from "../assets/recycle_bin.png";
import EditPopupLeftSideBoards from "./components/EditPopupLeftSideBoards.jsx";
import EditPopupRightSideCard from "./components/EditPopupRightSideCard.jsx";
import EditPopupListName from "./components/EditPopupListName.jsx";
import { useState } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
//

function Table() {
  // eslint-disable-next-line no-undef
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaces, boards } = location.state;

  const [EditPopUpLeftSideBoardsStatus, setEditPopUpLeftSideBoardsStatus] =
    useState(false);
  const [EditPopUpRightSideCardStatus, setEditPopUpRightSideCardStatus] =
    useState(false);
  const [EditPopUpListNameStatus, setEditPopUpListNameStatus] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(""); //currentWorkspace = currentBoard
  const [createsList, setCreatesList] = useState(false); //createWorkspace = createList
  const [currentList, setCurrentList] = useState(null); //currentList = currentList
  const [cards, setCards] = useState([]); //cards = lists
  const [currentCards, setCurrentCards] = useState(""); //currentCards = currentLists
  const [singleCard, setSingleCard] = useState([]); //singleCard = singleList
  const [id, setId] = useState("");
  const trelloAPI = new api.TrelloAPI();

  useEffect(() => {
    // Redirect if location.state is not available
    if (!location.state) {
      navigate("/workspace");
    }
  }, [location.state, navigate]);

  const handleWorkspaceClick = (board) => {
    setId(board.id);
    setCurrentBoard(board.id);
    setCreatesList(true);
    fetchCards(board.id);
  };

  const fetchCards = async (boardId) => {
    if (boardId) {
      try {
        const data = await trelloAPI.getLists(boardId); // Fetch all list
        setCards(data);
        const data2 = await trelloAPI.getCards(boardId); // Fetch all card
        setSingleCard(data2);
      } catch (error) {
        console.error("Error fetching list for board:", error);
      }
    } else {
      console.error("No board id provided");
    }
  };

  const createList = async () => {
    try {
      await trelloAPI.createList(currentBoard);
      fetchCards(id);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const creatCard = async (listId) => {
    try {
      await trelloAPI.createCard(listId);
      fetchCards(id);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const updateCard = async (card) => {
    setCurrentCards(card.id);
    setEditPopUpRightSideCardStatus(true);
  };

  const updateList = async (singleCards) => {
    setCurrentList(singleCards.id);
    setEditPopUpListNameStatus(true);
  };

  const deleteList = async (listId) => {
    try {
      await trelloAPI.deleteList(listId);
      fetchCards(id);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };
  const deleteCard = async (cardId) => {
    try {
      await trelloAPI.deleteCard(cardId);
      fetchCards(id);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const trello = new api.TrelloAPI();
  return (
    <div className="overflow-x-hidden overflow-y-hidden h-screen">
      {/*<div>{currentWorkspace}</div>*/}
      <Header></Header>
      <div className="flex w-screen flex-1 h-screen">
        {/* Left side of the page */}
        <div className="flex flex-col w-1/5 bg-gray-200 scroll-smooth border-r-2 border-black">
          <div className="flex flex-col py-2 rounded-lg bg-blue-500 mt-3 ml-3 mr-3 mb-6">
            <div className="flex items-center justify-start">
              <h1 className="flex-1 mr-8 text-center">Boards :</h1>
            </div>
          </div>

          {boards.length ? (
            boards.map((board) => (
              <div
                key={board.id}
                className="flex justify-center content-center ml-3 mr-3 mb-3"
              >
                <button
                  onClick={() => handleWorkspaceClick(board)}
                  className="flex justify-center items-center w-96 py-2 rounded-lg bg-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:text-white"
                >
                  <img
                    onClick={() => setEditPopUpLeftSideBoardsStatus(true)}
                    className="fw-4 h-4 ml-4 cursor-pointer hover:rotate-90 duration-300"
                    src={edit}
                    alt="edit button"
                  />
                  <h1 className="flex-1 mr-8 text-center">{board.name}</h1>
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
        <div className="flex flex-1 bg-gradient-to-r from-red-700/75 to-indigo-700/75 h-full scroll-smooth overflow-auto">
          {cards.length > 0 ? (
            cards.map((singleCards) => (
              <div key={singleCards.id}>
                <div className="flex flex-col w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3">
                  <>
                    <div className="flex items-center justify-start">
                      <img
                        className="fw-4 h-4 ml-4 cursor-pointer hover:rotate-90 duration-300"
                        src={add_button}
                        alt="add button"
                        onClick={() => creatCard(singleCards.id)}
                      />
                      {/* Display name of the first label in singleCard */}
                      <button
                        className="flex-1 mr-8 ml-8 text-center"
                        onClick={() => updateList(singleCards)}
                      >
                        {singleCards.name}
                      </button>
                      <button onClick={() => deleteList(singleCards.id)}>
                        <img
                          className="fw-4 h-4 mr-4 cursor-pointer hover:rotate-90 duration-300"
                          src={delete_button}
                          alt="delete button"
                        />
                      </button>
                    </div>
                    {/* Map over cards that contain the singleCard[0].id in their idLabels */}
                    {singleCard
                      .filter((card) => card.idList === singleCards.id)
                      .map((card) => (
                        <div
                          key={card.id}
                          className="flex flex-col w-90 py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3"
                        >
                          <div className="flex items-center justify-start">
                            <img
                              onClick={() => updateCard(card)}
                              className="fw-4 h-4 ml-4 cursor-pointer hover:rotate-90 duration-300"
                              src={edit}
                              alt="edit button"
                            />
                            <button onClick={() => deleteCard(card.id)}>
                              <img
                                className="fw-4 h-4 mr-4 cursor-pointer hover:rotate-90 duration-300"
                                src={delete_button}
                                alt="delete button"
                              />
                            </button>
                            <div className="flex-1 mr-8 text-center">
                              {card.name}
                            </div>
                          </div>
                          {/* Example content, replace with actual content as needed */}
                          <div className="flex w-auto py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3 text-center justify-center overflow-auto">
                            {card.desc ? card.desc : "No description"}
                          </div>
                        </div>
                      ))}
                  </>
                </div>
              </div>
            ))
          ) : (
            <div>
              <div className="flex flex-col w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 m-3">
                <p className="text-center">No Lists</p>
              </div>
            </div>
          )}

          <div>
            {createsList ? (
              <div className="flex w-96 py-2 rounded-lg bg-gray-300 bg-opacity-60 cursor-pointer m-3">
                <button
                  onClick={() => createList()}
                  className="flex-1 text-center italic opacity-60"
                >
                  Add Lists
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {EditPopUpLeftSideBoardsStatus ? (
        <EditPopupLeftSideBoards
          setEditPopUpLeftSideBoardsStatus={setEditPopUpLeftSideBoardsStatus}
          boardId={id}
        />
      ) : null}
      {EditPopUpRightSideCardStatus ? (
        <EditPopupRightSideCard
          setEditPopUpRightSideCardStatus={setEditPopUpRightSideCardStatus}
          cardId={currentCards}
        />
      ) : null}
      {EditPopUpListNameStatus ? (
        <EditPopupListName
          setEditPopUpListNameStatus={setEditPopUpListNameStatus}
          listId={currentList}
        />
      ) : null}
    </div>
  );
}

export default Table;
