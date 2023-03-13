import { Container, Row, Col } from "react-bootstrap";
import { Autocomplete, TextField, Button, Box, Collapse, Alert, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchGet, fetchPost } from "../../Api";
import { useNavigate  } from "react-router-dom";
import "../../Assets/css/Content.css";
import { Close } from "@mui/icons-material";

function Preferences() {
  const [categoryValue, setCategoryValue] = useState("");
  const [sourcesValue, setSourcesValue] = useState("");
  const [category, setCategory] = useState([]);
  const [sources, setSources] = useState([]);
  const [hasError, setHasError] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access-token");

  useEffect(() => {
    async function getCategory() {
      const data = await fetchGet(
        "news-articles/category",
        {},
        { accessToken }
      );
      const response = await data.json();
      setCategory(response.data);
    }

    if (accessToken) {
      getCategory();
    }
  }, [accessToken]);

  useEffect(() => {
    async function getSources() {
      const data = await fetchGet("news-articles/source", {}, { accessToken });
      const response = await data.json();
      setSources(response.data);
    }

    if (accessToken) {
      getSources();
    }
  }, [accessToken]);

  function handleCategory(e, value) {
    const categories = value.map((category) => category["id"]);
    setCategoryValue(categories.toString());
  }

  function handleSource(e, value) {
    const source = value.map((source) => source["id"]);
    setSourcesValue(source.toString());
  }

  async function handleSubmit(event) {
    try {
      const token = await fetchPost("personalize", {
        category: categoryValue,
        source: sourcesValue
      }, { accessToken });

      if (!token.ok) {
        throw await token.json();
      }
    } catch (e) {
      setHasError(e);
      setOpen(true);
    }
  }

  return (
    accessToken?(
    <Container className="main-content">
      <Row>
        <Col xs={8} className="content-name">
          <h1>Settings</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
        {hasError && (
              <Box sx={{ width: "100%" }}>
                <Collapse in={open}>
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {Object.values(hasError).map(data => (<p>{data}</p>))}
                  </Alert>
                </Collapse>
              </Box>
            )}
          <Autocomplete
            multiple
            id="tags-standard"
            options={category}
            getOptionLabel={(option) => option.webTitle}
            onChange={handleCategory}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="News Category Preferences"
                placeholder="Categories"
              />
            )}
          />
          <Autocomplete
            multiple
            id="tags-standard"
            options={sources}
            getOptionLabel={(option) => option.name}
            onChange={handleSource}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="News Source Preferences"
                placeholder="Sources"
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%", margin: "20px" }}
              onClick={handleSubmit}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Container>):navigate('/')
  );
}

export default Preferences;
