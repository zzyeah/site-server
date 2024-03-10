import MessageModel, { MessageAttributes } from "../model/message.model";

// message
export class MessageDAO {
  public static instance: MessageDAO = new MessageDAO();

  public static getInstance() {
    if (!MessageDAO.instance) MessageDAO.instance = new MessageDAO();
    return MessageDAO.instance;
  }

  public async addMessage(newMessage: MessageAttributes) {
    return await MessageModel.create(newMessage);
  }
}

const messageDAO = MessageDAO.getInstance();
export default messageDAO;
