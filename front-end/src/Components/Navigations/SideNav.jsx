import "../../Assets/css/Navigation.css";
import { Container, Row } from "react-bootstrap";
import { IconButton, Link } from "@mui/material";
import { useNavigate  } from "react-router-dom";
import { WidgetsOutlined, FeedOutlined, SettingsOutlined, LogoutOutlined } from "@mui/icons-material";

function SideNav() {
  const navigate = useNavigate();
  async function handleLinkClick() {
    localStorage.removeItem("access-token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    await navigate('/');
  }

  return (
    <Container className="sidenav">
      <Row className="icon-padding">
        <Link href="/" variant="body2">
          <IconButton aria-label="delete">
            <WidgetsOutlined fontSize="large" color="primary" />
          </IconButton>
        </Link>
      </Row>
      <Row className="icon-padding">
        <Link href="/top-news" variant="body2">
          <IconButton aria-label="delete">
            <FeedOutlined fontSize="large" color="primary" />
          </IconButton>
        </Link>
      </Row>
      <Row className="icon-padding">
        <Link href="/preferences" variant="body2">
          <IconButton aria-label="delete">
            <SettingsOutlined fontSize="large" color="primary" />
          </IconButton>
        </Link>
      </Row>
      <Row className="icon-padding">
        <Link onClick={handleLinkClick} variant="body2">
          <IconButton aria-label="delete">
            <LogoutOutlined fontSize="large" color="primary" />
          </IconButton>
        </Link>
      </Row>
    </Container>
  );
}

export default SideNav;
