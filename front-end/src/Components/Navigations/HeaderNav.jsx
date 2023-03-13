import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import dayjs from 'dayjs';
import {
  Box,
  Toolbar,
  InputBase,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Search as SearchIcon, FilterList } from "@mui/icons-material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "../../Api";
import "../../Assets/css/Navigation.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  color: alpha(theme.palette.common.black, 0.6),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
}));

function HeaderNav() {
  const [searchValue, setSearchValue] = useState();
  const [categoryValue, setCategoryValue] = useState("");
  const [sourcesValue, setSourcesValue] = useState("");
  const [fromDateValue, setFromDateValue] = useState(dayjs());
  const [toDateValue, setToDateValue] = useState(dayjs());
  const [category, setCategory] = useState([]);
  const [sources, setSources] = useState([]);
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
      const data = await fetchGet(
        "news-articles/source",
        {},
        { accessToken }
      );
      const response = await data.json();
      setSources(response.data);
    }

    if (accessToken) {
      getSources();
    }
  }, [accessToken]);

  function handleSearch(e) {
    setSearchValue(e.target.value);
  }

  function handleCategory(e, value) {
    const categories = value.map((category) => category["id"]);
    setCategoryValue(categories.toString());
  }

  function handleSource(e, value) {
    const source = value.map((source) => source["id"]);
    setSourcesValue(source.toString());
  }

  function handleFromDate(value) {
    setFromDateValue(value);
  }

  function handleToDate(value) {
    setToDateValue(value);
  }

  async function onKeyPress(e) {
    if (e.key === "Enter") {
      const fromDate = new Date(fromDateValue).toLocaleDateString()
      const toDate = new Date(toDateValue).toLocaleDateString()
      navigate(
        `/search?query=${searchValue}&category=${categoryValue}&sources=${sourcesValue}&fromDate=${fromDate}&toDate=${toDate}`
      );
      
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }} className="headernav">
      <Toolbar>
        <FormGroup>
          <Accordion>
            <AccordionSummary expandIcon={<FilterList />}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-title": "search" }}
                  onChange={handleSearch}
                  onKeyDown={onKeyPress}
                />
              </Search>
            </AccordionSummary>
            <AccordionDetails>
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
                    label="Category"
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
                    label="Source"
                    placeholder="Sources"
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                    label="From"
                    value={fromDateValue}
                    onChange={handleFromDate}
                  />
                  <DatePicker
                    label="To"
                    value={toDateValue}
                    onChange={handleToDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </AccordionDetails>
          </Accordion>
        </FormGroup>
      </Toolbar>
    </Box>
  );
}

export default HeaderNav;
