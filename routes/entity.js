/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/feedmaid
    @license MIT
*/

var mongodb = require('mongodb'),
    tools = require('./tools');

// Entity operations, Get an entity.
exports.entity_get = function(name, search, callback) {
    if(!name || !search) {
        return callback(400, 'Bad Request');
    }

    tools.dbopen(function(error, db) {
        if(error) {
            return callback(506, error);
        }

        db.collection(name + 's', function(error, collection) {
            if(error) {
                return callback(506, error);
            }

            collection.findOne(search, function(error, entity) {
                db.close();
                if(error) {
                    return callback(506, error);
                }

                return callback(200, entity);
            });
        });
    });
};

// Entity operations, Add an entity.
exports.entity_add = function(name, entity, callback) {
    if(!name || !entity) {
        return callback(400, 'Bad Request');
    }

    entity['create_at_timestamp'] = (new Date()).getTime();
    entity['create_at'] = tools.timestamp();

    tools.dbopen(function(error, db) {
        if(error) {
            db.close();
            return callback(506, error);
        }

        db.collection(name + 's', function(error, collection) {
            if(error) {
                db.close();
                return callback(506, error);
            }

            collection.insert(entity, { safe: true }, function(error, result) {
                db.close();

                if(error) {
                    return callback(506, error);
                }

                tools.log('Entity "' + name + '" added', result);
                return callback(200, result);
            });
        });
    });
};

// Entity operations, List entities.
exports.entity_list = function(name, last_id, callback) {
    if(!name) {
        return callback(400, 'Bad Request');
    }

    tools.dbopen(function(error, db) {
        if(error) {
            return callback(506, error);
        }

        db.collection(name + 's', function(error, collection) {
            if(error) {
                return callback(506, error);
            }

            var cursor, ObjectID = mongodb.ObjectID, criteria;

            if(last_id) {
                // Paging.
                criteria = { '_id': { '$lte': new ObjectID(last_id) } };
                cursor = collection.find(criteria);
                cursor.sort({ '_id': -1 }).limit(tools.PER_PAGE_COUNT).toArray(function(error, docs) {
                    db.close();
                    if(error) { return callback(506, error); }
                    return callback(200, docs);
                });
            } else {
                // No paging.
                cursor = collection.find();
                cursor.sort({ '_id': -1 }).toArray(function(error, docs) {
                    db.close();
                    if(error) { return callback(506, error); }
                    return callback(200, docs);
                });
            }
        });
    });
};

// Entity operations, Delete an entity.
exports.entity_delete = function(name, search, callback) {
    if(!name || !search) {
        return callback(400, 'Bad Request');
    }

    tools.dbopen(function(error, db) {
        if(error) {
            return callback(506, error);
        }

        db.collection(name + 's', function(error, collection) {
            if(error) {
                return callback(506, error);
            }

            collection.remove(search, { safe: true }, function(error, result) {
                db.close();

                if(error) {
                    return callback(506, error);
                }

                tools.log('Entity "' + name + '" removed, affected: ', result);
                return callback(200, result);
            });
        });
    });
};

// Entity operations, Update an entity.
exports.entity_update = function(name, ent, callback) {
    if(!ent || !ent) {
        return callback(400, 'Bad Request');
    }

    tools.dbopen(function(error, db) {
        if(error) {
            return callback(506, error);
        }

        db.collection(name + 's', function(error, collection) {
            if(error) {
                return callback(506, error);
            }

            var ObjectID = mongodb.ObjectID, id = ent['_id'].toString();

            delete ent['id'];
            var todo = [];
            for(var property in ent) if(!ent[property]) todo.push(property);
            for(var i = 0; i < todo.length; ++i) delete ent[todo[i]];

            ent['update_at_timestamp'] = (new Date()).getTime();
            ent['update_at'] = tools.timestamp();
            delete ent['_id'];

            collection.update({ '_id': new ObjectID(id) }, { $set: ent }, { safe: true }, function(error, affected) {
                db.close();
                if(error) {
                    return callback(506, error);
                }

                tools.log('Entity "' + name + '" updated, affected: ' + affected);
                return callback(200, ent);
            });
        });
    });
};
