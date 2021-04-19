import React from 'react';

import { Form } from 'react-bootstrap';
import { DebounceInput } from 'react-debounce-input';

export const Text = ({ page, index, question, value, rId }) => {
    const {title, instruction, type, as} = question;
    return (
        <>
            <h6 dangerouslySetInnerHTML={{__html: title}}/>
            {instruction && <p>{ instruction }</p>}
            {
                type === "simple" &&
                    <Form.Control
                        as={DebounceInput}
                        value={value}
                        minLength={1}
                        debounceTimeout={2500}
                        onChange={e => Meteor.call("responses.update", rId, page, index, e.target.value)}
                    />
            }
        </>
    );
};