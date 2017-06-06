class MemoryUserStore {
    constructor() {
        this.storage = {};
    }

    serialize(user) {
        return user.uid;
    }

    deserialize(uid) {
        return this.storage[uid];
    }

    createOrUpdate(user) {
        this.storage[user.uid] = user;
        return user;
    }

    update(user) {
        this.storage[user.uid] = user;
        return user;
    }
}

module.exports = { MemoryUserStore };