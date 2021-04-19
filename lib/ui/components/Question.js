import React from "react";

import { ListGroup } from "react-bootstrap";

import { MultipleChoice } from "./questions/MultipleChoice";
import { Matrix } from "./questions/Matrix";
import { Text } from "./questions/Text";

export const Question = ({ survey, page, index, question, value, rId }) => {
    return (
        <ListGroup.Item>
            {(() => {
                const props = { survey, page, index, question, value, rId };
                switch(question.type) {
                    case "radio":
                    case "checkbox":
                    case "select":
                        return <MultipleChoice {...props}/>;
                    case "matrix":
                        return <Matrix {...props}/>;
                    case "simple":
                    case "text":
                        return <Text {...props}/>;
                    default:
                        return (
                            <span>Unrecognised type: { question.type }</span>
                        );
                }
            })()}
        </ListGroup.Item>
    );
};