import { Mongo } from 'meteor/mongo';

import { Responses } from "./responses";

export const Surveys = new Mongo.Collection('surveys');

Meteor.methods({
    "surveys.options.create"(_id, page, index, { label, value }) {
        return Surveys.update({
            _id
        }, {
            $push: {
                ["pages." + page + ".questions." + index + ".options"]: {
                    value,
                    label,
                    owner: this.userId
                }
            }
        });
    },
    "surveys.options.remove"(_id, page, index, value, isMulti=false) {
        let field = "value." + page + "." + index;
        if(isMulti) field += ".";
        Responses.update({
            [field]:  value
        }, {
            [isMulti ? "$pull" : "$set"]: {
                ["value." + page + "." + index]: isMulti ? value : null
            }
        });
        return Surveys.update({_id}, {
            $pull: {
                ["pages." + page + ".questions." + index + ".options"]: { value }
            }
        });
    }
});

if(Meteor.isServer)
    Meteor.publish('surveys', () => Surveys.find());