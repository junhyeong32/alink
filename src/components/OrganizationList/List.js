import * as React from "react";
import PropTypes from "prop-types";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { useTreeItem } from "@mui/lab/TreeItem";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Row from "../Box/Row";
import getApInfoWithSpecificAp from "../../hooks/apManagement/getApInfoWithSpecificAp";
import { ModalContext } from "../../contexts/ModalContext";
import { OrganizationContext } from "../../contexts/OrganizationListContext";
import { useContext } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import getLastTeam from "../../hooks/share/getLastTeam";
import { useRouter } from "next/router";

const CustomContent = React.forwardRef(function CustomContent(
  props,
  ref
  //   { setRowCheck, setRowUserInfo }
) {
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

  const { addModalData, modal_data } = useContext(ModalContext);
  const { addOrganizationData } = useContext(OrganizationContext);

  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();

  const icon = iconProp || expansionIcon || displayIcon;

  //   const handleMouseDown = (event) => {
  //     console.log("1", event);
  //     preventSelection(event);
  //   };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);

    if (router.pathname === "/apManagement") {
      (async () => {
        const ap_info = (
          await Axios.Get(`ap/org/${nodeId}`, {
            params: {
              platform: "web",
              token: cookies.access_token,
            },
          })
        )?.data;

        if (ap_info.code === 200) {
          addOrganizationData(nodeId);
          addModalData(() => {
            const row_check = [];
            const row_user_info = [];

            ap_info?.data.map((info, key) => {
              row_check.push(info.id);
              row_user_info.push({
                profile_img: info?.profile_image,
                user_info:
                  "[" +
                  getLastTeam(
                    info?.region,
                    info?.studio,
                    info?.branch,
                    info?.team
                  ) +
                  "]" +
                  " " +
                  info?.name +
                  " " +
                  info?.rank,
              });
            });

            return {
              row_check: row_check,
              row_user_info: row_user_info,
            };
          });
        }
      })();
    } else {
      addOrganizationData(nodeId);
    }
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
      >
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
);

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
      label={
        <Row>
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

export default function OrganizationList({ group_list }) {
  return (
    <>
      {group_list?.map((list, list_key) => {
        return (
          <TreeView
            key={list_key}
            mt={2}
            sx={{ overflowY: "scroll" }}
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
