import React, {useEffect, useState} from "react";
import {Cascader, message} from "antd";
import {FetchLocations, Location} from "../../services/service_controller";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {CascaderOptionType, CascaderValueType} from "antd/lib/cascader";
import "./styles/index.css";

export const LocationSelect: React.FC<{ onChange?: (data: any) => void }> = ({onChange}) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectValues, setSelectValues] = useState<CascaderValueType>([]);
    const project = useSelector((state: ReducerState) => state.global.project);

    useEffect(() => {
        if (project !== undefined && project.id > 0) {
            FetchLocations(project.id).then(res => {
                if (res.status === 0) {
                    setLocations(res.data);
                } else {
                    message.error(res.msg, 2).then(() => {
                    });
                }
            });
            setSelectValues([]);
        }
    }, [project]);

    let _locationTree = CreateTreeNode(locations);

    const select = (value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => {
        if (selectedOptions !== undefined && selectedOptions.length === 4) {
            setSelectValues(value);
            if (onChange && selectedOptions) {
                onChange(selectedOptions[3]);
            }
        }
    };

    const filter = (inputValue: string, path: any) => {
        return path.some((treeData: LocationTreeNode) => treeData.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    };

    return (
        <Cascader className="my-selector"
                  fieldNames={{label: "label", value: "value", children: "children"}}
                  options={_locationTree}
                  onChange={select}
                  placeholder="请选择位置"
                  showSearch={{filter}}
                  value={selectValues}
                  bordered={false}
                  size="small"
        />
    );
};

export interface LocationTreeNode {
    value: any,
    label: string,
    children: LocationTreeNode[],
    disabled?: boolean,
    location_1_id: number,
    location_2_id: number,
    location_3_id: number,
    location_4_id: number
}

// 递归创建location树
function CreateTreeNode(nodes: Location[]): LocationTreeNode[] {
    if (nodes.length === 0) {
        return [];
    }
    let tree: LocationTreeNode[] = [];
    for (let i = 0; i < nodes.length; i++) {
        tree.push({
            value: [
                nodes[i].location_1_id.toString(),
                nodes[i].location_2_id.toString(),
                nodes[i].location_3_id.toString(),
                nodes[i].location_4_id.toString()].join(","),
            label: nodes[i].location_name,
            children: CreateTreeNode(nodes[i].children || []),
            location_1_id: nodes[i].location_1_id,
            location_2_id: nodes[i].location_2_id,
            location_3_id: nodes[i].location_3_id,
            location_4_id: nodes[i].location_4_id,
        });
    }
    return tree;
}