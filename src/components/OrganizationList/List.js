import * as React from "react";
import PropTypes from "prop-types";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem, { useTreeItem } from "@mui/lab/TreeItem";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Row from "../Box/Row";
import { ModalContext } from "../../contexts/ModalContext";
import { OrganizationContext } from "../../contexts/OrganizationListContext";
import { useContext } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import getLastTeam from "../../hooks/share/getLastTeam";
import { useRouter } from "next/router";

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    onClick,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const { addModalData, modal_data, modal_list } = useContext(ModalContext);
  const { addOrganizationData, org_search, addOrganizationInfo } =
    useContext(OrganizationContext);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleExpansionClick = (event) => {
    handleExpansion(event);
    addOrganizationData(nodeId);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);

    addOrganizationData(nodeId);
    addOrganizationInfo(label);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      //   onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
        sx={{ zIndex: 1 }}
      >
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = (props) => {
  return (
    <TreeItem ContentComponent={CustomContent} {...props} test={props.test} />
  );
};

const getAllCodeOfTree = (el) => {
  const arr = [];

  arr.push(el.code);

  el.children.map((child) =>
    getAllCodeOfTree(child).map((code) => arr.push(code))
  );

  return arr;
};

const TreeViewRecursive = ({ el, depth }) => {
  if (depth === 100) return;
  return (
    <CustomTreeItem
      nodeId={el.code}
      test={el?.name}
      label={
        <Row sx={{ zIndex: 1 }}>
          <Typography variant="h6">{el?.name}</Typography>
          <Typography ml={0.4} variant="h6" color="primary.gray">
            ({el?.user_count})
          </Typography>
        </Row>
      }
    >
      {el.children.map((child_el, child_index) => {
        return (
          <TreeViewRecursive
            key={child_index}
            el={child_el}
            depth={depth + 1}
          />
        );
      })}
    </CustomTreeItem>
  );
};

export default function OrganizationList({ group_list, open, absolute }) {
  return (
    <>
      {group_list?.map((list, list_key) => {
        return (
          <TreeView
            key={list_key}
            mt={2}
            sx={{
              height: "100vh",
              overflowY: "scroll",
              // display: open ? "flex" : "none",
              // position: absolute && "absolute",
              // zIndex: absolute && 2,
              // background: "#FFFFFF",
            }}
            defaultExpanded={getAllCodeOfTree(list)}
            defaultCollapseIcon={
              <Image src="/tree_arrow.png" width={10} height={9} alt="" />
            }
            defaultExpandIcon={
              <Image src="/tree_right_arrow.png" width={10} height={9} alt="" />
            }
          >
            <TreeViewRecursive el={list} depth={1} />
          </TreeView>
        );
      })}
    </>
  );
}
