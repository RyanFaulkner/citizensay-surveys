import { Mongo } from 'meteor/mongo';

export const Responses = new Mongo.Collection('responses');

Meteor.methods({
    "responses.insert"(id, value) {
        const userId = this.userId;
        let response = Responses.findOne({id, userId});
        if(!response)
            response = Responses.insert({
                id,
                userId,
                value
            });
        return response;
    },

    "responses.update"(_id, pi, qi, value) {
        return Responses.update({_id},
            {
                $set: {
                    ["value." + pi + "." + qi]: value
                }
            });
    }
});

if(Meteor.isServer)
    Meteor.publish('responses', () => Responses.find());