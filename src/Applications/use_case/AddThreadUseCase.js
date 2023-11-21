const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(userId, addThread);
    return new AddedThread({
      id: addedThread.id,
      title: addedThread.title,
      owner: addedThread.user_id,
    });
  }
}

module.exports = AddThreadUseCase;
