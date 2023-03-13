import { Container, Row, Col } from "react-bootstrap";
import { Button, Avatar, CardHeader } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Assets/css/Navigation.css";
import BlankProfile from "../../Assets/images/blank-profile.png";

function RightNav() {
  const navigate = useNavigate();
  const routeChange = () => {
    let path = "/login";
    navigate(path);
  };

  const [status, setStatus] = useState(false);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (name && email) {
      setStatus(true);
    }
  }, [name, email]);

  return (
    <Container className="rightnav">
      <Row>
        <Col>
          {!status && (
            <Button
              variant="contained"
              color="primary"
              style={{ width: "100%" }}
              onClick={routeChange}
            >
              Login / Signup
            </Button>
          )}

          {status && (
            <CardHeader
              avatar={
                <Avatar
                  alt="Blank Profile"
                  src={BlankProfile}
                  sx={{ width: 56, height: 56 }}
                />
              }
              title={name}
              subheader="Member"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RightNav;
