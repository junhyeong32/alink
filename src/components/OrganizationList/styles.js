const styles = {
  organization_container: {
    width: "246px",
    p: 0,
    border: "1px solid #EFEFEF",
    height: "100%",
    rowGap: 2,
    pb: 1.5,
    background: "#F5F5F5",
    zIndex: 1,
  },

  contents_box: {
    width: "100%",
    pr: "10px",
    pl: "9px",
    height: "100%",
    overflow: "auto",
  },

  excel_button: {
    borderRadius: "5px",
    height: 28,
    minWidth: "30px",
    maxWidth: "30px",
    p: 0,
    overflow: "hidden",
    position: "relative",
    transitionProperty: "min-width,width,max-width",
    transitionDuration: ".5s",
    "&:hover": {
      minWidth: "96px",
      maxWidth: "96px",
    },
  },

  excel_button_text: {
    position: "absolute",
    display: "flex",
    width: "113px",
    left: "8px",
  },
};

export default styles;
