const style = {
  main: {
    backgroundImage: `url(/main_background.png)`,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    objectFit: "contain",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  id_input: {
    width: 364,
    height: 42,
    background: " rgba(255, 255, 255, 0.6)",
    pl: 0,
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "26px",
    paddingLeft: "12px",
  },

  password_input: {
    width: 364,
    height: 42,
    background: " rgba(255, 255, 255, 0.6)",
    pl: 0,
    fontWeight: 400,
    fontSize: 18,
    paddingLeft: "12px",
  },

  login_btn: {
    width: 364,
    height: 50,
    background:
      "linear-gradient(180deg, #0D1D41 0%, rgba(13, 29, 65, 0.8) 100%)",
    color: "white",
    mt: 5,
    p: 0,
  },
};

export default style;
