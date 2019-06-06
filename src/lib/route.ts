// patch Route type with name prop
import {ComponentClass} from "react";
import {Route as ReactRoute, RouteProps} from "react-router";

interface RouteNamedProps extends RouteProps {
    name?: string;
}

export declare type Route = ComponentClass<RouteNamedProps>;
export const Route = ReactRoute as Route;
