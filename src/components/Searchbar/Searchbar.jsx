import React, { useEffect, useRef, useState } from "react";
import "./Searchbar.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import images from "../../constants/images";
import { roadmapListApi } from "../../api/api.js";
import { useNavigate } from "react-router-dom";

const Searchbar = (props) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const CustomPaperComponent = React.forwardRef((props, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="search__component"
        style={{
          fontFamily: "sans-serif",
          marginTop: "8px",
          marginBottom: "8px",
          background: "#343434",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "4px",
          padding: 8,
          ...props.style,
        }}
      />
    );
  });
  const [search, setSearch] = useState([]);
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const data = await roadmapListApi();
      setSearch(data);
    };
    fetchRoadmaps().then();
  }, []);
  const getOptionLabel = (option) => {
    return `${option.title} (${option.cat.title}) ${option.description}`;
  };
  const renderOption = (props, option) => {
    return (
      <li
        {...props}
        className="search__result"
        onClick={() => {
          navigate("/roadmap/" + option.id);
        }}
      >
        {option.title} ({option.cat.title})
      </li>
    );
  };
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("click", handleClick);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("click", handleClick);
      }
    };
  }, []);
  const handleClick = () => {
    inputRef.current.value = "";
    setValue("");
    isRoadmaps && props.handleSearch("");
  };
  const isRoadmaps = location.pathname === "/roadmaps";
  return (
    <Autocomplete
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            backgroundColor: "rgba(52, 52, 52, 0.3)",
            borderWidth: "1px 1px 1px 1px",
            borderStyle: "solid",
            borderColor: "#15BE8B",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
      className="search"
      limitTags={6}
      options={search}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          inputRef={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            isRoadmaps && props.handleSearch(e.target.value);
          }}
          {...params}
          placeholder="Search in our library..."
          InputProps={{
            ...params.InputProps,
            style: {
              color: "white",
              transform: "0",
              width: "100%",
              paddingRight: 20,
              paddingLeft: 20,
            },
            startAdornment: <img src={images.SearchIcon} />,
            endAdornment: (value || props.value) && (
              <img
                className={"search__clear"}
                src={images.CrossIcon}
                onClick={handleClick}
              />
            ),
            className: "search__input",
          }}
          onFocus={(e) => {
            setValue(e.target.value);
            isRoadmaps && props.handleSearch(e.target.value);
          }}
          onBlur={(e) => {
            setValue(e.target.value);
            isRoadmaps && props.handleSearch(e.target.value);
          }}
        />
      )}
      renderOption={renderOption}
      noOptionsText={"NO OPTIONS"}
      PaperComponent={CustomPaperComponent}
    />
  );
};

export default Searchbar;
