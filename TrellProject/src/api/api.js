import axios from "axios";
import Cookies from "js-cookie";
export const process = {
  env: {
    REACT_APP_BASE_URL: "https://api.trello.com/1/",
    REACT_APP_REDIRECT_URL: "https://trello-ten-ashen.vercel.app/workspace",
    REACT_APP_API_KEY: "18a78997301a4a18c553d49791f6aae2",
    REACT_APP_EXPIRATION: "1hour",
  },
};
export class TrelloAPI {
  constructor() {
    this.apiKey = Cookies.get("trello_api_key");
    this.token = Cookies.get("trello_token");
    this.baseURL = process.env.REACT_APP_BASE_URL;
  }

  ////////////////////////////////////// Boards //////////////////////////////////////


  async createBoard(active) {
    return this.request("post", `/boards/`, {
      name: "boardName",
      idOrganization: active,
      defaultLists: false,
    });
  }
  async getBoard(boardId) {
    return this.request("get", `/boards/${boardId}`);
  }
  async getCards(boardId) {
    return this.request("get", `/boards/${boardId}/cards`);
  }
  async listBoardsInWorkspace(workspaceId) {
    return this.request(
      "get",
      `/organizations/${workspaceId}/boards`,
      {},
      { fields: "name,url" }
    );
  }
  // async listBoards() {
  //   return this.request(
  //     "get",
  //     `/members/me/boards`,
  //     {},
  //     {
  //       lists: "all",
  //       cards: "all",
  //     }
  //   );
  // }
  async updateBoard(boardId, newName) {
    return this.request("put", `/boards/${boardId}`, { name: newName });
  }

  async deleteBoard(boardId) {
    return this.request("delete", `/boards/${boardId}`);
  }


  ////////////////////////////////////// Lists //////////////////////////////////////


  async createList(boardId) {
    return this.request("post", `/lists?name=template&idBoard=${boardId}`);
  }

  async updateList(listId, newName) {
    return this.request("put", `/lists/${listId}?name=${newName}`);
  }

  async deleteList(listId) {
    return this.updateList(listId, { closed: true });
  }
  async getLists(boardId) {
    return this.request("get", `/boards/${boardId}/lists`);
  }

  ////////////////////////////////////// Cards //////////////////////////////////////


  async getCards(boardId,viewFilter = "all")  {
    return this.request("get",`/boards/${boardId}/cards?filter=${viewFilter}`);
  }
  async createCard(listId) {
    return this.request("post", `/cards?idList=${listId}`, {
      name: 'cardName',
      desc: 'cardDescription',
    });
  }

  async updateCard(cardId, newParams) {
    return this.request("put", `/cards/${cardId}?name=${newParams.name}&desc=${newParams.desc}&id=${cardId}`);
  }

  async deleteCard(cardId) {
    return this.request("delete", `/cards/${cardId}`);
  }


  ////////////////////////////////////// Workspace //////////////////////////////////////


  async deleteWorkspace(workspaceId) {
    return this.request("delete", `/organizations/${workspaceId}`);
  }

  async createWorkspace(workspaceName) {
    return this.request("post", `/organizations/`, { displayName: "workspaceName" });
  }

  async listWorkspaces() {
    return this.request("get", `/members/me/organizations`);
  }

  async updateWorkspace(workspaceId, newName) {
    return this.request("put", `/organizations/${workspaceId}?name=${newName}`);
  }

  async request(method, path, data = {}, params = {}) {
    const url = `${this.baseURL}${path}`;
    const config = {
      method: method,
      url: url,
      params: {
        key: this.apiKey,
        token: this.token,
        ...params,
      },
      data: data,
    };
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(
        "API request failed:",
        error.response ? error.response.data : error.message
      );
    }
  }
}

export const handleTokenStorage = () => {
  const token = window.location.hash.match(/token=(\w+)/)?.[1];
  if (token) {
    Cookies.set("trello_token", token, {
      expires: process.env.REACT_APP_EXPIRATION / 24,
    });
    Cookies.set("trello_api_key", process.env.REACT_APP_API_KEY, {
      expires: process.env.REACT_APP_EXPIRATION / 24,
    });
    window.location.hash = "";
  }
};
export const logout = (callback) => {
  Cookies.remove("trello_token");
  Cookies.remove("trello_api_key");
  if (callback) callback();
};
