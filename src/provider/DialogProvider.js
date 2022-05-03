import * as React from "react";
import Button from "@mui/material/Button";
import {Dialog} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DialogContext = React.createContext();

function DialogContainer(props) {
  const {title, content, onClose, closeDialog, onOk, open} = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          // onClose();
          closeDialog();
        }}>취소</Button>
        <Button onClick={() => {
          onOk();
          closeDialog();
        }} autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DialogProvider({children, ...props}) {
  const [dialogs, setDialogs] = React.useState([]);

  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs].concat({...latestDialog, open: false});
    });
  };

  const createDialog = ({title, content, onClose, onOk, onKill, ...option}) => {
    const dialog = {title, content, onClose, closeDialog, onOk, onKill, ...option, open: true};
    setDialogs((dialogs) => [...dialogs, dialog]);
  };

  const contextValue = React.useRef([createDialog, closeDialog]);

  return (
    <DialogContext.Provider value={contextValue.current} {...props}>
      {children}
      {dialogs.map((dialog, i) => {
        return <DialogContainer key={i} {...dialog} />;
      })}
    </DialogContext.Provider>
  );
}

export const useDialog = () => React.useContext(DialogContext);
