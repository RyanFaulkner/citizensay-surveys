import React, { useState } from "react";

import { useTracker } from "meteor/react-meteor-data";
import { Surveys, Responses } from "meteor/citizensay:surveys";

import { Page } from './Page';

import { useTranslation } from "react-i18next";

export const Survey = ({ id }) => {
    const { t } = useTranslation();

    const [ current, setCurrent ] = useState(0);

    //Load data
    const userId = Meteor.userId();
    const { survey, response } =  useTracker(() => {
        Meteor.subscribe("surveys");
        Meteor.subscribe("responses");
        return {
            survey: Surveys.findOne(id),
            response: Responses.findOne({id, userId})
        };
    });

    if(survey) {
        // Create new response
        if(!response) {
            Meteor.call("responses.insert", id, init());
            return null;
        }
        return (
            <>
                <h4>{ survey.name || t("survey") }</h4>
                <p>{ survey.description }</p>
                <small>{ survey.pages.length } Page(s)</small>
                <hr/>
                <Page
                    survey={survey._id}
                    index={current}
                    page={survey.pages[current]}
                    response={response.value[current]}
                    rId={response._id}
                />
            </>
        );
    } else {
        // Survey Loading
        return null;
    }

    function init() {
        return [...Array(survey.pages.length)]
            .map((p, i) =>
                [...Array(survey.pages[i].questions.length)]
                    .map((r, qi) => {
                        if(survey.pages[i].questions[qi].type === "matrix")
                            r = [...Array(survey.pages[i].questions[qi].rows.length)];
                        return r;
                    })
            );
    }
};