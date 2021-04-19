import React from "react";

import Select, { components } from "react-select";
import Creatable from "react-select/creatable";

import { Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import _ from 'lodash';

export const MultipleChoice = ({ survey, page, index, question, value, rId }) => {
    const { title, instruction, type, isMulti, options, expandable } = question;
    return (
        <>
            <h6 dangerouslySetInnerHTML={{__html: title}}/>
            {instruction && <p>{ instruction }</p>}
            {
                type === "select" ?
                    (() => {
                        const addProps = { survey, page, index, isMulti };
                        let props = {
                            key: "q" + index + "_" + value && (Array.isArray(value) ? value.join("-"): value),
                            isMulti,
                            options,
                            value: Array.isArray(value) ? value.map(v => options.find(o => v === o.value)) : options.find(o => value === o.value),
                            onChange: (selected, {action}) => {
                                if(action === "create-option")
                                    Meteor.call("surveys.options.create", survey, page, index, Array.isArray(selected) ? selected[selected.length - 1] : selected);
                                Meteor.call("responses.update", rId, page, index, !isMulti ? selected.value : Array.isArray(selected) ? selected.map(s => s.value) : [])
                            },
                            components: {
                                SingleValue: ({ children, ...props }) => <CustomValue children={children} props={props} {...addProps}/>,
                                MultiValue: ({ children, ...props }) => <CustomValue children={children} props={props} {...addProps}/>
                            }
                        };
                        return (expandable ? <Creatable {...props}/> : <Select {...props}/>);
                    })()
                :
                    <ListGroup>
                        {
                            options.map((c, cI) => {
                                let { label, owner } = c;
                                const checked = Array.isArray(value) ? value.includes(c.value) : value === c.value;
                                return (
                                    <ListGroup.Item
                                        key={"q" + index + "c" + cI}
                                        variant={checked && "success"}
                                    >
                                        <Form.Check
                                            type={type}
                                            label={label}
                                            checked={checked}
                                            onChange={() => Meteor.call("responses.update", rId, page, index, type === "checkbox" ? _.xor(value, [c.value]) : c.value)}
                                            style={{float: "left"}}
                                        />
                                        {
                                            owner === Meteor.userId() &&
                                                <Button
                                                    size="sm"
                                                    style={{float: "right", color: "red"}}
                                                    variant="link"
                                                    onClick={() => Meteor.call("surveys.options.remove", survey, page, index, c.value, isMulti)}
                                                >
                                                    <FontAwesomeIcon icon="trash"/>
                                                </Button>
                                        }
                                    </ListGroup.Item>
                                );
                            })
                        }
                        {
                            expandable &&
                                <ListGroup.Item>
                                    <Form.Control
                                        onKeyUp={e => {
                                            if(e.keyCode === 13) {
                                                e.preventDefault();
                                                let value, label = value = e.target.value.trim();
                                                if(!options.some(c => c.value === value)) {
                                                    Meteor.call("surveys.options.create", survey, page, index, {label, value});
                                                    e.target.value = "";
                                                } else
                                                    alert("Option already exists");
                                            }
                                        }}
                                    />
                                </ListGroup.Item>
                        }
                    </ListGroup>
            }
        </>
    );
};

const CustomValue = ({ children, props, survey, page, index, isMulti }) => {
    const Comp = isMulti ? components.MultiValue : components.SingleValue;
    return (
        <Comp {...props}>
            { children }
            {
                props.data.owner === Meteor.userId() &&
                    <Button
                        style={{color: "red"}}
                        variant="link"
                        onClick={() => Meteor.call("surveys.options.remove", survey, page, index, props.data.value, isMulti)}
                    >
                        <FontAwesomeIcon icon="trash"/>
                    </Button>
            }
        </Comp>
    );
};