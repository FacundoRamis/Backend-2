import UsersDAO from "../dao/mongo/users.mongo.js";

export default class UsersRepository {
  constructor() {
    this.dao = new UsersDAO();
  }

  getByEmail = (email) => this.dao.getByEmail(email);
  getById = (id) => this.dao.getById(id);
  create = (user) => this.dao.create(user);
  updatePassword = (id, password) =>
    this.dao.update(id, { password });
}
