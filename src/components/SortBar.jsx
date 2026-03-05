import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function SortBar({
  activeSort,
  handleSortChange,
  sortAscending,
  setSortAscending,
}) {
  return (
    <>
      <Typography variant="subtitle2">Sort by</Typography>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ButtonGroup>
          <Button
            variant={activeSort === "title" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("title")}
          >
            Title
          </Button>
          <Button
            variant={activeSort === "author" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("author")}
          >
            Author
          </Button>
          <Button
            variant={activeSort === "rating" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("rating")}
          >
            Rating
          </Button>
          <Button
            variant={activeSort === "date" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("date")}
          >
            Date Added
          </Button>
        </ButtonGroup>
        {/* <Typography variant="subtitle2">Sort descending?</Typography> */}
        <div
          onClick={() => setSortAscending(!sortAscending)}
          style={{
            cursor: "pointer",
            position: "relative",
            width: "24px",
            height: "35px",
          }}
        >
          <ArrowDropUpIcon
            sx={{
              color: sortAscending ? "#ccc" : "primary.main",
              position: "absolute",
              top: "-4px",
              left: 0,
              fontSize: "30px",
            }}
          />
          <ArrowDropDownIcon
            sx={{
              color: sortAscending ? "primary.main" : "#ccc",
              position: "absolute",
              bottom: "-4px",
              left: 0,
              fontSize: "30px",
            }}
          />
        </div>
      </div>
      {/* <Switch
        onChange={() => setSortAscending(sortAscending ? false : true)}
        checked={sortAscending}
      /> */}
    </>
  );
}
