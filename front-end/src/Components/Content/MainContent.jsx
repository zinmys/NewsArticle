import { Container, Row, Col, Card, Placeholder } from "react-bootstrap";
import { Button, Link } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchGet } from "../../Api";
import LoadingImg from "../../Assets/images/Loading.png";
import "../../Assets/css/Content.css";

function MainContent() {
  const randomNumber = useRef(Math.floor(Math.random() * 10));
  const [recentNews, setRecentNews] = useState(undefined);
  const [topNews, setTopNews] = useState(undefined);
  const accessToken = localStorage.getItem("access-token");

  useEffect(() => {
    async function getTopNews() {
      const data = await fetchGet(
        "news-articles/top-news",
        {},
        { accessToken }
      );
      const response = await data.json();
      const topNewsData = response.data[randomNumber.current];
      const publishedAt = new Date(topNewsData.publishedAt).toLocaleString();
      setTopNews({ ...topNewsData, publishedAt });
    }

    if (accessToken) {
      getTopNews();
    }
  }, [accessToken, randomNumber]);

  useEffect(() => {
    async function getRecentNews() {
      const data = await fetchGet(
        "news-articles/recent-news",
        {},
        { accessToken }
      );
      const response = await data.json();
      setRecentNews(
        response.data.map((data) => {
          const publishedAt = new Date(data.publishedAt).toLocaleString();
          return { ...data, publishedAt };
        })
      );
    }

    if (accessToken) {
      getRecentNews();
    }
  }, [accessToken]);

  return (
    <Container className="main-content">
      <Row>
        <Row className="ootd-header">
          <Col xs={9}>
            <h1>Top News</h1>
          </Col>
          <Col xs={3}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: "100%" }}
              component={ReactRouterLink}
              to="/top-news"
            >
              More
            </Button>
          </Col>
        </Row>
        <Row>
          {topNews ? (
            <Col xs={10}>
              <Link component={ReactRouterLink} to={topNews.url} target="_blank" underline="none">
                <Card className="bg-dark text-white ootd-card">
                  <Card.Img src={topNews.imageUrl} alt="Card image" />
                  <Card.ImgOverlay>
                    <Card.Title>{topNews.title}</Card.Title>
                    <Card.Text>{topNews.description}</Card.Text>
                    <Card.Text>{topNews.publishedAt}</Card.Text>
                  </Card.ImgOverlay>
                </Card>
              </Link>
            </Col>
          ) : (
            <Col xs={10}>
              <Card className="bg-dark text-white ootd-card">
                <Card.Img src={LoadingImg} alt="Card image" />
                <Card.ImgOverlay>
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
                </Card.ImgOverlay>
              </Card>
            </Col>
          )}
        </Row>
      </Row>
      <Row>
        <Col xs={8} className="content-name">
          <h1>Recent News</h1>
        </Col>
      </Row>
      <Row>
        {recentNews
          ? recentNews.map((news) => {
              return (
                <Col md={6} className="content">
                  <Link component={ReactRouterLink} to={news.url} target="_blank" underline="none" color="primary">
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

export default MainContent;
