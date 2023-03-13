import { Container, Row, Col, Card, Placeholder } from "react-bootstrap";
import { Link } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGet } from "../../Api";
import { useLocation } from "react-router-dom";
import LoadingImg from "../../Assets/images/Loading.png";
import "../../Assets/css/Content.css";

function SearchContent() {
  const [news, setNews] = useState(undefined);
  const accessToken = localStorage.getItem("access-token");
  const location = useLocation();

  useEffect(() => {
    async function getTopNews() {
      const query = location.search;
      const data = await fetchGet(
        "news-articles/search" + query,
        {},
        { accessToken }
      );
      const response = await data.json();
      setNews(
        response.data.map((data) => {
          const publishedAt = new Date(data.publishedAt).toLocaleString();
          return { ...data, publishedAt };
        })
      );
    }

    if (accessToken) {
      getTopNews();
    }
  }, [accessToken, location]);

  return (
    <Container className="main-content">
      <Row>
        <Col xs={8} className="content-name">
          <h1>Result from Searching News</h1>
        </Col>
      </Row>
      <Row>
        {news
          ? news.map((news) => {
              return (
                <Col md={6} className="content">
                  <Link
                    component={ReactRouterLink}
                    to={news.url}
                    target="_blank"
                    underline="none"
                  >
                    <Card>
                      <Card.Img variant="top" src={news.imageUrl} />
                      <Card.Body>
                        <Card.Title>{news.title}</Card.Title>
                        <Card.Text>{news.description}</Card.Text>
                        <Card.Text>{news.publishedAt}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })
          : Array.from(Array(10), () => {
              return (
                <Col md={6} className="content">
                  <Card>
                    <Card.Img variant="top" src={LoadingImg} />
                    <Card.Body>
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                        <Placeholder xs={4} /> <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
      </Row>
    </Container>
  );
}

export default SearchContent;
