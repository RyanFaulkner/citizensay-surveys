export * from "./lib/api/index";

import { i18n, library, addRoute, renderWithId } from "meteor/citizensay:core";

import { Survey } from './lib/ui/components/Survey';

//i18n.addResources("en", "surveys", {});
//library.add();

addRoute({
    path: "/surveys/:id",
    render: ({ match }) => renderWithId(Survey, match.params.id)
});