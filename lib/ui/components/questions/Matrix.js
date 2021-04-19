import React from "react";

import { Form, Table } from "react-bootstrap";

export const Matrix = ({ page, index, question, value, rId }) => {
    const { title, instruction, columns, rows } = question;
    return (
        <>
            <h6 dangerouslySetInnerHTML={{__html: title}}/>
            {instruction && <p>{ instruction }</p>}
            <Table>
                <thead>
                <tr>
                    <th/>
                    {
                        columns.map((c, ci) =>
                            <th key={"q" + index + "c" + ci}>
                                { c.text }
                            </th>
                        )
                    }
                </tr>
                </thead>
                <tbody>
                {
                    rows.map((r, ri) => {
                        const key = "q" + index + "r" + ri;
                        const checked = value[ri];
                        return (
                            <tr key={key}
                                className={checked && "bg-light"}
                            >
                                <th>
                                    { r.text }
                                </th>
                                {
                                    columns.map((c, ci) =>
                                        <td key={key + "c" + ci}>
                                            <Form.Control
                                                type="radio"
                                                name={key}
                                                checked={checked === ci}
                                                style={{
                                                    margin: "auto",
                                                    width: "auto"
                                                }}
                                                onChange={() => Meteor.call("responses.update", rId, page, index + "." + ri, ci)}
                                            />
                                        </td>
                                    )
                                }
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
        </>
    );
};