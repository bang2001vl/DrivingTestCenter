import { type } from "os";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DataTable4, DataTable4Props } from "../../sections/DataTable4";
import { ISelectable } from "../../_interfaces/selectable";

interface IProps {
    routeSelect: string,
    routeNameFE: string,
    webTitle: string,
    pageTitle: string,
    searchOptionList: ISelectable[],
    orderOptionList: ISelectable[],
    onRenderItem: (dataList: any[], select: () => void, emptyView?: JSX.Element) => JSX.Element
    filter?: { [key: string]: any },
    hideTitle?: boolean,
    ref?: any,
}

export type BasicPageProps = IProps & Partial<DataTable4Props>;

export const BasicPage = (props: BasicPageProps) => {
    console.log("REF2", props.ref);
    
    const navigate = useNavigate();
    const api = useAPI();

    const handleSelect = (params: URLSearchParams) => {
        console.log("Filter", props.filter);

        if (props.filter) {
            Object.keys(props.filter).forEach(key => {
                params.append(key, props.filter![key])
            });
        }
        return api.get(
            `${appConfig.backendUri}/${props.routeSelect}/select?${params.toString()}`
        );
    }

    const handleCount = (params: URLSearchParams) => {
        if (props.filter) {
            Object.keys(props.filter).forEach(key => {
                params.append(key, props.filter![key])
            });
        }
        return api.get(
            `${appConfig.backendUri}/${props.routeSelect}/count?${params.toString()}`
        );
    }

    const handleCreate = () => {
        navigate(`/${props.routeNameFE}/create`);
    }

    return (
        <DataTable4
            searchbarText='Tìm kiếm'
            title={props.webTitle}
            textLabel={props.hideTitle ? "" : props.pageTitle}
            count={handleCount}
            select={handleSelect}
            onClickCreate={handleCreate}
            {...props}
        />
    )
};