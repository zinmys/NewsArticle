import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Container, Row, Col } from "react-bootstrap";
import {
  SideNav,
  HeaderNav,
  RightNav,
  MainContent,
  TopNews,
  SearchContent,
  Preferences,
} from "./Components";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchGet } from "./Api";

const theme = createTheme({
  shape: {
    borderRadius: "25px",
  },
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#121212",
      darker: "#053e85",
    },
    secondary: {
      main: "#fffeff",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

function App() {
  const [currentRoute, setCurrentRoute] = useState("/");
  const [accessTokenTemp, setAccessTokenTemp] = useState();
  const location = useLocation();

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    async function getUser() {
      const data = await fetchGet("user", {}, { accessToken });
      const userData = await data.json();

      setAccessTokenTemp(accessToken);
      if (userData.name && userData.email) {
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);
      }
    }

    async function getTempToken() {
      const data = await fetchGet("credentials", {}, {});
      const tokenData = await data.json();

      setAccessTokenTemp(tokenData.access_token);
      localStorage.setItem("access-token", tokenData.access_token);
    }

    if (accessToken) {
      getUser();
    } else {
      getTempToken();
    }
  });

  function switchRender(param) {
    switch (param) {
      case "/":
        return <MainContent />;
      case "/top-news":
        return <TopNews />;
      case "/search":
        return <SearchContent />;
      case "/preferences":
        return <Preferences />;
      default:
        return <MainContent />;
    }
  }

  return accessTokenTemp ? (
    <ThemeProvider theme={theme}>
      <Container>
        <Row>
          <Col md={1}>
            <SideNav />
          </Col>
          <Col md={11}>
            <Row>
              <Col md={9}>
                <Row>
                  <HeaderNav />
                </Row>
                <Row>{accessTokenTemp && switchRender(currentRoute)}</Row>
              </Col>
              <Col md={3}>
                <RightNav />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  ) : (
    <CircularProgress color="primary" />
  );
}

export default App;
