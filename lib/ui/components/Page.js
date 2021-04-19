import React from "react";

import { ListGroup } from "react-bootstrap";
import { Question } from "./Question";

export const Page = ({ survey, index, page, response, rId }) => {
    const { title, questions } = page;
    return (
        <>
            <h5>{ title }</h5>
            <ListGroup>
                {
                    (Array.isArray(questions) && questions.length > 0) ?
                        questions.map((q, i) =>
                            <Question
                                key={"q" + i}
                                survey={survey}
                                page={index}
                                index={i}
                                question={q}
                                value={response[i]}
                                rId={rId}
                            />
                        )
                    :
                        <span>No Questions</span>
                }
            </ListGroup>
        </>
    );
};